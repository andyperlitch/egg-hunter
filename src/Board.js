import React, { useRef, useEffect, Fragment as F, useContext } from "react"
import * as d3 from 'd3'
import ContainerDimensions from 'react-container-dimensions'
import './Board.css'
import egg from './egg.png'
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

    // EGGS
    newTile
      .filter((t) => t.egg)
      .append('ellipse')
      .classed('tileEgg', true)
      .attr('cx', cellSize / 2)
      .attr('cy', cellSize / 2)
      .attr('rx', cellSize * 0.25)
      .attr('ry', cellSize * 0.3)
      .attr('fill', 'url(#eggBg)')
      .attr('transform', `translate(${cellSize * 0.3}, -${cellSize * 0.18}) rotate(30) `)

    // ROCKS
    newTile
      .filter((t) => t.rock)
      .append('image')
      .classed('tileRock', true)
      .attr('x', cellPadding * 3)
      .attr('y', cellPadding * 3)
      .attr('href', rock)
      .attr('width', cellSize * 0.7)
      .attr('height', cellSize * 0.7)

    tile = newTile.merge(tile)

    // CHARACTER
    console.log(`charDatum`, charDatum)
    let char = svg.selectAll('image.character')
      .data([charDatum], () => 1)
    
    char.enter()
      .append('image')
      .classed('character', true)
      .attr('href', charImg)
      .attr('width', cellSize - cellPadding * 2)
      .attr('height', cellSize - cellPadding * 2)
      .attr('x', (d) => d.col * cellSize + cellPadding)
      .attr('y', (d) => d.row * cellSize + cellPadding)
      .merge(char)
    
    char
      .transition()
      .duration(1000)
      .attr('x', (d) => d.col * cellSize + cellPadding)
      .attr('y', (d) => d.row * cellSize + cellPadding)
      .on('end', () => dispatch({ type: 'moved' }))
  })

  return (<svg className="BoardSvg" ref={svgRef} width={width} height={height}>
    <defs>
      <pattern id="eggBg" x="0" y="0" height="100" width="100">
        <image x="-50" y="-50" xlinkHref={egg} height="150" width="150" />
      </pattern>
    </defs>
  </svg>)
}

const getTiles = ({ rows , columns, hasEgg, hasRock }, cellSize) => {
  const tiles = []
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      tiles.push({
        row: i,
        col: j,
        x: j * cellSize,
        y: i * cellSize,
        egg: hasEgg(i, j),
        rock: hasRock(i, j),
        cellSize,
      })
    }    
  }
  console.log(`tiles`, tiles)
  return tiles
}

