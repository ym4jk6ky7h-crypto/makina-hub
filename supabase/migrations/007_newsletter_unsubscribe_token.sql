-- Token único por suscriptor para desuscripción segura (sin login)

ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_unsubscribe_token_key
  ON newsletter_subscribers (unsubscribe_token)
  WHERE unsubscribe_token IS NOT NULL;
