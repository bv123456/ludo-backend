import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://ludo-backend.onrender.com"); // Replace with your backend URL

const LudoGame = () => {
  const [playerName, setPlayerName] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [players, setPlayers] = useState({});
  const [timer, setTimer] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [diceValue, setDiceValue] = useState(null);

  useEffect(() => {
    socket.on("gameStart", ({ players }) => {
      setPlayers(players);
      setGameStarted(true);
    });

    socket.on("timer", (time) => setTimer(time));

    socket.on("diceRolled", ({ playerId, diceValue }) => {
      if (socket.id === playerId) {
        setDiceValue(diceValue);
      }
    });

    socket.on("gameEnd", ({ winner }) => {
      setWinner(winner);
      setGameStarted(false);
    });
  }, []);

  const joinGame = () => {
    socket.emit("joinGame", { playerName, deposit: parseInt(deposit) });
  };

  const rollDice = () => {
    socket.emit("rollDice");
  };

  return (
    <div>
      <h1>Ludo Game</h1>
      {!gameStarted ? (
        <div>
          <input
            type="text"
            placeholder="Enter name"
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter deposit"
            onChange={(e) => setDeposit(e.target.value)}
          />
          <button onClick={joinGame}>Join Game</button>
        </div>
      ) : (
        <div>
          <h2>Time Left: {timer}s</h2>
          <h3>Dice Roll: {diceValue}</h3>
          <button onClick={rollDice}>Roll Dice</button>
        </div>
      )}
      {winner && <h2>Winner: {winner === "tie" ? "It's a Tie!" : winner.playerName}</h2>}
    </div>
  );
};

export default LudoGame;
