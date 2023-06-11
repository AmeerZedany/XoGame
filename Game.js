import React, { useState, useEffect} from 'react';
import './Game.css';
import { useNavigate} from 'react-router-dom';

import { addGame , addOWinner , addXWinner} from './Action';
import { useDispatch ,useSelector} from 'react-redux';

let flag = 0
//mode ==0 2 player mode 
// mode == 1 one player mode

function Game({gameOn , mode,player1,player2}) {
  const [board, setBoard] = useState([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
    const [calculationBoard, setCalculationBoard] = useState([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
    const [winner, setWinner] = useState('');
    const [xWins, setXWins] = useState(0);
    const [oWins, setOWins] = useState(0);
    const [GameCounter, setGameCounter] = useState(1);

    const [Start , setStart] = useState('O')
    const [currentPlayer, setCurrentPlayer] = useState(Start);

    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    const [startTimeX, setStartTimeX] = useState(null);
    const [elapsedTimeX, setElapsedTimeX] = useState(0);;

    const [startTimeO, setStartTimeO] = useState(null);
    const [elapsedTimeO, setElapsedTimeO] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const maxWinTimeX = useSelector(state => state.Action.MaxWinTimeX);
    const minWinTimeX = useSelector(state => state.Action.MinWinTimeX);
    const maxWinTimeO = useSelector(state => state.Action.MaxWinTimeO);
    const minWinTimeO = useSelector(state => state.Action.MinWinTimeO);

    useEffect ( () => {
      if(flag == 0){
        setStartTime(Date.now()); // Set the start time for the round
        if (currentPlayer == 'O'){
          setStartTimeO(Date.now()); // Set the start time for the round
        }
        if (currentPlayer == 'X'){
          setStartTimeX(Date.now()); // Set the start time for the round
        }
      }
      flag = 1;

    })
    
    const handleCellClick = (row, col) => {
      if (board[row][col] === '' && winner === '') {
        if (!startTimeO) {
          setStartTimeO(Date.now()); // Set the start time for the round
        }
        if (!startTimeX) {
          setStartTimeX(Date.now()); // Set the start time for the round
        }
        const newBoard = [...board];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        checkWinner(newBoard, row, col);
        if(mode == 0 ){
          setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
        else{
          setCurrentPlayer('X');
        }
      }
    };

    useEffect(() => {
      if (startTime && !winner) {
        const timer = setInterval(() => {
          const currentTime = Date.now();
          const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds
          setElapsedTime(elapsedTime);
        }, 1000); // Update elapsed time every second
    
        // Clean up the timer when the component unmounts or when the round ends
        return () => clearInterval(timer);
      }
    }, [startTime, winner]);

    useEffect(() => {
      let interval;
      if (currentPlayer === 'O' && !winner) {
          interval = setInterval(() => {
            setElapsedTimeO((elapsedTimeO) => elapsedTimeO + 0.105) ;
          }, 100);
      }
      else if (currentPlayer === 'X' && !winner){
        interval = setInterval(() => {
          setElapsedTimeX((elapsedTimeX) => elapsedTimeX + 0.105);
        }, 100);
      }
      return () => {
        clearInterval(interval);
      };
    }, [currentPlayer][winner]);

    useEffect(() => {
      if (currentPlayer === 'X' && !winner && mode === 1) {
        const timer = setTimeout(() => {
          makeEasyMove();
        }, 1000);
        return () => {
          clearTimeout(timer);
        };
      } else if (currentPlayer === 'X' && !winner && mode === 2) {
        const timer = setTimeout(() => {
          makeBestMove();
        }, 1000);
        
        return () => {
          clearTimeout(timer);
        };
      }
    }, [currentPlayer, Start]);
    
    const makeEasyMove = () => {
        const emptyCells = [];
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            if (board[row][col] === '') {
              emptyCells.push({ row, col });
            }
          }
        }
    
        if (emptyCells.length > 0) {
          const randomIndex = Math.floor(Math.random() * emptyCells.length);
          const { row, col } = emptyCells[randomIndex];
          const newBoard = [...board];
          console.log(currentPlayer)
          newBoard[row][col] = currentPlayer;
          setBoard(newBoard);
          checkWinner(newBoard, row, col);
          setCurrentPlayer('O');
        }
    };

    const makeBestMove = () => {
      let bestScore = -Infinity;
      let bestMove = null;
    
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (board[row][col] === '') {
            board[row][col] = 'X';
            const moveScore= minimax(board, false);   
            board[row][col] = '';
    
            if (moveScore > bestScore) {
              bestScore = moveScore;
              bestMove = { row, col };
            }
          }
        }
      }
    
      if (bestMove) {
        const { row, col } = bestMove;
        board[row][col] = 'X';
        setBoard([...board]);
        checkWinner(board, row, col);
        setCurrentPlayer('O');
      }
    };
    
    
    
    
    function minimax(board, maximizingPlayer) {
      if (isGameOver(board)) {
        const score = evaluate(board);
        return score;
      }
    
      const scores = [];
    
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (board[row][col] === '') {
            const newBoard = [...board];
            newBoard[row][col] = maximizingPlayer ? 'X' : 'O';
            const score = minimax(newBoard, !maximizingPlayer);
            newBoard[row][col] = '';
            scores.push(score);
          }
        }
      }
    
      return maximizingPlayer ? Math.max(...scores) : Math.min(...scores);
    }

    const isGameOver = (board) => {
      // Check for a win or a tie
      return hasWinner(board) || isBoardFull(board);
    };

    const isBoardFull = (board) => {
      // Check if the board is full
      return board.every(row => row.every(cell => cell !== ''));
    };
    
    const hasWinner = (board) => {
      // Check rows
      for (let row = 0; row < 3; row++) {
        if (
          board[row][0] !== '' &&
          board[row][0] === board[row][1] &&
          board[row][1] === board[row][2]
        ) {
          return true;
        }
      }
    
      // Check columns
      for (let col = 0; col < 3; col++) {
        if (
          board[0][col] !== '' &&
          board[0][col] === board[1][col] &&
          board[1][col] === board[2][col]
        ) {
          return true;
        }
      }
    
      // Check diagonals
      if (
        board[0][0] !== '' &&
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2]
      ) {
        return true;
      }
    
      if (
        board[0][2] !== '' &&
        board[0][2] === board[1][1] &&
        board[1][1] === board[2][0]
      ) {
        return true;
      }
    
      // No winner
      return false;
    };
    
    const evaluate = (board) => {
      const winningCombinations = [
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Columns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonals
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
      ];
    
      // Check for a win
      for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
          board[a[0]][a[1]] === 'X' &&
          board[b[0]][b[1]] === 'X' &&
          board[c[0]][c[1]] === 'X'
        ) {
          return 10; // AI wins
        } else if (
          board[a[0]][a[1]] === 'O' &&
          board[b[0]][b[1]] === 'O' &&
          board[c[0]][c[1]] === 'O'
        ) {
          return -10; // Human wins
        }
      }
    
      // No win, so it's a tie
      return 0;
    };
    
    // The remaining helper functions (isGameOver, evaluate, getNextPlayer, isBoardFull) should be implemented as mentioned in my previous response.
    
    
    
    const checkWinner = (currentBoard, row, col) => {
      const symbols = ['X', 'O'];
      for (let symbol of symbols) {
        // Check rows
        if (
          currentBoard[row][0] === symbol &&
          currentBoard[row][1] === symbol &&
          currentBoard[row][2] === symbol
        ) {
          setWinner(symbol);
          updateScore(symbol);
          dispatch(addGame(GameCounter,elapsedTime));
          if(symbol === 'X'){
            dispatch(addXWinner(parseFloat((elapsedTimeX+0.9).toFixed(1))));
          }
          else{
            dispatch(addOWinner(parseFloat((elapsedTimeO).toFixed(1))));
          }
          return;
        }
        // Check columns
        if (
          currentBoard[0][col] === symbol &&
          currentBoard[1][col] === symbol &&
          currentBoard[2][col] === symbol
        ) {
          setWinner(symbol);
          updateScore(symbol);
          dispatch(addGame(GameCounter,elapsedTime));
          if(symbol === 'X'){
            dispatch(addXWinner(parseFloat((elapsedTimeX+0.9).toFixed(1))));
          }
          else{
            dispatch(addOWinner(parseFloat((elapsedTimeO).toFixed(1))));
          }          return;
        }
        // Check diagonals
        if (
          (currentBoard[0][0] === symbol &&
            currentBoard[1][1] === symbol &&
            currentBoard[2][2] === symbol) ||
          (currentBoard[0][2] === symbol &&
            currentBoard[1][1] === symbol &&
            currentBoard[2][0] === symbol)
        ) {
          setWinner(symbol);
          updateScore(symbol);
          dispatch(addGame(GameCounter,elapsedTime));
          if(symbol === 'X'){
            dispatch(addXWinner(parseFloat((elapsedTimeX+0.9).toFixed(1))));
          }
          else{
            dispatch(addOWinner(parseFloat((elapsedTimeO).toFixed(1))));
          }          return;
        }
      }
      // Check for a draw
      if (!currentBoard.flat().includes('')) {
        setWinner('draw');
        dispatch(addGame(GameCounter,elapsedTime));
      }


    };
  

    const updateScore = (symbol) => {
      if (symbol === 'X') {
        setXWins((prevWins) => prevWins + 1);
      } else if (symbol === 'O') {
        setOWins((prevWins) => prevWins + 1);
      }
    };

    const NextGame = () => {
      setBoard([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ]);
      setWinner('');

      if (Start === 'X'){
        setStart('O');
        setCurrentPlayer('O');
      }
      else{
          setStart('X');
          setCurrentPlayer('X');
      }
      setGameCounter( (GameCounter) => GameCounter+1)
      setStartTime(null);
      setElapsedTime(0);
      flag = 0;
      setElapsedTimeO(0);
      setElapsedTimeX(0);

    };

  return (
    <div className="game-container">
      <div className="current-player">    
          {winner ? (
          <div className="message">
            {winner === 'draw' ? "It's a draw!" : `Player ${winner} wins!`}
            <button className="play-again" onClick={NextGame}>
              Play Again
            </button>
          </div>
        ) : (<p>Current Player : {currentPlayer}</p>)}
      </div>

      <table className="board">
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} onClick={() => handleCellClick(rowIndex, colIndex)}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="result-box">
        <div className="score">
          <p>Game Counter : {GameCounter}</p>
          <p>{player1}(O): {oWins}</p>
          <p>{player2}(X): {xWins}</p>
        </div>
      </div>
      {/* All time Plays for one Round ,Min Time You Win,Max Time You Win*/}
      <div className="Time-box">
        <p>Time For this Round : {elapsedTime}</p>
        <p>Min Time {player2} Win: {minWinTimeX}</p>
        <p>Max Time {player2} Win : {maxWinTimeX}</p>
        <p>Min Time {player1} Win: {minWinTimeO}</p>
        <p>Max Time {player1} Win : {maxWinTimeO}</p>
      </div>
    </div>
    
  );
}

export default Game;
/*
if(gameOn === 1){
}
else{
  //window.alert("Game not started. Returning to the home page.");
  console.log("Error");
  navigate("/");

}*/