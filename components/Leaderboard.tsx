
import React, { useMemo } from 'react';
import { ScoreEntry } from '../types';

interface LeaderboardProps {
  onBack: () => void;
  lastScore: ScoreEntry | null;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack, lastScore }) => {
  const scores: ScoreEntry[] = useMemo(() => {
    return JSON.parse(localStorage.getItem('tetris_lemmings_scores') || '[]');
  }, []);

  const bestPlayers = useMemo(() => {
    return [...scores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [scores]);

  const biggestKillers = useMemo(() => {
    return [...scores]
      .sort((a, b) => b.kills - a.kills)
      .slice(0, 10);
  }, [scores]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl p-4 md:p-8 h-full overflow-y-auto">
      <h2 className="text-4xl font-black text-white mb-8 tracking-tighter italic">SÍNĚ SLÁVY A HANBY</h2>
      
      {lastScore && (
        <div className="w-full mb-8 bg-blue-900/30 border border-blue-500/30 p-4 rounded-2xl text-center">
            <span className="text-blue-300 text-sm font-bold uppercase">Poslední pokus</span>
            <div className="text-xl">
                {lastScore.name}: <span className="font-black">{lastScore.score.toLocaleString()}</span> bodů | <span className="text-rose-400 font-bold">{lastScore.kills}</span> obětí
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Top Players */}
        <div className="bg-slate-900 border-2 border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-black text-blue-400 mb-4 flex items-center gap-2">
            🏆 TOP 10 HRÁČŮ
          </h3>
          <div className="space-y-3">
            {bestPlayers.length === 0 ? (
                <div className="text-slate-600 italic">Zatím žádné záznamy...</div>
            ) : bestPlayers.map((entry, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 w-4">{i + 1}.</span>
                    <span className="font-bold text-slate-200">{entry.name}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-black text-blue-400 tabular-nums">{entry.score.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 italic">{entry.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Killers */}
        <div className="bg-slate-900 border-2 border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-black text-rose-500 mb-4 flex items-center gap-2">
            💀 NEJVĚTŠÍ ZABIJÁCI
          </h3>
          <div className="space-y-3">
             {biggestKillers.length === 0 ? (
                <div className="text-slate-600 italic">Zatím nikdo nikoho nerozmačkal.</div>
            ) : biggestKillers.map((entry, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 w-4">{i + 1}.</span>
                    <span className="font-bold text-slate-200">{entry.name}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-black text-rose-500 tabular-nums">{entry.kills.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500">Mrtvol v jedné hře</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="mt-12 px-12 py-4 bg-slate-700 hover:bg-slate-600 rounded-full font-bold transition-all shadow-lg active:scale-95"
      >
        ZPĚT DO MENU
      </button>
    </div>
  );
};

export default Leaderboard;
