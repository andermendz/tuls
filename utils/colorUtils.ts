
export interface Color {
    r: number;
    g: number;
    b: number;
    hex: string;
}

export const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
};

export const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};

// Simple color quantization using the Median Cut algorithm approach
// or a simplified clustering for performance
export const extractColors = async (imageSrc: string, colorCount: number = 6): Promise<Color[]> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            // Resize for faster processing
            const maxDimension = 200;
            const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            const pixelArray: [number, number, number][] = [];
            for (let i = 0; i < imageData.length; i += 4) {
                // Skip transparent pixels
                if (imageData[i + 3] < 128) continue;
                pixelArray.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
            }

            if (pixelArray.length === 0) {
                resolve([]);
                return;
            }

            // Simple quantization: Group similar colors
            // This is a simplified approach. For production, a library like 'node-vibrant' or 'colorthief' is often used,
            // but we want to keep it dependency-free as per plan.

            const quantization = (pixels: [number, number, number][], depth: number): [number, number, number][] => {
                if (depth === 0 || pixels.length === 0) {
                    // Return average color
                    const r = pixels.reduce((sum, p) => sum + p[0], 0) / pixels.length;
                    const g = pixels.reduce((sum, p) => sum + p[1], 0) / pixels.length;
                    const b = pixels.reduce((sum, p) => sum + p[2], 0) / pixels.length;
                    return [[Math.round(r), Math.round(g), Math.round(b)]];
                }

                // Find channel with greatest range
                let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
                pixels.forEach(p => {
                    minR = Math.min(minR, p[0]); maxR = Math.max(maxR, p[0]);
                    minG = Math.min(minG, p[1]); maxG = Math.max(maxG, p[1]);
                    minB = Math.min(minB, p[2]); maxB = Math.max(maxB, p[2]);
                });

                const rangeR = maxR - minR;
                const rangeG = maxG - minG;
                const rangeB = maxB - minB;
                const maxRange = Math.max(rangeR, rangeG, rangeB);

                // Sort pixels by that channel
                if (maxRange === rangeR) pixels.sort((a, b) => a[0] - b[0]);
                else if (maxRange === rangeG) pixels.sort((a, b) => a[1] - b[1]);
                else pixels.sort((a, b) => a[2] - b[2]);

                const mid = Math.floor(pixels.length / 2);
                return [
                    ...quantization(pixels.slice(0, mid), depth - 1),
                    ...quantization(pixels.slice(mid), depth - 1)
                ];
            };

            // Calculate depth based on desired count (2^depth >= count)
            // For 6 colors, we need depth 3 (8 colors) then trim
            const colors = quantization(pixelArray, 3);

            // Map to Color interface and remove duplicates/very similar colors
            const uniqueColors: Color[] = [];
            const seenHex = new Set<string>();

            colors.forEach(c => {
                const hex = rgbToHex(c[0], c[1], c[2]);
                if (!seenHex.has(hex)) {
                    seenHex.add(hex);
                    uniqueColors.push({ r: c[0], g: c[1], b: c[2], hex });
                }
            });

            resolve(uniqueColors.slice(0, colorCount));
        };
        img.onerror = (e) => reject(e);
        img.src = imageSrc;
    });
};
