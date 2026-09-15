import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

export function TouchControls({ onMoveLeft, onMoveRight, onJump, onSlide }) {
  return (
    <div style={{
      position: 'absolute', bottom: '24px', left: '24px', right: '24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      pointerEvents: 'none', zIndex: 18
    }}>
      {/* Left/Right Directional Buttons */}
      <div style={{ display: 'flex', gap: '14px', pointerEvents: 'auto' }}>
        <button
          className="btn-retro"
          onClick={onMoveLeft}
          style={{ width: '64px', height: '64px', borderRadius: '50%', padding: 0 }}
        >
          <ArrowLeft size={28} />
        </button>
        <button
          className="btn-retro"
          onClick={onMoveRight}
          style={{ width: '64px', height: '64px', borderRadius: '50%', padding: 0 }}
        >
          <ArrowRight size={28} />
        </button>
      </div>

      {/* Action Buttons: Jump & Slide */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', pointerEvents: 'auto' }}>
        <button
          className="btn-retro btn-gold"
          onClick={onJump}
          style={{ width: '64px', height: '64px', borderRadius: '50%', padding: 0 }}
        >
          <ArrowUp size={28} />
        </button>
        <button
          className="btn-retro btn-red"
          onClick={onSlide}
          style={{ width: '64px', height: '64px', borderRadius: '50%', padding: 0 }}
        >
          <ArrowDown size={28} />
        </button>
      </div>
    </div>
  );
}
