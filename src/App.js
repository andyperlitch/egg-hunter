import React from 'react';
import './App.css';

import {Board} from './Board.js'
import {Instructions} from './Instructions.js'

function App() {

  const game = {
    columns: 6,
    rows: 5,
    charPoint: [0, 0],
    eggPoints: [
      [1,1], [3,3], [1,4], [4,5]
    ],
    rockPoints: [
      [0,1], [1,3], [2,3], [4,4]
    ] 
  }

  return (
    <div className="App">
      <Board game={game} />
      <Instructions />
    </div>
  );
}

export default App;
