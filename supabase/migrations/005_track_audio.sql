-- Campos de audio nativo para temas (sin depender de YouTube)
ALTER TABLE tracks
  ADD COLUMN IF NOT EXISTS audio_url TEXT,
  ADD COLUMN IF NOT EXISTS preview_url TEXT,
  ADD COLUMN IF NOT EXISTS download_url TEXT,
  ADD COLUMN IF NOT EXISTS source_type TEXT;

COMMENT ON COLUMN tracks.audio_url IS 'URL de audio completo (MP3 en Storage o stream propio)';
COMMENT ON COLUMN tracks.preview_url IS 'Preview corto (p. ej. clip iTunes 30s)';
COMMENT ON COLUMN tracks.download_url IS 'Enlace legal de descarga o compra del tema';
COMMENT ON COLUMN tracks.source_type IS 'hosted | itunes_preview | bandcamp | external';

-- Bucket público para previews subidos manualmente
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'track-previews',
  'track-previews',
  true,
  15728640,
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read track previews"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'track-previews');

CREATE POLICY "Service upload track previews"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'track-previews');
