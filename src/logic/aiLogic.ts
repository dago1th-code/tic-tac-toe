import { Board, Player, AIDifficulty } from '../types/game';
import { checkWinner, checkDraw } from './gameLogic';

/**
 * Returns list of available empty cell indices.
 */
export function getAvailableMoves(board: Board): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

/**
 * Minimax recursive evaluation function.
 */
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player
): { score: number; bestMove?: number } {
  const winResult = checkWinner(board);

  if (winResult) {
    if (winResult.winner === aiPlayer) {
      return { score: 10 - depth };
    } else if (winResult.winner === humanPlayer) {
      return { score: depth - 10 };
    }
  }

  if (checkDraw(board, null)) {
    return { score: 0 };
  }

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const evaluation = minimax(board, depth + 1, false, aiPlayer, humanPlayer);
      board[move] = null;

      if (evaluation.score > maxScore) {
        maxScore = evaluation.score;
        bestMove = move;
      }
    }

    return { score: maxScore, bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = humanPlayer;
      const evaluation = minimax(board, depth + 1, true, aiPlayer, humanPlayer);
      board[move] = null;

      if (evaluation.score < minScore) {
        minScore = evaluation.score;
        bestMove = move;
      }
    }

    return { score: minScore, bestMove };
  }
}

/**
 * Computes AI move based on selected difficulty.
 */
export function getAIMove(
  board: Board,
  aiPlayer: Player = 'O',
  difficulty: AIDifficulty = 'hard'
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';

  // Easy: Purely random move
  if (difficulty === 'easy') {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // Medium: 60% optimal / tactical, 40% random
  if (difficulty === 'medium') {
    // 1. Check if AI can win in 1 move
    for (const move of availableMoves) {
      board[move] = aiPlayer;
      if (checkWinner(board)?.winner === aiPlayer) {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }

    // 2. Check if Human can win in 1 move and block it
    for (const move of availableMoves) {
      board[move] = humanPlayer;
      if (checkWinner(board)?.winner === humanPlayer) {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }

    // 3. Take center if available
    if (board[4] === null && Math.random() > 0.3) {
      return 4;
    }

    // 4. Random choice
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // Hard: Unbeatable Minimax
  const result = minimax(board, 0, true, aiPlayer, humanPlayer);
  return result.bestMove !== undefined ? result.bestMove : availableMoves[0];
}
