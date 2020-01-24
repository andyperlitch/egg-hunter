import React, { useRef, useEffect, Fragment as F, useContext } from "react"
import * as d3 from 'd3'
import ContainerDimensions from 'react-container-dimensions'
import './Board.css'
import eggImg from './egg.png'
import rock from './rock.png'
import charImg from './bunny.png'
import { GameContext } from "./GameContext"

export const Board = () => {
  return (
    <div className="Board">
      <ContainerDimensions>
        {({ width }) => (<F>
          <Tiles width={width} />
        </F>)}
      </ContainerDimensions>
    </div>
  )
}

const Tiles = ({  width }) => {
  const {game, dispatch} = useContext(GameContext)

  const svgRef = useRef()
  const charDatum = {
    row: game.charPoint[0],
    col: game.charPoint[1],
  }
  const cellSize = width / game.columns
  const cellPadding = 6
  const tiles = getTiles(game, cellSize)
  const eggs = getEggs(game, cellSize)
  console.log(`eggs.length`, eggs.length)
  const height = cellSize * game.rows

  useEffect(() => {
    const svg = d3.select(svgRef.current)

    // TILES
    let tile = svg
      .selectAll('g.tileGroup')
      .data(tiles, (tile) => `${tile.row},${tile.col}`)

    let newTile = tile.enter()
      .append('g')
      .classed('tileGroup', true)
      .attr('transform', (t) => `translate(${t.x}, ${t.y})`)
    
    // SQUARES
    newTile
      .append('rect')
      .classed('tileSquare', true)
      .attr('x', cellPadding / 2)
      .attr('y', cellPadding / 2)
      .attr('rx', cellPadding)
      .attr('width', cellSize - cellPadding)
      .attr('height', cellSize - cellPadding)

    // ROCKS
    newTile
      .filter((t) => t.rock)
      .append('image')
      .classed('tileRock', true)
      .attr('x', cellPadding * 3)
      .attr('y', cellPadding * 3)
      .attr('xlink:href', rock)
      .attr('width', cellSize * 0.7)
      .attr('height', cellSize * 0.7)

    tile = newTile.merge(tile)

    // CHARACTER
    let char = svg.selectAll('image.character')
      .data([charDatum], () => 1)
    
    char.enter()
      .append('image')
      .classed('character', true)
      .attr('xlink:href', charImg)
      .attr('width', cellSize - cellPadding * 2)
      .attr('height', cellSize - cellPadding * 2)
      .attr('x', (d) => d.col * cellSize + cellPadding)
      .attr('y', (d) => d.row * cellSize + cellPadding)
      .merge(char)
    
    char
      .transition()
      .duration(700)
      .attr('x', (d) => d.col * cellSize + cellPadding)
      .attr('y', (d) => d.row * cellSize + cellPadding)
      .on('end', () => dispatch({ type: 'moved' }))
    
    // EGGS
    let egg = svg.selectAll('image.egg')
      .data(eggs, (d) => `${d.row}.${d.col}`)

    egg.exit().remove()

    
    egg = egg.enter()
      .append('image')
      .classed('egg', true)
      .attr('xlink:href', eggImg)
      .attr('width', cellSize - cellPadding * 8)
      .attr('height', cellSize - cellPadding * 8)
      .attr('x', (d) => d.col * cellSize + cellPadding * 4)
      .attr('y', (d) => d.row * cellSize + cellPadding * 4)
      .merge(egg)
    
  })

  return (<svg className="BoardSvg" ref={svgRef} width={width} height={height}></svg>)
}

const getTiles = ({ rows , columns, rocks }, cellSize) => {
  const tiles = []
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      tiles.push({
        row: i,
        col: j,
        x: j * cellSize,
        y: i * cellSize,
        rock: rocks.has(i, j),
        cellSize,
      })
    }    
  }
  return tiles
}

const getEggs = ({ eggs, eggsFound }, cellSize) => {
  return eggs.values
    .filter((egg) => !eggsFound.has(...egg))
    .map(([row, col]) => ({
      row,
      col,
      x: col * cellSize,
      y: row * cellSize,
    }))
}
