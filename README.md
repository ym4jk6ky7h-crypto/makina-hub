# Makina Hub

Plataforma de referencia para música **mákina**, **remember** y **hardcore** — conectada a **Supabase**.

## Requisitos

- Node.js 18+
- Proyecto Supabase con schema y seed aplicados

## Configuración

```bash
cd makina-hub
npm install
cp .env.example .env.local
```

1. Ejecuta `supabase/migrations/002_makina_hub_production.sql` en Supabase SQL Editor
2. Ejecuta `supabase/seed.sql` **o** `npm run db:seed`
3. `npm run dev` → http://localhost:3000

Ver [DEPLOY.md](./DEPLOY.md) para despliegue en Vercel.

**Guía paso a paso (claves, Supabase SQL, 50 artistas, eventos, APIs):** [GUÍA-DATOS.md](./GUÍA-DATOS.md)

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo |
| `npm run build` | Build producción |
| `npm run db:seed` | Insertar datos demo vía API (service role) |
| `npm run db:discover-artists` | 50 artistas mákina (Wikipedia + MusicBrainz + …) |
| `npm run db:discover-events` | 10 eventos catalanes 2026 |
| `npm run db:discover-tracks` | Temas clásicos + YouTube |
| `npm run db:sync-all` | Pipeline completo (artistas → eventos → temas) |
| `npm run db:generate-seed` | Regenerar `supabase/seed.sql` |

## Arquitectura

- `src/services/` — acceso a Supabase por entidad
- `src/lib/supabase/` — clientes SSR y browser
- `src/lib/ai/` + `src/services/ai/` + `src/agents/` — preparado para IA futura
- Sin datos mock: la app **requiere** Supabase configurado

## Rutas dinámicas (ES + EN)

| Español | Inglés |
|---------|--------|
| `/artistas/[slug]` | `/artist/[slug]` |
| `/musica/[slug]` | `/track/[slug]` |
| `/eventos/[slug]` | `/event/[slug]` |
| `/sesiones/[slug]` | `/session/[slug]` |
| `/vinilos/[slug]` | `/vinyl/[slug]` |
