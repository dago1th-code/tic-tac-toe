import React from 'react';
import { CellValue } from '../../types/game';
import styles from './Cell.module.css';

interface CellProps {
  value: CellValue;
  index: number;
  isWinningCell: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({
  value,
  index,
  isWinningCell,
  disabled,
  onClick,
}) => {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const stateDescription = value ? `Player ${value}` : 'empty';
  const ariaLabel = `Row ${row}, Column ${col}, ${stateDescription}`;

  const cellClasses = [
    styles.cell,
    value === 'X' ? styles.cellX : '',
    value === 'O' ? styles.cellO : '',
    isWinningCell ? styles.winningCell : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={cellClasses}
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {value === 'X' && (
        <span className={styles.mark} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.markSvg}
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      )}
      {value === 'O' && (
        <span className={styles.mark} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.markSvg}
          >
            <circle cx="12" cy="12" r="8" />
          </svg>
        </span>
      )}
    </button>
  );
};

