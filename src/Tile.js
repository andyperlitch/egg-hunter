import React from 'react'
import './Tile.css'

export const Tile = ({ tile, length }) => {
  return (<div className="Tile" style={{width: `${length}px`, height: `${length}px` }}></div>)
}