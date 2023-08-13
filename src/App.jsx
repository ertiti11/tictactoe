import "./index.css";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Square } from "./components/Square";
import { TURNS } from "./constants";
import { checkWinner, checkEndGame } from "./logic/board";
import WinnerModal from "./components/WinnerModal";

function AI_Move(board, playerTurn) {
  // Copiar el tablero para simular movimientos
  const simulatedBoard = [...board];

  for (let i = 0; i < simulatedBoard.length; i++) {
    if (!simulatedBoard[i]) {
      // Simular movimiento del jugador en esta posición
      simulatedBoard[i] = playerTurn;

      // Verificar si el movimiento bloquea una victoria del oponente
      if (checkWinner(simulatedBoard, playerTurn)) {
        return i; // Elegir esta posición para bloquear el movimiento del jugador
      }

      simulatedBoard[i] = null; // Revertir la simulación
    }
  }

  // Si no hay una jugada defensiva, elegir el primer espacio vacío
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      return i;
    }
  }
}

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ? turnFromStorage : TURNS.X;
  });

  const [winner, setWinner] = useState(null);

  const updateBoard = (index) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    // guardar partida
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", newTurn);
    console.log(window.localStorage.getItem("turn"));
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti({ particleCount: 250, spread: 180 });

      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };
  useEffect(() => {
    if (turn === TURNS.O && !winner) {
      const timeout = setTimeout(() => {
        const aiMoveIndex = AI_Move(board, TURNS.O);
        if (board[aiMoveIndex] === null) {
          updateBoard(aiMoveIndex);
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [board, turn, winner]);

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetBoard}>Empezar de nuevo</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal resetBoard={resetBoard} winner={winner} />
    </main>
  );
}

export default App;
