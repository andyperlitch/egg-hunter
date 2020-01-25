import { toast } from 'react-toastify';
import { getLookup, moveCharPoint } from './utils'
import { levels } from './levels'

export function reducer(state, action) {
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
        let { eggs, eggsFound, level } = state
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
          if (levels[level + 1]) {
            level++
          }
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
          eggs: getLookup(levels[level].eggs),
          rocks: getLookup(levels[level].rocks),
          level,
        }
      }
    }
    default: {
      return state
    }
  }
}