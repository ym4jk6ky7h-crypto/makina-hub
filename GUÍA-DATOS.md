# Guía completa — datos reales en Makina Hub

Esta guía explica **desde cero** cómo dejar la web con artistas, temas y eventos reales (mákina catalana), usando Supabase y los scripts automáticos.

---

## Resumen rápido (orden correcto)

| Paso | Qué haces | Resultado |
|------|-----------|-----------|
| 1 | Crear tablas en Supabase (migración SQL) | BD vacía con schema |
| 2 | Configurar `CLAVES-SUPABASE.env` + **service role** | La app y los scripts pueden escribir |
| 3 | `npm run db:sync-all` (o seed SQL + discover por partes) | 50 artistas + eventos + temas |
| 4 | `npm run dev` | Ver `/artistas`, `/eventos`, `/musica` |

---

## 1. Supabase — proyecto y tablas

### 1.1 Entrar al proyecto

1. Abre [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Proyecto: **acsyjnzgyjzfetvtpsay** (tu URL ya está en `CLAVES-SUPABASE.env`)

### 1.2 Crear las tablas (solo la primera vez)

1. Menú izquierdo → **SQL Editor** → **New query**
2. Abre en tu Mac el archivo:
   `makina-hub/supabase/migrations/002_makina_hub_production.sql`
3. Copia **todo** el contenido y pégalo en el editor
4. Pulsa **Run**

Si ya lo ejecutaste antes, no hace falta repetirlo (puede borrar datos si el SQL hace `DROP TABLE`).

### 1.3 Comprobar que hay tablas

En **Table Editor** deberías ver: `artists`, `tracks`, `events`, `labels`, `sessions`, `vinyls`, `event_artists`.

### 1.4 Ver cuántos datos hay

En SQL Editor, ejecuta el archivo `supabase/verificar-datos.sql` o esta consulta:

```sql
SELECT 'artists' AS tabla, COUNT(*) FROM artists
UNION ALL SELECT 'tracks', COUNT(*) FROM tracks
UNION ALL SELECT 'events', COUNT(*) FROM events;
```

---

## 2. Claves — qué es cada una

Archivo principal: **`CLAVES-SUPABASE.env`** (visible en Finder; el dev lo carga automáticamente).

| Variable | Para qué sirve | ¿Dónde la sacas? |
|----------|----------------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Conectar la web | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Leer datos en el navegador | Settings → API → publishable / anon |
| `SUPABASE_SERVICE_ROLE_KEY` | **Escribir** con scripts (`discover`, `seed`) | Settings → API → **service_role** (secret) |
| `DISCOGS_TOKEN` | Fotos y bios de Discogs (opcional) | discogs.com → Settings → Developers |
| `YOUTUBE_API_KEY` | Enlaces a vídeos concretos (opcional) | Google Cloud Console |
| `NEXT_PUBLIC_SITE_URL` | SEO / enlaces | `http://localhost:3000` en local |

### Importante sobre seguridad

- **Nunca** subas `service_role` a GitHub ni la pegues en chats públicos.
- La **publishable** puede ir en el front; la **service_role** solo en tu Mac y en Vercel como variable **sin** prefijo `NEXT_PUBLIC_`.

### Cómo rellenar `CLAVES-SUPABASE.env`

1. Abre el archivo en Cursor
2. En Supabase: **Project Settings** → **API**
3. Copia **service_role** y descomenta la línea:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Guarda (Cmd+S)

Sin esta clave verás errores del tipo: `violates row-level security policy`.

---

## 3. Dos formas de llenar la base de datos

### Opción A — Automático (recomendado): artistas reales + eventos + temas

Desde la carpeta del proyecto:

```bash
cd "/Users/eduardogarcialopez/Music/Analizr Vinyl Dj/makina-hub"
npm install
```

#### Prueba con 10 artistas (~3–5 min sin MusicBrainz)

```bash
npm run db:sync-all -- --limit=10 --skip-mb
```

`--skip-mb` evita MusicBrainz (más rápido). Sin ese flag, cada artista tarda ~2 s extra por MusicBrainz.

#### Los 50 artistas completos

```bash
# Con MusicBrainz (mejor calidad, ~25–40 min)
npm run db:sync-all

# O solo artistas primero, luego eventos y temas
npm run db:discover-artists
npm run db:discover-events
npm run db:discover-tracks
```

#### Solo ver qué haría (sin escribir)

```bash
npm run db:discover-artists -- --dry-run --limit=5
```

### Opción B — Seed demo por SQL (rápido, menos “real”)

1. SQL Editor → ejecuta `supabase/reset-datos.sql` (borra todo)
2. Ejecuta `supabase/seed.sql` (20 artistas, 100 tracks demo)
3. Opcional: encima ejecuta discover para **mezclar** datos reales:

```bash
npm run db:discover-artists -- --limit=20
npm run db:discover-events
```

---

## 4. Qué hace cada script

### `db:discover-artists`

- Lee la lista de **50 artistas** en `data/catalan-makina-artists.ts`
- Enriquece con:
  - **Wikipedia (es)** — biografía e imagen si existe
  - **MusicBrainz** — enlaces Spotify / YouTube / Discogs
  - **Discogs** (si hay token) — foto y bio
  - **YouTube** (si hay API key) — vídeo; si no, enlace de búsqueda
- Guarda en tabla `artists` (upsert por `slug`)

Flags útiles:

```bash
npm run db:discover-artists -- --limit=10
npm run db:discover-artists -- --dry-run
npm run db:discover-artists -- --skip-mb
```

### `db:discover-events`

- Inserta **10 eventos** curados (Remember, Xque, Chasis, Pont Aeri, etc.) en `data/catalan-makina-events.ts`
- Fechas en **2026** para que salgan como “próximos”
- Enlaza DJs en `event_artists` **si** esos artistas ya están en la BD

**Ejecutar después** de `discover-artists` (o tendrás eventos sin lineup completo).

### `db:discover-tracks`

- Añade temas clásicos por artista (`data/makina-classic-tracks.ts`): Flying Free, sesiones Anonim, etc.
- `youtube_url`: vídeo real con API, o búsqueda en YouTube

```bash
npm run db:discover-tracks -- --artist=pastis-buenri
```

### `db:sync-all`

Ejecuta en orden: artistas → eventos → temas.

### `db:seed`

Inserta el pack demo vía API (mismo requisito: **service role**). Alternativa a pegar `seed.sql` en Supabase.

---

## 5. APIs opcionales (más calidad)

### Discogs

1. Cuenta en [discogs.com](https://www.discogs.com)
2. [Settings → Developers](https://www.discogs.com/settings/developers) → **Generate new token**
3. En `CLAVES-SUPABASE.env`:

```env
DISCOGS_TOKEN=tu_token_aqui
```

4. Vuelve a correr:

```bash
npm run db:discover-artists -- --limit=20
```

Límite Discogs: ~60 peticiones/minuto; el script espera entre llamadas.

### YouTube Data API v3

1. [Google Cloud Console](https://console.cloud.google.com) → nuevo proyecto
2. **APIs & Services** → **Library** → activa **YouTube Data API v3**
3. **Credentials** → **Create credentials** → **API key**
4. (Recomendado) Restringe la key a YouTube Data API y a tu IP en desarrollo
5. En `CLAVES-SUPABASE.env`:

```env
YOUTUBE_API_KEY=AIza...
```

6. Temas y artistas con vídeo real:

```bash
npm run db:discover-artists -- --limit=10
npm run db:discover-tracks
```

Cuota gratuita: ~10.000 unidades/día (cada búsqueda ≈ 100 unidades).

---

## 6. Ver la web en local

```bash
npm run dev
```

Abre la URL que salga en terminal (a veces **3001** si el 3000 está ocupado).

| Ruta | Qué verás |
|------|-----------|
| `/` | Home con artistas y eventos |
| `/artistas` | Listado |
| `/artistas/pastis-buenri` | Ficha (bio, YouTube, imagen) |
| `/eventos` | Eventos 2026 |
| `/musica` | Temas con enlace YouTube |
| `/buscar?q=pastis` | Búsqueda global |

Si la home está vacía: casi siempre la BD tiene 0 filas o falta la publishable key en `CLAVES-SUPABASE.env`.

---

## 7. Problemas frecuentes

### “Supabase no configurado” o pantalla vacía

- Revisa `CLAVES-SUPABASE.env`: URL y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` sin placeholders `YOUR_PROJECT`
- Reinicia `npm run dev` después de guardar el archivo

### `violates row-level security policy`

- Falta **`SUPABASE_SERVICE_ROLE_KEY`** en `CLAVES-SUPABASE.env`
- Los scripts de discover **no** usan la publishable para escribir

### `Falta SUPABASE_SERVICE_ROLE_KEY`

- El script se detiene a propósito; añade la service role (sección 2)

### Eventos sin DJs en el cartel

- Corriste `discover-events` antes que `discover-artists`
- Solución: `npm run db:discover-artists` y luego `npm run db:discover-events` otra vez

### `duplicate key events_slug_key` al hacer seed SQL

- Ejecuta primero `reset-datos.sql`, luego `seed.sql`
- O usa solo los scripts discover (slugs distintos al seed demo)

### Discover-artists muy lento

- Usa `--skip-mb` o `--limit=10` para pruebas
- MusicBrainz pide ~1 petición/segundo por política de la API

### Imágenes no cargan

- `next.config.ts` ya permite Wikipedia, ui-avatars, Discogs
- Tras añadir Discogs, reinicia `npm run dev`

---

## 8. Editar contenido a mano

| Quieres cambiar… | Archivo |
|------------------|---------|
| Lista de 50 artistas | `data/catalan-makina-artists.ts` |
| Eventos y salas | `data/catalan-makina-events.ts` |
| Temas por DJ | `data/makina-classic-tracks.ts` |
| Regenerar SQL seed | `npm run db:generate-seed` → `supabase/seed.sql` |

Después de editar listas, vuelve a ejecutar el script correspondiente (`discover-artists`, etc.).

---

## 9. Despliegue (Vercel)

1. Sube el repo a GitHub (sin `CLAVES-SUPABASE.env` ni service role)
2. En Vercel → **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` = tu dominio
3. Los scripts `db:discover-*` se ejecutan **en tu Mac**, no en Vercel (salvo que configures un CI aparte)

Detalle: [DEPLOY.md](./DEPLOY.md)

---

## 10. Checklist final

- [ ] Migración `002_makina_hub_production.sql` ejecutada en Supabase
- [ ] `CLAVES-SUPABASE.env` con URL + publishable + **service_role**
- [ ] `npm run db:sync-all` (o sync con `--limit=10` de prueba)
- [ ] `verificar-datos.sql` muestra filas > 0
- [ ] `npm run dev` y `/artistas` muestra nombres reales
- [ ] (Opcional) `DISCOGS_TOKEN` y `YOUTUBE_API_KEY` para enriquecer más

Si algo falla, copia el mensaje exacto del terminal (sin pegar la service role) y lo revisamos.
