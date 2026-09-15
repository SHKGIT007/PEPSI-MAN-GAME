import React from 'react';
import { ArrowLeft, Check, Trees, Building2 } from 'lucide-react';

export function StageSelect({ currentStage, onSelectStage, onClose }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 25, padding: '20px',
      background: 'rgba(5, 8, 16, 0.95)', backdropFilter: 'blur(10px)'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '30px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 className="pixel-font" style={{ fontSize: '18px', color: 'var(--pepsi-gold)' }}>
            SELECT STAGE
          </h2>
          <button className="btn-retro" onClick={onClose} style={{ padding: '8px 14px', fontSize: '11px' }}>
            <ArrowLeft size={16} /> BACK
          </button>
        </div>

        {/* Stage Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {/* Stage 1: Village */}
          <div
            onClick={() => { onSelectStage('Village'); onClose(); }}
            style={{
              background: currentStage === 'Village' ? 'rgba(0, 85, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: currentStage === 'Village' ? '3px solid var(--pepsi-cyan)' : '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px', padding: '20px', cursor: 'pointer',
              transition: 'all 0.2s ease', position: 'relative'
            }}
          >
            {currentStage === 'Village' && (
              <div style={{
                position: 'absolute', top: '12px', right: '12px',
                background: 'var(--pepsi-cyan)', color: '#000', borderRadius: '50%', padding: '4px'
              }}>
                <Check size={16} />
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#4A7C59', padding: '10px', borderRadius: '10px' }}>
                <Trees size={24} color="#FFF" />
              </div>
              <div>
                <h3 className="orbitron-font" style={{ fontSize: '16px', color: '#FFF' }}>STAGE 1</h3>
                <div style={{ fontSize: '14px', color: 'var(--pepsi-gold)', fontWeight: 700 }}>VILLAGE RUN</div>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#AAA', lineHeight: 1.5 }}>
              Dash through rustic gaon dirt paths, jump wooden hurdles, dodge hay bales & cross river bridges!
            </p>
          </div>

          {/* Stage 2: City */}
          <div
            onClick={() => { onSelectStage('City'); onClose(); }}
            style={{
              background: currentStage === 'City' ? 'rgba(0, 85, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: currentStage === 'City' ? '3px solid var(--pepsi-cyan)' : '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px', padding: '20px', cursor: 'pointer',
              transition: 'all 0.2s ease', position: 'relative'
            }}
          >
            {currentStage === 'City' && (
              <div style={{
                position: 'absolute', top: '12px', right: '12px',
                background: 'var(--pepsi-cyan)', color: '#000', borderRadius: '50%', padding: '4px'
              }}>
                <Check size={16} />
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#0055FF', padding: '10px', borderRadius: '10px' }}>
                <Building2 size={24} color="#FFF" />
              </div>
              <div>
                <h3 className="orbitron-font" style={{ fontSize: '16px', color: '#FFF' }}>STAGE 2</h3>
                <div style={{ fontSize: '14px', color: 'var(--pepsi-cyan)', fontWeight: 700 }}>NEON METROPOLIS</div>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#AAA', lineHeight: 1.5 }}>
              High speed runner through illuminated shehar highways, neon skyscrapers, traffic cones & city buses!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
