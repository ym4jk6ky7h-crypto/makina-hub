# Publicar Makina Hub en Vercel — guía fácil (desde cero)

## ¿Qué es cada cosa? (en 30 segundos)

| Pieza | Qué es | Analogía |
|-------|--------|----------|
| **Tu Mac** | Donde programas con `npm run dev` | El taller |
| **Supabase** | Base de datos en la nube (eventos, artistas…) | El almacén de datos |
| **GitHub** | Donde guardas el código (copia en internet) | La caja fuerte del proyecto |
| **Vercel** | Donde se **publica** la web para que cualquiera la abra | La tienda abierta al público |

**Vercel no guarda tus datos de artistas.** Solo ejecuta la web. Los datos siguen en **Supabase** (el mismo proyecto que usas en local).

---

## Antes de empezar (checklist)

Marca mentalmente:

- [ ] La web funciona en local: `npm run dev` → ves artistas o eventos.
- [ ] En Supabase ejecutaste el SQL de `002_makina_hub_production.sql` y `003_new_releases.sql`.
- [ ] En tu Mac ejecutaste al menos una vez:  
  `npm run db:sync-all -- --skip-mb`  
  (así Supabase tiene eventos, sesiones, etc.).
- [ ] Tienes a mano `CLAVES-SUPABASE.env` (para copiar las claves, **no** para subirlo a GitHub).

---

## PARTE A — Subir el código a GitHub

GitHub es el puente entre tu ordenador y Vercel.

### A1. Crear repositorio en GitHub

1. Entra en [github.com](https://github.com) → **New repository**.
2. Nombre: por ejemplo `makina-hub`.
3. **No** marques “Add README” si ya tienes código local.
4. Crea el repo y copia la URL (algo como `https://github.com/tu-usuario/makina-hub.git`).

### A2. Subir desde la carpeta del proyecto

Abre la terminal en la carpeta **makina-hub** (donde está `package.json`):

```bash
cd "/Users/eduardogarcialopez/Music/Analizr Vinyl Dj/makina-hub"
git init
git add .
git commit -m "Primera versión Makina Hub"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/makina-hub.git
git push -u origin main
```

Sustituye `TU_USUARIO` por tu usuario de GitHub.

**Importante:** `CLAVES-SUPABASE.env` y `.env.local` **no deben subirse** (ya están en `.gitignore`). Las claves las pondrás solo en Vercel.

---

## PARTE B — Crear cuenta en Vercel y conectar GitHub

### B1. Registro

1. Ve a [vercel.com](https://vercel.com).
2. **Sign Up** → elige **Continue with GitHub**.
3. Autoriza a Vercel para ver tus repositorios.

### B2. Importar el proyecto

1. En el panel: **Add New… → Project**.
2. Busca el repo `makina-hub` → **Import**.
3. Pantalla de configuración:
   - **Framework:** Next.js (automático).
   - **Root Directory:**  
     - Si el repo **es solo** la carpeta makina-hub → deja `.`  
     - Si el repo es la carpeta padre “Analizr Vinyl Dj” → escribe `makina-hub`.
   - **Build Command:** `npm run build` (por defecto).
   - **Install Command:** `npm install`.

**Todavía no pulses Deploy.** Primero las variables de entorno (siguiente parte).

---

## PARTE C — Variables de entorno (lo más importante)

Son “contraseñas y direcciones” que la web necesita en producción. Sin ellas verás pantalla vacía o “Configura Supabase”.

### C1. Dónde pegarlas en Vercel

En la misma pantalla de importación, baja a **Environment Variables**,  
o después: **Project → Settings → Environment Variables**.

Para cada variable, marca **Production**, **Preview** y **Development**.

### C2. Qué copiar (desde Supabase y tu archivo local)

Abre en tu Mac `CLAVES-SUPABASE.env` y el dashboard de Supabase:

[Supabase → tu proyecto → Settings → API Keys](https://supabase.com/dashboard/project/acsyjnzgyjzfetvtpsay/settings/api-keys)

| Nombre en Vercel | Qué pegar | Ejemplo |
|------------------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto | `https://acsyjnzgyjzfetvtpsay.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave **publishable** (`sb_publishable_...`) | La de tu `CLAVES-SUPABASE.env` |
| `NEXT_PUBLIC_SITE_URL` | La URL de Vercel (la pondrás tras el 1.er deploy) | `https://makina-hub-xxx.vercel.app` |
| `SUPABASE_SECRET_KEY` | Clave **secret** / service role (`eyJ...` o `sb_secret_...`) | Solo servidor; la de `CLAVES-SUPABASE.env` |
| `CRON_SECRET` | Una frase secreta inventada por ti | Genera en terminal: `openssl rand -hex 32` |

Opcionales (mejor contenido, no obligatorios para arrancar):

| Variable | Para qué |
|----------|----------|
| `DISCOGS_TOKEN` | Portadas y sellos |
| `YOUTUBE_API_KEY` | Sesiones con vídeo real en YouTube |

**No hace falta** duplicar `NEXT_PUBLIC_SUPABASE_ANON_KEY` si ya pusiste `PUBLISHABLE_KEY`.

### C3. Orden recomendado

1. Pega URL + PUBLISHABLE_KEY + SECRET_KEY + CRON_SECRET.
2. Deja `NEXT_PUBLIC_SITE_URL` temporalmente como `http://localhost:3000` o vacío.
3. Haz el primer deploy (Parte D).
4. Copia la URL real que te da Vercel y **actualiza** `NEXT_PUBLIC_SITE_URL`.
5. **Redeploy** (Deployments → ⋮ → Redeploy) para aplicar el cambio.

---

## PARTE D — Primer deploy (publicar la web)

1. Pulsa **Deploy**.
2. Espera 2–5 minutos. Verás logs; al final **Congratulations** o un enlace.
3. Clic en **Visit** → se abre algo como `https://makina-hub-xxxxx.vercel.app`.

### Si el build falla (rojo)

1. Abre el deploy fallido → pestaña **Building** → lee las últimas líneas.
2. Errores típicos:
   - Falta dependencia → en local `npm install` y vuelve a subir a GitHub.
   - Error TypeScript → corrige en local, `git push`, Vercel vuelve a desplegar solo.

### Si la web abre pero está vacía

Casi siempre faltan variables `NEXT_PUBLIC_SUPABASE_*` o no ejecutaste `db:sync-all` contra **ese** proyecto Supabase.

---

## PARTE E — Comprobar que todo va bien

Abre tu URL de Vercel y revisa:

| Página | Deberías ver |
|--------|----------------|
| `/` | Inicio con secciones |
| `/eventos` | Lista de fiestas (badge “X próximos”) |
| `/artistas` | Listado de DJs |
| `/sesiones` | Tarjetas con imagen YouTube |
| `/novedades` | Solo si ejecutaste migración 003 + `db:discover-releases` |

Si `/eventos` está vacío pero en local sí hay datos: misma URL de Supabase en Vercel que en `CLAVES-SUPABASE.env`, y datos ya sincronizados con `npm run db:sync-all`.

---

## PARTE F — Actualizaciones automáticas

Cada vez que hagas `git push` a `main`, Vercel **vuelve a desplegar** la web sola (1–3 min).

Flujo habitual:

```text
Editas código en Cursor → git add . → git commit → git push
→ Vercel construye → nueva versión online
```

No hace falta volver a importar el proyecto.

---

## PARTE G — Dominio propio (opcional)

Si tienes `www.tumakina.com`:

1. Vercel → tu proyecto → **Settings → Domains**.
2. Añade el dominio y sigue las instrucciones DNS en tu registrador (GoDaddy, Cloudflare, etc.).
3. Cambia `NEXT_PUBLIC_SITE_URL` al dominio nuevo → **Redeploy**.

---

## PARTE H — Cron (actualizar datos cada día)

El archivo `vercel.json` pide a Vercel que cada día a las 06:00 UTC llame a `/api/cron/daily-sync` para refrescar eventos y novedades.

Necesitas:

- `CRON_SECRET` en variables de entorno.
- `SUPABASE_SECRET_KEY` en variables de entorno.
- Plan **Pro** en Vercel para crons fiables (en plan gratuito puede estar limitado).

**Alternativa gratis:** usar GitHub Actions (archivo `.github/workflows/daily-sync.yml` en el repo) con los mismos secretos en GitHub → Settings → Secrets.

**Poblar datos la primera vez** (siempre desde tu Mac, una vez):

```bash
cd makina-hub
npm run db:sync-all -- --skip-mb
```

Eso escribe en Supabase; la web en Vercel solo lee.

---

## Resumen en 6 pasos

1. **Supabase:** SQL 002 + 003 + `npm run db:sync-all -- --skip-mb` en tu Mac.  
2. **GitHub:** sube el código (sin archivos de claves).  
3. **Vercel:** cuenta + Import proyecto + Root Directory correcto.  
4. **Variables:** URL, PUBLISHABLE_KEY, SECRET_KEY, CRON_SECRET.  
5. **Deploy** → copia URL → actualiza `NEXT_PUBLIC_SITE_URL` → Redeploy.  
6. **Prueba** `/eventos`, `/artistas`, `/sesiones`.

---

## Preguntas frecuentes

**¿Vercel guarda mis claves si las pongo mal?**  
Sí, pero no las muestra completas después. Puedes editarlas en Settings → Environment Variables.

**¿Puedo usar solo Vercel sin GitHub?**  
Sí, con Vercel CLI (`vercel` en terminal), pero GitHub es más fácil para principiantes.

**¿Local y Vercel comparten datos?**  
Sí, si ambos usan la **misma** `NEXT_PUBLIC_SUPABASE_URL`. La base de datos es una sola en Supabase.

**¿Tengo que pagar?**  
Vercel y Supabase tienen plan gratuito para proyectos pequeños. El cron diario en Vercel puede requerir Pro.

---

## PASO 4 SIN LIARSE (copiar y pegar, una por una)

Abre **dos ventanas** en el Mac:

1. **Cursor** → archivo `makina-hub/CLAVES-SUPABASE.env`
2. **Navegador** → Vercel, pantalla del proyecto → sección **Environment Variables**

En Vercel verás algo así:

```text
[ Key / Name ]  [ Value ]  [ Add ]
```

Cada fila de abajo = pulsas **Add** una vez. En **Key** va el nombre exacto (copiado). En **Value** va lo de la derecha de tu archivo (sin comillas).

Marca las tres casillas: **Production**, **Preview**, **Development**.

### Fila 1 (obligatoria)

| En Vercel (Key) | En Value pegas desde CLAVES-SUPABASE.env |
|-----------------|------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Línea 5: lo que va después del `=` → empieza por `https://acsyjnzgyjzfetvtpsay...` |

### Fila 2 (obligatoria)

| En Vercel (Key) | En Value |
|-----------------|----------|
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Línea 6: empieza por `sb_publishable_` |

### Fila 3 (obligatoria para cron; la web puede ir sin ella al principio)

| En Vercel (Key) | En Value |
|-----------------|----------|
| `SUPABASE_SECRET_KEY` | Línea 10: empieza por `eyJ` (es larga, cópiala entera) |

### Fila 4 (obligatoria si quieres actualización automática)

| En Vercel (Key) | En Value |
|-----------------|----------|
| `CRON_SECRET` | **No está en el archivo.** Inventa una frase, por ejemplo: `makina-hub-cron-2026-mi-clave-secreta` (mínimo 20 caracteres) |

### Fila 5 (puedes ponerla ya o después del deploy)

| En Vercel (Key) | En Value |
|-----------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Por ahora: `https://makina-hub.vercel.app` (cámbiala cuando Vercel te dé la URL real) |

### Opcionales (solo si quieres; puedes saltarlas)

| Key | Value |
|-----|--------|
| `DISCOGS_TOKEN` | Línea 18 de CLAVES-SUPABASE.env |
| `YOUTUBE_API_KEY` | Línea 19 de CLAVES-SUPABASE.env |

### Errores típicos al liarse

| Error | Solución |
|-------|----------|
| Puse la URL en **Key** y el nombre en **Value** | Al revés: Key = nombre fijo de la tabla, Value = tu clave |
| Copié `NEXT_PUBLIC_SUPABASE_URL=https://...` entero | Solo la parte después del `=`, sin espacios |
| Puse la clave **secret** en PUBLISHABLE | Publishable = `sb_publishable_...` (línea 6). Secret = `eyJ...` (línea 10), otro nombre |
| No marqué Production / Preview / Development | Marca las tres en cada variable |
| Añadí 6 variables en un solo cuadro | Una variable = un par Key + Value + Add |

Cuando tengas **mínimo las filas 1 y 2**, ya puedes pulsar **Deploy**.

---

## PASO 5 — Deploy (publicar la web)

1. En la misma pantalla de Vercel, baja y pulsa el botón grande **Deploy**.
2. Verás una pantalla con logs que se mueven (Building…). **No cierres la pestaña.** Tarda 2–5 minutos.
3. Si todo va bien:
   - Aparece **Congratulations** o un tick verde.
   - Hay un botón **Visit** o un enlace tipo `https://makina-hub-xxxxx.vercel.app`.
4. Haz clic en **Visit** → se abre tu web en internet.

### Si sale error rojo (Build Failed)

1. Clic en el deploy fallido.
2. Pestaña **Building** → baja al final del texto.
3. Copia las últimas 10–15 líneas (o haz captura) para revisar.

Causas frecuentes:

| Mensaje | Qué hacer |
|---------|-----------|
| `Module not found` | En tu Mac: `npm install`, luego `git push` |
| Error TypeScript | Corrige en local, `git push`, Vercel reintenta solo |
| `Root Directory` incorrecto | Settings → General → Root Directory = `makina-hub` si el repo es la carpeta padre |

---

## PASO 6 — Arreglar la URL del sitio (2 minutos)

Tras el primer deploy, Vercel te da una URL real. Hay que ponerla en la variable 5 del paso 4.

1. Copia la URL completa (ej. `https://makina-hub-abc123.vercel.app`).
2. Vercel → tu proyecto → **Settings** → **Environment Variables**.
3. Busca `NEXT_PUBLIC_SITE_URL` → **Edit** (o créala si no existe).
4. Pega esa URL en **Value** → **Save**.
5. Arriba: pestaña **Deployments** → en el último deploy, menú **⋮** (tres puntos) → **Redeploy** → confirma.

Sin redeploy, el cambio de variable no se aplica a la web publicada.

---

## PASO 7 — Comprobar que funciona

Abre tu URL de Vercel y prueba estas páginas:

| URL | Qué deberías ver |
|-----|------------------|
| `/` | Inicio con secciones |
| `/eventos` | Lista de fiestas (número “X próximos”) |
| `/artistas` | Grid de DJs |
| `/sesiones` | Tarjetas con miniatura |

### Si ves “Configura Supabase”

Faltan variables en Vercel. Vuelve al paso 4: mínimo filas 1 y 2. Luego **Redeploy**.

### Si la web abre pero `/eventos` está vacío

Los datos están en Supabase, pero puede que no los hayas cargado. En tu Mac:

```bash
cd "/Users/eduardogarcialopez/Music/Analizr Vinyl Dj/makina-hub"
npm run db:sync-all -- --skip-mb
```

Usa el **mismo** proyecto Supabase que en `CLAVES-SUPABASE.env`. Recarga `/eventos` en Vercel (no hace falta otro deploy).

### Si `/novedades` está vacío

En Supabase SQL Editor ejecuta el contenido de `003_new_releases.sql`, luego en Mac:

```bash
npm run db:discover-releases
```

---

## PASO 8 — Cambios futuros (flujo normal)

Cada vez que edites código:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Vercel detecta el push y despliega solo (1–3 min). Puedes ver el progreso en **Deployments**.

---

## PASO 9 — Dominio propio (solo si lo tienes)

1. **Settings → Domains** → añade `www.tudominio.com`.
2. En tu proveedor de dominio (GoDaddy, etc.), crea el registro DNS que indique Vercel.
3. Actualiza `NEXT_PUBLIC_SITE_URL` con ese dominio → **Redeploy**.

---

## Checklist final

- [ ] Variables 1 y 2 en Vercel  
- [ ] Deploy verde  
- [ ] `NEXT_PUBLIC_SITE_URL` = URL real + Redeploy  
- [ ] `/eventos` muestra fiestas  
- [ ] (Opcional) `npm run db:sync-all` hecho en Mac  

---

Si algo falla, copia el mensaje de error del deploy o una captura de Environment Variables (tapando las claves) y lo revisamos.
