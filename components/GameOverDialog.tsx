
import React, { useState } from 'react';
import { ScoreEntry, Difficulty } from '../types';

interface GameOverDialogProps {
  score: number;
  kills: number;
  difficulty: Difficulty;
  onSave: (name: string) => void;
  onCancel: () => void;
}

const GameOverDialog: React.FC<GameOverDialogProps> = ({ score, kills, difficulty, onSave, onCancel }) => {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-900 border-2 border-rose-500/50 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
        <h2 className="text-4xl font-black text-rose-500 mb-2 italic tracking-tighter">KONEC HRY</h2>
        <p className="text-slate-400 mb-6 uppercase text-xs font-bold tracking-widest">{difficulty}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800 p-4 rounded-2xl">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Skóre</div>
                <div className={`text-xl font-black ${score < 0 ? 'text-red-400' : 'text-blue-400'}`}>{score.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl border border-rose-900/30">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Mrtví</div>
                <div className="text-xl font-black text-rose-500">{kills}</div>
            </div>
        </div>

        <div className="mb-6">
            <label className="block text-left text-xs font-bold text-slate-500 mb-2 uppercase ml-2">Jméno hrdiny:</label>
            <input 
                autoFocus
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tvé jméno..."
                className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && name.trim() && onSave(name)}
            />
        </div>

        <div className="flex flex-col gap-2">
            <button 
                disabled={!name.trim()}
                onClick={() => onSave(name)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl font-black transition-all shadow-lg active:scale-95"
            >
                ULOŽIT SKÓRE
            </button>
            <button 
                onClick={onCancel}
                className="w-full py-3 text-slate-500 hover:text-slate-300 text-sm font-bold transition-colors"
            >
                Zahodit a odejít
            </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverDialog;
