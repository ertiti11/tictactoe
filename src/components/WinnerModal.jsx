import { Square } from "./Square";

export default function WinnerModal({winner, resetBoard}) {
  if (winner === null) return null;
  const winnerText = winner === false ? 'Empate' : 'Ganó: ' + winner;
  return (
    <section className="winner">
      <div className="text">
        <h2>{winnerText}</h2>
        <header className="win">{winner && <Square>{winner}</Square>}</header>
        <footer>
          <button onClick={resetBoard}>Empezar de nuevo</button>
        </footer>
      </div>
    </section>
  );
}
