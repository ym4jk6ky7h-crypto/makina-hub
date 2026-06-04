# Sincronización automática diaria

Makina Hub puede actualizar solo **eventos**, **novedades** (Discogs) y **temas nuevos** cada día.

## Qué hace

| Paso | Fuente | Resultado |
|------|--------|-----------|
| Eventos | [Makina Legends](https://www.makinalegends.com/eventos/) (sitemap) | Se fusionan con `data/catalan-makina-events-catalog.ts` |
| Novedades | Discogs API (`DISCOGS_TOKEN`) | Releases recientes por artista del roster |
| Temas | Discogs (tracklists) | Temas nuevos en `/musica` |

El catálogo **manual** que editas tú no se borra; lo auto solo añade o actualiza entradas con prefijo `ml-` o `auto-discogs-`.

## Uso local

```bash
cd makina-hub

# Una vez al día (o cuando quieras)
npm run db:daily-sync

# Más rápido (menos páginas web)
npm run db:daily-sync -- --quick

# Solo descargar sin escribir en Supabase
npm run db:fetch-auto
```

Requisitos en `CLAVES-SUPABASE.env`:

- `SUPABASE_SECRET_KEY` (o `SUPABASE_SERVICE_ROLE_KEY`)
- `DISCOGS_TOKEN` (recomendado para novedades y temas)
- `YOUTUBE_API_KEY` (opcional, enlaces YouTube en temas)

## Vercel (producción)

1. En **Vercel → Settings → Environment Variables** añade `CRON_SECRET` (string largo aleatorio).
2. Las mismas claves de Supabase y `DISCOGS_TOKEN` que en local.
3. El archivo `vercel.json` programa el cron a las **06:00 UTC** cada día.

Vercel llamará a `GET /api/cron/daily-sync` con header:

`Authorization: Bearer TU_CRON_SECRET`

## GitHub Actions (alternativa)

Workflow: `.github/workflows/daily-sync.yml`

Configura secrets del repo:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY`
- `DISCOGS_TOKEN`
- `YOUTUBE_API_KEY` (opcional)

Puedes lanzarlo manualmente en **Actions → Daily Makina Hub sync → Run workflow**.

## Archivos generados (no subir a git)

- `data/auto/fetched-events.json`
- `data/auto/fetched-releases.json`
- `data/auto/fetched-tracks.json`
- `data/auto/sync-meta.json`

## Seguir editando a mano

- Eventos locales pequeños: `data/catalan-makina-events-catalog.ts`
- Novedades curadas: `data/makina-new-releases.ts`
- Artistas: `data/makina-artists-meta.ts` + `data/makina-artist-bios.ts`

Tras editar manualmente, `npm run db:discover-events` (o `db:daily-sync`) vuelve a fusionar todo.
