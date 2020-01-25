import React, { useReducer } from 'react';
import { ToastContainer } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import {Board} from './Board'
import {Instructions} from './Instructions'
import { GameContext } from './GameContext'
import { getLookup } from './utils';
import { levels } from './levels'
import { reducer } from './reducer'

const defaultGame = {
  startPoint: [0, 0],
  charPoint: [0, 0],
  columns: levels[0].columns,
  rows: levels[0].rows,
  eggs: getLookup(levels[0].eggs),
  eggsFound: getLookup([]),
  rocks: getLookup(levels[0].rocks),
  instructions: [],
  running: -1,
  level: 0,
}



function App() {
  const [game, dispatch] = useReducer(reducer, defaultGame)
  return (
    <GameContext.Provider value={{game, dispatch}}>
      <div className="App">
        <Board />
        <Instructions />
      </div>
      <ToastContainer />
    </GameContext.Provider>
  );
}

export default App;
