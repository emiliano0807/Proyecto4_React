import React, { useEffect, useState } from 'react';
import './Memorama.css'; // CSS con estilos y animaciones

const generateCards = () => {
  const totalCards = 25;
  const pairsNeeded = Math.floor(totalCards / 2);
  const values = Array.from({ length: pairsNeeded }, (_, i) => i + 1);
  const cardValues = [...values, ...values];
  if (totalCards % 2 !== 0) cardValues.push(''); // Para hacer 25 (impar), una carta vacía

  for (let i = cardValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
  }

  return cardValues.map((value, index) => ({
    id: index,
    value,
    flipped: false,
    matched: false,
  }));
};

const Memorama = () => {
  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [turn, setTurn] = useState(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [gameOver, setGameOver] = useState(false);

  const resetGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setTurn(1);
    setScores({ 1: 0, 2: 0 });
    setGameOver(false);
  };

  const handleClick = (index) => {
    if (cards[index].flipped || cards[index].matched || flippedCards.length === 2 || gameOver) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    const newFlipped = [...flippedCards, index];
    setCards(newCards);
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const match = newCards[first].value === newCards[second].value;

      setTimeout(() => {
        if (match) {
          newCards[first].matched = true;
          newCards[second].matched = true;
          setScores(prev => ({ ...prev, [turn]: prev[turn] + 10 }));
        } else {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setTurn(turn === 1 ? 2 : 1);
        }
        setCards(newCards);
        setFlippedCards([]);

        const allMatched = newCards.every(card => card.matched || card.value === '');
        if (allMatched) {
          setGameOver(true);
        }
      }, 1000);
    }
  };

  return (
    <div className="memorama-container">
      <h1>Memorama 5x5</h1>
      <div className="info">
        <p>Turno del jugador {turn}</p>
        <p>Puntaje - Jugador 1: {scores[1]} | Jugador 2: {scores[2]}</p>
      </div>
      <div className="grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? 'flipped' : ''}`}
            onClick={() => handleClick(index)}
          >
            <div className="card-inner">
              <div className="card-front">{card.flipped || card.matched ? card.value : ''}</div>
              <div className="card-back" />
            </div>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="winner-banner">
          <h2 className="winner-text">
            ¡Jugador {scores[1] > scores[2] ? 1 : scores[2] > scores[1] ? 2 : 'Empate'} gana!
          </h2>
        </div>
      )}

      <button className="reset-button" onClick={resetGame}>Reiniciar juego</button>
    </div>
  );
};

export default Memorama;
