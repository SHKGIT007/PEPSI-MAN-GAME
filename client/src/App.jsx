import React, { useState } from 'react';
import { GameCanvas } from './game/GameCanvas';
import { MainMenu } from './components/MainMenu';
import { StageSelect } from './components/StageSelect';
import { HUD } from './components/HUD';
import { GameOverModal } from './components/GameOverModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { TouchControls } from './components/TouchControls';
import { soundManager } from './game/SoundEngine';

export function App() {
  const [gameState, setGameState] = useState('menu'); // 'menu' | 'playing' | 'paused' | 'gameover'
  const [showStageSelect, setShowStageSelect] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedStage, setSelectedStage] = useState('Village'); // 'Village' | 'City'
  const [isMuted, setIsMuted] = useState(false);

  // Player state
  const [lane, setLane] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpProgress, setJumpProgress] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isShielded, setIsShielded] = useState(false);

  // Stats accumulator
  const [currentStats, setCurrentStats] = useState({ distance: 0, score: 0, cans: 0, speed: 14, combo: 1 });
  const [finalResults, setFinalResults] = useState(null);

  const startGame = () => {
    setLane(0);
    setIsJumping(false);
    setJumpProgress(0);
    setIsSliding(false);
    setIsShielded(false);
    setCurrentStats({ distance: 0, score: 0, cans: 0, speed: 14, combo: 1 });
    setFinalResults(null);
    setGameState('playing');
    soundManager.startBGM();
  };

  const pauseGame = () => {
    setGameState('paused');
    soundManager.stopBGM();
  };

  const resumeGame = () => {
    setGameState('playing');
    soundManager.startBGM();
  };

  const handleGameOver = (results) => {
    setFinalResults(results);
    setGameState('gameover');
    soundManager.stopBGM();
  };

  const returnToMenu = () => {
    setGameState('menu');
    soundManager.stopBGM();
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* PS1 Retro Scanline Effect */}
      <div className="ps1-scanlines" />

      {/* 3D Viewport Canvas */}
      <GameCanvas
        stage={selectedStage}
        isPaused={gameState === 'paused' || gameState === 'menu' || gameState === 'gameover'}
        isGameOver={gameState === 'gameover'}
        onUpdateStats={setCurrentStats}
        onGameOver={handleGameOver}
        lane={lane}
        setLane={setLane}
        isJumping={isJumping}
        setIsJumping={setIsJumping}
        jumpProgress={jumpProgress}
        setJumpProgress={setJumpProgress}
        isSliding={isSliding}
        setIsSliding={setIsSliding}
        isShielded={isShielded}
        setIsShielded={setIsShielded}
      />

      {/* Main Menu Screen */}
      {gameState === 'menu' && !showStageSelect && !showLeaderboard && (
        <MainMenu
          onStartGame={startGame}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenStageSelect={() => setShowStageSelect(true)}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          selectedStage={selectedStage}
        />
      )}

      {/* Stage Selection Overlay */}
      {showStageSelect && (
        <StageSelect
          currentStage={selectedStage}
          onSelectStage={setSelectedStage}
          onClose={() => setShowStageSelect(false)}
        />
      )}

      {/* High Score Leaderboard Overlay */}
      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}

      {/* Gameplay HUD Overlay */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <HUD
          stats={currentStats}
          stage={selectedStage}
          isShielded={isShielded}
          onPause={gameState === 'playing' ? pauseGame : resumeGame}
        />
      )}

      {/* Touch / On-Screen Gamepad Overlay */}
      {gameState === 'playing' && (
        <TouchControls
          onMoveLeft={() => setLane((l) => Math.max(-1, l - 1))}
          onMoveRight={() => setLane((l) => Math.min(1, l + 1))}
          onJump={() => {
            if (!isJumping) {
              setIsJumping(true);
              setJumpProgress(0);
              soundManager.playJump();
            }
          }}
          onSlide={() => {
            if (!isSliding) {
              setIsSliding(true);
              soundManager.playSlide();
              setTimeout(() => setIsSliding(false), 800);
            }
          }}
        />
      )}

      {/* Pause Menu Overlay */}
      {gameState === 'paused' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 25, background: 'rgba(5, 8, 16, 0.85)', backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', minWidth: '300px' }}>
            <h2 className="pixel-font" style={{ fontSize: '20px', color: 'var(--pepsi-gold)', marginBottom: '20px' }}>
              GAME PAUSED
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn-retro btn-gold" onClick={resumeGame}>
                RESUME
              </button>
              <button className="btn-retro" onClick={startGame}>
                RESTART RUN
              </button>
              <button className="btn-retro btn-red" onClick={returnToMenu}>
                MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <GameOverModal
          results={finalResults}
          stage={selectedStage}
          onRestart={startGame}
          onReturnHome={returnToMenu}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
        />
      )}
    </div>
  );
}

export default App;
