import React from 'react';
import styles from './RewardWallet.module.css';

interface RewardWalletProps {
  balance: number;
  streak: number;
  lastReward: number | null;
  onResetBalance: () => void;
}

export const RewardWallet: React.FC<RewardWalletProps> = ({
  balance,
  streak,
  lastReward,
  onResetBalance,
}) => {
  return (
    <div className={styles.walletCard} aria-label="Player Earnings Wallet">
      <div className={styles.walletLeft}>
        <div className={styles.iconCircle}>
          <span className={styles.cashIcon}>💵</span>
        </div>
        <div className={styles.balanceInfo}>
          <span className={styles.walletLabel}>Prize Bank</span>
          <div className={styles.balanceRow}>
            <span className={styles.balanceValue}>
              ${balance.toFixed(2)}
            </span>
            {lastReward !== null && lastReward > 0 && (
              <span className={styles.rewardPopup}>
                +${lastReward.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.walletRight}>
        {streak > 1 && (
          <div className={styles.streakBadge} title={`${streak} consecutive wins!`}>
            <span>🔥</span>
            <span>{streak}x Streak</span>
          </div>
        )}

        {balance > 0 && (
          <button
            type="button"
            className={styles.resetBtn}
            onClick={onResetBalance}
            title="Reset prize balance"
            aria-label="Reset prize balance"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
