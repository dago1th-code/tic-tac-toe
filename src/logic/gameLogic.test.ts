import { describe, it, expect } from 'vitest';
import {
  checkWinner,
  checkDraw,
  getNextPlayer,
  isValidMove,
  createInitialBoard,
  createInitialGameState,
  applyMove,
  resetBoardOnly,
  resetScoresOnly,
  clearHistoryOnly,
  WINNING_COMBINATIONS,
} from './gameLogic';
import { Board } from '../types/game';

describe('gameLogic Engine', () => {
  it('should define exactly 8 winning combinations', () => {
    expect(WINNING_COMBINATIONS).toHaveLength(8);
  });

  it('should initialize empty board with 9 null cells', () => {
    const board = createInitialBoard();
    expect(board).toHaveLength(9);
    expect(board.every((cell) => cell === null)).toBe(true);
  });

  it('should switch players correctly', () => {
    expect(getNextPlayer('X')).toBe('O');
    expect(getNextPlayer('O')).toBe('X');
  });

  describe('checkWinner', () => {
    it('should return null when board is empty', () => {
      const board = createInitialBoard();
      expect(checkWinner(board)).toBeNull();
    });

    it('should detect top row win [0, 1, 2]', () => {
      const board: Board = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
      const result = checkWinner(board);
      expect(result).toEqual({ winner: 'X', winningCells: [0, 1, 2] });
    });

    it('should detect middle row win [3, 4, 5]', () => {
      const board: Board = ['X', 'O', 'X', 'O', 'O', 'O', 'X', null, null];
      const result = checkWinner(board);
      expect(result).toEqual({ winner: 'O', winningCells: [3, 4, 5] });
    });

    it('should detect bottom row win [6, 7, 8]', () => {
      const board: Board = [null, 'O', 'O', 'O', 'X', null, 'X', 'X', 'X'];
      const result = checkWinner(board);
      expect(result).toEqual({ winner: 'X', winningCells: [6, 7, 8] });
    });

    it('should detect vertical columns wins', () => {
      // Column 0
      const col0: Board = ['X', 'O', null, 'X', 'O', null, 'X', null, null];
      expect(checkWinner(col0)).toEqual({ winner: 'X', winningCells: [0, 3, 6] });

      // Column 1
      const col1: Board = ['X', 'O', 'X', null, 'O', null, null, 'O', null];
      expect(checkWinner(col1)).toEqual({ winner: 'O', winningCells: [1, 4, 7] });

      // Column 2
      const col2: Board = ['O', 'X', 'X', null, 'O', 'X', null, null, 'X'];
      expect(checkWinner(col2)).toEqual({ winner: 'X', winningCells: [2, 5, 8] });
    });

    it('should detect diagonal wins', () => {
      // Diagonal [0, 4, 8]
      const diag1: Board = ['X', 'O', null, 'O', 'X', null, null, null, 'X'];
      expect(checkWinner(diag1)).toEqual({ winner: 'X', winningCells: [0, 4, 8] });

      // Diagonal [2, 4, 6]
      const diag2: Board = ['X', 'X', 'O', null, 'O', null, 'O', null, null];
      expect(checkWinner(diag2)).toEqual({ winner: 'O', winningCells: [2, 4, 6] });
    });
  });

  describe('checkDraw', () => {
    it('should return false for empty or in-progress board', () => {
      const board = createInitialBoard();
      expect(checkDraw(board, null)).toBe(false);
    });

    it('should return false if there is a winner even if board is full', () => {
      const fullWinBoard: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'X', 'X', 'O'];
      expect(checkDraw(fullWinBoard, 'X')).toBe(false);
    });

    it('should return true for a complete draw board', () => {
      const drawBoard: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      expect(checkWinner(drawBoard)).toBeNull();
      expect(checkDraw(drawBoard, null)).toBe(true);
    });
  });

  describe('isValidMove', () => {
    it('should allow valid moves on empty cells when game is active', () => {
      const board = createInitialBoard();
      expect(isValidMove(board, 0, false)).toBe(true);
      expect(isValidMove(board, 8, false)).toBe(true);
    });

    it('should reject moves on already occupied cells', () => {
      const board: Board = ['X', null, null, null, null, null, null, null, null];
      expect(isValidMove(board, 0, false)).toBe(false);
    });

    it('should reject moves when game is already over', () => {
      const board = createInitialBoard();
      expect(isValidMove(board, 1, true)).toBe(false);
    });

    it('should reject out-of-bounds indices', () => {
      const board = createInitialBoard();
      expect(isValidMove(board, -1, false)).toBe(false);
      expect(isValidMove(board, 9, false)).toBe(false);
    });
  });

  describe('applyMove state transitions', () => {
    it('should update cell mark and switch turn to O', () => {
      let state = createInitialGameState();
      state = applyMove(state, 0);

      expect(state.board[0]).toBe('X');
      expect(state.currentPlayer).toBe('O');
      expect(state.winner).toBeNull();
      expect(state.isDraw).toBe(false);
    });

    it('should ignore duplicate click on same cell without switching player', () => {
      let state = createInitialGameState();
      state = applyMove(state, 0);
      const afterFirstMove = { ...state };
      state = applyMove(state, 0);

      expect(state).toEqual(afterFirstMove);
      expect(state.currentPlayer).toBe('O');
    });

    it('should declare winner, increment X score, and log history on 3-in-a-row', () => {
      let state = createInitialGameState();
      // X: 0, O: 3, X: 1, O: 4, X: 2 (X wins row 0)
      state = applyMove(state, 0); // X
      state = applyMove(state, 3); // O
      state = applyMove(state, 1); // X
      state = applyMove(state, 4); // O
      state = applyMove(state, 2); // X

      expect(state.winner).toBe('X');
      expect(state.winningCells).toEqual([0, 1, 2]);
      expect(state.isDraw).toBe(false);
      expect(state.scores.X).toBe(1);
      expect(state.scores.O).toBe(0);
      expect(state.scores.draws).toBe(0);

      // Verify history
      expect(state.history).toHaveLength(1);
      expect(state.history[0].winner).toBe('X');
      expect(state.history[0].roundNumber).toBe(1);
      expect(state.history[0].totalMoves).toBe(5);

      // Subsequent moves should be ignored
      const stateAfterWin = applyMove(state, 8);
      expect(stateAfterWin.board[8]).toBeNull();
    });

    it('should increment draws and log history when board fills with no winner', () => {
      let state = createInitialGameState();
      // Moves: 0(X), 1(O), 2(X), 4(O), 3(X), 5(O), 7(X), 6(O), 8(X)
      const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
      for (const idx of moves) {
        state = applyMove(state, idx);
      }

      expect(state.winner).toBeNull();
      expect(state.isDraw).toBe(true);
      expect(state.scores.draws).toBe(1);
      expect(state.scores.X).toBe(0);
      expect(state.scores.O).toBe(0);

      expect(state.history).toHaveLength(1);
      expect(state.history[0].winner).toBe('Draw');
      expect(state.history[0].totalMoves).toBe(9);
    });

    it('should reset board while preserving scores and history with resetBoardOnly', () => {
      let state = createInitialGameState();
      state.scores.X = 3;
      state.scores.O = 2;
      state.scores.draws = 1;
      state.board[0] = 'X';
      state.winner = 'X';
      state.history = [
        {
          id: 'test-1',
          roundNumber: 1,
          winner: 'X',
          totalMoves: 5,
          timestamp: Date.now(),
          gameMode: 'pvp',
        },
      ];

      const resetState = resetBoardOnly(state);
      expect(resetState.board.every((c) => c === null)).toBe(true);
      expect(resetState.winner).toBeNull();
      expect(resetState.currentPlayer).toBe('X');
      expect(resetState.scores).toEqual({ X: 3, O: 2, draws: 1 });
      expect(resetState.history).toHaveLength(1);
    });

    it('should reset scores with resetScoresOnly', () => {
      let state = createInitialGameState();
      state.scores.X = 5;
      state.scores.O = 4;
      state.scores.draws = 2;

      const resetState = resetScoresOnly(state);
      expect(resetState.scores).toEqual({ X: 0, O: 0, draws: 0 });
    });

    it('should clear history with clearHistoryOnly', () => {
      let state = createInitialGameState();
      state.history = [
        {
          id: 'test-1',
          roundNumber: 1,
          winner: 'X',
          totalMoves: 5,
          timestamp: Date.now(),
          gameMode: 'pvp',
        },
      ];

      const clearedState = clearHistoryOnly(state);
      expect(clearedState.history).toEqual([]);
    });
  });
});
