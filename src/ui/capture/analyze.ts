/**
 * Quick on-device quality checks for ID and selfie photos, so people can retake before submitting.
 * These are heuristics, not the identity check itself. The thresholds are starting points and
 * need tuning against real photos taken on real phones.
 */

export type ImageIssue = 'dark' | 'bright' | 'blurry' | 'small';

export interface ImageReport {
  width: number;
  height: number;
  brightness: number; // 0 to 255
  sharpness: number; // variance of the Laplacian; higher is sharper
  issues: ImageIssue[];
}

const ANALYSIS_WIDTH = 320;
const MIN_EDGE = 600;
const DARK_BELOW = 55;
const BRIGHT_ABOVE = 228;
const BLURRY_BELOW = 30;

export async function analyzeImage(blob: Blob): Promise<ImageReport> {
  const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
  const { width, height } = bitmap;
  const scale = Math.min(1, ANALYSIS_WIDTH / width);
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    bitmap.close();
    return { width, height, brightness: 128, sharpness: 100, issues: [] };
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const { data } = ctx.getImageData(0, 0, w, h);
  const gray = new Float32Array(w * h);
  let sum = 0;
  for (let i = 0; i < w * h; i++) {
    const g = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    gray[i] = g;
    sum += g;
  }
  const brightness = sum / (w * h);

  // Variance of the Laplacian: edges are crisp in a sharp photo and soft in a blurry one
  let lapSum = 0;
  let lapSq = 0;
  let n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const lap = 4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - w] - gray[i + w];
      lapSum += lap;
      lapSq += lap * lap;
      n++;
    }
  }
  const mean = lapSum / n;
  const sharpness = lapSq / n - mean * mean;

  const issues: ImageIssue[] = [];
  if (Math.min(width, height) < MIN_EDGE) issues.push('small');
  if (brightness < DARK_BELOW) issues.push('dark');
  if (brightness > BRIGHT_ABOVE) issues.push('bright');
  if (sharpness < BLURRY_BELOW) issues.push('blurry');

  return { width, height, brightness, sharpness, issues };
}

export const ISSUE_TEXT: Record<ImageIssue, string> = {
  dark: 'This looks dark. Move towards a window or a lamp.',
  bright: 'This looks washed out. Move away from direct light or glare.',
  blurry: 'This looks blurry. Hold steady and let the camera focus.',
  small: 'This photo is small. Try again closer, or use a higher-quality photo.',
};
