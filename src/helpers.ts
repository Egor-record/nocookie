import { PNG } from 'pngjs';
import { Buffer } from 'buffer';

export async function generateBlackDotPNG(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const png = new PNG({ width: 1, height: 1 });
    png.data[0] = 255;
    png.data[1] = 0;
    png.data[2] = 0;
    png.data[3] = 255;

    const chunks: Buffer[] = [];

    png.pack()
      .on('data', (chunk) => chunks.push(chunk))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject);
  });
}