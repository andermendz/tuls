import exifr from 'exifr';

/**
 * Reads a File object and returns a data URL.
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Loads an image from a source URL into an HTMLImageElement.
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Resizes an image if it exceeds a maximum dimension, maintaining aspect ratio.
 * This is crucial for AI processing performance to prevent browser crashes.
 */
export const resizeImage = async (file: File, maxDimension: number = 1500): Promise<Blob> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  if (img.width <= maxDimension && img.height <= maxDimension) {
    return file; // No need to resize
  }

  let width = img.width;
  let height = img.height;

  if (width > height) {
    if (width > maxDimension) {
      height = Math.round(height * (maxDimension / width));
      width = maxDimension;
    }
  } else {
    if (height > maxDimension) {
      width = Math.round(width * (maxDimension / height));
      height = maxDimension;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Canvas context not available");

  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Resize failed"));
    }, file.type, 0.9);
  });
};

/**
 * Extracts EXIF data from a file using exifr.
 */
export const getExifData = async (file: File): Promise<any> => {
  if (!file) {
    return {};
  }

  try {
    const metadata = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      iptc: true,
      icc: true,
      jfif: true,
      ihdr: true,
      mergeOutput: true,
      pick: undefined,
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
    });

    return metadata || {};
  } catch (error) {
    console.warn("Error parsing EXIF data:", error);
    return {};
  }
};

/**
 * Scrubs metadata from JPEG files by slicing binary segments.
 */
const scrubJpeg = async (file: File): Promise<Blob> => {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const chunks: Uint8Array[] = [];
  let pos = 0;

  if (data[0] !== 0xFF || data[1] !== 0xD8) throw new Error("Invalid JPEG");

  chunks.push(data.subarray(0, 2));
  pos = 2;

  while (pos < data.length) {
    if (data[pos] !== 0xFF) break;

    const startPos = pos;
    while (pos < data.length && data[pos] === 0xFF) {
      pos++;
    }

    if (pos >= data.length) break;

    const marker = data[pos];

    if (marker === 0xDA) {
      chunks.push(data.subarray(startPos));
      break;
    }

    if (marker === 0xD9) {
      chunks.push(data.subarray(startPos, pos + 1));
      break;
    }

    if (marker >= 0xD0 && marker <= 0xD7) {
      chunks.push(data.subarray(startPos, pos + 1));
      pos++;
      continue;
    }

    const len = (data[pos + 1] << 8) | data[pos + 2];
    const segmentEnd = pos + 1 + len;

    const isApp = marker >= 0xE0 && marker <= 0xEF;
    const isComment = marker === 0xFE;

    const keep = (marker === 0xE0 || marker === 0xE2 || marker === 0xEE) ||
      (!isApp && !isComment);

    if (keep) {
      chunks.push(data.subarray(startPos, segmentEnd));
    }

    pos = segmentEnd;
  }

  return new Blob(chunks as any, { type: file.type });
};

/**
 * Scrubs metadata from PNG files by filtering chunks.
 */
const scrubPng = async (file: File): Promise<Blob> => {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  const u8 = new Uint8Array(buffer);

  const signature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
  for (let i = 0; i < 8; i++) {
    if (u8[i] !== signature[i]) throw new Error("Not a PNG");
  }

  const chunks: Uint8Array[] = [u8.subarray(0, 8)];
  let pos = 8;

  while (pos < u8.length) {
    const length = view.getUint32(pos);
    const typeStart = pos + 4;
    const typeStr = String.fromCharCode(
      u8[typeStart], u8[typeStart + 1], u8[typeStart + 2], u8[typeStart + 3]
    );

    const chunkTotalLength = length + 12;

    const scrub = ['eXIf', 'tEXt', 'zTXt', 'iTXt', 'iCCP', 'dSIG'].includes(typeStr);

    if (!scrub) {
      chunks.push(u8.subarray(pos, pos + chunkTotalLength));
    }

    pos += chunkTotalLength;
  }

  return new Blob(chunks as any, { type: file.type });
};

/**
 * Fallback scrubber using Canvas.
 */
const scrubMetadataCanvas = async (file: File): Promise<Blob> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Canvas context not available");
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Conversion failed"));
    }, file.type);
  });
};

export const scrubMetadata = async (file: File): Promise<Blob> => {
  try {
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      return await scrubJpeg(file);
    }
    if (file.type === 'image/png') {
      return await scrubPng(file);
    }
  } catch (e) {
    console.warn("Binary scrub failed, falling back to canvas", e);
  }
  return scrubMetadataCanvas(file);
};

export const convertImageFormat = async (file: File, format: 'image/jpeg' | 'image/png' | 'image/webp'): Promise<Blob> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Canvas context not available");

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Conversion failed"));
    }, format, 0.95);
  });
};

export const compressImage = async (file: File, quality: number): Promise<Blob> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Canvas context not available");

  let targetType = file.type;
  if (targetType === 'image/png') {
    if (quality < 1) targetType = 'image/jpeg';
  }

  if (targetType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Compression failed"));
    }, targetType, quality);
  });
};

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  fileType: string = 'image/jpeg'
): Promise<Blob> => {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error("No canvas context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas is empty'));
    }, fileType);
  });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};