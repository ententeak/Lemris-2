
import React from 'react';
import { Difficulty } from '../types';

interface StartScreenProps {
  onStart: (diff: Difficulty) => void;
  onShowLeaderboard: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowLeaderboard }) => {
  return (
    <div className="flex flex-col items-center max-w-md p-8 bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl">
      <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-500 italic tracking-tighter">
        LEMMRIS 2
      </h1>
      <p className="text-slate-400 text-sm mb-6 text-center italic">
        Smaž řádky pro záchranu Lemmingů. Pozor na padající kostky!
      </p>

      <div className="bg-slate-800 p-4 rounded-xl mb-6 text-sm text-slate-300">
        <h3 className="font-bold text-blue-300 mb-2 uppercase tracking-widest text-xs">Pravidla:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Smazaný řádek = +1 Lemming (max 20)</li>
          <li>Lemmingové násobí skóre (až 5x)</li>
          <li>Rozmačkání Lemminga = <span className="text-red-400 font-bold">DRSNÁ PENALITA</span></li>
          <li>Víc mrtvých najednou = EXTRÉMNÍ ZTRÁTA</li>
        </ul>
      </div>

      <div className="flex flex-col w-full gap-3">
        <button 
          onClick={() => onStart(Difficulty.EASY)}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold transition-all transform active:scale-95 shadow-lg shadow-emerald-900/20"
        >
          START: Lehká (Pohoda)
        </button>
        <button 
          onClick={() => onStart(Difficulty.MEDIUM)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-all transform active:scale-95 shadow-lg shadow-blue-900/20"
        >
          START: Střední (Klasika)
        </button>
        <button 
          onClick={() => onStart(Difficulty.HARD)}
          className="w-full py-3 bg-rose-600 hover:bg-rose-500 rounded-lg font-bold transition-all transform active:scale-95 shadow-lg shadow-rose-900/20"
        >
          START: Těžká (Masakr)
        </button>
        <button 
          onClick={onShowLeaderboard}
          className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-all transform active:scale-95 mt-2"
        >
          🏆 Tabulky Skóre
        </button>
      </div>

      <div className="mt-8 text-[10px] text-slate-500 flex flex-col items-center gap-1 uppercase tracking-widest font-bold">
        <div className="flex gap-4">
            <span>ŠIPKY / WASD: Pohyb</span>
            <span>MEZERNÍK: Hard Drop</span>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
