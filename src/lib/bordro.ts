/**
 * Net maaştan işveren maliyetine bordro modeli (Türkiye, aylık bordro, 12 ay).
 *
 * Kapsadığı kurallar: SGK prime esas kazanç tavanı (asgari ücretin 9 katı), kümülatif
 * gelir vergisi, asgari ücrete isabet eden gelir ve damga vergisi istisnası, işçi ve
 * işveren SGK + işsizlik payları. Net ücret dolar olarak sabittir; her ayın TL hedefi
 * o ayın kuruyla bulunur, brüt ücret ikili aramayla çözülür.
 *
 * Kaynak parametreler 2026 mevzuatıdır. 2027 değerleri varsayımdır: TL parametreleri
 * `artisYuzde` kadar artırılır. Resmî 2027 asgari ücreti ve vergi dilimleri Aralık
 * 2026'da açıklanınca yalnızca girdiler güncellenir.
 */

/** Gelir vergisi dilimi: [üst sınır (TL, kümülatif matrah), oran]. */
export type Dilim = readonly [ust: number, oran: number];

export const MEVZUAT_2026 = {
  /** Aylık brüt asgari ücret, TL. */
  asgariUcret: 33_030,
  /** SGK tavanı = asgari ücret × 9 (7566 sayılı Kanun, 2026'dan itibaren). */
  sgkTavanKati: 9,
  /** 2026 ücret gelirleri tarifesi. */
  dilimler: [
    [190_000, 0.15],
    [400_000, 0.2],
    [1_500_000, 0.27],
    [5_300_000, 0.35],
    [Number.POSITIVE_INFINITY, 0.4],
  ] as readonly Dilim[],
  /** Damga vergisi, binde 7,59. */
  damgaVergisi: 0.00759,
  /** İşçi payı: SGK %14 + işsizlik %1. */
  isciPayi: 0.15,
  /** İşveren payı, hizmet sektörü 2 puan indirimiyle: SGK %19,75 + işsizlik %2. */
  isverenPayiIndirimli: 0.2175,
  /** İşveren payı, indirimsiz: SGK %21,75 + işsizlik %2. */
  isverenPayiIndirimsiz: 0.2375,
} as const;

export interface BordroGirdisi {
  /** Aylık net maaş, dolar. */
  netUsd: number;
  /** Aylık yemek parası, TL. */
  yemekTl: number;
  /** Ocak ayı kuru, ₺/$. */
  kurOcak: number;
  /** Aralık ayı kuru, ₺/$. Aradaki aylar doğrusal ilerler. */
  kurAralik: number;
  /** 2026'ya göre TL parametre artışı (asgari ücret, tavan, dilimler), yüzde. */
  artisYuzde: number;
  /** Hizmet sektörü 2 puanlık SGK işveren indirimi uygulanıyor mu? */
  indirim: boolean;
}

export interface Kalemler {
  brut: number;
  net: number;
  isciPayi: number;
  gelirVergisi: number;
  damgaVergisi: number;
  isverenPayi: number;
  yemek: number;
  toplam: number;
}

export interface AyDokumu {
  /** 0 = Ocak. */
  ay: number;
  kur: number;
  brut: number;
  toplamTl: number;
}

export interface BordroSonucu {
  tl: Kalemler;
  usd: Kalemler;
  aylar: AyDokumu[];
  asgariUcret: number;
  sgkTavani: number;
  isverenPayi: number;
}

/** Kümülatif matrah `x` için dilimli gelir vergisi. */
export function kumulatifVergi(x: number, dilimler: readonly Dilim[]): number {
  let vergi = 0;
  let alt = 0;
  for (const [ust, oran] of dilimler) {
    const dilimTavani = Math.min(x, ust);
    if (dilimTavani > alt) vergi += (dilimTavani - alt) * oran;
    if (x <= ust) break;
    alt = ust;
  }
  return vergi;
}

const bosKalemler = (): Kalemler => ({
  brut: 0,
  net: 0,
  isciPayi: 0,
  gelirVergisi: 0,
  damgaVergisi: 0,
  isverenPayi: 0,
  yemek: 0,
  toplam: 0,
});

export function bordroHesapla(g: BordroGirdisi): BordroSonucu {
  const m = MEVZUAT_2026;
  const carpan = 1 + g.artisYuzde / 100;
  const asgariUcret = m.asgariUcret * carpan;
  const sgkTavani = asgariUcret * m.sgkTavanKati;
  const dilimler: Dilim[] = m.dilimler.map(([ust, oran]) => [
    Number.isFinite(ust) ? ust * carpan : ust,
    oran,
  ]);
  const isverenPayi = g.indirim ? m.isverenPayiIndirimli : m.isverenPayiIndirimsiz;
  const asgariMatrah = asgariUcret * (1 - m.isciPayi);

  let kumulatifMatrah = 0;
  let kumulatifAsgariMatrah = 0;
  const tl = bosKalemler();
  const usd = bosKalemler();
  const aylar: AyDokumu[] = [];

  for (let ay = 0; ay < 12; ay++) {
    const kur = g.kurOcak + ((g.kurAralik - g.kurOcak) * ay) / 11;
    const hedefNet = g.netUsd * kur;

    const ayHesabi = (brut: number) => {
      const primMatrahi = Math.min(brut, sgkTavani);
      const isci = m.isciPayi * primMatrahi;
      const vergiMatrahi = brut - isci;
      const vergi =
        kumulatifVergi(kumulatifMatrah + vergiMatrahi, dilimler) -
        kumulatifVergi(kumulatifMatrah, dilimler);
      const istisna =
        kumulatifVergi(kumulatifAsgariMatrah + asgariMatrah, dilimler) -
        kumulatifVergi(kumulatifAsgariMatrah, dilimler);
      const gelirVergisi = Math.max(vergi - istisna, 0);
      const damgaVergisi = m.damgaVergisi * Math.max(brut - asgariUcret, 0);
      return {
        primMatrahi,
        isci,
        vergiMatrahi,
        gelirVergisi,
        damgaVergisi,
        net: brut - isci - gelirVergisi - damgaVergisi,
      };
    };

    let alt = hedefNet;
    let ust = hedefNet * 3;
    for (let i = 0; i < 80; i++) {
      const orta = (alt + ust) / 2;
      if (ayHesabi(orta).net < hedefNet) alt = orta;
      else ust = orta;
    }
    const brut = ust;
    const c = ayHesabi(brut);
    kumulatifMatrah += c.vergiMatrahi;
    kumulatifAsgariMatrah += asgariMatrah;

    const isveren = isverenPayi * c.primMatrahi;
    const toplamTl = brut + isveren + g.yemekTl;
    const ayTl: Kalemler = {
      brut,
      net: c.net,
      isciPayi: c.isci,
      gelirVergisi: c.gelirVergisi,
      damgaVergisi: c.damgaVergisi,
      isverenPayi: isveren,
      yemek: g.yemekTl,
      toplam: toplamTl,
    };
    for (const k of Object.keys(ayTl) as (keyof Kalemler)[]) {
      tl[k] += ayTl[k];
      usd[k] += ayTl[k] / kur;
    }
    aylar.push({ ay, kur, brut, toplamTl });
  }

  return { tl, usd, aylar, asgariUcret, sgkTavani, isverenPayi };
}

/**
 * Yüzdeleri tek ondalığa yuvarlar ve toplamı tam 100,0 tutar (en büyük kalan yöntemi).
 * Böylece yığılmış çubuktaki etiketler toplamda 100'ü verir.
 */
export function yuzdeDagit(degerler: readonly number[]): number[] {
  const toplam = degerler.reduce((a, b) => a + b, 0);
  const onda = degerler.map((d) => (toplam > 0 ? (d / toplam) * 1000 : 0));
  const taban = onda.map(Math.floor);
  let eksik = 1000 - taban.reduce((a, b) => a + b, 0);
  const sira = onda
    .map((v, i) => ({ i, kalan: v - Math.floor(v) }))
    .sort((a, b) => b.kalan - a.kalan);
  for (const { i } of sira) {
    if (eksik <= 0) break;
    taban[i] = (taban[i] ?? 0) + 1;
    eksik -= 1;
  }
  return taban.map((t) => t / 10);
}
