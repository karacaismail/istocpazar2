// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const SITE = 'https://karacaismail.github.io';
const BASE = '/istocpazar2';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    starlight({
      title: 'İstoc Pazar Yeri Rehberi',
      description:
        'İstoc.com iki taraflı B2B pazar yeri için soğuk başlangıç, likidite, strateji seçenek uzayı, çözüm önerileri ve ekip kurulum rehberi.',
      defaultLocale: 'root',
      locales: { root: { label: 'Türkçe', lang: 'tr' } },
      lastUpdated: true,
      pagination: true,
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.scss'],
      components: {
        Footer: './src/components/SiteFooter.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'Kaynak kod',
          href: 'https://github.com/karacaismail/istocpazar2',
        },
      ],
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        {
          label: 'Başlangıç',
          items: [
            { label: 'İki dakikalık özet', slug: 'baslangic/iki-dakikalik-ozet' },
            { label: 'Bu rehber nasıl okunur', slug: 'baslangic/nasil-okunur' },
            { label: 'Sizden istenen kararlar', slug: 'baslangic/yonetici-karari' },
            { label: 'Sözlük', slug: 'baslangic/sozluk' },
          ],
        },
        {
          label: 'Teşhis: problem gerçekte ne?',
          items: [
            { label: 'Problem haritası', slug: 'teshis/problem-haritasi' },
            { label: 'Alternatif hipotezler', slug: 'teshis/alternatif-hipotezler' },
            { label: 'Bilinmeyenler haritası', slug: 'teshis/bilinmeyenler-haritasi' },
            { label: 'Varsayım kütüğü', slug: 'teshis/varsayim-kutugu' },
          ],
        },
        {
          label: 'Teori: hangi pazarlama?',
          items: [
            { label: 'Pazarlama 2.0 mı, 5.0 mı, 9.0 mu?', slug: 'teori/kacinci-pazarlama' },
            { label: 'Strateji soy ağacı', slug: 'teori/soy-agaci' },
            { label: 'Gerilla ve kontrgerilla', slug: 'teori/gerilla-kontrgerilla' },
            { label: 'Pazarlama dışı disiplinler', slug: 'teori/disiplin-transferi' },
            { label: 'Karar Kitabı modelleri', slug: 'teori/karar-kitabi' },
            { label: 'İknanın psikolojisi', slug: 'teori/iknanin-psikolojisi' },
          ],
        },
        {
          label: 'Pazar yeri mekaniği',
          items: [
            { label: 'Likidite: asıl ölçüt', slug: 'pazaryeri/likidite' },
            { label: 'Soğuk başlangıç çözüm aileleri', slug: 'pazaryeri/soguk-baslangic-aileleri' },
            { label: 'Atomik ağ', slug: 'pazaryeri/atomik-ag' },
            { label: 'Giriş kaması seçenekleri', slug: 'pazaryeri/giris-kamasi-secenekleri' },
            { label: 'Sihirli an', slug: 'pazaryeri/sihirli-an' },
            { label: 'Taraf taraf değer önerisi', slug: 'pazaryeri/deger-onerisi' },
            { label: 'Güven mimarisi', slug: 'pazaryeri/guven-mimarisi' },
            { label: 'Teşvik ve mekanizma tasarımı', slug: 'pazaryeri/tesvik-tasarimi' },
            { label: 'Büyüme döngüleri', slug: 'pazaryeri/buyume-dongulari' },
          ],
        },
        {
          label: 'Rekabet ve zamanlama',
          items: [
            { label: 'Geniş rekabet haritası', slug: 'rekabet/rekabet-haritasi' },
            { label: 'Tüketilmeyen pazar ve geçiş maliyeti', slug: 'rekabet/tuketilmeyen-pazar' },
            { label: 'Neden şimdi?', slug: 'rekabet/neden-simdi' },
            { label: 'Ajan tabanlı ticaret', slug: 'rekabet/agentic-ticaret' },
          ],
        },
        {
          label: 'Kanıt ve karşı kanıt',
          items: [
            { label: 'Kanıt haritası', slug: 'kanit/kanit-haritasi' },
            { label: 'Çelişki haritası', slug: 'kanit/celiski-haritasi' },
            { label: 'Başarısızlık ve anti-pattern', slug: 'kanit/basarisizlik-haritasi' },
            { label: 'Batış provası: 30 ölüm nedeni', slug: 'kanit/premortem' },
            { label: 'Kırmızı takım', slug: 'kanit/red-team' },
          ],
        },
        {
          label: 'Çözüm önerileri',
          items: [
            { label: 'Çözüm özeti', slug: 'cozum/cozum-ozeti' },
            { label: 'Önerilen giriş kaması', slug: 'cozum/onerilen-giris-kamasi' },
            { label: 'Kendini ödeyen model', slug: 'cozum/kendini-odeyen-model' },
            { label: 'Aşamalı istihdam ve kapılar', slug: 'cozum/asamali-istihdam' },
            { label: 'Arz kurulum operasyonu', slug: 'cozum/arz-kurulum-operasyonu' },
            { label: 'SMART eylem planı: 90 gün', slug: 'cozum/eylem-plani' },
            { label: 'Seçilmeyen seçenekler', slug: 'cozum/secilmeyen-secenekler' },
          ],
        },
        {
          label: 'Karar sistemi',
          items: [
            { label: 'Karar döngüsü', slug: 'karar-sistemi/eca-plus' },
            { label: 'Karşılık merdiveni', slug: 'karar-sistemi/karsilik-merdiveni' },
            { label: 'Puanlama modeli', slug: 'karar-sistemi/puanlama' },
            { label: 'Kural kütüphanesi', slug: 'karar-sistemi/kural-kutuphanesi' },
          ],
        },
        {
          label: 'Hedefler ve ölçüm',
          items: [
            { label: 'Hedeflerimiz nelerdir', slug: 'olcum/hedeflerimiz' },
            { label: 'North Star adayları', slug: 'olcum/north-star' },
            { label: 'Metrik sözlüğü', slug: 'olcum/metrik-sozlugu' },
            { label: 'Goodhart tuzağı', slug: 'olcum/goodhart' },
            { label: 'Durdurma ve ölçekleme ölçütleri', slug: 'olcum/kill-scale' },
          ],
        },
        {
          label: 'Organizasyon: 3 kişilik ekip',
          items: [
            { label: 'Organizasyon hipotezi', slug: 'organizasyon/hipotez' },
            { label: 'Roller ve kalifikasyonlar', slug: 'organizasyon/roller-ve-kalifikasyonlar' },
            { label: 'Görev tanımı: Masa Başı', slug: 'organizasyon/gorev-tanimi-masabasi' },
            { label: 'Görev tanımı: Saha', slug: 'organizasyon/gorev-tanimi-saha' },
            { label: 'Görev tanımı: Organizatör', slug: 'organizasyon/gorev-tanimi-organizator' },
            { label: 'Günlük iş akışları', slug: 'organizasyon/gunluk-akislar' },
            { label: 'SMART hedefler', slug: 'organizasyon/smart-hedefler' },
            { label: 'İşe alım ve onboarding', slug: 'organizasyon/ise-alim' },
            { label: 'Yasal sınırlar ve spam riski', slug: 'organizasyon/yasal-sinirlar' },
          ],
        },
        {
          label: 'Deney portföyü',
          items: [
            { label: 'Deney portföyü', slug: 'deney/portfoy' },
            { label: 'Deney kartları', slug: 'deney/kartlar' },
          ],
        },
        {
          label: 'Açık uçlar',
          items: [
            { label: 'Cevaplanmamış sorular', slug: 'acik/acik-sorular' },
            { label: 'Önerilen derin araştırma akışları', slug: 'acik/arastirma-akislari' },
          ],
        },
        {
          label: 'Yayın ve bakım',
          items: [
            { label: 'Test kapıları', slug: 'yayin/test-kapilari' },
            { label: 'Yayın prosedürü', slug: 'yayin/yayin-proseduru' },
            { label: 'Sürüm günlüğü', slug: 'yayin/surum-gunlugu' },
          ],
        },
      ],
    }),
  ],
});
