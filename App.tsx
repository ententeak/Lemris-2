
import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameEngine from './components/GameEngine';
import Leaderboard from './components/Leaderboard';
import GameOverDialog from './components/GameOverDialog';
import { Difficulty, ScoreEntry } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'menu' | 'game' | 'leaderboard'>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [lastScore, setLastScore] = useState<ScoreEntry | null>(null);
  const [showGameOver, setShowGameOver] = useState<{ score: number, kills: number } | null>(null);

  const handleStartGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setView('game');
    setShowGameOver(null);
  };

  const onGameOverTriggered = (finalScore: number, finalKills: number) => {
    setShowGameOver({ score: finalScore, kills: finalKills });
  };

  const handleSaveScore = (name: string) => {
    if (!showGameOver) return;

    const entry: ScoreEntry = {
      name: name || 'Bezejmenný hrdina',
      score: showGameOver.score,
      kills: showGameOver.kills,
      difficulty,
      date: new Date().toLocaleDateString()
    };
    
    const scores: ScoreEntry[] = JSON.parse(localStorage.getItem('tetris_lemmings_scores') || '[]');
    scores.push(entry);
    localStorage.setItem('tetris_lemmings_scores', JSON.stringify(scores));
    
    setLastScore(entry);
    setShowGameOver(null);
    setView('leaderboard');
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none">
      {view === 'menu' && (
        <StartScreen onStart={handleStartGame} onShowLeaderboard={() => setView('leaderboard')} />
      )}
      
      {view === 'game' && (
        <GameEngine 
          difficulty={difficulty} 
          onGameOver={onGameOverTriggered} 
          onExit={() => setView('menu')}
        />
      )}
      
      {view === 'leaderboard' && (
        <Leaderboard 
          onBack={() => setView('menu')} 
          lastScore={lastScore}
        />
      )}

      {showGameOver && (
        <GameOverDialog 
            score={showGameOver.score}
            kills={showGameOver.kills}
            difficulty={difficulty}
            onSave={handleSaveScore}
            onCancel={() => { setShowGameOver(null); setView('menu'); }}
        />
      )}
    </div>
  );
};

export default App;
