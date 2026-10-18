/**
 * Prepare a photo chosen from the library or taken with the phone's camera app:
 * check it is an image of a sensible size, fix its rotation, shrink it, and return a JPEG.
 * Nothing leaves the device here.
 */

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_BYTES = 15 * 1024 * 1024;

export class ImageError extends Error {
  kind: 'type' | 'size' | 'decode' | 'small';
  constructor(kind: ImageError['kind'], message: string) {
    super(message);
    this.kind = kind;
  }
}

export interface PreparedImage {
  blob: Blob;
  url: string; // object URL; call URL.revokeObjectURL when finished
  width: number;
  height: number;
}

export async function prepareImage(
  input: Blob,
  { maxEdge = 1600, quality = 0.85, minEdge = 400 }: { maxEdge?: number; quality?: number; minEdge?: number } = {},
): Promise<PreparedImage> {
  if (input.type && !ACCEPTED_TYPES.includes(input.type)) {
    throw new ImageError('type', 'Please choose a JPEG, PNG or WebP photo.');
  }
  if (input.size > MAX_BYTES) {
    throw new ImageError('size', 'That photo is too large. Choose one under 15 MB.');
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(input, { imageOrientation: 'from-image' });
  } catch {
    // HEIC from iPhones is the usual cause; the browser cannot read it
    throw new ImageError('decode', "We couldn't open that photo. Try a JPEG or PNG, or take a new one.");
  }

  if (Math.min(bitmap.width, bitmap.height) < minEdge) {
    bitmap.close();
    throw new ImageError('small', 'That photo is too small. Choose a larger one.');
  }

  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new ImageError('decode', "We couldn't process that photo. Please try another.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  if (!blob) throw new ImageError('decode', "We couldn't process that photo. Please try another.");
  return { blob, url: URL.createObjectURL(blob), width, height };
}
