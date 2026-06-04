/**
 * Generates supabase/seed.sql from scripts/seed-data.ts
 * Run: npx tsx scripts/generate-seed-sql.ts
 */
import * as fs from "fs";
import * as path from "path";
import {
  SEED_ARTISTS,
  SEED_LABELS,
  buildSeedTracks,
  buildSeedEvents,
  buildSeedSessions,
  buildSeedVinyls,
  buildEventArtists,
} from "./seed-data";

function esc(s: string | null | undefined) {
  if (s == null) return "NULL";
  return `'${String(s).replace(/'/g, "''")}'`;
}

function arr(a: string[]) {
  return `ARRAY[${a.map(esc).join(", ")}]::text[]`;
}

const tracks = buildSeedTracks();
const events = buildSeedEvents();
const sessions = buildSeedSessions();
const vinyls = buildSeedVinyls();
const eventArtists = buildEventArtists();

const lines: string[] = [
  "-- MAKINA HUB — Seed data",
  "-- Run AFTER 002_makina_hub_production.sql",
  "-- 1) Ejecuta primero reset-datos.sql si hubo errores antes",
  "TRUNCATE event_artists, vinyls, sessions, tracks, events, labels, artists CASCADE;",
  "",
  "BEGIN;",
  "",
  "-- Labels (10)",
  ...SEED_LABELS.map(
    (l) =>
      `INSERT INTO labels (id, slug, name, description, logo_url, founded_year) VALUES (${esc(l.id)}, ${esc(l.slug)}, ${esc(l.name)}, ${esc(l.description)}, ${esc(l.logo_url)}, ${l.founded_year});`
  ),
  "",
  "-- Artists (20)",
  ...SEED_ARTISTS.map(
    (a) =>
      `INSERT INTO artists (id, slug, name, real_name, biography, country, city, image_url, instagram_url, youtube_url, spotify_url) VALUES (${esc(a.id)}, ${esc(a.slug)}, ${esc(a.name)}, ${esc(a.real_name)}, ${esc(a.biography)}, ${esc(a.country)}, ${esc(a.city)}, ${esc(a.image_url)}, ${esc(a.instagram_url)}, ${esc(a.youtube_url)}, ${esc(a.spotify_url)});`
  ),
  "",
  "-- Tracks (100)",
  ...tracks.map(
    (t) =>
      `INSERT INTO tracks (id, slug, title, artist_id, year, bpm, label_id, genre, youtube_url, description) VALUES (${esc(t.id)}, ${esc(t.slug)}, ${esc(t.title)}, ${esc(t.artist_id)}, ${t.year}, ${t.bpm}, ${esc(t.label_id)}, ${esc(t.genre)}, ${esc(t.youtube_url)}, ${esc(t.description)});`
  ),
  "",
  "-- Events (20)",
  ...events.map(
    (e) =>
      `INSERT INTO events (id, slug, title, description, event_date, city, venue, image_url) VALUES (${esc(e.id)}, ${esc(e.slug)}, ${esc(e.title)}, ${esc(e.description)}, ${esc(e.event_date)}, ${esc(e.city)}, ${esc(e.venue)}, ${esc(e.image_url)});`
  ),
  "",
  "-- Sessions (20)",
  ...sessions.map(
    (s) =>
      `INSERT INTO sessions (id, slug, title, artist_id, duration, youtube_url, tracklist, created_at) VALUES (${esc(s.id)}, ${esc(s.slug)}, ${esc(s.title)}, ${esc(s.artist_id)}, ${s.duration}, ${esc(s.youtube_url)}, ${arr(s.tracklist)}, ${esc(s.created_at)});`
  ),
  "",
  "-- Vinyls (20)",
  ...vinyls.map(
    (v) =>
      `INSERT INTO vinyls (id, slug, title, artist_id, label_id, year, catalog_number, cover_url, estimated_value, rarity) VALUES (${esc(v.id)}, ${esc(v.slug)}, ${esc(v.title)}, ${esc(v.artist_id)}, ${esc(v.label_id)}, ${v.year}, ${esc(v.catalog_number)}, ${esc(v.cover_url)}, ${v.estimated_value}, ${esc(v.rarity)});`
  ),
  "",
  "-- Event ↔ Artist",
  ...eventArtists.map(
    (ea) =>
      `INSERT INTO event_artists (event_id, artist_id) VALUES (${esc(ea.event_id)}, ${esc(ea.artist_id)}) ON CONFLICT DO NOTHING;`
  ),
  "",
  "COMMIT;",
];

const out = path.join(__dirname, "../supabase/seed.sql");
fs.writeFileSync(out, lines.join("\n"));
console.log(`Written ${out} (${tracks.length} tracks, ${SEED_ARTISTS.length} artists)`);
