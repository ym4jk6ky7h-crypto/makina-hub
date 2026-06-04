-- Nuevas producciones mákina con enlace de compra
-- Ejecutar en Supabase SQL Editor después de 002

CREATE TABLE IF NOT EXISTS new_releases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  label_id UUID REFERENCES labels(id) ON DELETE SET NULL,
  release_date DATE NOT NULL,
  purchase_url TEXT NOT NULL,
  store_name TEXT NOT NULL DEFAULT 'Tienda',
  cover_url TEXT,
  description TEXT,
  genre music_genre NOT NULL DEFAULT 'makina',
  youtube_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_new_releases_slug ON new_releases(slug);
CREATE INDEX IF NOT EXISTS idx_new_releases_artist_id ON new_releases(artist_id);
CREATE INDEX IF NOT EXISTS idx_new_releases_release_date ON new_releases(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_new_releases_featured ON new_releases(featured);

ALTER TABLE new_releases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read new_releases" ON new_releases;
CREATE POLICY "Public read new_releases" ON new_releases FOR SELECT USING (true);
