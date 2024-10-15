-- Initialize game
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  status VARCHAR(50), -- 'active' or 'finished'
  eliminated_corner INT DEFAULT NULL, -- The most recently eliminated corner
  created_at TIMESTAMP DEFAULT NOW()
);

-- Store players and their selected corners
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  corner INT, -- The player's selected corner (1-4)
  game_id INT REFERENCES games(id)
);
