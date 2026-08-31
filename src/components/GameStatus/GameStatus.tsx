import React from 'react';
import { Player } from '../../types/game';
import styles from './GameStatus.module.css';

interface GameStatusProps {
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  currentPlayer,
  winner,
  isDraw,
}) => {
  let statusText = '';
  let statusClass = styles.turn;
  let statusBadge = null;

  if (winner) {
    statusText = `Player ${winner} Wins!`;
    statusClass = styles.win;
    statusBadge = (
      <span className={styles.badgeWin} aria-hidden="true">
        🏆
      </span>
    );
  } else if (isDraw) {
    statusText = "It's a Draw!";
    statusClass = styles.draw;
    statusBadge = (
      <span className={styles.badgeDraw} aria-hidden="true">
        🤝
      </span>
    );
  } else {
    statusText = `Player ${currentPlayer}'s Turn`;
    statusClass = currentPlayer === 'X' ? styles.turnX : styles.turnO;
    statusBadge = (
      <span
        className={`${styles.playerMarkBadge} ${
          currentPlayer === 'X' ? styles.markX : styles.markO
        }`}
        aria-hidden="true"
      >
        {currentPlayer}
      </span>
    );
  }

  return (
    <div
      className={`${styles.container} ${statusClass}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {statusBadge}
      <span className={styles.statusMessage}>{statusText}</span>
    </div>
  );
};

