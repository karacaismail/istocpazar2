import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
const entries = [...config.matchAll(/\{ label: '([^']+)', slug: '([^']+)' \}/g)];
let made = 0;
for (const [, label, slug] of entries) {
  const file = join(root, 'src', 'content', 'docs', `${slug}.mdx`);
  if (existsSync(file) || existsSync(file.replace(/\.mdx$/, '.md'))) continue;
  mkdirSync(dirname(file), { recursive: true });
  const t = label.replace(/"/g, "'");
  writeFileSync(
    file,
    `---\ntitle: ${t}\ndescription: ${t} — hazırlanıyor.\nkanit: cikarim\nguven: dusuk\ntur: harita\nfaz: faz-1\n---\n\nHazırlanıyor.\n`,
    'utf8'
  );
  made += 1;
}
console.log(`Taslak olusturuldu: ${made}`);
