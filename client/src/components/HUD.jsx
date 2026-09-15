import React from 'react';
import { Pause, ShieldAlert, Zap } from 'lucide-react';

export function HUD({ stats, stage, isShielded, onPause }) {
  const { distance = 0, score = 0, cans = 0, speed = 14, combo = 1 } = stats;
  const speedKmh = Math.floor(speed * 3.6);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: 'none', zIndex: 15, padding: '16px 24px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
    }}>
      {/* Top HUD Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Left Side: Score & Stage Badge */}
        <div className="glass-panel" style={{ padding: '10px 18px', pointerEvents: 'auto' }}>
          <div style={{ fontSize: '11px', color: 'var(--pepsi-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
            STAGE: {stage}
          </div>
          <div className="pixel-font" style={{ fontSize: '20px', color: '#FFF', marginTop: '4px' }}>
            SCORE: {score.toLocaleString()}
          </div>
          {combo > 1 && (
            <div className="orbitron-font" style={{ fontSize: '12px', color: 'var(--pepsi-gold)', fontWeight: 900 }}>
              COMBO x{combo.toFixed(1)}!
            </div>
          )}
        </div>

        {/* Center: Soda Cans Counter */}
        <div className="glass-panel" style={{
          padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto'
        }}>
          <span style={{ fontSize: '24px' }}>🥤</span>
          <div>
            <div style={{ fontSize: '10px', color: '#AAA', fontWeight: 700 }}>CANS COLLECTED</div>
            <div className="pixel-font" style={{ fontSize: '18px', color: 'var(--pepsi-gold)' }}>
              {cans}
            </div>
          </div>
        </div>

        {/* Right Side: Distance & Speedometer */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '10px 18px', textAlign: 'right', pointerEvents: 'auto' }}>
            <div style={{ fontSize: '10px', color: '#AAA', fontWeight: 700 }}>DISTANCE</div>
            <div className="orbitron-font" style={{ fontSize: '22px', color: '#00F0FF', fontWeight: 900 }}>
              {distance} M
            </div>
          </div>

          <button className="btn-retro" onClick={onPause} style={{ padding: '12px', pointerEvents: 'auto' }}>
            <Pause size={18} />
          </button>
        </div>
      </div>

      {/* Bottom HUD: Speedometer & Active Shield Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {/* Shield Status Indicator */}
        {isShielded ? (
          <div className="glass-panel pulse-glow" style={{
            padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px',
            borderColor: 'var(--pepsi-cyan)', background: 'rgba(0, 240, 255, 0.2)'
          }}>
            <ShieldAlert size={22} color="var(--pepsi-cyan)" />
            <span className="pixel-font" style={{ fontSize: '12px', color: 'var(--pepsi-cyan)' }}>
              SHIELD ACTIVE (INVINCIBLE)
            </span>
          </div>
        ) : (
          <div />
        )}

        {/* Speedometer */}
        <div className="glass-panel" style={{
          padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto'
        }}>
          <Zap size={22} color="var(--pepsi-gold)" />
          <div>
            <div style={{ fontSize: '10px', color: '#AAA', fontWeight: 700 }}>SPEEDOMETER</div>
            <div className="orbitron-font" style={{ fontSize: '24px', color: 'var(--pepsi-gold)', fontWeight: 900 }}>
              {speedKmh} <span style={{ fontSize: '14px', color: '#FFF' }}>KM/H</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
