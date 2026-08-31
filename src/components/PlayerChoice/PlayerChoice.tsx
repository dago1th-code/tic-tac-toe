import React, { useEffect } from 'react';
import { Player } from '../../types/game';
import styles from './PlayerChoice.module.css';

interface PlayerChoiceProps {
  humanPlayer: Player;
  onSelectSide: (side: Player) => void;
  disabled?: boolean;
}

export const PlayerChoice: React.FC<PlayerChoiceProps> = ({
  humanPlayer,
  onSelectSide,
  disabled = false,
}) => {
  // Listen for keyboard 'x' or 'o' keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const key = e.key.toUpperCase();
      if (key === 'X' && humanPlayer !== 'X') {
        onSelectSide('X');
      } else if (key === 'O' && humanPlayer !== 'O') {
        onSelectSide('O');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [humanPlayer, onSelectSide, disabled]);

  return (
    <div className={styles.container} role="group" aria-label="Choose Player Symbol">
      <span className={styles.label}>Your Symbol:</span>
      <div className={styles.choiceGroup}>
        <button
          type="button"
          className={`${styles.choiceBtn} ${styles.btnX} ${
            humanPlayer === 'X' ? styles.activeX : ''
          }`}
          onClick={() => onSelectSide('X')}
          aria-pressed={humanPlayer === 'X'}
          title="Play as X (Goes first - Press 'X' key)"
        >
          <span className={styles.symbolIcon}>❌</span>
          <span className={styles.btnText}>Play as X</span>
          <span className={styles.keyHint}>[X]</span>
        </button>

        <button
          type="button"
          className={`${styles.choiceBtn} ${styles.btnO} ${
            humanPlayer === 'O' ? styles.activeO : ''
          }`}
          onClick={() => onSelectSide('O')}
          aria-pressed={humanPlayer === 'O'}
          title="Play as O (Goes second - Press 'O' key)"
        >
          <span className={styles.symbolIcon}>⭕</span>
          <span className={styles.btnText}>Play as O</span>
          <span className={styles.keyHint}>[O]</span>
        </button>
      </div>
    </div>
  );
};
