-- MAKINA HUB — Production schema (replaces MVP tables)
-- Run in Supabase SQL Editor after 001 or on fresh project

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop legacy MVP tables if present
DROP TABLE IF EXISTS event_artists CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS vinyls CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS tracks CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS labels CASCADE;
DROP TABLE IF EXISTS artists CASCADE;

DROP TYPE IF EXISTS vinyl_rarity CASCADE;
DROP TYPE IF EXISTS music_genre CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Enums
CREATE TYPE music_genre AS ENUM (
  'makina', 'remember', 'hardcore', 'makina-revival', 'bouncy', 'hard-dance'
);

CREATE TYPE vinyl_rarity AS ENUM ('common', 'uncommon', 'rare', 'legendary');

-- artists
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  real_name TEXT,
  biography TEXT NOT NULL DEFAULT '',
  country TEXT DEFAULT 'España',
  city TEXT,
  image_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  spotify_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_artists_name ON artists(name);
CREATE INDEX idx_artists_city ON artists(city);

-- labels
CREATE TABLE labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  founded_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_labels_slug ON labels(slug);
CREATE INDEX idx_labels_name ON labels(name);

-- tracks
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  year INTEGER,
  bpm INTEGER,
  label_id UUID REFERENCES labels(id) ON DELETE SET NULL,
  genre music_genre NOT NULL DEFAULT 'makina',
  youtube_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tracks_slug ON tracks(slug);
CREATE INDEX idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX idx_tracks_label_id ON tracks(label_id);
CREATE INDEX idx_tracks_genre ON tracks(genre);
CREATE INDEX idx_tracks_year ON tracks(year);
CREATE INDEX idx_tracks_title ON tracks(title);

-- events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  event_date TIMESTAMPTZ NOT NULL,
  city TEXT NOT NULL,
  venue TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_city ON events(city);
CREATE INDEX idx_events_title ON events(title);

-- event_artists (M:N artist <-> event)
CREATE TABLE event_artists (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, artist_id)
);

CREATE INDEX idx_event_artists_artist_id ON event_artists(artist_id);

-- sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  duration INTEGER,
  youtube_url TEXT,
  tracklist TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_slug ON sessions(slug);
CREATE INDEX idx_sessions_artist_id ON sessions(artist_id);
CREATE INDEX idx_sessions_title ON sessions(title);

-- vinyls
CREATE TABLE vinyls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  label_id UUID REFERENCES labels(id) ON DELETE SET NULL,
  year INTEGER,
  catalog_number TEXT NOT NULL,
  cover_url TEXT,
  estimated_value NUMERIC(10, 2),
  rarity vinyl_rarity NOT NULL DEFAULT 'common',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vinyls_slug ON vinyls(slug);
CREATE INDEX idx_vinyls_artist_id ON vinyls(artist_id);
CREATE INDEX idx_vinyls_label_id ON vinyls(label_id);
CREATE INDEX idx_vinyls_rarity ON vinyls(rarity);

-- Full-text search (global search)
ALTER TABLE artists ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(real_name, '') || ' ' || coalesce(biography, '') || ' ' || coalesce(city, ''))
  ) STORED;
CREATE INDEX idx_artists_search ON artists USING GIN (search_vector);

ALTER TABLE tracks ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) STORED;
CREATE INDEX idx_tracks_search ON tracks USING GIN (search_vector);

ALTER TABLE events ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(city, '') || ' ' || coalesce(venue, ''))
  ) STORED;
CREATE INDEX idx_events_search ON events USING GIN (search_vector);

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('spanish', coalesce(title, ''))
  ) STORED;
CREATE INDEX idx_sessions_search ON sessions USING GIN (search_vector);

ALTER TABLE vinyls ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(catalog_number, ''))
  ) STORED;
CREATE INDEX idx_vinyls_search ON vinyls USING GIN (search_vector);

ALTER TABLE labels ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, ''))
  ) STORED;
CREATE INDEX idx_labels_search ON labels USING GIN (search_vector);

-- RLS: public read
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vinyls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read artists" ON artists FOR SELECT USING (true);
CREATE POLICY "Public read labels" ON labels FOR SELECT USING (true);
CREATE POLICY "Public read tracks" ON tracks FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read event_artists" ON event_artists FOR SELECT USING (true);
CREATE POLICY "Public read sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Public read vinyls" ON vinyls FOR SELECT USING (true);

-- Service role bypasses RLS for seeding
