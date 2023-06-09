import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import Game from './Game';
import HomeComp from './HomePage';
function App() {
  const [mode,setMode] = useState(0);
  const [player1,setPlayer1] = useState('Player1');
  const [player2,setPlayer2] = useState('Player2');
  const [gameOn,setgameOn] = useState(0);
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<HomeComp setgameOn = {setgameOn} mode = {mode} setMode={setMode} setPlayer1={setPlayer1} setPlayer2={setPlayer2} />} />
            <Route path="/Game" element={<CheckComponent gameOn={gameOn} mode={mode} player1={player1} player2={player2} />} />

          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

function CheckComponent({ gameOn, mode, player1, player2 }) {
  const navigate = useNavigate();
  let called = false
  useEffect(() => {
    if (gameOn !== 1 && !called) {
      window.alert("GAME REST!"); 
      navigate('/'); // Navigate to '/' if gameOn is not 1
      called = true ;
    }
  }, [gameOn, navigate]);

  if (gameOn === 1) {
    return <Game gameOn={gameOn} mode={mode} player1={player1} player2={player2} />;
  } else {
    return null;
  }
}

export default App;
