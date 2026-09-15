import { io } from 'socket.io-client';

const API_BASE = '/api';
export const socket = io(window.location.origin, {
  autoConnect: true,
  reconnection: true
});

export const fetchLeaderboard = async () => {
  try {
    const res = await fetch(`${API_BASE}/leaderboard`);
    if (!res.ok) throw new Error('Failed to fetch leaderboards');
    return await res.json();
  } catch (err) {
    console.warn('API error, returning fallback data:', err);
    return {
      success: true,
      leaderboard: [
        { name: 'PEPSI_HERO', score: 18500, distance: 3200, cans: 142, stage: 'City' },
        { name: 'PS1_LEGEND', score: 14200, distance: 2600, cans: 110, stage: 'Village' },
        { name: 'RETRO_RUNNER', score: 11800, distance: 2100, cans: 95, stage: 'City' },
        { name: 'SPEED_DEMON', score: 9400, distance: 1850, cans: 78, stage: 'Village' }
      ],
      stats: { totalGamesPlayed: 50, totalDistanceRun: 90000, totalCansCollected: 5000 }
    };
  }
};

export const submitScore = async (scoreData) => {
  try {
    const res = await fetch(`${API_BASE}/leaderboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreData)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to submit score:', err);
    return { success: false, message: 'Could not save score to server' };
  }
};
