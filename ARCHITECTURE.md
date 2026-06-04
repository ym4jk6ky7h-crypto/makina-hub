# Makina Hub — Arquitectura MVP

## Visión técnica

Aplicación **Next.js 15 App Router** con renderizado híbrido:
- **SSR** en listados y fichas (SEO + datos frescos)
- **Client Components** solo donde hay interactividad (filtros, búsqueda, AI)
- **Repository pattern** para desacoplar demo data ↔ Supabase

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Vercel    │────▶│  Next.js 15  │────▶│  Supabase   │
│   (Edge)    │     │  App Router  │     │ PostgreSQL  │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────▼───────┐
                    │  OpenAI API  │
                    │ (Ask Makina) │
                    └──────────────┘
```

## Estructura de carpetas

```
makina-hub/
├── src/
│   ├── app/                      # Rutas y layouts (App Router)
│   │   ├── layout.tsx            # Shell global: Navbar + Sidebar + Footer
│   │   ├── page.tsx              # Home
│   │   ├── eventos/              # Listado + [slug]
│   │   ├── artistas/
│   │   ├── musica/
│   │   ├── sesiones/
│   │   ├── sellos/
│   │   ├── vinilos/
│   │   ├── ask/                  # Ask Makina AI
│   │   ├── buscar/
│   │   ├── api/ai/route.ts       # Endpoint OpenAI
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── ui/                   # Shadcn (Button, Input, Card…)
│   │   ├── layout/               # Navbar, Sidebar, Footer, SectionHeader
│   │   ├── cards/                # EventCard, ArtistCard, TrackCard…
│   │   ├── search/               # SearchBar
│   │   ├── events/               # EventFilters
│   │   └── ask/                  # AskMakinaForm
│   ├── lib/
│   │   ├── data/
│   │   │   ├── demo.ts           # Seed local (MVP sin Supabase)
│   │   │   └── repository.ts     # Capa de acceso unificada
│   │   ├── supabase/             # Cliente browser + server
│   │   ├── seo/                  # metadata + JSON-LD
│   │   ├── constants.ts
│   │   └── utils.ts
│   └── types/
│       └── database.ts           # Tipos TypeScript del dominio
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
└── public/
```

## Modelo de datos

| Tabla | Relaciones |
|-------|------------|
| `artists` | 1:N tracks, sessions, vinyls; M:N events |
| `labels` | 1:N tracks, vinyls |
| `tracks` | N:1 artist, label |
| `events` | M:N artists (`event_artists`) |
| `sessions` | N:1 artist |
| `vinyls` | N:1 artist, label |
| `profiles` | 1:1 auth.users (futuro) |

Índices en: `slug`, `featured`, `event_date`, `province`, `genre`, `year`.

## Capa de datos (Repository)

`repository.ts` expone funciones async (`getArtists`, `getEvents`, …).

- Si hay `NEXT_PUBLIC_SUPABASE_*` → consulta Supabase
- Si no → usa `demo.ts` (MVP funcional out-of-the-box)

Preparado para agentes IA futuros: misma interfaz, nueva fuente de escritura.

## SEO

- URLs amigables: `/artistas/pastis-buenri`
- `generateMetadata` por ficha
- Open Graph dinámico
- `sitemap.ts` + `robots.ts`
- JSON-LD: Organization, MusicEvent, MusicRecording, Person

## Diseño

- Tema oscuro premium (variables CSS HSL)
- Acentos: pink `#ff2d6a`, purple, cyan, gold
- Mobile-first: sidebar oculto en móvil, navbar con menú
- Cards con glass effect y hover scale

## Escalabilidad futura

1. **Auth** → Supabase Auth + RLS por rol (editor/admin)
2. **CMS** → Panel en `/admin` o Supabase Studio
3. **Agentes IA** → Workers que insertan en tablas vía service role
4. **Cache** → `unstable_cache` / Redis para listados populares
5. **API pública** → `/api/v1/*` para integraciones
