// Copies the latin-subset WOFF2 files the site and resume use into public/fonts.
import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public', 'fonts');
mkdirSync(out, { recursive: true });

const files = [
  ['ibm-plex-sans', [400, 500, 600, 700]],
  ['ibm-plex-mono', [400, 500]],
];

for (const [family, weights] of files) {
  for (const w of weights) {
    const name = `${family}-latin-${w}-normal.woff2`;
    copyFileSync(join(root, 'node_modules', '@fontsource', family, 'files', name), join(out, name));
    console.log('copied', name);
  }
}
