const express = require('express');
const router = express.Router();
const pool = require('../db');

// Helper function to randomly choose a corner
function getRandomCorner(exclude) {
  const corners = [1, 2, 3, 4].filter(corner => corner !== exclude);
  const randomIndex = Math.floor(Math.random() * corners.length);
  return corners[randomIndex];
}

async function createNewGame() {
  const result = await pool.query('INSERT INTO games (status) VALUES ($1) RETURNING *', ['active']);
  return result.rows[0];  // Returns the newly created game
}

// Start a new game
router.post('/new', async (req, res) => {
  try {
    const result = await pool.query('INSERT INTO games (status) VALUES ($1) RETURNING *', ['active']);
    const game = result.rows[0];
    res.status(200).json({ message: 'Game started!', gameId: game.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a player to the latest active game
router.post('/add-player', async (req, res) => {
  try {
    const { name, corner } = req.body;

    // Check if there is an active game, sorted by id (get the latest active game)
    const gameResult = await pool.query('SELECT * FROM games WHERE status = $1 ORDER BY id DESC LIMIT 1', ['active']);
    let game;
    
    if (gameResult.rowCount === 0) {
      // No active game exists, so create a new one
      game = await createNewGame();
      console.log('New game created with ID:', game.id);
    } else {
      // Use the latest active game
      game = gameResult.rows[0];
      console.log(`Active game found with ID: ${game.id}`);
    }

    // Insert the player into the players table with the game ID
    await pool.query('INSERT INTO players (name, corner, game_id) VALUES ($1, $2, $3)', [name, corner, game.id]);
    console.log(`Player ${name} added to corner ${corner} in game ${game.id}`);
    
    res.status(200).json({ message: `Player ${name} added to corner ${corner} in game ${game.id}!` });
  } catch (err) {
    console.error('Error in add-player route:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Eliminate a corner and check for remaining players
router.post('/eliminate-corner', async (req, res) => {
  try {
    // Fetch the latest active game
    const gameResult = await pool.query('SELECT * FROM games WHERE status = $1 ORDER BY id DESC LIMIT 1', ['active']);
    if (gameResult.rowCount === 0) {
      return res.status(400).json({ message: 'No active game found' });
    }

    const game = gameResult.rows[0];
    const { id: gameId } = game;

    console.log(`Eliminate corner request received for game ID: ${gameId}`);

    // Get the next random corner (excluding the last eliminated one)
    const eliminatedCorner = getRandomCorner(game.eliminated_corner);
    console.log(`Corner to be eliminated: ${eliminatedCorner}`);

    // Update the game to reflect the new eliminated corner
    await pool.query('UPDATE games SET eliminated_corner = $1 WHERE id = $2', [eliminatedCorner, gameId]);

    // Remove all players from the eliminated corner
    await pool.query('DELETE FROM players WHERE game_id = $1 AND corner = $2', [gameId, eliminatedCorner]);

    // Check how many players are left
    const remainingPlayersResult = await pool.query('SELECT * FROM players WHERE game_id = $1', [gameId]);
    const remainingPlayers = remainingPlayersResult.rows;
    console.log(`Remaining players after elimination: ${remainingPlayers.length}`);

    if (remainingPlayers.length === 1) {
      // One player left, they win the game
      await pool.query('UPDATE games SET status = $1 WHERE id = $2', ['finished', gameId]);
      console.log(`Player ${remainingPlayers[0].name} wins the game!`);

      // Automatically create a new game if necessary
      const newGameResult = await createNewGame();
      const newGame = newGameResult;
      console.log(`New game started with ID: ${newGame.id}`);

      return res.status(200).json({
        message: `Player ${remainingPlayers[0].name} wins the game! New game started with ID: ${newGame.id}`,
      });
    } else if (remainingPlayers.length === 0) {
      // No players left (could be a tie or an error)
      await pool.query('UPDATE games SET status = $1 WHERE id = $2', ['finished', gameId]);
      console.log('No players remaining, game over!');

      // Automatically create a new game
      const newGameResult = await createNewGame();
      const newGame = newGameResult;
      console.log(`New game started with ID: ${newGame.id}`);

      return res.status(200).json({ message: 'No players remaining, game over! New game started.' });
    } else {
      // Continue to next round
      res.status(200).json({ message: `Corner ${eliminatedCorner} eliminated. ${remainingPlayers.length} players remain.` });
    }

  } catch (err) {
    console.error('Error in eliminate-corner route:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get the current status of the game
router.get('/:gameId/status', async (req, res) => {
  try {
    const { gameId } = req.params;
    const gameResult = await pool.query('SELECT * FROM games WHERE id = $1', [gameId]);
    const game = gameResult.rows[0];
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    const playersResult = await pool.query('SELECT * FROM players WHERE game_id = $1', [gameId]);
    const players = playersResult.rows;
    
    res.status(200).json({ game, players });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
