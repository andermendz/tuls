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
 * Extracts EXIF data from a file using exifr.
 * This library provides comprehensive metadata extraction including:
 * - EXIF (camera settings, date, location)
 * - IPTC (copyright, keywords)
 * - XMP (extended metadata)
 * - ICC (color profiles)
 */
export const getExifData = async (file: File): Promise<any> => {
  if (!file) {
    return {};
  }

  try {
    // Extract all available metadata with exifr
    const metadata = await exifr.parse(file, {
      // Enable all metadata formats
      tiff: true,
      exif: true,
      gps: true,
      iptc: true,
      icc: true,
      jfif: true,
      ihdr: true,
      // Merge all segments into one object
      mergeOutput: true,
      // Include all tags
      pick: undefined,
      // Translate GPS coordinates to decimal
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
 * Uses subarray to prevent memory copying.
 */
const scrubJpeg = async (file: File): Promise<Blob> => {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const chunks: Uint8Array[] = [];
  let pos = 0;

  // Check SOI (FF D8)
  if (data[0] !== 0xFF || data[1] !== 0xD8) throw new Error("Invalid JPEG");
  
  chunks.push(data.subarray(0, 2));
  pos = 2;

  while (pos < data.length) {
    if (data[pos] !== 0xFF) break; // Should be a marker or padding

    // Skip padding FFs
    const startPos = pos;
    while (pos < data.length && data[pos] === 0xFF) {
      pos++;
    }
    
    if (pos >= data.length) break;

    const marker = data[pos];
    
    // SOS (Start of Scan) - FF DA - Copy rest of file and stop
    if (marker === 0xDA) {
      chunks.push(data.subarray(startPos));
      break;
    }
    
    // EOI (End of Image) - FF D9
    if (marker === 0xD9) {
      chunks.push(data.subarray(startPos, pos + 1));
      break;
    }
    
    // RSTn (Restart Markers) - FF D0-D7
    if (marker >= 0xD0 && marker <= 0xD7) {
      chunks.push(data.subarray(startPos, pos + 1));
      pos++;
      continue;
    }

    // Variable length segments
    // Length (2 bytes) includes the length field itself
    const len = (data[pos + 1] << 8) | data[pos + 2];
    const segmentEnd = pos + 1 + len;
    
    // Filter segments
    // Remove APP1 (0xE1) - Exif/XMP
    // Remove APPn (0xE0-0xEF) except APP0/APP2/APP14
    // Remove COM (0xFE)
    const isApp = marker >= 0xE0 && marker <= 0xEF;
    const isComment = marker === 0xFE;
    
    // Keep JFIF (E0), ICC (E2), Adobe (EE)
    const keep = (marker === 0xE0 || marker === 0xE2 || marker === 0xEE) || 
                 (!isApp && !isComment);

    if (keep) {
      chunks.push(data.subarray(startPos, segmentEnd));
    }

    pos = segmentEnd;
  }
  
  return new Blob(chunks, { type: file.type });
};

/**
 * Scrubs metadata from PNG files by filtering chunks.
 * Uses subarray to prevent memory copying.
 */
const scrubPng = async (file: File): Promise<Blob> => {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  const u8 = new Uint8Array(buffer);
  
  // PNG Signature
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
         u8[typeStart], u8[typeStart+1], u8[typeStart+2], u8[typeStart+3]
     );
     
     const chunkTotalLength = length + 12; // 4 len + 4 type + data + 4 crc
     
     // Scrub list
     const scrub = ['eXIf', 'tEXt', 'zTXt', 'iTXt', 'iCCP', 'dSIG'].includes(typeStr);
     
     if (!scrub) {
         chunks.push(u8.subarray(pos, pos + chunkTotalLength));
     }
     
     pos += chunkTotalLength;
  }
  
  return new Blob(chunks, { type: file.type });
};

/**
 * Fallback scrubber using Canvas (destructive/lossy but reliable).
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

/**
 * Main scrub function. Tries lossless binary scrub first, falls back to canvas.
 */
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

/**
 * Converts an image to a specific format.
 */
export const convertImageFormat = async (file: File, format: 'image/jpeg' | 'image/png' | 'image/webp'): Promise<Blob> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Canvas context not available");
  
  // Fill background white for JPEGs to avoid black transparency
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

/**
 * Compresses an image by adjusting quality (JPEG/WEBP only mostly).
 */
export const compressImage = async (file: File, quality: number): Promise<Blob> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Canvas context not available");

  // Force JPEG or WEBP for compression if PNG (since PNG is lossless usually)
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

/**
 * Helper to create the cropped image from react-easy-crop pixels
 */
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