CREATE TABLE IF NOT EXISTS shape (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS blueprint (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS blueprint_shape (
  blueprint_id INTEGER NOT NULL,
  shape_id INTEGER NOT NULL,
  count INTEGER DEFAULT 1,
  PRIMARY KEY (blueprint_id, shape_id)
  FOREIGN KEY (blueprint_id) REFERENCES blueprint(id) ON DELETE CASCADE,
  FOREIGN KEY (shape_id) REFERENCES shape(id)
);

CREATE TABLE IF NOT EXISTS optimal_blueprint (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT, -- unix timestamp
  data TEXT
  );

CREATE UNIQUE INDEX IF NOT EXISTS idx_ob_name ON optimal_blueprint (name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_shape_name ON shape (name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_blueprint_name ON blueprint (name);
CREATE INDEX IF NOT EXISTS idx_blueprint_id on blueprint_shape (blueprint_id);
CREATE INDEX IF NOT EXISTS idx_shape_id on blueprint_shape (shape_id);
