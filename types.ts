
export type ShapeType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Pos {
  x: number;
  y: number;
}

export interface Lemming {
  id: string;
  x: number;
  y: number;
  direction: 1 | -1;
  isFalling: boolean;
}

export interface BloodStain extends Pos {
  id: string;
  timestamp: number;
}

export interface ScoreEntry {
  name: string;
  score: number;
  kills: number;
  difficulty: Difficulty;
  date: string;
}

export enum Difficulty {
  EASY = 'Lehká',
  MEDIUM = 'Střední',
  HARD = 'Těžká'
}

export interface GameState {
  grid: (string | null)[][];
  activePiece: ActivePiece | null;
  lemmings: Lemming[];
  score: number;
  totalKills: number;
  linesCleared: number;
  isGameOver: boolean;
  isPaused: boolean;
  difficulty: Difficulty;
}

export interface ActivePiece {
  pos: Pos;
  shape: number[][];
  type: ShapeType;
  color: string;
}
