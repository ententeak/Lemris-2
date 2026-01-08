
import { Difficulty, type ShapeType } from './types';

export const COLS = 10;
export const ROWS = 20;
export const MAX_LEMMINGS = 20;

export const SHAPES: Record<ShapeType, { shape: number[][]; color: string }> = {
  I: { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], color: '#22d3ee' },
  J: { shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], color: '#3b82f6' },
  L: { shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], color: '#f59e0b' },
  O: { shape: [[1, 1], [1, 1]], color: '#eab308' },
  S: { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: '#22c55e' },
  T: { shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], color: '#a855f7' },
  Z: { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: '#ef4444' }
};

export const DIFFICULTY_SPEEDS: Record<Difficulty, number> = {
  [Difficulty.EASY]: 800,
  [Difficulty.MEDIUM]: 500,
  [Difficulty.HARD]: 250
};
