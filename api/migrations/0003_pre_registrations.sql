-- Pré-cadastro público (gadon.com.br/pre-cadastro): uma linha por e-mail.
CREATE TABLE pre_registrations (
  email TEXT PRIMARY KEY COLLATE NOCASE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  state TEXT,
  profiles TEXT NOT NULL,
  herd_size TEXT,
  source TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
