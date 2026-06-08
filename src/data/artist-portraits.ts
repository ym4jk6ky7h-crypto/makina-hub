/**
 * Fotos verificadas manualmente (Discogs / fuentes fiables).
 * No usar búsqueda automática en Wikipedia: devuelve homónimos incorrectos.
 *
 * npm run db:apply-portraits
 */
export type ArtistPortraitSource = "discogs" | "wikimedia" | "manual";

export type CuratedPortrait = {
  url: string;
  source: ArtistPortraitSource;
  /** Mismo retrato que otro slug del roster */
  sameAs?: string;
};

/** Slug → foto verificada del DJ */
export const CURATED_ARTIST_PORTRAITS: Record<string, CuratedPortrait> = {
  skudero: {
    url: "https://i.discogs.com/iayTuuw50LqC4JWdAfSAlUkGFbeM8OryXu59dd8o3N0/rs:fit/g:sm/q:90/h:395/w:395/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTExMjk3/Ny0xNTY3MzQyMzE2/LTQzOTQuanBlZw.jpeg",
    source: "discogs",
  },
  pastis: {
    url: "https://i.discogs.com/uRHDK5Q4uDeP_159mFLAkzIrGFfanwDK4tqjZWGyUeg/rs:fit/g:sm/q:90/h:335/w:482/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTExMzEz/MS0xMjg4MTM5Mzc2/LmpwZWc.jpeg",
    source: "discogs",
  },
  buenri: {
    url: "",
    source: "discogs",
    sameAs: "pastis",
  },
  "xavi-metralla": {
    url: "https://i.discogs.com/RSdIyiF8CknFDnnr7uWA_tlEy4Va-OKcLWxww8T8pxw/rs:fit/g:sm/q:90/h:464/w:464/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTExMjk4/My0xNTY3MzQyNDEw/LTcyMjYuanBlZw.jpeg",
    source: "discogs",
  },
  konik: {
    url: "https://i.discogs.com/QsAhsfLp1GFfnFjtkIO1Q3XD_lp8zpkKdLItullzb3U/rs:fit/g:sm/q:90/h:310/w:180/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTExMjk4/OC0xNTE2MDYwMTg1/LTk4OTEuanBlZw.jpeg",
    source: "discogs",
  },
  "mike-platinas": {
    url: "https://i.discogs.com/pPVtkGr6Oz9gY7PpLj2_rPyj4a8RTL10Eo7m3Q3q8cI/rs:fit/g:sm/q:90/h:338/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTIwNDA2/My0xNDc4OTc1Nzg4/LTMyMzcuanBlZw.jpeg",
    source: "discogs",
  },
  "quique-tejada": {
    url: "https://i.discogs.com/EL0Rt3BfCBQFwOy--0J1dquXsFz1_xD8kyhAuN7Xt4w/rs:fit/g:sm/q:90/h:161/w:135/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTEyNjM1/OS0xMDk2NzE4MzM4/LmpwZw.jpeg",
    source: "discogs",
  },
  ruboy: {
    url: "https://i.discogs.com/N-YipKYnPL1h3AGdGysP8HRZ_1ZwT1iMKdiAuWfGiI8/rs:fit/g:sm/q:90/h:291/w:264/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTc5Nzkx/LTE1OTM2MDI1NzMt/OTgyMy5qcGVn.jpeg",
    source: "discogs",
  },
  delirium: {
    url: "https://i.discogs.com/JxGTG64eZ_c2nIcU0Jmab_R8lzpMZYfOm-aDpLbSqQo/rs:fit/g:sm/q:90/h:442/w:332/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTE0ODgy/NS0xNDM3ODQxNjc1/LTQyMzEuanBlZw.jpeg",
    source: "discogs",
  },
  "dvrk-oktopus": {
    url: "https://i.discogs.com/WsBmwY_KLP691IW3XAEcAg0MqvFH-bipJ_Y_OZVbnEo/rs:fit/g:sm/q:90/h:500/w:500/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTE0MzU4/MTU1LTE3MTEzOTAw/NDAtNzgzOC5qcGVn.jpeg",
    source: "discogs",
  },
  "jordi-k-stana": {
    url: "https://i.discogs.com/7rNP03kxnYKneDE4_llfgbh4ODswdBIwM2RBBDqkUPw/rs:fit/g:sm/q:90/h:506/w:487/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTEzMTQ1/MTEtMTY0OTg0MDIz/Mi0yMTg5LmpwZWc.jpeg",
    source: "discogs",
  },
  "fran-bit": {
    url: "https://i.discogs.com/iE5r5sdlgYFyN1Hvk3anY4dxQYohoYfZE0LU9Pa5Q5I/rs:fit/g:sm/q:90/h:480/w:480/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTQyNjE2/LTE2MDA1NDE1MjMt/MzQxOS5qcGVn.jpeg",
    source: "discogs",
  },
  "alberto-tapia": {
    url: "https://i.discogs.com/xZIPCpZ4A9DG8fuMqshqpjWSpFqqZQ8LH1SkXaYWX3o/rs:fit/g:sm/q:90/h:404/w:590/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTE4NjU2/Ny0xNjE0MTc5NTU5/LTM2MTcuanBlZw.jpeg",
    source: "discogs",
  },
  "toni-peret": {
    url: "https://i.discogs.com/qY0MHYHTPH4H6B_uWX3mznpCVNtT-9CMjAEkHS1Kxzs/rs:fit/g:sm/q:90/h:130/w:110/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTg5NTU3/LTEwODM1MDgwMTQu/anBn.jpeg",
    source: "discogs",
  },
  "nando-dixkontrol": {
    url: "https://i.discogs.com/EZRbKYdaZDtwc_a6-1khm7N3pJti0o5BBvlgTVWFceg/rs:fit/g:sm/q:90/h:450/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLXJfOTky/OTMtMDAxLmpwZw.jpeg",
    source: "discogs",
  },
  "darren-styles": {
    url: "https://i.discogs.com/r6-CDMXHJaYoexzv3BzKDeWL1ZCKXjTClkrLtteiQPU/rs:fit/g:sm/q:90/h:430/w:390/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTM2Mzgx/LTE0OTM0ODQzMzkt/NzI3MS5qcGVn.jpeg",
    source: "discogs",
  },
  "julio-navas": {
    url: "https://i.discogs.com/6O_iBsO6vJHlOc4Plk5aP6_DH1y6ls6OzWI3V2rmG6g/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTEzMDYz/MC0xNDgzNzI5MDc5/LTc3NDQuanBlZw.jpeg",
    source: "discogs",
  },
  "dj-buffon": {
    url: "https://i.discogs.com/jdTXGeKTWakOSabfxdm2ROVQAJt80PlKyKI_lYZ_juM/rs:fit/g:sm/q:90/h:795/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTM2NTc1/Ny0xNjgzMTIzNjY0/LTYwMzUuanBlZw.jpeg",
    source: "discogs",
  },
  "scott-brown": {
    url: "https://i.discogs.com/fv_nHIyLe80QMmjPYSqEQavr-o4EmT7dvWXxjy3aMOU/rs:fit/g:sm/q:90/h:476/w:387/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTYxMjMt/MTIwOTEyNzA5MS5q/cGVn.jpeg",
    source: "discogs",
  },
  gollum: {
    url: "https://i.discogs.com/x8lBqhRbv8DBwSfPMDLXamKgf5Jipr2_DO-g5yXntmU/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTIwNDM2/LTE1NjYxNTgzODYt/Mjc1MC5qcGVn.jpeg",
    source: "discogs",
  },
  "frank-trax": {
    url: "https://i.discogs.com/MIXcryhBxcWujK_JhEntsJ-aXKzCtfPzCBzEqLUovAQ/rs:fit/g:sm/q:90/h:650/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTUwMTc5/LTE0ODc5NzkwMjkt/Nzk0Ni5qcGVn.jpeg",
    source: "discogs",
  },
  chumi: {
    url: "https://i.discogs.com/ahBagREtyfp0s9YNzP0wTSPSqaSlxBMgPk-x8dbLVGI/rs:fit/g:sm/q:90/h:396/w:542/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTEyMjk3/NS0xMTU0MzAxNzE5/LmpwZWc.jpeg",
    source: "discogs",
  },
  markos13: {
    url: "https://i.discogs.com/sBYPkpg9Tew2Vu7mzvy35ef6NyRf93b1afMNWpo_sOY/rs:fit/g:sm/q:90/h:200/w:200/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTcyNjY3/LTE1NTM5NjkxMjIt/MzA2Mi5qcGVn.jpeg",
    source: "discogs",
  },
  "ricardo-f": {
    url: "https://i.discogs.com/M0srOren5KUHMravQjxGWTTxMv4IBnLrNfuSLk5FKNA/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTEyMDY4/NC0xNDc0NDU4MDc4/LTc0NDQuanBlZw.jpeg",
    source: "discogs",
  },
  "javi-boss": {
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Javier_Ros.png",
    source: "wikimedia",
  },
};

export function resolveCuratedPortraitUrl(slug: string): string | null {
  const entry = CURATED_ARTIST_PORTRAITS[slug];
  if (!entry) return null;
  if (entry.sameAs) {
    const ref = CURATED_ARTIST_PORTRAITS[entry.sameAs];
    return ref?.url || null;
  }
  return entry.url || null;
}

export function isCuratedPortraitSlug(slug: string): boolean {
  return Boolean(resolveCuratedPortraitUrl(slug));
}
