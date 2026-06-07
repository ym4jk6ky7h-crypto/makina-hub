-- Ordenar sesiones por fecha de publicación en YouTube
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS youtube_published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS youtube_video_id TEXT;

COMMENT ON COLUMN sessions.youtube_published_at IS 'Fecha de publicación del vídeo en YouTube';
COMMENT ON COLUMN sessions.youtube_video_id IS 'ID del vídeo (deduplicación en sync diario)';

CREATE UNIQUE INDEX IF NOT EXISTS sessions_youtube_video_id_key
  ON sessions (youtube_video_id)
  WHERE youtube_video_id IS NOT NULL;
