
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

export const Difficulty = {
  EASY: 'Lehká',
  MEDIUM: 'Střední',
  HARD: 'Těžká'
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export interface ScoreEntry {
  name: string;
  score: number;
  kills: number;
  difficulty: Difficulty;
  date: string;
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
