const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processLogoAndOG() {
  const sourceImg = String.raw`C:\Users\TOSHIBA\.gemini\antigravity\brain\3dc99b7e-b20d-4f1a-93da-f955190ee3f8\alam_alsiana_logo_1795176529872.jpg`;

  console.log('Reading source image from:', sourceImg);
  const metadata = await sharp(sourceImg).metadata();
  console.log('Source metadata:', metadata.width, 'x', metadata.height, metadata.format);

  // 1. Generate 512x512 square logo PNG
  await sharp(sourceImg)
    .resize(512, 512, { fit: 'cover' })
    .png({ quality: 95 })
    .toFile('public/logo.png');
  console.log('Created public/logo.png');

  // 2. Generate 512x512 icon for Next.js App Router (src/app/icon.png)
  await sharp(sourceImg)
    .resize(512, 512, { fit: 'cover' })
    .png({ quality: 95 })
    .toFile('src/app/icon.png');
  console.log('Created src/app/icon.png');

  // 3. Generate 180x180 Apple Touch Icon
  await sharp(sourceImg)
    .resize(180, 180, { fit: 'cover' })
    .png({ quality: 95 })
    .toFile('public/apple-touch-icon.png');
  await sharp(sourceImg)
    .resize(180, 180, { fit: 'cover' })
    .png({ quality: 95 })
    .toFile('src/app/apple-icon.png');
  console.log('Created apple-touch-icon.png and src/app/apple-icon.png');

  // 4. Generate 32x32 favicon.ico / favicon.png
  await sharp(sourceImg)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile('public/favicon.ico');
  await sharp(sourceImg)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile('src/app/favicon.ico');
  console.log('Created favicon.ico in public/ and src/app/');

  // 5. Generate high-impact 1200x630 OpenGraph (OG) image for WhatsApp / Telegram / Social Media
  // Create a 1200x630 dark canvas with gold gradients and place the circular 3D logo in it
  const logoSquare = await sharp(sourceImg)
    .resize(500, 500, { fit: 'cover' })
    .png()
    .toBuffer();

  const svgOverlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="80%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFC400" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="goldText" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#FFE066"/>
          <stop offset="50%" stop-color="#FFC400"/>
          <stop offset="100%" stop-color="#E5A700"/>
        </linearGradient>
      </defs>
      <!-- Background glow -->
      <rect x="0" y="0" width="1200" height="630" fill="#070707"/>
      <circle cx="950" cy="315" r="450" fill="url(#glow)"/>
      <circle cx="150" cy="100" r="300" fill="url(#glow)" opacity="0.4"/>
      
      <!-- Right Side decorative circuit border -->
      <rect x="20" y="20" width="1160" height="590" rx="24" fill="none" stroke="#FFC400" stroke-opacity="0.2" stroke-width="2"/>
      
      <!-- Arabic Typography -->
      <g text-anchor="end" font-family="'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif">
        <!-- Badge -->
        <rect x="360" y="100" width="290" height="42" rx="21" fill="#FFC400" fill-opacity="0.15" stroke="#FFC400" stroke-opacity="0.4" stroke-width="1.5"/>
        <text x="635" y="128" fill="#FFC400" font-size="20" font-weight="bold">⚡ المنصة الأولى لفنيي الهواتف</text>
        
        <!-- Main Title -->
        <text x="650" y="230" fill="url(#goldText)" font-size="64" font-weight="900" letter-spacing="-1">عالم الصيانة PRO</text>
        
        <!-- Subtitle -->
        <text x="650" y="295" fill="#FFFFFF" font-size="28" font-weight="bold">منظومة هاردوير متكاملة على طاولة الفني</text>
        
        <!-- Feature bullets -->
        <text x="650" y="375" fill="#D4D4D8" font-size="22" font-weight="600">✓ مخططات وتتبع مسارات حية (ZXW Killer)</text>
        <text x="650" y="420" fill="#D4D4D8" font-size="22" font-weight="600">✓ تشخيص ذكي لسحبات الباور سبلاي والـ IC</text>
        <text x="650" y="465" fill="#D4D4D8" font-size="22" font-weight="600">✓ سوق بوردات التشليح وخزنة الزبائن بطباعة QR</text>
        
        <!-- Domain URL tag -->
        <rect x="420" y="515" width="230" height="40" rx="10" fill="#18181B" stroke="#27272A" stroke-width="1"/>
        <text x="635" y="542" fill="#06B6D4" font-size="18" font-family="monospace" font-weight="bold">alam-alsiana.vercel.app</text>
      </g>
    </svg>
  `);

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 7, g: 7, b: 7, alpha: 1 }
    }
  })
    .composite([
      { input: svgOverlay, top: 0, left: 0 },
      { input: logoSquare, top: 65, left: 660 } // Place the 500x500 3D logo emblem on the right side
    ])
    .jpeg({ quality: 92 })
    .toFile('public/og-image.jpg');

  // Also save as public/og-image.png and src/app/opengraph-image.png for Next.js automatic OG router
  await sharp('public/og-image.jpg')
    .png({ quality: 92 })
    .toFile('public/og-image.png');
  await sharp('public/og-image.jpg')
    .png({ quality: 92 })
    .toFile('src/app/opengraph-image.png');

  console.log('Created public/og-image.jpg, public/og-image.png, and src/app/opengraph-image.png (1200x630)');
}

processLogoAndOG().catch(err => {
  console.error('Error processing logo:', err);
  process.exit(1);
});
