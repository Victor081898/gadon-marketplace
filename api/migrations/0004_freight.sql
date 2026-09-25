-- Central de fretes: pedidos de frete (cotações e voltas vazias do Radar), agenda de viagens e documentos de transporte.
CREATE TABLE IF NOT EXISTS freight_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('cotacao', 'volta')),
  route_id INTEGER,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  heads INTEGER,
  quantity TEXT,
  pickup_date TEXT,
  carrier TEXT NOT NULL,
  price INTEGER,
  distance_km INTEGER,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'contatado', 'fechado', 'cancelado')),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_freight_requests_user ON freight_requests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_freight_requests_created ON freight_requests(created_at DESC);

CREATE TABLE IF NOT EXISTS freight_trips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trip_date TEXT NOT NULL,
  trip_time TEXT,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  animals INTEGER,
  carrier TEXT,
  status TEXT NOT NULL DEFAULT 'Programada' CHECK (status IN ('Programada', 'Em andamento', 'Concluída', 'Cancelada')),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_freight_trips_user ON freight_trips(user_id, trip_date);

CREATE TABLE IF NOT EXISTS freight_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  name TEXT NOT NULL,
  trip_label TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  expires_at TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'emitido')),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_freight_documents_user ON freight_documents(user_id, created_at DESC);
