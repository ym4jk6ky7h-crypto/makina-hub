# Artist Enricher Agent

Pipeline automático para poblar artistas, eventos y temas de la mákina catalana.

## Pipeline completo

```bash
# Todo en orden: artistas → eventos → temas
npm run db:sync-all

# Solo los primeros 10 artistas (prueba)
npm run db:sync-all -- --limit=10
```

## Por pasos

```bash
# 50 artistas (Wikipedia + MusicBrainz + Discogs + YouTube)
npm run db:discover-artists
npm run db:discover-artists -- --limit=10 --dry-run
npm run db:discover-artists -- --skip-mb    # más rápido (~5 min vs ~25 min)

npm run db:discover-events   # 10 eventos reales CAT 2026
npm run db:discover-tracks   # clásicos (Flying Free, etc.)
```

## Fuentes

| Fuente | Datos | Requiere |
|--------|--------|----------|
| `data/makina-artists.ts` | 100 artistas mákina (bio orígenes/época/hoy) |
| Wikipedia API (es) | Bio, foto | — |
| MusicBrainz | Spotify, YouTube, Discogs URLs | — (1 req/s) |
| Discogs | Foto, bio, nombre real | `DISCOGS_TOKEN` |
| YouTube Data API | Vídeo por artista/tema | `YOUTUBE_API_KEY` |
| `data/catalan-makina-events.ts` | Eventos Remember, Xque, Chasis… | artistas en BD |
| `data/makina-classic-tracks.ts` | Temas por artista | artistas en BD |

Sin `YOUTUBE_API_KEY`, los enlaces apuntan a búsqueda en YouTube (mejor que null).

## Variables en `CLAVES-SUPABASE.env`

```
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...   # recomendado para upsert
DISCOGS_TOKEN=...
YOUTUBE_API_KEY=...
```

## Requisitos

- Supabase con migración `002_makina_hub_production.sql` aplicada
- Service role key para escritura masiva (anon puede fallar con RLS)
