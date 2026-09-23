CREATE TABLE IF NOT EXISTS jar_settings (
 id TEXT PRIMARY KEY,
 household_id TEXT NOT NULL,
 name TEXT NOT NULL,
 percent REAL NOT NULL,
 color TEXT NOT NULL,
 sort_order INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_jars_household ON jar_settings(household_id,sort_order);
CREATE TABLE IF NOT EXISTS family_members (
 id TEXT PRIMARY KEY,
 household_id TEXT NOT NULL,
 name TEXT NOT NULL,
 avatar_key TEXT,
 favorite_colors TEXT NOT NULL DEFAULT '',
 interests TEXT NOT NULL DEFAULT '',
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_members_household ON family_members(household_id);
CREATE TABLE IF NOT EXISTS price_offers (
 id TEXT PRIMARY KEY,
 household_id TEXT NOT NULL,
 product TEXT NOT NULL,
 store TEXT NOT NULL,
 price REAL NOT NULL,
 regular_price REAL,
 size_label TEXT,
 url TEXT,
 expiry_date TEXT,
 observed_at TEXT NOT NULL,
 note TEXT,
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_offers_household_product ON price_offers(household_id,product);
CREATE TABLE IF NOT EXISTS feedback (
 id TEXT PRIMARY KEY,
 contact TEXT,
 message TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 visitor_hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_feedback_rate ON feedback(visitor_hash,created_at);
