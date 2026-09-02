/**
 * İçerik test kapıları.
 * Bu betik, rehberin sözünü verdiği kuralları makine ile doğrular:
 *  1. Emoji yasağı (kullanıcı kuralı: UI ikonlarında emoji kullanılmaz).
 *  2. Mermaid yasağı (görseller erişilebilir statik SVG olmalı).
 *  3. Her sayfada zorunlu frontmatter alanları (kanıt seviyesi beyanı).
 *  4. Her <Figure> bileşeninin metinsel karşılığı (alt slot) bulunmalı.
 *  5. Her <Chart> bileşeninin erişilebilir tablo verisi bulunmalı.
 *  6. Kenar çubuğundaki her slug için gerçek bir dosya bulunmalı.
 *  7. Ham http(s) CDN bağımlılığı olmamalı (yerel varlık kuralı).
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const docsDir = join(root, 'src', 'content', 'docs');

const failures = [];
const stats = { pages: 0, figures: 0, charts: 0, words: 0 };

function fail(file, rule, detail) {
  failures.push({ file, rule, detail });
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (['.md', '.mdx'].includes(extname(entry))) out.push(full);
  }
  return out;
}

// Emoji aralıkları (piktografik semboller). Tipografik işaretler hariç tutulur.
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/u;

if (!existsSync(docsDir)) {
  console.error('HATA: src/content/docs bulunamadı.');
  process.exit(1);
}

const files = walk(docsDir);

for (const file of files) {
  const rel = relative(root, file);
  const raw = readFileSync(file, 'utf8');
  stats.pages += 1;
  stats.words += raw.split(/\s+/).length;

  // 1. Emoji
  const emojiMatch = raw.match(EMOJI);
  if (emojiMatch) {
    const line = raw.slice(0, raw.indexOf(emojiMatch[0])).split('\n').length;
    fail(rel, 'emoji-yasagi', `satır ${line}: "${emojiMatch[0]}"`);
  }

  // 2. Mermaid
  if (/```\s*mermaid/i.test(raw) || /<pre[^>]*class="[^"]*mermaid/i.test(raw)) {
    fail(rel, 'mermaid-yasagi', 'mermaid bloğu bulundu');
  }

  // 3. Frontmatter
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) {
    fail(rel, 'frontmatter-eksik', 'frontmatter bloğu yok');
  } else {
    const body = fm[1];
    for (const key of ['title', 'description', 'kanit', 'guven', 'tur', 'faz']) {
      if (!new RegExp(`^${key}:`, 'm').test(body)) {
        fail(rel, 'frontmatter-alan-eksik', `"${key}" alanı yok`);
      }
    }
  }

  // 4. Figure -> alt slot
  const figureOpens = raw.match(/<Figure\b/g)?.length ?? 0;
  const altSlots = raw.match(/slot="alt"/g)?.length ?? 0;
  stats.figures += figureOpens;
  if (figureOpens > altSlots) {
    fail(rel, 'diyagram-erisilebilirlik', `${figureOpens} Figure, ${altSlots} metinsel karşılık`);
  }

  // 5. Chart -> tablo verisi
  const chartOpens = raw.match(/<Chart\b/g)?.length ?? 0;
  stats.charts += chartOpens;
  if (chartOpens > 0) {
    const rowsProps = raw.match(/rows=\{/g)?.length ?? 0;
    const colProps = raw.match(/columns=\{/g)?.length ?? 0;
    if (rowsProps < chartOpens || colProps < chartOpens) {
      fail(rel, 'grafik-erisilebilirlik', `${chartOpens} Chart, ${rowsProps} rows, ${colProps} columns`);
    }
  }

  // 7. Uzak varlık
  const remote = raw.match(/(?:src|href)=["']https?:\/\/[^"']*\.(?:js|css|svg|png|jpg|woff2?)["']/i);
  if (remote) {
    fail(rel, 'uzak-varlik', remote[0]);
  }
}

// 6. Kenar çubuğu slug doğrulaması
const config = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
const slugs = [...config.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const seen = new Set();
for (const slug of slugs) {
  if (seen.has(slug)) fail('astro.config.mjs', 'slug-tekrar', slug);
  seen.add(slug);
  const md = join(docsDir, `${slug}.md`);
  const mdx = join(docsDir, `${slug}.mdx`);
  if (!existsSync(md) && !existsSync(mdx)) {
    fail('astro.config.mjs', 'slug-dosyasi-yok', slug);
  }
}

// Yetim sayfa kontrolü (index hariç)
for (const file of files) {
  const rel = relative(docsDir, file).replace(/\.(md|mdx)$/, '');
  if (rel === 'index') continue;
  if (!seen.has(rel)) fail(relative(root, file), 'kenar-cubugunda-yok', rel);
}

console.log('--- İçerik test kapıları ---');
console.log(`Sayfa: ${stats.pages} | Diyagram: ${stats.figures} | Grafik: ${stats.charts} | Kelime: ~${stats.words}`);
console.log(`Kenar çubuğu bağlantısı: ${slugs.length}`);

if (failures.length > 0) {
  console.error(`\nBAŞARISIZ: ${failures.length} bulgu\n`);
  for (const f of failures) console.error(`  [${f.rule}] ${f.file} — ${f.detail}`);
  process.exit(1);
}

console.log('\nGEÇTİ: tüm içerik kapıları yeşil.');
