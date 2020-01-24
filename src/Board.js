import React, { useRef, useEffect, Fragment as F } from "react"
import * as d3 from 'd3'
import ContainerDimensions from 'react-container-dimensions'
import './Board.css'
import egg from './egg.png'
import rock from './rock.png'

export const Board = ({ game }) => {
  return (
    <div className="Board">
      <ContainerDimensions>
        {({ width }) => (<F>
          <Tiles game={game} width={width} />
        </F>)}
      </ContainerDimensions>
    </div>
  )
}

const Tiles = ({ game, width }) => {
  const svgRef = useRef()
  const cellSize = width / game.columns
  const cellPadding = 6
  const tiles = getTiles(game, cellSize)
  const height = cellSize * game.rows

  useEffect(() => {
    const svg = d3.select(svgRef.current)

    // TILES
    let tile = svg
      .selectAll('g.tile')
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

    

  })

  return (<svg className="BoardSvg" ref={svgRef} width={width} height={height}>
    <defs>
      <pattern id="eggBg" x="0" y="0" height="100" width="100">
        <image x="-100" y="0" xlinkHref={egg} height="200" width="200" />
      </pattern>
    </defs>
  </svg>)
}

const getTiles = ({ rows , columns, eggPoints, rockPoints, charPoint }, cellSize) => {
  const tiles = []
  const hasEgg = getLookup(eggPoints)
  const hasRock = getLookup(rockPoints)
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

const getLookup = (points) => {
  const lookup = points.reduce((acc, [row, col]) => {
    if (!acc[row]) {
      acc[row] = { [col]: true }
    } else {
      acc[row][col] = true
    }
    return acc
  }, {})
  return (row, col) => {
    return lookup[row] && lookup[row][col]
  }
}