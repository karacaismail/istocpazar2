# İstoc Pazar Yeri Rehberi

İstoc.com iki taraflı B2B pazar yerinin **yumurta-tavuk (soğuk başlangıç)** problemi için
hazırlanmış; problem uzayını açan, çözüm önerileri sunan ve üç kişilik pazarlama ekibinin
kurulumunu SMART hedeflerle tanımlayan aranabilir dokümantasyon sitesi.

**Yayın adresi:** https://karacaismail.github.io/istocpazar2/

## Rehber neyi içerir

| Bölüm | İçerik |
| ----- | ------ |
| Başlangıç | İki dakikalık özet, okuma kılavuzu, sahibinden istenen kararlar, sözlük |
| Teşhis | Problem haritası, alternatif hipotezler, bilinmeyenler haritası, varsayım kütüğü |
| Teori | Pazarlama sürüm tartışması, strateji soy ağacı, gerilla/kontrgerilla, disiplin transferi, Karar Kitabı modelleri, ikna psikolojisi |
| Pazar yeri | Likidite, soğuk başlangıç çözüm aileleri, atomik ağ, wedge, sihirli an, değer önerisi, güven mimarisi, teşvik tasarımı, büyüme döngüleri |
| Rekabet | Geniş rekabet haritası, tüketilmeyen pazar, neden şimdi, ajan tabanlı ticaret |
| Kanıt | Kanıt haritası, çelişki haritası, başarısızlık haritası, premortem, kırmızı takım |
| Çözüm | Çözüm özeti, önerilen wedge, kendini ödeyen model, aşamalı istihdam, 90 günlük SMART eylem planı |
| Karar sistemi | ECA+ ve SIDAML, karşılık merdiveni, puanlama, kural kütüphanesi |
| Ölçüm | Hedef hiyerarşisi, North Star adayları, metrik sözlüğü, Goodhart tuzağı, durdurma ölçütleri |
| Organizasyon | Roller ve kalifikasyonlar, üç görev tanımı, günlük iş akışları, SMART hedefler, işe alım, yasal sınırlar |
| Deney | Deney portföyü ve kartları |
| Açık uçlar | Cevaplanmamış sorular, önerilen araştırma akışları |
| Yayın | Test kapıları, yayın prosedürü, sürüm günlüğü |

## Teknoloji

| Alan | Seçim |
| ---- | ----- |
| Çerçeve | Astro 7 + Starlight |
| Dil | Strict TypeScript |
| Stil | SCSS |
| Arama | Pagefind (Starlight yerleşik) |
| İkon | Yerel Phosphor SVG (vendor edilmiş, CDN yok, emoji yok) |
| Diyagram | Erişilebilir statik SVG (Mermaid kullanılmaz) |
| Grafik | ECharts (yalnızca gerçek sayısal veri için, tablo karşılığı zorunlu) |
| Yayın | GitHub Actions ile GitHub Pages |

## Geliştirme

```bash
npm install
npm run dev
```

## Test kapıları

```bash
npm run verify
```

Sırayla çalışır: `astro check` (tip kontrolü), `astro build` (derleme),
`content-gates.mjs` (emoji yasağı, Mermaid yasağı, frontmatter zorunluluğu, diyagram ve
grafik erişilebilirliği, kenar çubuğu bütünlüğü, uzak varlık yasağı).

## Katkı kuralları

- Her sayfa `kanit`, `guven`, `tur`, `faz` alanlarını beyan eder.
- Her diyagramın metinsel karşılığı (`slot="alt"`) zorunludur.
- Her grafiğin veri tablosu (`columns`, `rows`) zorunludur.
- Emoji kullanılmaz; ikonlar yerel Phosphor SVG'dir.
- Bir varsayım çürüdüğünde sayfa silinmez; karşı kanıt eklenir ve sürüm günlüğüne yazılır.

## Uyarı

Bu rehber bir **araştırma ve seçenek haritasıdır**; kesinleşmiş taahhüt değildir.
Büyük bölümü çıkarım seviyesindedir ve İstoc'a özgü alan verisiyle doğrulanmamıştır.
Hukuki bölümler avukat görüşünün yerini tutmaz.
