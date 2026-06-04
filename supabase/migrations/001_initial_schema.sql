-- MAKINA HUB — Initial Schema
-- Run in Supabase SQL Editor or via CLI

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('user', 'editor', 'admin');
CREATE TYPE vinyl_rarity AS ENUM ('common', 'uncommon', 'rare', 'legendary');
CREATE TYPE music_genre AS ENUM (
  'makina', 'remember', 'hardcore', 'makina-revival', 'bouncy', 'hard-dance'
);

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Artists
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  year_started INTEGER,
  country TEXT DEFAULT 'España',
  social_instagram TEXT,
  social_soundcloud TEXT,
  social_youtube TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_artists_featured ON artists(featured) WHERE featured = TRUE;
CREATE INDEX idx_artists_name ON artists(name);

-- Labels
CREATE TABLE labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  history TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  country TEXT,
  year_founded INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_labels_slug ON labels(slug);

-- Tracks
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  label_id UUID REFERENCES labels(id) ON DELETE SET NULL,
  year INTEGER,
  bpm INTEGER,
  genre music_genre NOT NULL DEFAULT 'makina',
  youtube_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tracks_slug ON tracks(slug);
CREATE INDEX idx_tracks_artist ON tracks(artist_id);
CREATE INDEX idx_tracks_label ON tracks(label_id);
CREATE INDEX idx_tracks_genre ON tracks(genre);
CREATE INDEX idx_tracks_year ON tracks(year);
CREATE INDEX idx_tracks_featured ON tracks(featured) WHERE featured = TRUE;

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  poster_url TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  venue TEXT NOT NULL,
  genres music_genre[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_province ON events(province);
CREATE INDEX idx_events_featured ON events(featured) WHERE featured = TRUE;

-- Event ↔ Artist (M:N)
CREATE TABLE event_artists (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, artist_id)
);

CREATE INDEX idx_event_artists_artist ON event_artists(artist_id);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  session_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  youtube_url TEXT,
  tracklist TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_slug ON sessions(slug);
CREATE INDEX idx_sessions_artist ON sessions(artist_id);
CREATE INDEX idx_sessions_date ON sessions(session_date);

-- Vinyls
CREATE TABLE vinyls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  label_id UUID REFERENCES labels(id) ON DELETE SET NULL,
  catalog_ref TEXT NOT NULL,
  year INTEGER,
  cover_url TEXT,
  estimated_value_eur NUMERIC(10, 2),
  rarity vinyl_rarity NOT NULL DEFAULT 'common',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vinyls_slug ON vinyls(slug);
CREATE INDEX idx_vinyls_artist ON vinyls(artist_id);
CREATE INDEX idx_vinyls_label ON vinyls(label_id);
CREATE INDEX idx_vinyls_rarity ON vinyls(rarity);

-- RLS (public read for MVP)
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vinyls ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read artists" ON artists FOR SELECT USING (true);
CREATE POLICY "Public read labels" ON labels FOR SELECT USING (true);
CREATE POLICY "Public read tracks" ON tracks FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read event_artists" ON event_artists FOR SELECT USING (true);
CREATE POLICY "Public read sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Public read vinyls" ON vinyls FOR SELECT USING (true);
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
