// ── Primitives ─────────────────────────────────────────────────────────────
export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

// ── Game Config ─────────────────────────────────────────────────────────────
export type GameMode = 'pvp' | 'ai';
export type AIDifficulty = 'easy' | 'medium' | 'hard';
export type BoardSize = 3 | 4 | 5;
export type MatchMode = 'single' | 'best-of-3' | 'best-of-5';
export type AppScreen = 'start' | 'game' | 'summary' | 'replay';

// ── UI / Theming ─────────────────────────────────────────────────────────────
export type ThemeMode = 'light' | 'dark';
export type ColorTheme = 'gradient' | 'neon' | 'classic' | 'minimal' | 'cyberpunk';

// ── Player Profile ───────────────────────────────────────────────────────────
export interface PlayerProfile {
  name: string;
  icon: string;    // emoji, e.g. "🐉"
  color: string;   // hex, e.g. "#3b82f6"
}

// ── Scores & Stats ───────────────────────────────────────────────────────────
export interface Scores {
  X: number;
  O: number;
  draws: number;
}

export interface MatchScore {
  X: number;
  O: number;
}

// ── Win Detection ─────────────────────────────────────────────────────────────
export interface WinningLine {
  winner: Player;
  combination: number[];
}

// ── History ───────────────────────────────────────────────────────────────────
export interface GameHistoryItem {
  id: string;
  roundNumber: number;
  winner: Player | 'Draw';
  totalMoves: number;
  winningCells?: number[];
  timestamp: number;
  duration: number;        // seconds
  gameMode: GameMode;
  aiDifficulty?: AIDifficulty;
  boardSize: BoardSize;
  rewardEarned?: number;
  moveLog: number[];       // ordered cell indices for replay
}

// ── Settings (persisted) ──────────────────────────────────────────────────────
export interface AppSettings {
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  soundEnabled: boolean;
  timerEnabled: boolean;
  timerSeconds: number;
  aiDifficulty: AIDifficulty;
  boardSize: BoardSize;
  matchMode: MatchMode;
  playerX: PlayerProfile;
  playerO: PlayerProfile;
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  name: string;
  icon: string;
  wins: number;
  losses: number;
  draws: number;
}

// ── Core Game State ───────────────────────────────────────────────────────────
export interface GameState {
  // Board
  board: Board;
  boardSize: BoardSize;
  currentPlayer: Player;
  humanPlayer: Player;       // which symbol the human plays (AI mode)
  winner: Player | null;
  isDraw: boolean;
  winningCells: number[];
  moveLog: number[];         // current game move list for replay
  moveHistory: Board[];      // undo stack (board snapshots)

  // Match/Series
  scores: Scores;            // session running totals
  matchScore: MatchScore;    // current best-of series score
  matchMode: MatchMode;
  matchWinner: Player | null;

  // History
  history: GameHistoryItem[];
  gameStartTime: number;     // Date.now() at first move

  // Rewards
  balance: number;
  streak: number;
  lastReward: number | null;

  // Mode
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;

  // UI hints / feedback
  hintCell: number | null;
  invalidCell: number | null;

  // App navigation
  appScreen: AppScreen;
  lastFinishedGame: GameHistoryItem | null;

  // Settings
  soundEnabled: boolean;
  timerEnabled: boolean;
  timerSeconds: number;
  colorTheme: ColorTheme;
  playerX: PlayerProfile;
  playerO: PlayerProfile;
}
