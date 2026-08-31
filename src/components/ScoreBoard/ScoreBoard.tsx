import React from 'react';
import { Player, Scores } from '../../types/game';
import styles from './ScoreBoard.module.css';

interface ScoreBoardProps {
  scores: Scores;
  currentPlayer: Player;
  isGameOver: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  currentPlayer,
  isGameOver,
}) => {
  const isXActive = !isGameOver && currentPlayer === 'X';
  const isOActive = !isGameOver && currentPlayer === 'O';

  return (
    <section className={styles.scoreContainer} aria-label="Game Scoreboard">
      {/* Player X Card */}
      <div
        className={`${styles.scoreCard} ${styles.cardX} ${
          isXActive ? styles.activeCard : ''
        }`}
      >
        <div className={styles.playerHeader}>
          <span className={styles.playerLabel}>Player X</span>
          {isXActive && <span className={styles.activeDot} title="Active turn" />}
        </div>
        <span className={styles.scoreValue} aria-label={`Player X has ${scores.X} wins`}>
          {scores.X}
        </span>
      </div>

      {/* Draws Card */}
      <div className={`${styles.scoreCard} ${styles.cardDraws}`}>
        <div className={styles.playerHeader}>
          <span className={styles.playerLabel}>Draws</span>
        </div>
        <span className={styles.scoreValue} aria-label={`${scores.draws} ties`}>
          {scores.draws}
        </span>
      </div>

      {/* Player O Card */}
      <div
        className={`${styles.scoreCard} ${styles.cardO} ${
          isOActive ? styles.activeCard : ''
        }`}
      >
        <div className={styles.playerHeader}>
          <span className={styles.playerLabel}>Player O</span>
          {isOActive && <span className={styles.activeDot} title="Active turn" />}
        </div>
        <span className={styles.scoreValue} aria-label={`Player O has ${scores.O} wins`}>
          {scores.O}
        </span>
      </div>
    </section>
  );
};

