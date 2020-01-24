import React, { useContext } from 'react'
import './Instructions.css'
import { GameContext } from './GameContext';

const directions = {
  left: '⇠',
  up: '⇡',
  right: '⇢',
  down: '⇣',
}

export const Instructions = () => {
  const { game: { instructions }, dispatch } = useContext(GameContext)
  return (<div className="Instructions">
    {/* <h2 className="InstructionsTitle">Instructions</h2> */}
    <button className="RunButton" onClick={() => dispatch({ type: 'run', payload: 0 })}>Run!</button>
    <AddInstruction />
    {instructions.map((dir, i) => <Instruction dir={dir} i={i} key={i} />)}
  </div>)
}

const Instruction = ({ dir, i }) => {
  const { dispatch } = useContext(GameContext)
  return (<div className="Instruction">
    <span className="InstructionDir">{directions[dir]}</span>
    <button
      className="InstructionDelete"
      onClick={() => dispatch({ type: 'rmInstruction', payload: i })}
    >
      x
    </button>
  </div>)
}

const AddInstruction = () => {
  const { dispatch } = useContext(GameContext)

  return (<div className="AddInstruction">
    <div className="AddInstructionButtons">
      <button
        type="button"
        className="AddInstructionArrowButton"
        onClick={() => dispatch({ type: 'addInstruction', payload: 'left' })}
      >
        <span className="arrowBtnText">{directions.left}</span>
      </button>
      <button
        type="button"
        className="AddInstructionArrowButton"
        onClick={() => dispatch({ type: 'addInstruction', payload: 'up' })}
      >
        <span className="arrowBtnText">{directions.up}</span>
      </button>
      <button
        type="button"
        className="AddInstructionArrowButton"
        onClick={() => dispatch({ type: 'addInstruction', payload: 'right' })}
      >
        <span className="arrowBtnText">{directions.right}</span>
      </button>
      <button
        type="button"
        className="AddInstructionArrowButton"
        onClick={() => dispatch({ type: 'addInstruction', payload: 'down' })}
      >
        <span className="arrowBtnText">{directions.down}</span>
      </button>
    </div>
  </div>)
}