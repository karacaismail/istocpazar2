import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/**
 * Kanıt hiyerarşisi — her sayfa hangi güç seviyesinde kanıta dayandığını beyan eder.
 * Uzman yönergesi madde 26 ve 36 gereği zorunludur.
 */
export const evidenceLevels = [
  'sistematik-derleme',
  'hakemli-arastirma',
  'sektor-verisi',
  'resmi-kaynak',
  'vaka-calismasi',
  'operator-beyani',
  'uzman-gorusu',
  'cikarim',
  'spekulasyon',
  'karma',
] as const;

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        /** Sayfanın baskın kanıt seviyesi. */
        kanit: z.enum(evidenceLevels).default('karma'),
        /** Bu sayfadaki iddialara duyulan genel güven. */
        guven: z.enum(['yuksek', 'orta', 'dusuk']).default('orta'),
        /** Sayfa bir karar dayanağı mı, yoksa seçenek haritası mı? */
        tur: z
          .enum(['harita', 'oneri', 'karar', 'operasyon', 'referans'])
          .default('harita'),
        /** Faz 1 (problem uzayı) mı, Faz 2 (çözüm) mü? */
        faz: z.enum(['faz-1', 'faz-2', 'her-ikisi']).default('faz-1'),
      }),
    }),
  }),
};
