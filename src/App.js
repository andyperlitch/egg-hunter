import React, { useReducer } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import {Board} from './Board'
import {Instructions} from './Instructions'
import { GameContext } from './GameContext'

const defaultGame = {
  startPoint: [0, 0],
  charPoint: [0, 0],
  columns: 6,
  rows: 5,
  eggs: getLookup([[1,1], [3,3], [1,4], [4,5]]),
  eggsFound: getLookup([]),
  rocks: getLookup([
    [0,1], [1,3], [2,3], [4,4]
  ]),
  instructions: [],
  running: -1,
}

function getLookup (points) {
  const lookup = points.reduce((acc, [row, col]) => {
    if (!acc[row]) {
      acc[row] = { [col]: true }
    } else {
      acc[row][col] = true
    }
    return acc
  }, {})
  return {
    values: points, 
    has: (row, col) => {
      return lookup[row] && lookup[row][col] === true
    },
    add: (row, col) => {
      if (!lookup[row]) {
        lookup[row] = { [col]: true }
      } else {
        lookup[row][col] = true
      }
      points.push([row, col])
    }
  }
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
      if (!instruction) {
        return state
      }
      return {
        ...state,
        charPoint: moveCharPoint(state.startPoint, instruction),
        running: action.payload,
      }
    }
    case 'moved': {
      // check if we are running
      if (state.running === -1) {
        return state
      }
      // check validity of spot
      if (state.rocks.has(...state.charPoint)) {
        toast.error('You hit a rock!', {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return {
          ...state,
          running: -1,
          charPoint: [...state.startPoint],
          eggsFound: getLookup([]),
        }
      }

      const [row, col] = state.charPoint
      const { rows, columns } = state
      if (row < 0 || row >= rows || col < 0 || col >= columns) {
        toast.error('You went out of bounds!', {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return {
          ...state,
          running: -1,
          // error: 'You went out of bounds!',
          charPoint: [...state.startPoint],
          eggsFound: getLookup([]),
        }
      }

      // check for egg
      if (state.eggs.has(...state.charPoint) && !state.eggsFound.has(...state.charPoint)) {
        state.eggsFound.add(...state.charPoint)
      }

      // check if remaining instructions
      const { running, instructions } = state
      if (instructions[running + 1]) {
        return {
          ...state,
          running: running + 1,
          charPoint: moveCharPoint(state.charPoint, instructions[running + 1])
        }
      } else {
        const { eggs, eggsFound } = state
        if (eggs.values.length > eggsFound.values.length) {
          toast.info(`You found ${eggsFound.values.length} out of ${eggs.values.length} eggs!`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.success(`You got all the eggs!!!`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        // toast.error('You went out of bounds!', {
        //   position: "bottom-center",
        //   autoClose: 5000,
        //   hideProgressBar: true,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        // });
        return {
          ...state,
          running: -1,
          charPoint: [...state.startPoint],
          eggsFound: getLookup([]),
        }
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
      <ToastContainer />
    </GameContext.Provider>
  );
}

export default App;
