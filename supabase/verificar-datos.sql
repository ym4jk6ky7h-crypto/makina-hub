-- Pega en Supabase SQL Editor y pulsa Run.
-- Debes ver: artists 20, tracks 100, events 20, etc.

SELECT 'artists' AS tabla, COUNT(*)::int AS total FROM artists
UNION ALL SELECT 'tracks', COUNT(*)::int FROM tracks
UNION ALL SELECT 'events', COUNT(*)::int FROM events
UNION ALL SELECT 'sessions', COUNT(*)::int FROM sessions
UNION ALL SELECT 'labels', COUNT(*)::int FROM labels
UNION ALL SELECT 'vinyls', COUNT(*)::int FROM vinyls;
