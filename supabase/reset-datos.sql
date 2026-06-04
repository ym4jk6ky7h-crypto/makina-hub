-- Ejecuta ESTO en Supabase SQL Editor → Run
-- Luego ejecuta seed.sql completo (versión corregida sin slugs duplicados)

TRUNCATE event_artists, vinyls, sessions, tracks, events, labels, artists CASCADE;

-- Comprueba que todo está a 0:
SELECT 'artists' AS tabla, COUNT(*)::int AS total FROM artists;
