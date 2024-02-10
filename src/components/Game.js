import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/game.css';

function Game() {
    const { difficulty } = useParams();
    const [board, setBoard] = useState([]);
    const [timer, setTimer] = useState(0);
    const [minesLeft, setMinesLeft] = useState(0);
    const [isGameOver, setGameOver] = useState(false);
    const navigate = useNavigate();
    const timerRef = useRef(null);

    const initializeBoard = (rows, cols, mines) => {
        const emptyBoard = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => ({
                isRevealed: false,
                isMine: false,
                isFlagged: false,
                neighborMines: 0,
            }))
        );

        for (let i = 0; i < mines; i++) {
            let randomRow, randomCol;
            do {
                randomRow = Math.floor(Math.random() * rows);
                randomCol = Math.floor(Math.random() * cols);
            } while (emptyBoard[randomRow][randomCol].isMine);
            emptyBoard[randomRow][randomCol].isMine = true;
        }

        setBoard(emptyBoard);
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
    };

    const revealCell = (row, col) => {
        if (isGameOver || board[row]?.[col]?.isRevealed || board[row]?.[col]?.isFlagged) {
            return;
        }

        const updatedBoard = [...board];
        updatedBoard[row][col].isRevealed = true;

        if (!updatedBoard[row][col].isMine) {
            let minesAround = 0;

            for (let i = row - 1; i <= row + 1; i++) {
                for (let j = col - 1; j <= col + 1; j++) {
                    if (i >= 0 && i < updatedBoard.length && j >= 0 && j < updatedBoard[0].length) {
                        if (updatedBoard[i][j].isMine) {
                            minesAround++;
                        }
                    }
                }
            }

            updatedBoard[row][col].neighborMines = minesAround;

            if (minesAround === 0) {
                for (let i = row - 1; i <= row + 1; i++) {
                    for (let j = col - 1; j <= col + 1; j++) {
                        if (i >= 0 && i < updatedBoard.length && j >= 0 && j < updatedBoard[0].length) {
                            revealCell(i, j);
                        }
                    }
                }
            }
        }

        setBoard(updatedBoard);

        if (updatedBoard[row][col].isMine) {
            endGame(false);
        }

        if (checkWinCondition(updatedBoard)) {
            endGame(true);
        }
    };

    const flagCell = (row, col) => {
        if (isGameOver || board[row]?.[col]?.isRevealed) {
            return;
        }

        const updatedBoard = [...board];
        updatedBoard[row][col].isFlagged = !updatedBoard[row][col].isFlagged;

        setBoard(updatedBoard);

        if (checkWinCondition(updatedBoard)) {
            endGame(true);
        }
    };

    const checkWinCondition = (currentBoard) => {
        if (!Array.isArray(currentBoard)) {
            return false;
        }

        const rows = currentBoard.length;
        const cols = currentBoard[0]?.length;

        if (!cols) {
            return false;
        }

        const totalMines = currentBoard.reduce((acc, row) =>
            acc + row.filter(cell => cell.isMine).length, 0);

        const flaggedCells = currentBoard.reduce((acc, row) =>
            acc + row.filter(cell => cell.isFlagged).length, 0);

        const revealedCells = currentBoard.reduce((acc, row) =>
            acc + row.filter(cell => cell.isRevealed).length, 0);

        return flaggedCells === totalMines && flaggedCells + revealedCells === rows * cols;
    };

    const getCellClass = (cell) => {
        let cellClass = '';

        if (cell?.isRevealed) {
            cellClass = 'revealed';

            if (cell?.neighborMines > 0) {
                switch (cell.neighborMines) {
                    case 1:
                        cellClass += ' blue';
                        break;
                    case 2:
                        cellClass += ' green';
                        break;
                    case 3:
                        cellClass += ' red';
                        break;
                    case 4:
                        cellClass += ' dark-blue';
                        break;
                    case 5:
                        cellClass += ' brown';
                        break;
                    case 6:
                        cellClass += ' cyan';
                        break;
                    case 7:
                        cellClass += ' black';
                        break;
                    case 8:
                        cellClass += ' white';
                        break;
                    default:
                        break;
                }
            }
        } else if (cell?.isFlagged) {
            cellClass = 'flagged';
        }

        return cellClass;
    };

    const getCellContent = (cell) => {
        if (cell?.isRevealed && cell?.isMine) {
            return '💣';
        } else if (cell?.isFlagged) {
            return '🚩';
        } else if (cell?.isRevealed && cell?.neighborMines > 0) {
            return cell.neighborMines.toString();
        } else {
            return '';
        }
    };

    const restartGame = () => {
        clearInterval(timerRef.current);
        initializeGame(difficulty);
        startTimer();
    };

    const endGame = (isVictory) => {
        clearInterval(timerRef.current);
        setGameOver(true);

        if (!isVictory) {
            const updatedBoard = board.map(row => row.map(cell => ({ ...cell, isRevealed: true })));
            setBoard(updatedBoard);
        }

        if (isVictory) {
            const currentTime = timer;
            navigate('/leaderboard', { state: { time: currentTime } });
        }
    };

    const initializeGame = (chosenDifficulty) => {
        let rows, cols, mines;
        switch (chosenDifficulty) {
            case 'easy':
                rows = 8;
                cols = 8;
                mines = 10;
                break;
            case 'medium':
                rows = 16;
                cols = 16;
                mines = 40;
                break;
            case 'hard':
                rows = 32;
                cols = 16;
                mines = 100;
                break;
            default:
                rows = 8;
                cols = 8;
                mines = 10;
        }

        initializeBoard(rows, cols, mines);
        setMinesLeft(mines);
        setTimer(0);
        setGameOver(false);
    };

    useEffect(() => {
        initializeGame(difficulty);
        startTimer();

        return () => {
            clearInterval(timerRef.current);
        };
    }, [difficulty]);

    return (
        <div className="container">
            <h1>Игра "Сапёр"</h1>
            <div>
                <p>Таймер: {timer} сек</p>
                <p>Осталось мин: {minesLeft}</p>

                <div className="board">
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className="row">
                            {row.map((cell, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`cell ${getCellClass(cell)}`}
                                    onClick={() => revealCell(rowIndex, colIndex)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        flagCell(rowIndex, colIndex);
                                    }}
                                >
                                    {getCellContent(cell)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <button onClick={restartGame}>Перезапустить игру</button>
                <Link to="/settings" className="settings-button">Настройки</Link>
            </div>
        </div>
    );
}

export default Game;
