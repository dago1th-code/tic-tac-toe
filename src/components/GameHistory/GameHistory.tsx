import React, { useState } from 'react';
import { GameHistoryItem } from '../../types/game';
import styles from './GameHistory.module.css';

interface GameHistoryProps {
  history: GameHistoryItem[];
  onClearHistory: () => void;
}

export const GameHistory: React.FC<GameHistoryProps> = ({
  history,
  onClearHistory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalGames = history.length;
  const xWins = history.filter((h) => h.winner === 'X').length;
  const oWins = history.filter((h) => h.winner === 'O').length;
  const draws = history.filter((h) => h.winner === 'Draw').length;

  const xWinRate = totalGames > 0 ? Math.round((xWins / totalGames) * 100) : 0;
  const oWinRate = totalGames > 0 ? Math.round((oWins / totalGames) * 100) : 0;

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <section className={styles.container} aria-label="Match History and Stats">
      {/* Collapsible Header Bar */}
      <div className={styles.headerBar}>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="history-drawer"
        >
          <div className={styles.toggleTitle}>
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Match History</span>
            <span className={styles.countBadge}>{totalGames}</span>
          </div>

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Drawer Content */}
      {isOpen && (
        <div id="history-drawer" className={styles.drawer}>
          {totalGames > 0 ? (
            <>
              {/* Quick Analytics Summary */}
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>X Win Rate</span>
                  <span className={`${styles.statNum} ${styles.numX}`}>{xWinRate}%</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>O Win Rate</span>
                  <span className={`${styles.statNum} ${styles.numO}`}>{oWinRate}%</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Draws</span>
                  <span className={styles.statNum}>{draws}</span>
                </div>
              </div>

              {/* Chronological Games List */}
              <div className={styles.historyList} role="feed" aria-label="Previous Rounds">
                {history.map((item) => (
                  <article key={item.id} className={styles.historyCard}>
                    <div className={styles.cardLeft}>
                      <span className={styles.roundNum}>Round #{item.roundNumber}</span>
                      <div className={styles.winnerBadge}>
                        {item.winner === 'X' && (
                          <span className={styles.winX}>🏆 Player X Won</span>
                        )}
                        {item.winner === 'O' && (
                          <span className={styles.winO}>🏆 Player O Won</span>
                        )}
                        {item.winner === 'Draw' && (
                          <span className={styles.winDraw}>🤝 Draw</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.cardRight}>
                      <div className={styles.tagsRow}>
                        <span className={styles.modeTag}>
                          {item.gameMode === 'ai'
                            ? `🤖 AI (${item.aiDifficulty || 'med'})`
                            : '👥 2-Player'}
                        </span>
                        <span className={styles.movesTag}>{item.totalMoves} moves</span>
                      </div>
                      <span className={styles.timeTag}>{formatTime(item.timestamp)}</span>
                    </div>
                  </article>
                ))}
              </div>

              {/* Clear History Button */}
              <div className={styles.actionsRow}>
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={onClearHistory}
                  aria-label="Clear all match history"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span>Clear History</span>
                </button>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🎮</span>
              <p className={styles.emptyTitle}>No match history yet</p>
              <p className={styles.emptySub}>Play a round to track scores, win rates, and moves!</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

