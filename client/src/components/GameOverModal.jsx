import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Send, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitScore } from '../services/api';

export function GameOverModal({ results, stage, onRestart, onReturnHome, onOpenLeaderboard }) {
  const { finalScore = 0, finalDistance = 0, finalCans = 0 } = results || {};
  const [playerName, setPlayerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rankInfo, setRankInfo] = useState(null);

  useEffect(() => {
    // Fire festive arcade confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitted) return;

    const res = await submitScore({
      name: playerName,
      score: finalScore,
      distance: finalDistance,
      cans: finalCans,
      stage
    });

    if (res.success) {
      setIsSubmitted(true);
      setRankInfo(res.rank);
    }
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 30, padding: '20px',
      background: 'rgba(5, 8, 16, 0.92)', backdropFilter: 'blur(12px)'
    }}>
      <div className="glass-panel float-anim" style={{
        width: '100%', maxWidth: '440px', padding: '32px', textAlign: 'center'
      }}>
        <h2 className="pixel-font" style={{
          fontSize: '24px', color: 'var(--pepsi-red)',
          textShadow: '2px 2px 0px #000', marginBottom: '8px'
        }}>
          GAME OVER!
        </h2>
        <div style={{ fontSize: '12px', color: 'var(--pepsi-cyan)', marginBottom: '24px' }}>
          CRASHED ON STAGE: {stage.toUpperCase()}
        </div>

        {/* Score Summary Box */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-glow)',
          borderRadius: '12px', padding: '20px', marginBottom: '24px'
        }}>
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', color: '#AAA' }}>FINAL SCORE</div>
            <div className="pixel-font" style={{ fontSize: '26px', color: 'var(--pepsi-gold)', marginTop: '4px' }}>
              {finalScore.toLocaleString()}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#AAA' }}>DISTANCE</div>
              <div className="orbitron-font" style={{ fontSize: '16px', color: '#00F0FF', fontWeight: 700 }}>
                {finalDistance} M
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#AAA' }}>CANS COLLECTED</div>
              <div className="orbitron-font" style={{ fontSize: '16px', color: 'var(--pepsi-gold)', fontWeight: 700 }}>
                🥤 {finalCans}
              </div>
            </div>
          </div>
        </div>

        {/* Score Submission Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmitScore} style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#FFF', fontWeight: 600, marginBottom: '8px' }}>
              SUBMIT TO GLOBAL LEADERBOARD:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                maxLength={12}
                placeholder="ENTER YOUR NAME"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={{
                  flex: 1, padding: '12px 14px', borderRadius: '8px',
                  border: '2px solid var(--pepsi-cyan)', background: '#090F20',
                  color: '#FFF', fontFamily: "'Press Start 2P', cursive", fontSize: '11px',
                  outline: 'none', textTransform: 'uppercase'
                }}
              />
              <button type="submit" className="btn-retro" style={{ padding: '12px 16px', fontSize: '11px' }}>
                <Send size={14} /> SAVE
              </button>
            </div>
          </form>
        ) : (
          <div style={{
            background: 'rgba(0, 240, 255, 0.15)', border: '1px solid var(--pepsi-cyan)',
            borderRadius: '8px', padding: '12px', marginBottom: '24px', color: 'var(--pepsi-cyan)',
            fontSize: '13px', fontWeight: 700
          }}>
            ✅ SCORE SAVED! YOUR GLOBAL RANK: #{rankInfo || 'TOP 10'}
          </div>
        )}

        {/* Modal Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-retro btn-gold" onClick={onRestart} style={{ flex: 1, padding: '14px' }}>
            <RotateCcw size={18} /> RETRY
          </button>
          <button className="btn-retro" onClick={onReturnHome} style={{ padding: '14px' }}>
            <Home size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
