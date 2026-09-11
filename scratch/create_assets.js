import fs from 'fs';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Simple valid 1x1 or styled SVG to PNG base64 strings
// Logo (blue badge with text)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <rect width="160" height="160" rx="32" fill="#2563EB"/>
  <circle cx="80" cy="80" r="50" fill="#1D4ED8"/>
  <path d="M50 80 L70 100 L110 60" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text x="80" y="145" font-family="sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF" text-anchor="middle">DESIGN FEST</text>
</svg>`;

const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" rx="24" fill="url(#g1)"/>
  <circle cx="200" cy="180" r="120" fill="#FFFFFF" opacity="0.1"/>
  <circle cx="650" cy="450" r="180" fill="#FFFFFF" opacity="0.15"/>
  <rect x="150" y="120" width="500" height="360" rx="16" fill="#FFFFFF" opacity="0.95"/>
  <rect x="190" y="160" width="420" height="40" rx="8" fill="#4F46E5"/>
  <rect x="190" y="220" width="260" height="20" rx="4" fill="#CBD5E1"/>
  <rect x="190" y="255" width="340" height="15" rx="4" fill="#E2E8F0"/>
  <rect x="190" y="280" width="300" height="15" rx="4" fill="#E2E8F0"/>
  <rect x="190" y="340" width="160" height="45" rx="8" fill="#10B981"/>
  <circle cx="530" cy="300" r="70" fill="#F59E0B"/>
</svg>`;

const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="100" fill="#3B82F6"/>
  <circle cx="100" cy="80" r="40" fill="#FFFFFF"/>
  <path d="M30 170 C40 125, 160 125, 170 170 Z" fill="#FFFFFF"/>
</svg>`;

const q8RefSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="#F3F4F6"/>
  <rect x="150" y="100" width="300" height="400" rx="16" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="2"/>
  <circle cx="300" cy="190" r="60" fill="#3B82F6"/>
  <circle cx="300" cy="175" r="24" fill="#FFFFFF"/>
  <path d="M255 230 C265 200, 335 200, 345 230 Z" fill="#FFFFFF"/>
  <text x="300" y="290" font-family="sans-serif" font-weight="bold" font-size="22" fill="#111827" text-anchor="middle">Alex Morgan</text>
  <text x="300" y="325" font-family="sans-serif" font-weight="500" font-size="14" fill="#6B7280" text-anchor="middle">Lead UI/UX Designer</text>
  <rect x="210" y="370" width="180" height="45" rx="8" fill="#2563EB"/>
  <text x="300" y="398" font-family="sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF" text-anchor="middle">Connect</text>
</svg>`;

const q9RefSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#F8FAFC"/>
  <rect x="40" y="40" width="720" height="60" rx="8" fill="#1E293B"/>
  <rect x="60" y="50" width="100" height="40" rx="6" fill="#2563EB"/>
  <text x="110" y="75" font-family="sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF" text-anchor="middle">LOGO</text>
  <text x="710" y="76" font-family="sans-serif" font-weight="500" font-size="13" fill="#FFFFFF" text-anchor="end">Home   Features   Pricing   Contact</text>
  <text x="40" y="180" font-family="sans-serif" font-weight="bold" font-size="30" fill="#0F172A">Build Better Products Faster</text>
  <text x="40" y="240" font-family="sans-serif" font-weight="normal" font-size="14" fill="#475569">Streamline your workflow with our modern design platform</text>
  <text x="40" y="260" font-family="sans-serif" font-weight="normal" font-size="14" fill="#475569">built for high-performing creative teams.</text>
  <rect x="40" y="330" width="160" height="45" rx="8" fill="#2563EB"/>
  <text x="120" y="358" font-family="sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF" text-anchor="middle">Get Started</text>
  <rect x="450" y="140" width="310" height="240" rx="12" fill="#4F46E5"/>
</svg>`;

const q10RefSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#FFFFFF"/>
  <rect x="40" y="30" width="720" height="100" rx="12" fill="#0F172A"/>
  <text x="60" y="90" font-family="sans-serif" font-weight="bold" font-size="24" fill="#38BDF8">DESIGN PRECISION CHAMPIONSHIP 2026</text>
  <rect x="650" y="45" width="90" height="70" rx="8" fill="#2563EB"/>
  <rect x="40" y="145" width="720" height="6" rx="3" fill="#F59E0B"/>
  <rect x="40" y="170" width="400" height="260" rx="12" fill="#4F46E5"/>
  <rect x="460" y="170" width="300" height="260" rx="12" fill="#F1F5F9"/>
  <text x="480" y="215" font-family="sans-serif" font-weight="bold" font-size="18" fill="#0F172A">Key Highlights</text>
  <text x="480" y="255" font-family="sans-serif" font-weight="500" font-size="14" fill="#334155">• 100% Automated Scoring</text>
  <text x="480" y="285" font-family="sans-serif" font-weight="500" font-size="14" fill="#334155">• Live Leaderboard Updates</text>
  <text x="480" y="315" font-family="sans-serif" font-weight="500" font-size="14" fill="#334155">• Certificate of Excellence</text>
  <rect x="280" y="460" width="240" height="50" rx="25" fill="#10B981"/>
  <text x="400" y="491" font-family="sans-serif" font-weight="bold" font-size="15" fill="#FFFFFF" text-anchor="middle">SUBMIT FINAL DESIGN</text>
</svg>`;

// Write SVGs as well as PNG alias compatibility
fs.writeFileSync(path.join(assetsDir, 'logo.png'), logoSvg);
fs.writeFileSync(path.join(assetsDir, 'hero_graphic.png'), heroSvg);
fs.writeFileSync(path.join(assetsDir, 'avatar.png'), avatarSvg);
fs.writeFileSync(path.join(assetsDir, 'q8_profile_card_ref.png'), q8RefSvg);
fs.writeFileSync(path.join(assetsDir, 'q9_landing_section_ref.png'), q9RefSvg);
fs.writeFileSync(path.join(assetsDir, 'q10_full_design_ref.png'), q10RefSvg);

console.log('Successfully generated asset files in public/assets/');
