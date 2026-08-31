import React from 'react';
import { Board as BoardType } from '../../types/game';
import { Cell } from '../Cell/Cell';
import styles from './Board.module.css';

interface BoardProps {
  board: BoardType;
  winningCells: number[];
  isGameOver: boolean;
  onCellClick: (index: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  winningCells,
  isGameOver,
  onCellClick,
}) => {
  return (
    <div className={styles.boardWrapper}>
      <div
        className={styles.boardGrid}
        role="grid"
        aria-label="Tic Tac Toe 3 by 3 game board"
      >
        {board.map((cellValue, index) => (
          <Cell
            key={index}
            index={index}
            value={cellValue}
            isWinningCell={winningCells.includes(index)}
            disabled={isGameOver}
            onClick={() => onCellClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

