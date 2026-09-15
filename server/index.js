const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'leaderboard.json');

// Default initial high scores (Retro PS1 vibes)
let leaderboards = [
  { name: 'PEPSI_HERO', score: 18500, distance: 3200, cans: 142, stage: 'City' },
  { name: 'PS1_LEGEND', score: 14200, distance: 2600, cans: 110, stage: 'Village' },
  { name: 'RETRO_RUNNER', score: 11800, distance: 2100, cans: 95, stage: 'City' },
  { name: 'SPEED_DEMON', score: 9400, distance: 1850, cans: 78, stage: 'Village' },
  { name: 'CAN_COLLECTOR', score: 7600, distance: 1500, cans: 62, stage: 'Village' }
];

let globalStats = {
  totalGamesPlayed: 42,
  totalDistanceRun: 85400,
  totalCansCollected: 4890
};

// Load saved leaderboards if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(rawData);
    if (parsed.leaderboards) leaderboards = parsed.leaderboards;
    if (parsed.globalStats) globalStats = parsed.globalStats;
    console.log('[Server] Loaded persisted leaderboards and stats.');
  } catch (err) {
    console.error('[Server] Error loading leaderboard data:', err.message);
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ leaderboards, globalStats }, null, 2));
  } catch (err) {
    console.error('[Server] Error saving leaderboard data:', err.message);
  }
}

// REST APIs
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', game: 'Pepsi-Man 3D Runner API', time: new Date().toISOString() });
});

app.get('/api/leaderboard', (req, res) => {
  // Sort descending by score
  const sorted = [...leaderboards].sort((a, b) => b.score - a.score).slice(0, 20);
  res.json({ success: true, leaderboard: sorted, stats: globalStats });
});

app.post('/api/leaderboard', (req, res) => {
  const { name, score, distance, cans, stage } = req.body;
  if (!name || score === undefined) {
    return res.status(400).json({ success: false, message: 'Name and score are required.' });
  }

  const cleanName = String(name).trim().toUpperCase().substring(0, 12) || 'RUNNER';
  const newEntry = {
    name: cleanName,
    score: Math.floor(Number(score) || 0),
    distance: Math.floor(Number(distance) || 0),
    cans: Math.floor(Number(cans) || 0),
    stage: stage || 'Village',
    date: new Date().toISOString()
  };

  leaderboards.push(newEntry);
  // Sort and limit
  leaderboards.sort((a, b) => b.score - a.score);
  if (leaderboards.length > 50) {
    leaderboards = leaderboards.slice(0, 50);
  }

  // Update stats
  globalStats.totalGamesPlayed += 1;
  globalStats.totalDistanceRun += newEntry.distance;
  globalStats.totalCansCollected += newEntry.cans;

  saveData();

  // Broadcast to online socket clients
  io.emit('new_high_score', newEntry);

  res.json({ success: true, entry: newEntry, rank: leaderboards.findIndex(e => e === newEntry) + 1 });
});

// Socket.io for Real-Time Gameplay Updates
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.emit('init_stats', { stats: globalStats, topPlayer: leaderboards[0] });

  socket.on('player_run', (data) => {
    socket.broadcast.emit('live_runner', { id: socket.id, distance: data.distance, score: data.score });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 PEPSI-MAN Backend Server Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`=================================`);
});
