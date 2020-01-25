export function getLookup (points) {
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

export const moveCharPoint = (startPoint, dir) => {
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