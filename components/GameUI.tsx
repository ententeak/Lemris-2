
import React from 'react';
import { COLS, ROWS, MAX_LEMMINGS, SHAPES } from '../constants';
import type { Lemming, ActivePiece, Difficulty, ShapeType, BloodStain } from '../types';

interface GameUIProps {
  grid: (string | null)[][];
  activePiece: ActivePiece | null;
  nextType: ShapeType;
  lemmings: Lemming[];
  bloodStains: BloodStain[];
  score: number;
  totalKills: number;
  isPaused: boolean;
  isWaiting: boolean;
  onPauseToggle: () => void;
  onExit: () => void;
  difficulty: Difficulty;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onDrop: () => void;
}

const GameUI: React.FC<GameUIProps> = ({ 
  grid, activePiece, nextType, lemmings, bloodStains, score, totalKills, isPaused, isWaiting, onPauseToggle, onExit,
  onMoveLeft, onMoveRight, onMoveDown, onRotate, onDrop
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 max-w-6xl w-full items-start justify-center overflow-y-auto h-full">
      
      {/* Sidebar Vlevo */}
      <div className="flex flex-row md:flex-col gap-4 w-full md:w-48 order-2 md:order-1">
        <div className="flex-1 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-lg">
          <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Skóre</div>
          <div className={`text-2xl font-black tabular-nums transition-colors ${score < 0 ? 'text-rose-500' : 'text-blue-400'}`}>
            {score.toLocaleString()}
          </div>
        </div>

        <div className="hidden md:block bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-lg">
          <div className="text-[10px] uppercase text-slate-500 font-bold mb-3">Příští dílek</div>
          <div className="flex flex-col items-center justify-center h-24 w-full">
            <div 
              className="grid gap-px bg-slate-800"
              style={{ 
                gridTemplateColumns: `repeat(${SHAPES[nextType].shape[0].length}, minmax(0, 1fr))`,
                width: '60px'
              }}
            >
              {SHAPES[nextType].shape.map((row, y) => 
                row.map((cell, x) => (
                  <div 
                    key={`${x}-${y}`} 
                    className="w-full aspect-square rounded-sm"
                    style={{ backgroundColor: cell ? SHAPES[nextType].color : 'transparent' }}
                  >
                    {cell > 0 && <div className="w-full h-full border border-white/20 shadow-inner"></div>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-lg">
            <button 
                onClick={onPauseToggle}
                className="w-full py-2 mb-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold transition-colors"
            >
                {isPaused ? 'POKRAČOVAT' : 'PAUZA'}
            </button>
            <button 
                onClick={onExit}
                className="w-full py-2 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 rounded-lg text-sm font-bold transition-colors"
            >
                UKONČIT
            </button>
        </div>
      </div>

      {/* Herní plocha */}
      <div className="relative bg-slate-900 border-4 border-slate-800 rounded-xl shadow-2xl p-1 overflow-hidden order-1 md:order-2 mx-auto">
        <div 
          className="grid gap-px bg-slate-800"
          style={{ 
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            width: 'min(70vw, 320px)',
            aspectRatio: `${COLS}/${ROWS}`
          }}
        >
          {grid.map((row, y) => (
            row.map((cell, x) => {
              let activeColor = null;
              if (activePiece) {
                const { pos, shape, color } = activePiece;
                const localX = x - pos.x;
                const localY = y - pos.y;
                if (localX >= 0 && localX < shape[0].length && localY >= 0 && localY < shape.length) {
                  if (shape[localY][localX]) activeColor = color;
                }
              }

              return (
                <div 
                  key={`${x}-${y}`} 
                  className="w-full h-full rounded-sm relative"
                  style={{ backgroundColor: activeColor || cell || 'rgba(15, 23, 42, 0.8)' }}
                >
                  {(cell || activeColor) && <div className="w-full h-full border border-white/10 shadow-inner"></div>}
                </div>
              );
            })
          ))}
        </div>

        {/* Krev */}
        <div className="absolute inset-0 pointer-events-none">
          {bloodStains.map(stain => (
            <div 
              key={stain.id}
              className="absolute blood-splatter"
              style={{
                left: `${(stain.x / COLS) * 100}%`,
                top: `${(stain.y / ROWS) * 100}%`,
                width: `${(1 / COLS) * 100}%`,
                height: `${(1 / ROWS) * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Lemmingové (CSS Postavičky) */}
        <div className="absolute inset-0 pointer-events-none">
          {lemmings.map(lem => (
            <div 
              key={lem.id}
              className={`absolute lemming-container ${lem.isFalling ? 'anim-fall' : 'anim-walk'}`}
              style={{
                left: `${(lem.x / COLS) * 100}%`,
                top: `${(lem.y / ROWS) * 100}%`,
                width: `${(1 / COLS) * 100}%`,
                height: `${(1 / ROWS) * 100}%`,
                transform: lem.direction === -1 ? 'scaleX(-1)' : 'none'
              }}
            >
              <div className="flex flex-col items-center transform scale-75">
                {/* Vlasy */}
                <div className="w-2 h-1 bg-green-500 rounded-full mb-0.5"></div>
                {/* Tělo */}
                <div className="w-3 h-4 bg-blue-600 rounded-t-lg relative">
                    {/* Obličej */}
                    <div className="absolute top-1 left-0.5 w-2 h-1 bg-white/40 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status čekání */}
        {isWaiting && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600/60 rounded text-[8px] font-black animate-pulse">
                AIRBORNE...
            </div>
        )}

        {isPaused && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <h2 className="text-4xl font-black text-white mb-4 italic">PAUZA</h2>
                <button 
                    onClick={onPauseToggle}
                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg"
                >
                    Zpět do akce
                </button>
            </div>
        )}
      </div>

      {/* Sidebar Vpravo */}
      <div className="flex flex-col gap-4 w-full md:w-48 order-3">
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-lg">
          <div className="text-[10px] uppercase text-slate-500 font-bold mb-3 flex justify-between">
            <span>Lemmingové</span>
            <span className="text-blue-400 font-black">{lemmings.length}/{MAX_LEMMINGS}</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${(lemmings.length / MAX_LEMMINGS) * 100}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-slate-500 italic flex justify-between">
            <span>Multi:</span>
            <span className="text-emerald-400 font-bold">{(1 + (lemmings.length / MAX_LEMMINGS) * 4).toFixed(1)}x</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-lg border-rose-900/40">
          <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Mrtví</div>
          <div className="text-3xl font-black text-rose-500 tabular-nums">
            {totalKills.toLocaleString()}
          </div>
        </div>

        {/* Mobilní ovládání */}
        <div className="md:hidden grid grid-cols-4 gap-2 mt-2 w-full">
            <button onPointerDown={onMoveLeft} className="p-4 bg-slate-800 rounded-xl active:bg-slate-700 flex items-center justify-center shadow-lg">⬅️</button>
            <button onPointerDown={onRotate} className="p-4 bg-slate-800 rounded-xl active:bg-slate-700 flex items-center justify-center shadow-lg">🔄</button>
            <button onPointerDown={onMoveRight} className="p-4 bg-slate-800 rounded-xl active:bg-slate-700 flex items-center justify-center shadow-lg">➡️</button>
            <button onPointerDown={onDrop} className="p-4 bg-blue-600 rounded-xl active:bg-blue-500 flex items-center justify-center shadow-lg font-black text-xs">⚡ DROP</button>
            <button onPointerDown={onMoveDown} className="col-span-3 p-4 bg-slate-800 rounded-xl active:bg-slate-700 font-bold text-xs uppercase">DOLŮ</button>
            <button onClick={onPauseToggle} className="p-4 bg-slate-700 rounded-xl active:bg-slate-600">⏸️</button>
        </div>
      </div>
    </div>
  );
};

export default GameUI;
