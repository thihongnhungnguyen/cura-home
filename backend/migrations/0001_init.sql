CREATE TABLE IF NOT EXISTS records (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  person TEXT NOT NULL DEFAULT 'Cả nhà',
  category TEXT NOT NULL DEFAULT '',
  amount REAL,
  quantity REAL,
  unit TEXT,
  date TEXT,
  time TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  note TEXT,
  image_key TEXT,
  details TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_records_household_kind_date ON records(household_id, kind, date);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS google_connections (
  email TEXT PRIMARY KEY,
  refresh_token_encrypted TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
