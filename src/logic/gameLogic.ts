import {
  Board,
  CellValue,
  GameState,
  Player,
  Scores,
  GameHistoryItem,
  GameMode,
  AIDifficulty,
} from '../types/game';

export const WINNING_COMBINATIONS: readonly [number, number, number][] = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

export interface WinnerResult {
  winner: Player;
  winningCells: number[];
}

/**
 * Checks if the current board has a winning combination.
 */
export function checkWinner(board: Board): WinnerResult | null {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    const cellA = board[a];
    const cellB = board[b];
    const cellC = board[c];

    if (cellA !== null && cellA === cellB && cellA === cellC) {
      return {
        winner: cellA,
        winningCells: [a, b, c],
      };
    }
  }

  return null;
}

/**
 * Checks if the current board is full without a winner (Draw).
 */
export function checkDraw(board: Board, winner: Player | null): boolean {
  if (winner !== null) {
    return false;
  }
  return board.every((cell) => cell !== null);
}

/**
 * Gets the next player turn.
 */
export function getNextPlayer(current: Player): Player {
  return current === 'X' ? 'O' : 'X';
}

/**
 * Checks if a move at the specified index is valid.
 */
export function isValidMove(board: Board, index: number, isGameOver: boolean): boolean {
  if (isGameOver) {
    return false;
  }
  if (index < 0 || index >= board.length) {
    return false;
  }
  return board[index] === null;
}

/**
 * Creates an empty 3x3 board.
 */
export function createInitialBoard(): Board {
  return Array<CellValue>(9).fill(null);
}

/**
 * Calculates dollar reward based on match outcome, difficulty, and winning streak.
 */
export function calculateReward(
  winner: Player | null,
  isDraw: boolean,
  gameMode: GameMode,
  aiDifficulty: AIDifficulty,
  humanPlayer: Player,
  currentStreak: number
): { reward: number; newStreak: number } {
  if (isDraw) {
    return { reward: 2.0, newStreak: 0 };
  }

  if (!winner) {
    return { reward: 0, newStreak: currentStreak };
  }

  if (gameMode === 'pvp') {
    // 2-Player local match reward
    const streakBonus = currentStreak >= 2 ? 10.0 : 0;
    return { reward: 10.0 + streakBonus, newStreak: currentStreak + 1 };
  }

  // AI mode: check if human won
  if (winner === humanPlayer) {
    let baseReward = 5.0;
    if (aiDifficulty === 'medium') baseReward = 15.0;
    if (aiDifficulty === 'hard') baseReward = 50.0;

    const streakBonus = currentStreak >= 2 ? 10.0 : 0;
    return { reward: baseReward + streakBonus, newStreak: currentStreak + 1 };
  } else {
    // AI won against human
    return { reward: 0, newStreak: 0 };
  }
}

/**
 * Creates the initial clean game state.
 */
export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    currentPlayer: 'X',
    humanPlayer: 'X',
    winner: null,
    isDraw: false,
    winningCells: [],
    scores: {
      X: 0,
      O: 0,
      draws: 0,
    },
    history: [],
    balance: 0,
    streak: 0,
    lastReward: null,
    gameMode: 'pvp',
    aiDifficulty: 'medium',
    soundEnabled: true,
  };
}

/**
 * Pure state reducer / transition for making a move.
 */
export function applyMove(currentState: GameState, index: number): GameState {
  const isGameOver = currentState.winner !== null || currentState.isDraw;

  if (!isValidMove(currentState.board, index, isGameOver)) {
    return currentState;
  }

  // Clone board and set player mark
  const newBoard: Board = [...currentState.board];
  newBoard[index] = currentState.currentPlayer;

  const winResult = checkWinner(newBoard);
  const isDraw = checkDraw(newBoard, winResult ? winResult.winner : null);

  const updatedScores: Scores = { ...currentState.scores };
  let updatedHistory: GameHistoryItem[] = currentState.history;
  let newBalance = currentState.balance;
  let newStreak = currentState.streak;
  let earnedReward: number | null = null;

  if (winResult) {
    updatedScores[winResult.winner] += 1;
    const movesCount = newBoard.filter((c) => c !== null).length;

    const rewardResult = calculateReward(
      winResult.winner,
      false,
      currentState.gameMode,
      currentState.aiDifficulty,
      currentState.humanPlayer,
      currentState.streak
    );

    newBalance += rewardResult.reward;
    newStreak = rewardResult.newStreak;
    earnedReward = rewardResult.reward;

    const newHistoryItem: GameHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      roundNumber: currentState.history.length + 1,
      winner: winResult.winner,
      totalMoves: movesCount,
      winningCells: winResult.winningCells,
      timestamp: Date.now(),
      gameMode: currentState.gameMode,
      aiDifficulty: currentState.gameMode === 'ai' ? currentState.aiDifficulty : undefined,
      rewardEarned: rewardResult.reward,
    };
    updatedHistory = [newHistoryItem, ...currentState.history];
  } else if (isDraw) {
    updatedScores.draws += 1;
    const movesCount = newBoard.filter((c) => c !== null).length;

    const rewardResult = calculateReward(
      null,
      true,
      currentState.gameMode,
      currentState.aiDifficulty,
      currentState.humanPlayer,
      currentState.streak
    );

    newBalance += rewardResult.reward;
    newStreak = rewardResult.newStreak;
    earnedReward = rewardResult.reward;

    const newHistoryItem: GameHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      roundNumber: currentState.history.length + 1,
      winner: 'Draw',
      totalMoves: movesCount,
      timestamp: Date.now(),
      gameMode: currentState.gameMode,
      aiDifficulty: currentState.gameMode === 'ai' ? currentState.aiDifficulty : undefined,
      rewardEarned: rewardResult.reward,
    };
    updatedHistory = [newHistoryItem, ...currentState.history];
  }

  return {
    ...currentState,
    board: newBoard,
    currentPlayer: winResult || isDraw ? currentState.currentPlayer : getNextPlayer(currentState.currentPlayer),
    winner: winResult ? winResult.winner : null,
    winningCells: winResult ? winResult.winningCells : [],
    isDraw,
    scores: updatedScores,
    history: updatedHistory,
    balance: newBalance,
    streak: newStreak,
    lastReward: earnedReward,
  };
}

/**
 * Resets the board for a new game while preserving scores, balance, and history.
 */
export function resetBoardOnly(currentState: GameState): GameState {
  return {
    ...currentState,
    board: createInitialBoard(),
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
    winningCells: [],
    lastReward: null,
  };
}

/**
 * Resets all scores back to zero.
 */
export function resetScoresOnly(currentState: GameState): GameState {
  return {
    ...currentState,
    scores: {
      X: 0,
      O: 0,
      draws: 0,
    },
  };
}

/**
 * Clears the recorded game history.
 */
export function clearHistoryOnly(currentState: GameState): GameState {
  return {
    ...currentState,
    history: [],
  };
}

/**
 * Resets wallet earnings balance to zero.
 */
export function resetBalanceOnly(currentState: GameState): GameState {
  return {
    ...currentState,
    balance: 0,
    streak: 0,
    lastReward: null,
  };
}
