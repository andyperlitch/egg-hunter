import React, { useReducer } from 'react';
import './App.css';

import {Board} from './Board'
import {Instructions} from './Instructions'
import { GameContext } from './GameContext'

const defaultGame = {
  columns: 6,
  rows: 5,
  charPoint: [0, 0],
  eggPoints: [
    [1,1], [3,3], [1,4], [4,5]
  ],
  rockPoints: [
    [0,1], [1,3], [2,3], [4,4]
  ],
  instructions: []
}

const moveCharPoint = (startPoint, dir) => {
  switch (dir) {
    case 'up':
      return [startPoint[0] - 1, startPoint[1]]
    case 'down':
      return [startPoint[0] + 1, startPoint[1]]
    case 'left':
      return [startPoint[0], startPoint[1] - 1]
    case 'right':
      return [startPoint[0], startPoint[1] + 1]
    default:
      return [...startPoint]
  }
}

function reducer(state, action) {
  switch(action.type) {
    case 'addInstruction': {
      return {
        ...state,
        instructions: [
          ...state.instructions,
          action.payload,
        ]
      }
    }
    case 'rmInstruction': {
      const {instructions} = state
      instructions.splice(action.payload, 1)
      return {
        ...state,
        instructions: [...instructions]
      }
    }
    case 'run': {
      const instruction = state.instructions[action.payload]
      return {
        ...state,
        charPoint: moveCharPoint(state.charPoint, instruction)
      }
    }
    default: {
      return state
    }
  }
}

function App() {
  const [game, dispatch] = useReducer(reducer, defaultGame)
  return (
    <GameContext.Provider value={{game, dispatch}}>
      <div className="App">
        <Board />
        <Instructions />
      </div>
    </GameContext.Provider>
  );
}

export default App;
