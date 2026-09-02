/**
 * Phosphor ikonlarını node_modules'tan src/assets/icons/ altına kopyalar.
 * Amaç: ikonlar depoda yerel olarak bulunsun, CDN veya çalışma zamanı bağımlılığı olmasın.
 * Kullanım: node scripts/vendor-icons.mjs
 */
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const src = join(root, 'node_modules', '@phosphor-icons', 'core', 'assets', 'regular');
const dest = join(root, 'src', 'assets', 'icons');

const ICONS = [
  'arrows-clockwise', 'arrow-right', 'arrow-u-down-left', 'binoculars', 'brain',
  'buildings', 'calendar-check', 'chart-line-up', 'chats-circle', 'check-circle',
  'compass', 'crosshair', 'currency-circle-dollar', 'detective', 'eye-slash',
  'flask', 'flow-arrow', 'gavel', 'graph', 'handshake', 'lightbulb', 'list-checks',
  'magnifying-glass', 'map-trifold', 'megaphone', 'package', 'path', 'prohibit',
  'question', 'scales', 'seal-check', 'shield-warning', 'shuffle', 'siren',
  'stack', 'storefront', 'strategy', 'target', 'timer', 'tree-structure',
  'trend-down', 'user-focus', 'users-three', 'warning-circle', 'warning-octagon',
];

if (!existsSync(src)) {
  console.error('HATA: @phosphor-icons/core bulunamadı. Önce `npm install` çalıştırın.');
  process.exit(1);
}

mkdirSync(dest, { recursive: true });

let copied = 0;
const missing = [];
for (const name of ICONS) {
  const from = join(src, `${name}.svg`);
  if (!existsSync(from)) {
    missing.push(name);
    continue;
  }
  copyFileSync(from, join(dest, `${name}.svg`));
  copied += 1;
}

console.log(`Phosphor ikonu kopyalandı: ${copied}/${ICONS.length} -> src/assets/icons/`);
if (missing.length > 0) {
  console.error(`Bulunamayan ikonlar: ${missing.join(', ')}`);
  process.exit(1);
}
