import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Activity, RefreshCw } from 'lucide-react';
import { fetchLeaderboard } from '../services/api';

export function LeaderboardModal({ onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchLeaderboard();
    if (data.success) {
      setLeaderboard(data.leaderboard || []);
      setStats(data.stats || null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 35, padding: '20px',
      background: 'rgba(5, 8, 16, 0.95)', backdropFilter: 'blur(12px)'
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '680px', maxHeight: '85vh',
        padding: '28px', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Trophy size={24} color="var(--pepsi-gold)" />
            <h2 className="pixel-font" style={{ fontSize: '18px', color: 'var(--pepsi-gold)' }}>
              ONLINE LEADERBOARD
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-retro" onClick={loadData} style={{ padding: '8px 12px', fontSize: '11px' }}>
              <RefreshCw size={14} className={loading ? 'pulse-glow' : ''} />
            </button>
            <button className="btn-retro" onClick={onClose} style={{ padding: '8px 14px', fontSize: '11px' }}>
              <ArrowLeft size={16} /> BACK
            </button>
          </div>
        </div>

        {/* Global Community Stats Banner */}
        {stats && (
          <div style={{
            background: 'rgba(0, 85, 255, 0.15)', border: '1px solid var(--pepsi-bright-blue)',
            borderRadius: '10px', padding: '12px 18px', marginBottom: '20px',
            display: 'flex', justifyContent: 'space-around', fontSize: '12px'
          }}>
            <div>
              <span style={{ color: '#AAA' }}>TOTAL RUNS: </span>
              <strong style={{ color: '#FFF' }}>{stats.totalGamesPlayed}</strong>
            </div>
            <div>
              <span style={{ color: '#AAA' }}>DISTANCE RUN: </span>
              <strong style={{ color: 'var(--pepsi-cyan)' }}>{stats.totalDistanceRun.toLocaleString()} M</strong>
            </div>
            <div>
              <span style={{ color: '#AAA' }}>CANS DRUNK: </span>
              <strong style={{ color: 'var(--pepsi-gold)' }}>🥤 {stats.totalCansCollected}</strong>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(0, 0, 0, 0.5)', color: 'var(--pepsi-cyan)', borderBottom: '2px solid var(--pepsi-blue)' }}>
                <th style={{ padding: '12px' }}>RANK</th>
                <th style={{ padding: '12px' }}>PLAYER</th>
                <th style={{ padding: '12px' }}>SCORE</th>
                <th style={{ padding: '12px' }}>DISTANCE</th>
                <th style={{ padding: '12px' }}>STAGE</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr key={idx} style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: idx === 0 ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                }}>
                  <td style={{ padding: '12px', fontWeight: 700 }}>
                    {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                  </td>
                  <td className="pixel-font" style={{ padding: '12px', fontSize: '11px', color: '#FFF' }}>
                    {entry.name}
                  </td>
                  <td className="orbitron-font" style={{ padding: '12px', color: 'var(--pepsi-gold)', fontWeight: 700 }}>
                    {entry.score.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', color: '#AAA' }}>
                    {entry.distance} M
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                      background: entry.stage === 'City' ? '#0055FF' : '#4A7C59', color: '#FFF'
                    }}>
                      {entry.stage || 'Village'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
