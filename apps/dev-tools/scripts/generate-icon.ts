import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/**
 * Generates the dev review app icons by overlaying a dev badge onto the
 * main app's icons.
 *
 * Run with: bun run generate:icon
 */

const scriptDir = dirname(fileURLToPath(import.meta.url));

// The main app's icons, used as the base for every generated icon
const sourceIconDir = resolve(
  scriptDir,
  '../../desktop-electrobun/assets/icon',
);

// Where the generated dev review icons are written
const outputIconDir = resolve(scriptDir, '../assets/icon');

// macOS iconset sizes, as `<file name>: <pixel size>`
const MacIconsetSizes: Record<string, number> = {
  'icon_16x16.png': 16,
  'icon_16x16@2x.png': 32,
  'icon_32x32.png': 32,
  'icon_32x32@2x.png': 64,
  'icon_128x128.png': 128,
  'icon_128x128@2x.png': 256,
  'icon_256x256.png': 256,
  'icon_256x256@2x.png': 512,
  'icon_512x512.png': 512,
  'icon_512x512@2x.png': 1024,
};

// Sizes packed into the Windows .ico file
const WindowsIcoSizes = [16, 32, 48, 256];

generateIcons();

/**
 * Generates the full set of dev review app icons into the app's assets dir.
 */
async function generateIcons(): Promise<void> {
  // Ensure the output directories exist
  await mkdir(resolve(outputIconDir, 'macos/icon.iconset'), {
    recursive: true,
  });
  await mkdir(resolve(outputIconDir, 'linux'), { recursive: true });
  await mkdir(resolve(outputIconDir, 'windows'), { recursive: true });

  // Generate the top level 1024px icon
  await writeFile(
    resolve(outputIconDir, 'icon.png'),
    await renderIcon(1024),
    'binary',
  );

  // Generate the macOS iconset images
  for (const [fileName, size] of Object.entries(MacIconsetSizes)) {
    await writeFile(
      resolve(outputIconDir, 'macos/icon.iconset', fileName),
      await renderIcon(size),
      'binary',
    );
  }

  // Generate the Linux icon
  await writeFile(
    resolve(outputIconDir, 'linux/256x256.png'),
    await renderIcon(256),
    'binary',
  );

  // Generate the Windows icon, packing each size into a single .ico file
  const icoImages = await Promise.all(WindowsIcoSizes.map(renderIcon));
  await writeFile(
    resolve(outputIconDir, 'windows/icon.ico'),
    packIco(icoImages, WindowsIcoSizes),
    'binary',
  );

  console.log(`Generated dev review app icons in ${outputIconDir}`);
}

/**
 * Renders the dev review app icon at the given size as a PNG buffer.
 */
async function renderIcon(size: number): Promise<Buffer> {
  // Scale the main app icon to the requested size
  const base = await sharp(resolve(sourceIconDir, 'icon.png'))
    .resize(size, size)
    .toBuffer();

  // Render the badge at the same size so it can be composited on top
  const badge = await sharp(Buffer.from(renderBadgeSvg(size)))
    .resize(size, size)
    .png()
    .toBuffer();

  // Overlay the badge onto the base icon
  return sharp(base)
    .composite([{ input: badge }])
    .png()
    .toBuffer();
}

/**
 * Generates the SVG markup for the dev badge, a pencil-ruler glyph in a dark
 * circle, positioned in the bottom right segment of a `size` by `size` icon.
 */
function renderBadgeSvg(size: number): string {
  // Badge circle position and size, as fractions of the icon size
  const centerX = size * 0.7;
  const centerY = size * 0.7;
  const radius = size * 0.2;

  // White ring separating the badge from the icon behind it
  const ringWidth = size * 0.03;

  // The glyph is drawn on a 24x24 grid, scaled to fit inside the circle
  const glyphSize = radius * 1.1;
  const glyphScale = glyphSize / 24;
  const glyphOffsetX = centerX - glyphSize / 2;
  const glyphOffsetY = centerY - glyphSize / 2;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#1E293B" stroke="#FCFCFC" stroke-width="${ringWidth}" />
  <g transform="translate(${glyphOffsetX} ${glyphOffsetY}) scale(${glyphScale})" fill="none" stroke="#FCFCFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    ${PencilRulerPaths.map((path) => `<path d="${path}" />`).join('\n    ')}
  </g>
</svg>`;
}

/**
 * Packs the given PNG images into a Windows .ico file.
 *
 * Sizes must be listed in the same order as their images.
 */
function packIco(images: Buffer[], sizes: number[]): Buffer {
  // 6 byte file header followed by a 16 byte directory entry per image
  const headerSize = 6 + images.length * 16;
  const header = Buffer.alloc(headerSize);

  // Reserved, image type (1 = icon), and image count
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  // Images are appended in order, directly after the header
  let imageOffset = headerSize;

  images.forEach((image, index) => {
    const entryOffset = 6 + index * 16;
    const size = sizes[index];

    // Width and height, where 256 is encoded as 0
    header.writeUInt8(size === 256 ? 0 : size, entryOffset);
    header.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    // Palette color count and reserved byte, both unused for PNG images
    header.writeUInt8(0, entryOffset + 2);
    header.writeUInt8(0, entryOffset + 3);
    // Color planes and bits per pixel
    header.writeUInt16LE(1, entryOffset + 4);
    header.writeUInt16LE(32, entryOffset + 6);
    // Image byte length and its offset within the file
    header.writeUInt32LE(image.length, entryOffset + 8);
    header.writeUInt32LE(imageOffset, entryOffset + 12);

    imageOffset += image.length;
  });

  return Buffer.concat([header, ...images]);
}

// Path data of the lucide `pencil-ruler` icon
const PencilRulerPaths = [
  'M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13',
  'm8 6 2-2',
  'm18 16 2-2',
  'm17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17',
  'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
  'm15 5 4 4',
];
