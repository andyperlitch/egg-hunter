import React from 'react';
import './App.css';

import {Board} from './Board.js'
import {Instructions} from './Instructions.js'

function App() {

  const game = {
    columns: 10,
    rows: 4,
    charPoint: [0, 0],
    eggPoints: [
      [1,1], [4,5], [1,4], [8,10]
    ],
    rockPoints: [
      [1,2], [4,4], [6,3]
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
