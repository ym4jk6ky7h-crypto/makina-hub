# Despliegue Makina Hub + Supabase

## 1. Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecuta en orden:
   - `supabase/migrations/002_makina_hub_production.sql`
   - `supabase/seed.sql` (o `npm run db:seed` con service role)
3. En **Settings → API**, copia:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (solo servidor / seed)

## 2. Variables locales

```bash
cp .env.example .env.local
# Edita .env.local con tus claves
```

## 3. Seed por script (alternativa al SQL)

```bash
npm install
npm run db:seed
```

## 4. Desarrollo

```bash
npm run dev
```

## 5. Vercel

1. Importa el repo; **Root Directory**: `makina-hub`
2. Añade las variables de entorno (mismas que `.env.local`, sin service role en producción salvo que uses API admin).
3. Deploy.

## 6. Comprobar

- Home carga artistas/eventos desde Supabase
- `/buscar?q=pastis` devuelve resultados agrupados
- `/artistas/pastis-buenri` y `/artist/pastis-buenri` funcionan
