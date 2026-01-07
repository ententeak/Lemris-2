
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { COLS, ROWS, SHAPES, DIFFICULTY_SPEEDS, MAX_LEMMINGS } from '../constants';
import { ShapeType, Difficulty, Pos, Lemming, ActivePiece, BloodStain } from '../types';
import GameUI from './GameUI';

interface GameEngineProps {
  difficulty: Difficulty;
  onGameOver: (score: number, kills: number) => void;
  onExit: () => void;
}

const GameEngine: React.FC<GameEngineProps> = ({ difficulty, onGameOver, onExit }) => {
  const [grid, setGrid] = useState<(string | null)[][]>(() => 
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );

  const generateRandomType = useCallback((): ShapeType => {
    const keys = Object.keys(SHAPES) as ShapeType[];
    return keys[Math.floor(Math.random() * keys.length)];
  }, []);

  const [activePiece, setActivePiece] = useState<ActivePiece | null>(null);
  const [nextType, setNextType] = useState<ShapeType>(generateRandomType());
  const [lemmings, setLemmings] = useState<Lemming[]>([]);
  const [bloodStains, setBloodStains] = useState<BloodStain[]>([]);
  const [score, setScore] = useState(0);
  const [totalKills, setTotalKills] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWaitingForLemmings, setIsWaitingForLemmings] = useState(false);

  const gameLoopRef = useRef<number | undefined>(undefined);
  const lastTickRef = useRef<number>(0);
  const moveTickRef = useRef<number>(0);

  const createPiece = useCallback((typeToUse: ShapeType): ActivePiece => {
    const { shape, color } = SHAPES[typeToUse];
    return {
      type: typeToUse,
      shape,
      color,
      pos: { x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2), y: 0 }
    };
  }, []);

  const isValidMove = (pos: Pos, shape: number[][], currentGrid: (string | null)[][]) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
          if (newY >= 0 && currentGrid[newY][newX]) return false;
        }
      }
    }
    return true;
  };

  const calculatePenalty = (kills: number) => {
    if (kills === 0) return 0;
    return Math.floor(Math.pow(kills, 4.2) * 20); // Zpřísněná penalizace
  };

  const lockPiece = useCallback((targetPiece?: ActivePiece) => {
    const piece = targetPiece || activePiece;
    if (!piece) return;

    const occupied = new Set<string>();
    piece.shape.forEach((row, py) => {
      row.forEach((val, px) => {
        if (val) occupied.add(`${piece.pos.x + px},${piece.pos.y + py}`);
      });
    });

    let killsNow = 0;
    const newBlood: BloodStain[] = [];

    setLemmings(prev => {
      const survivors = prev.filter(lem => {
        const lx = Math.round(lem.x);
        const ly = Math.floor(lem.y + 0.1); // Malý offset pro přesnější detekci "uvnitř" kostky
        const isCrushed = occupied.has(`${lx},${ly}`);
        if (isCrushed) {
          killsNow++;
          newBlood.push({ id: Math.random().toString(36), x: lx, y: ly, timestamp: Date.now() });
        }
        return !isCrushed;
      });

      if (killsNow > 0) {
        setTotalKills(tk => tk + killsNow);
        setScore(s => s - calculatePenalty(killsNow));
        setBloodStains(bs => [...bs, ...newBlood]);
      }
      return survivors;
    });

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const gridX = piece.pos.x + x;
            const gridY = piece.pos.y + y;
            if (gridY >= 0 && gridY < ROWS) newGrid[gridY][gridX] = piece.color;
          }
        });
      });

      let linesCount = 0;
      for (let y = ROWS - 1; y >= 0; y--) {
        if (newGrid[y].every(cell => cell !== null)) {
          newGrid.splice(y, 1);
          newGrid.unshift(Array(COLS).fill(null));
          linesCount++;
          y++;
        }
      }

      if (linesCount > 0) {
        const basePoints = [0, 100, 300, 500, 800][linesCount] || linesCount * 200;
        setLemmings(prevLems => {
          const multiplier = 1 + (prevLems.length / MAX_LEMMINGS) * 4;
          setScore(s => s + Math.floor(basePoints * multiplier));
          const newLems = [...prevLems];
          for (let i = 0; i < linesCount; i++) {
            if (newLems.length < MAX_LEMMINGS) {
              newLems.push({
                id: Math.random().toString(36).substr(2, 9),
                x: Math.floor(Math.random() * (COLS - 2)) + 1,
                y: 0,
                direction: Math.random() > 0.5 ? 1 : -1,
                isFalling: true
              });
            }
          }
          return newLems;
        });
      }
      setIsWaitingForLemmings(true);
      return newGrid;
    });

    setActivePiece(null); 
  }, [activePiece, calculatePenalty]);

  const handleHardDrop = useCallback(() => {
    if (!activePiece || isPaused || isGameOver) return;
    let finalY = activePiece.pos.y;
    while (isValidMove({ ...activePiece.pos, y: finalY + 1 }, activePiece.shape, grid)) {
      finalY++;
    }
    const finalPiece = { ...activePiece, pos: { ...activePiece.pos, y: finalY } };
    lockPiece(finalPiece);
  }, [activePiece, grid, lockPiece, isPaused, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isGameOver || !activePiece) return;
      
      const { pos, shape } = activePiece;
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (isValidMove({ ...pos, x: pos.x - 1 }, shape, grid)) {
            setActivePiece(p => p ? { ...p, pos: { ...p.pos, x: p.pos.x - 1 } } : null);
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (isValidMove({ ...pos, x: pos.x + 1 }, shape, grid)) {
            setActivePiece(p => p ? { ...p, pos: { ...p.pos, x: p.pos.x + 1 } } : null);
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (isValidMove({ ...pos, y: pos.y + 1 }, shape, grid)) {
            setActivePiece(p => p ? { ...p, pos: { ...p.pos, y: p.pos.y + 1 } } : null);
          }
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          const rotated = shape[0].map((_, i) => shape.map(row => row[i]).reverse());
          if (isValidMove(pos, rotated, grid)) {
            setActivePiece(p => p ? { ...p, shape: rotated } : null);
          }
          break;
        case ' ':
          handleHardDrop();
          break;
        case 'p':
        case 'P':
        case 'Escape':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePiece, grid, isPaused, isGameOver, handleHardDrop]);

  useEffect(() => {
    const loop = (time: number) => {
      if (isPaused || isGameOver) {
        gameLoopRef.current = requestAnimationFrame(loop);
        return;
      }

      if (!activePiece && !isWaitingForLemmings) {
        const next = createPiece(nextType);
        if (!isValidMove(next.pos, next.shape, grid)) {
          setIsGameOver(true);
        } else {
          setActivePiece(next);
          setNextType(generateRandomType());
        }
      }

      const tetrisSpeed = DIFFICULTY_SPEEDS[difficulty];
      const physicsTick = 20;

      if (time - lastTickRef.current > tetrisSpeed) {
        if (activePiece && !isWaitingForLemmings) {
          if (isValidMove({ ...activePiece.pos, y: activePiece.pos.y + 1 }, activePiece.shape, grid)) {
            setActivePiece(p => p ? { ...p, pos: { ...p.pos, y: p.pos.y + 1 } } : null);
          } else {
            lockPiece();
          }
        }
        lastTickRef.current = time;
      }

      if (time - moveTickRef.current > physicsTick) {
        setLemmings(prev => {
          let isAnyoneFalling = false;
          
          // Pokud nejsou žádní lemmingové, rovnou zrušíme čekání
          if (prev.length === 0 && isWaitingForLemmings) {
            setIsWaitingForLemmings(false);
          }

          const filtered = prev.filter(lem => {
            const checkX = Math.round(lem.x);
            const checkY = Math.floor(lem.y + 0.1);
            // Pokud lemming propadl do obsazeného bloku, eliminujeme ho
            if (checkY >= 0 && checkY < ROWS && grid[checkY][checkX] !== null) {
                setTotalKills(tk => tk + 1);
                setScore(s => s - calculatePenalty(1));
                setBloodStains(bs => [...bs, { id: Math.random().toString(36), x: checkX, y: checkY, timestamp: Date.now() }]);
                return false;
            }
            return true;
          });

          const updated = filtered.map(lem => {
            const currentX = Math.round(lem.x);
            const currentY = Math.floor(lem.y + 0.1);
            
            // Hledání země
            let groundY = ROWS;
            for (let y = Math.max(0, currentY + 1); y < ROWS; y++) {
                if (grid[y][currentX] !== null) {
                    groundY = y;
                    break;
                }
            }

            const fallStep = 0.6; // Mírně pomalejší pád pro lepší stabilitu
            const targetY = groundY - 1;

            if (lem.y < targetY - 0.05) {
              isAnyoneFalling = true;
              return { ...lem, isFalling: true, y: Math.min(targetY, lem.y + fallStep) };
            } else {
              // Chůze na zemi
              const walkStep = 0.07;
              const nextX = Math.round(lem.x + (lem.direction * walkStep));
              const isWall = nextX < 0 || nextX >= COLS || grid[targetY][nextX] !== null;
              
              return {
                ...lem,
                isFalling: false,
                y: targetY, // Pevné přichycení k řádku
                direction: isWall ? (lem.direction * -1) as (1 | -1) : lem.direction,
                x: isWall ? lem.x : lem.x + (lem.direction * walkStep)
              };
            }
          });

          if (isWaitingForLemmings && !isAnyoneFalling) {
            setIsWaitingForLemmings(false);
          }
          return updated;
        });

        setBloodStains(prev => prev.filter(s => Date.now() - s.timestamp < 3000));
        moveTickRef.current = time;
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current!);
  }, [activePiece, grid, isPaused, isGameOver, difficulty, lockPiece, createPiece, nextType, generateRandomType, isWaitingForLemmings]);

  useEffect(() => {
    if (isGameOver) {
      onGameOver(score, totalKills);
    }
  }, [isGameOver, score, totalKills, onGameOver]);

  return (
    <GameUI 
      grid={grid} 
      activePiece={activePiece} 
      nextType={nextType}
      lemmings={lemmings} 
      bloodStains={bloodStains}
      score={score} 
      totalKills={totalKills}
      isPaused={isPaused}
      isWaiting={isWaitingForLemmings}
      onPauseToggle={() => setIsPaused(!isPaused)}
      onExit={onExit}
      difficulty={difficulty}
      onMoveLeft={() => {
        if (activePiece && isValidMove({ ...activePiece.pos, x: activePiece.pos.x - 1 }, activePiece.shape, grid)) {
          setActivePiece(p => p ? { ...p, pos: { ...p.pos, x: p.pos.x - 1 } } : null);
        }
      }}
      onMoveRight={() => {
        if (activePiece && isValidMove({ ...activePiece.pos, x: activePiece.pos.x + 1 }, activePiece.shape, grid)) {
          setActivePiece(p => p ? { ...p, pos: { ...p.pos, x: p.pos.x + 1 } } : null);
        }
      }}
      onMoveDown={() => {
        if (activePiece && isValidMove({ ...activePiece.pos, y: activePiece.pos.y + 1 }, activePiece.shape, grid)) {
          setActivePiece(p => p ? { ...p, pos: { ...p.pos, y: p.pos.y + 1 } } : null);
        }
      }}
      onRotate={() => {
        if (activePiece) {
          const rotated = activePiece.shape[0].map((_, i) => activePiece.shape.map(row => row[i]).reverse());
          if (isValidMove(activePiece.pos, rotated, grid)) {
            setActivePiece(p => p ? { ...p, shape: rotated } : null);
          }
        }
      }}
      onDrop={handleHardDrop}
    />
  );
};

export default GameEngine;
