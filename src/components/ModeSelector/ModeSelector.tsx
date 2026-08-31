import React from 'react';
import { GameMode, AIDifficulty } from '../../types/game';
import styles from './ModeSelector.module.css';

interface ModeSelectorProps {
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  soundEnabled: boolean;
  onSelectMode: (mode: GameMode) => void;
  onSelectDifficulty: (difficulty: AIDifficulty) => void;
  onToggleSound: () => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  gameMode,
  aiDifficulty,
  soundEnabled,
  onSelectMode,
  onSelectDifficulty,
  onToggleSound,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        {/* Mode Toggle Tabs */}
        <div className={styles.modeTabs} role="tablist" aria-label="Game Mode">
          <button
            type="button"
            role="tab"
            aria-selected={gameMode === 'pvp'}
            className={`${styles.tabBtn} ${gameMode === 'pvp' ? styles.tabActive : ''}`}
            onClick={() => onSelectMode('pvp')}
          >
            <span className={styles.tabIcon}>👥</span>
            <span>2 Players</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={gameMode === 'ai'}
            className={`${styles.tabBtn} ${gameMode === 'ai' ? styles.tabActive : ''}`}
            onClick={() => onSelectMode('ai')}
          >
            <span className={styles.tabIcon}>🤖</span>
            <span>vs Computer</span>
          </button>
        </div>

        {/* Sound Toggle Button */}
        <button
          type="button"
          className={`${styles.soundBtn} ${soundEnabled ? styles.soundOn : styles.soundOff}`}
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
        >
          {soundEnabled ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>
      </div>

      {/* Difficulty Selector if AI mode */}
      {gameMode === 'ai' && (
        <div className={styles.difficultyRow} role="group" aria-label="AI Difficulty">
          <span className={styles.diffLabel}>AI Level:</span>
          {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((diff) => (
            <button
              key={diff}
              type="button"
              className={`${styles.diffBtn} ${
                aiDifficulty === diff ? styles.diffActive : ''
              }`}
              onClick={() => onSelectDifficulty(diff)}
            >
              {diff === 'easy' && '🌱 Easy'}
              {diff === 'medium' && '⚡ Medium'}
              {diff === 'hard' && '🔥 Unbeatable'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
