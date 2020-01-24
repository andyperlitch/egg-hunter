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
