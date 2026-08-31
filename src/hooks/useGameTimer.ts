import { useState, useEffect, useCallback, useRef } from 'react';

export const DEFAULT_TURN_SECONDS = 15;

export interface UseGameTimerReturn {
  secondsLeft: number;
  isRunning: boolean;
  isCritical: boolean; // <= 5 seconds
  startTimer: () => void;
  resetTimer: () => void;
  stopTimer: () => void;
}

/**
 * Per-turn countdown timer hook.
 * Counts down from `turnSeconds` to 0 and calls `onTimeout` when it expires.
 */
export function useGameTimer(
  turnSeconds: number,
  onTimeout: () => void,
  enabled: boolean
): UseGameTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState(turnSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const onTimeoutRef = useRef(onTimeout);

  // Keep the callback ref current without re-triggering effects
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Countdown tick
  useEffect(() => {
    if (!isRunning || !enabled) return;

    if (secondsLeft <= 0) {
      setIsRunning(false);
      onTimeoutRef.current();
      return;
    }

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setIsRunning(false);
          onTimeoutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, secondsLeft, enabled]);

  const startTimer = useCallback(() => {
    setSecondsLeft(turnSeconds);
    setIsRunning(true);
  }, [turnSeconds]);

  const resetTimer = useCallback(() => {
    setSecondsLeft(turnSeconds);
    setIsRunning(true);
  }, [turnSeconds]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(turnSeconds);
  }, [turnSeconds]);

  return {
    secondsLeft,
    isRunning,
    isCritical: secondsLeft <= 5 && isRunning,
    startTimer,
    resetTimer,
    stopTimer,
  };
}

