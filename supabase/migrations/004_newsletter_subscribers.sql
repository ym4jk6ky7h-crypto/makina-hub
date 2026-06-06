-- Newsletter: suscriptores (solo insert público vía API con service role)

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'footer',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email
  ON newsletter_subscribers (lower(email));

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Sin políticas públicas: lectura/escritura solo con service role (API servidor)
