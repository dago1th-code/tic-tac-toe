import React from 'react';
import { Player } from '../../types/game';
import styles from './GameTimer.module.css';

interface GameTimerProps {
  secondsLeft: number;
  isRunning: boolean;
  isCritical: boolean;
  totalSeconds: number;
  currentPlayer: Player;
  isGameOver: boolean;
}

export const GameTimer: React.FC<GameTimerProps> = ({
  secondsLeft,
  isRunning,
  isCritical,
  totalSeconds,
  currentPlayer,
  isGameOver,
}) => {
  if (isGameOver || !isRunning) {
    return null;
  }

  const progress = (secondsLeft / totalSeconds) * 100;
  const dashOffset = 2 * Math.PI * 22 * (1 - progress / 100);

  return (
    <div
      className={`${styles.timerWrapper} ${isCritical ? styles.critical : ''}`}
      aria-label={`${secondsLeft} seconds remaining for ${currentPlayer} to move`}
      role="timer"
    >
      <div className={styles.svgWrap}>
        <svg width="58" height="58" viewBox="0 0 58 58">
          {/* Background track */}
          <circle
            cx="29"
            cy="29"
            r="22"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="4"
          />
          {/* Progress arc */}
          <circle
            cx="29"
            cy="29"
            r="22"
            fill="none"
            stroke={isCritical ? '#ef4444' : currentPlayer === 'X' ? '#ef4444' : '#3b82f6'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 22}`}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 29 29)"
            className={styles.progressArc}
          />
        </svg>

        <div className={`${styles.countdown} ${isCritical ? styles.countdownCritical : ''}`}>
          {secondsLeft}
        </div>
      </div>

      <div className={styles.timerLabel}>
        <span className={`${styles.playerDot} ${currentPlayer === 'X' ? styles.dotX : styles.dotO}`} />
        <span>{currentPlayer}'s turn</span>
      </div>
    </div>
  );
};

