-- Marketplace completo: anúncios, perguntas públicas, favoritos, pedidos, conversas,
-- notificações, visualizações (Radar de Frete) e dados de conta.

ALTER TABLE users ADD COLUMN location TEXT;
ALTER TABLE users ADD COLUMN seller_status TEXT NOT NULL DEFAULT 'nao_iniciado';
ALTER TABLE users ADD COLUMN seller_profile TEXT;
ALTER TABLE users ADD COLUMN weigher_progress TEXT;

CREATE TABLE lots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id TEXT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'em_analise' CHECK (status IN ('em_analise', 'publicado', 'recusado', 'pausado', 'vendido', 'removido')),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  breed TEXT NOT NULL,
  sex TEXT NOT NULL,
  heads INTEGER NOT NULL CHECK (heads > 0),
  weight_arroba REAL,
  age_label TEXT,
  age_months INTEGER,
  purpose TEXT,
  price_per_head INTEGER NOT NULL CHECK (price_per_head > 0),
  farm_name TEXT NOT NULL,
  owner_first_name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  lat REAL,
  lng REAL,
  feeding TEXT,
  vaccination TEXT,
  traceability TEXT,
  gta_status TEXT,
  description TEXT,
  photos TEXT NOT NULL DEFAULT '[]',
  review_note TEXT,
  is_demo INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  published_at TEXT
);
CREATE INDEX lots_status_idx ON lots (status, published_at);
CREATE INDEX lots_seller_idx ON lots (seller_id);

CREATE TABLE questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lot_id INTEGER NOT NULL REFERENCES lots(id),
  author_id TEXT NOT NULL REFERENCES users(id),
  question TEXT NOT NULL,
  answer TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  answered_at TEXT
);
CREATE INDEX questions_lot_idx ON questions (lot_id, created_at);

CREATE TABLE favorites (
  user_id TEXT NOT NULL REFERENCES users(id),
  lot_id INTEGER NOT NULL REFERENCES lots(id),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (user_id, lot_id)
);

CREATE TABLE lot_views (
  user_id TEXT NOT NULL REFERENCES users(id),
  lot_id INTEGER NOT NULL REFERENCES lots(id),
  viewed_at TEXT NOT NULL,
  PRIMARY KEY (user_id, lot_id)
);

CREATE TABLE radar_notified (
  user_id TEXT NOT NULL REFERENCES users(id),
  lot_id INTEGER NOT NULL,
  route_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (user_id, lot_id, route_id)
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  buyer_id TEXT NOT NULL REFERENCES users(id),
  lots_total INTEGER NOT NULL,
  freight_partner TEXT NOT NULL,
  freight_price INTEGER NOT NULL,
  freight_destination TEXT NOT NULL,
  freight_distance_km INTEGER,
  freight_promo INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  payment_provider TEXT NOT NULL,
  payment_reference TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pendente' CHECK (payment_status IN ('pendente', 'retido', 'liberado', 'cancelado')),
  gta_status TEXT NOT NULL DEFAULT 'aguardando_integracao',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  paid_at TEXT,
  released_at TEXT
);
CREATE INDEX orders_buyer_idx ON orders (buyer_id, created_at);

CREATE TABLE order_items (
  order_id TEXT NOT NULL REFERENCES orders(id),
  lot_id INTEGER NOT NULL REFERENCES lots(id),
  seller_id TEXT NOT NULL REFERENCES users(id),
  price INTEGER NOT NULL,
  PRIMARY KEY (order_id, lot_id)
);
CREATE INDEX order_items_seller_idx ON order_items (seller_id);

CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL REFERENCES orders(id),
  buyer_id TEXT NOT NULL REFERENCES users(id),
  seller_id TEXT NOT NULL REFERENCES users(id),
  buyer_last_read INTEGER NOT NULL DEFAULT 0,
  seller_last_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (order_id, seller_id)
);
CREATE INDEX conversations_buyer_idx ON conversations (buyer_id, updated_at);
CREATE INDEX conversations_seller_idx ON conversations (seller_id, updated_at);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id),
  sender_id TEXT REFERENCES users(id),
  kind TEXT NOT NULL DEFAULT 'texto' CHECK (kind IN ('texto', 'sistema', 'anexo', 'audio')),
  body TEXT NOT NULL,
  attachment TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX messages_conversation_idx ON messages (conversation_id, id);

CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  target TEXT,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX notifications_user_idx ON notifications (user_id, id);

CREATE TABLE password_resets (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL,
  used_at TEXT
);
