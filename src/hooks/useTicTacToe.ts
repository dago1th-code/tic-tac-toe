import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, GameMode, AIDifficulty, Player } from '../types/game';
import {
  createInitialBoard,
  applyMove,
  resetBoardOnly,
  resetScoresOnly,
  clearHistoryOnly,
  resetBalanceOnly,
} from '../logic/gameLogic';
import { getAIMove } from '../logic/aiLogic';
import { soundEngine } from '../logic/soundEffects';
import confetti from 'canvas-confetti';

const HISTORY_STORAGE_KEY = 'dago_game_history';
const SCORES_STORAGE_KEY = 'dago_game_scores';
const WALLET_STORAGE_KEY = 'dago_wallet';

export function useTicTacToe() {
  const [gameState, setGameState] = useState<GameState>(() => {
    let savedHistory = [];
    let savedScores = { X: 0, O: 0, draws: 0 };
    let savedBalance = 0;
    if (typeof window !== 'undefined') {
      try {
        const histJson = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (histJson) savedHistory = JSON.parse(histJson);
        const scoresJson = localStorage.getItem(SCORES_STORAGE_KEY);
        if (scoresJson) savedScores = JSON.parse(scoresJson);
        const walletJson = localStorage.getItem(WALLET_STORAGE_KEY);
        if (walletJson) savedBalance = JSON.parse(walletJson);
      } catch {
        // storage fallback
      }
    }

    return {
      board: createInitialBoard(),
      currentPlayer: 'X',
      humanPlayer: 'X',
      winner: null,
      isDraw: false,
      winningCells: [],
      scores: savedScores,
      history: savedHistory,
      balance: savedBalance,
      streak: 0,
      lastReward: null,
      gameMode: 'pvp',
      aiDifficulty: 'medium',
      soundEnabled: true,
    };
  });

  const isAIMovingRef = useRef(false);

  // Sync scores, history, balance to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(gameState.history));
      localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(gameState.scores));
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(gameState.balance));
    } catch {
      // storage unavailable
    }
  }, [gameState.history, gameState.scores, gameState.balance]);

  // Confetti + sound on win/draw
  useEffect(() => {
    if (gameState.winner) {
      if (gameState.soundEnabled) {
        soundEngine.playWinSound();
        // Cash sound for rewards
        if (gameState.lastReward && gameState.lastReward > 0) {
          setTimeout(() => soundEngine.playCashSound(), 600);
        }
      }
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#38bdf8'],
        });
      } catch {
        // Fallback
      }
    } else if (gameState.isDraw && gameState.soundEnabled) {
      soundEngine.playDrawSound();
    }
  }, [gameState.winner, gameState.isDraw, gameState.soundEnabled, gameState.lastReward]);

  // AI turn effect — AI always plays as 'O'
  useEffect(() => {
    const isGameOver = gameState.winner !== null || gameState.isDraw;
    if (
      gameState.gameMode === 'ai' &&
      gameState.currentPlayer === 'O' &&
      !isGameOver &&
      !isAIMovingRef.current
    ) {
      isAIMovingRef.current = true;
      const timer = setTimeout(() => {
        const aiMove = getAIMove(
          [...gameState.board],
          'O',
          gameState.aiDifficulty
        );
        if (aiMove !== -1) {
          if (gameState.soundEnabled) {
            soundEngine.playMoveSound('O');
          }
          setGameState((prev) => applyMove(prev, aiMove));
        }
        isAIMovingRef.current = false;
      }, 450);

      return () => {
        clearTimeout(timer);
        isAIMovingRef.current = false;
      };
    }
  }, [
    gameState.gameMode,
    gameState.currentPlayer,
    gameState.winner,
    gameState.isDraw,
    gameState.board,
    gameState.aiDifficulty,
    gameState.soundEnabled,
  ]);

  const handleCellClick = useCallback(
    (index: number) => {
      // Prevent human clicking during AI thinking turn
      if (
        gameState.gameMode === 'ai' &&
        gameState.currentPlayer === 'O' &&
        !gameState.winner &&
        !gameState.isDraw
      ) {
        return;
      }

      if (gameState.board[index] === null && !gameState.winner && !gameState.isDraw) {
        if (gameState.soundEnabled) {
          soundEngine.playMoveSound(gameState.currentPlayer);
        }
        setGameState((prevState) => applyMove(prevState, index));
      }
    },
    [gameState.gameMode, gameState.currentPlayer, gameState.board, gameState.winner, gameState.isDraw, gameState.soundEnabled]
  );

  const startNewGame = useCallback(() => {
    if (gameState.soundEnabled) {
      soundEngine.playResetSound();
    }
    setGameState((prevState) => resetBoardOnly(prevState));
  }, [gameState.soundEnabled]);

  const resetScores = useCallback(() => {
    if (gameState.soundEnabled) {
      soundEngine.playResetSound();
    }
    setGameState((prevState) => resetScoresOnly(prevState));
  }, [gameState.soundEnabled]);

  const clearHistory = useCallback(() => {
    if (gameState.soundEnabled) {
      soundEngine.playResetSound();
    }
    setGameState((prevState) => clearHistoryOnly(prevState));
  }, [gameState.soundEnabled]);

  const resetBalance = useCallback(() => {
    setGameState((prevState) => resetBalanceOnly(prevState));
  }, []);

  const setGameMode = useCallback((mode: GameMode) => {
    setGameState((prev) => ({
      ...resetBoardOnly(prev),
      gameMode: mode,
    }));
  }, []);

  const setAIDifficulty = useCallback((difficulty: AIDifficulty) => {
    setGameState((prev) => ({
      ...prev,
      aiDifficulty: difficulty,
    }));
  }, []);

  const toggleSound = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  }, []);

  const setHumanPlayer = useCallback((player: Player) => {
    setGameState((prev) => ({
      ...resetBoardOnly(prev),
      humanPlayer: player,
    }));
  }, []);

  /** Called by timer when a turn expires — skip that player's turn */
  const forfeitTurn = useCallback(() => {
    setGameState((prev) => {
      if (prev.winner || prev.isDraw) return prev;
      // Switch to next player without making a move
      const next = prev.currentPlayer === 'X' ? 'O' : 'X';
      return { ...prev, currentPlayer: next };
    });
  }, []);

  return {
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    humanPlayer: gameState.humanPlayer,
    winner: gameState.winner,
    isDraw: gameState.isDraw,
    winningCells: gameState.winningCells,
    scores: gameState.scores,
    history: gameState.history,
    balance: gameState.balance,
    streak: gameState.streak,
    lastReward: gameState.lastReward,
    gameMode: gameState.gameMode,
    aiDifficulty: gameState.aiDifficulty,
    soundEnabled: gameState.soundEnabled,
    isGameOver: gameState.winner !== null || gameState.isDraw,
    handleCellClick,
    startNewGame,
    resetScores,
    clearHistory,
    resetBalance,
    setGameMode,
    setAIDifficulty,
    toggleSound,
    setHumanPlayer,
    forfeitTurn,
  };
}
