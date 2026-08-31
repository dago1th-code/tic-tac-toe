import React, { useCallback, useEffect } from 'react';
import { useTicTacToe } from './hooks/useTicTacToe';
import { useTheme } from './hooks/useTheme';
import { useGameTimer, DEFAULT_TURN_SECONDS } from './hooks/useGameTimer';
import { Header } from './components/Header/Header';
import { ModeSelector } from './components/ModeSelector/ModeSelector';
import { GameStatus } from './components/GameStatus/GameStatus';
import { Board } from './components/Board/Board';
import { ScoreBoard } from './components/ScoreBoard/ScoreBoard';
import { GameHistory } from './components/GameHistory/GameHistory';
import { PlayerChoice } from './components/PlayerChoice/PlayerChoice';
import { RewardWallet } from './components/RewardWallet/RewardWallet';
import { GameTimer } from './components/GameTimer/GameTimer';
import { Button } from './components/Button/Button';
import styles from './App.module.css';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    board,
    currentPlayer,
    humanPlayer,
    winner,
    isDraw,
    winningCells,
    scores,
    history,
    balance,
    streak,
    lastReward,
    gameMode,
    aiDifficulty,
    soundEnabled,
    isGameOver,
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
  } = useTicTacToe();

  // Timer only relevant in AI mode (human's turn) or PvP always
  const isTimerActive =
    !isGameOver &&
    (gameMode === 'pvp' || (gameMode === 'ai' && currentPlayer === humanPlayer));

  const handleTimeout = useCallback(() => {
    if (!isGameOver) forfeitTurn();
  }, [isGameOver, forfeitTurn]);

  const {
    secondsLeft,
    isRunning,
    isCritical,
    resetTimer,
    stopTimer,
  } = useGameTimer(DEFAULT_TURN_SECONDS, handleTimeout, isTimerActive);

  // Reset timer whenever the current player changes or game resets
  useEffect(() => {
    if (isGameOver) {
      stopTimer();
    } else if (isTimerActive) {
      resetTimer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer, isGameOver]);

  return (
    <div className={styles.appContainer}>
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className={styles.mainCard}>
        <ModeSelector
          gameMode={gameMode}
          aiDifficulty={aiDifficulty}
          soundEnabled={soundEnabled}
          onSelectMode={setGameMode}
          onSelectDifficulty={setAIDifficulty}
          onToggleSound={toggleSound}
        />

        {/* Player symbol choice (only meaningful in AI mode) */}
        {gameMode === 'ai' && (
          <PlayerChoice
            humanPlayer={humanPlayer}
            onSelectSide={setHumanPlayer}
            disabled={isGameOver === false && board.some((c) => c !== null)}
          />
        )}

        <GameStatus
          currentPlayer={currentPlayer}
          winner={winner}
          isDraw={isDraw}
        />

        {/* Turn countdown timer */}
        <GameTimer
          secondsLeft={secondsLeft}
          isRunning={isRunning}
          isCritical={isCritical}
          totalSeconds={DEFAULT_TURN_SECONDS}
          currentPlayer={currentPlayer}
          isGameOver={isGameOver}
        />

        <Board
          board={board}
          winningCells={winningCells}
          isGameOver={isGameOver}
          onCellClick={handleCellClick}
        />

        <ScoreBoard
          scores={scores}
          currentPlayer={currentPlayer}
          isGameOver={isGameOver}
        />

        {/* Dollar Reward Wallet */}
        <RewardWallet
          balance={balance}
          streak={streak}
          lastReward={lastReward}
          onResetBalance={resetBalance}
        />

        <div className={styles.actionControls}>
          <Button
            variant="primary"
            size="md"
            onClick={startNewGame}
            aria-label="Start a new round"
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            }
          >
            New Game
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={resetScores}
            aria-label="Reset all player scores to zero"
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            }
          >
            Reset Scores
          </Button>
        </div>

        <GameHistory history={history} onClearHistory={clearHistory} />
      </main>

      <footer className={styles.footer}>
        <p>© 2026 DAGO • Crafted with React &amp; Gradient Blue-Purple Identity</p>
      </footer>
    </div>
  );
};

export default App;
