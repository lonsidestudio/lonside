import fs from 'node:fs';
import sharp from 'sharp';

// SVG officiel Lonside : Fond noir squircle, L. en blanc bold
const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#0a0a0a"/>
  <text x="256" y="372" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="340" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="-14">L.</text>
</svg>
`.trim();

async function main() {
  const svgBuffer = Buffer.from(svg);

  // 1. Générer PNGs aux différentes résolutions
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  const png256 = await sharp(svgBuffer).resize(256, 256).png().toBuffer();

  // Enregistrer les PNGs statiques dans public
  fs.writeFileSync('public/icon-48.png', png48);
  fs.writeFileSync('public/icon-192.png', png192);
  fs.writeFileSync('public/apple-icon.png', png180);

  // 2. Construire un fichier .ico valide contenant 16x16, 32x32, 48x48 et 256x256 (format PNG encapsulé moderne)
  const images = [
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
    { width: 256, height: 256, buffer: png256 },
  ];

  const headerSize = 6;
  const dirEntrySize = 16;
  const totalHeaderSize = headerSize + images.length * dirEntrySize;

  let offset = totalHeaderSize;
  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0); // width
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image size in bytes
    entry.writeUInt32LE(offset, 12); // image offset
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // image type (1 = icon)
  icoHeader.writeUInt16LE(images.length, 4); // number of images

  const icoBuffer = Buffer.concat([
    icoHeader,
    ...dirEntries,
    ...images.map((img) => img.buffer),
  ]);

  // Écrire le favicon.ico dans src/app et dans public
  fs.writeFileSync('src/app/favicon.ico', icoBuffer);
  fs.writeFileSync('public/favicon.ico', icoBuffer);

  console.log('Favicons generated successfully!');
  console.log('src/app/favicon.ico written, size:', icoBuffer.length);
  console.log('public/favicon.ico written, size:', icoBuffer.length);
  console.log('public/icon-48.png written, size:', png48.length);
}

main().catch(console.error);
