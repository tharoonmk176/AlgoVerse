import { sleep } from '../sorting/algorithms'

export { sleep }

export const defaultGridRows = 4
export const defaultGridCols = 4

export const dpAlgorithms = {
  fibonacci,
  gridTraveler,
}

export async function fibonacci(n, setDpTable, setCurrentIndices, setResult, speed, shouldStop = () => false) {
  if (shouldStop()) return { stopped: true }
  if (n < 1) {
    setDpTable([0])
    setCurrentIndices([0])
    setResult(0)
    await sleep(speed)
    return { stopped: false }
  }

  const table = new Array(n + 1).fill(0)
  table[1] = 1
  setDpTable([...table])
  setCurrentIndices([0, 1])
  await sleep(speed)
  if (shouldStop()) return { stopped: true }

  for (let i = 2; i <= n; i++) {
    if (shouldStop()) return { stopped: true }
    table[i] = table[i - 1] + table[i - 2]
    setDpTable([...table])
    setCurrentIndices([i, i - 1, i - 2])
    await sleep(speed)
    if (shouldStop()) return { stopped: true }
  }

  setResult(table[n])
  setCurrentIndices([n])
  return { stopped: false }
}

export async function gridTraveler(rows, cols, setGrid, setCurrentCell, speed, shouldStop = () => false) {
  if (shouldStop()) return { stopped: true }
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(0))

  for (let r = 0; r < rows; r++) {
    grid[r][0] = 1
  }
  for (let c = 0; c < cols; c++) {
    grid[0][c] = 1
  }
  setGrid(grid.map((row) => [...row]))
  setCurrentCell([0, 0])
  await sleep(speed)
  if (shouldStop()) return { stopped: true }

  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (shouldStop()) return { stopped: true }
      grid[r][c] = grid[r - 1][c] + grid[r][c - 1]
      setGrid(grid.map((row) => [...row]))
      setCurrentCell([r, c])
      await sleep(speed)
      if (shouldStop()) return { stopped: true }
    }
  }

  setCurrentCell([rows - 1, cols - 1])
  return { stopped: false }
}
