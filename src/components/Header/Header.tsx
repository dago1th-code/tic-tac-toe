import React from 'react';
import { ThemeMode } from '../../types/game';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import styles from './Header.module.css';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.brandBadge}>
          <span className={styles.brandDot} aria-hidden="true" />
          <span className={styles.brandName}>DAGO</span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <h1 className={styles.title}>
        <span className={styles.gradientText}>TIC TAC TOE</span>
      </h1>
      <p className={styles.subtitle}>Modern strategy game with dynamic AI & sound effects</p>
    </header>
  );
};
