import React from 'react';
import { Play, Trophy, HelpCircle, Volume2, VolumeX, Sparkles, MapPin } from 'lucide-react';
import { soundManager } from '../game/SoundEngine';

export function MainMenu({ onStartGame, onOpenLeaderboard, onOpenStageSelect, isMuted, setIsMuted, selectedStage }) {
  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 20, padding: '20px',
      background: 'radial-gradient(circle at center, rgba(0, 43, 127, 0.4) 0%, rgba(8, 12, 22, 0.95) 100%)'
    }}>
      {/* Top Header Buttons */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '12px' }}>
        <button className="btn-retro" onClick={toggleSound} style={{ padding: '10px 16px', fontSize: '12px' }}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          {isMuted ? 'MUTED' : 'SOUND ON'}
        </button>
      </div>

      {/* Main Arcade Pepsi Title Logo */}
      <div className="float-anim" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{
          fontSize: '14px', letterSpacing: '4px', color: 'var(--pepsi-cyan)',
          fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase'
        }}>
          PS1 RETRO 3D ACTION RUNNER
        </div>
        <h1 className="pixel-font pulse-glow" style={{
          fontSize: ' clamp(2rem, 6vw, 4.5rem)', color: '#FFFFFF',
          textShadow: '4px 4px 0px var(--pepsi-blue), -3px -3px 0px var(--pepsi-red)',
          lineHeight: 1.2
        }}>
          PEPSI-MAN
        </h1>
        <div className="orbitron-font" style={{
          fontSize: '20px', color: 'var(--pepsi-gold)', fontWeight: 900,
          letterSpacing: '6px', marginTop: '6px'
        }}>
          ULTIMATE EDITION
        </div>
      </div>

      {/* Selected Stage Badge */}
      <div className="glass-panel" style={{
        padding: '10px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px'
      }}>
        <MapPin size={20} color="var(--pepsi-cyan)" />
        <span style={{ fontSize: '14px', color: '#AAA' }}>CURRENT STAGE:</span>
        <span className="pixel-font" style={{ color: 'var(--pepsi-gold)', fontSize: '14px' }}>
          {selectedStage.toUpperCase()}
        </span>
        <button onClick={onOpenStageSelect} style={{
          background: 'none', border: 'none', color: 'var(--pepsi-cyan)',
          textDecoration: 'underline', cursor: 'pointer', fontSize: '12px', marginLeft: '10px'
        }}>
          CHANGE
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '340px' }}>
        <button className="btn-retro btn-gold" onClick={onStartGame} style={{ fontSize: '16px', padding: '18px 32px' }}>
          <Play size={24} fill="#000" />
          START RUN!
        </button>

        <button className="btn-retro" onClick={onOpenStageSelect}>
          <MapPin size={18} />
          STAGE SELECT
        </button>

        <button className="btn-retro btn-red" onClick={onOpenLeaderboard}>
          <Trophy size={18} />
          HIGH SCORES
        </button>
      </div>

      {/* Controls Guide Footer */}
      <div className="glass-panel" style={{
        marginTop: '36px', padding: '14px 28px', maxWidth: '480px', textAlign: 'center'
      }}>
        <div style={{ fontSize: '12px', color: 'var(--pepsi-cyan)', fontWeight: 700, marginBottom: '6px' }}>
          🎮 GAME CONTROLS
        </div>
        <div style={{ fontSize: '13px', color: '#DDD', display: 'flex', justifyContent: 'space-around', gap: '10px' }}>
          <span><b>[A / D] or [← / →]</b> Steer</span>
          <span><b>[W / SPACE]</b> Jump</span>
          <span><b>[S / ↓]</b> Slide</span>
        </div>
      </div>
    </div>
  );
}
