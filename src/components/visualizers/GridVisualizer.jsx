import { motion } from 'framer-motion'

function GridVisualizer({ grid, currentCell, result, accent }) {
  if (!grid || !grid.length) {
    return (
      <div className="graph-stage" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8' }}>No grid data. Configure dimensions to begin.</p>
      </div>
    )
  }

  const [currentRow, currentCol] = currentCell || [-1, -1]
  const isFibonacci = grid.length === 1

  return (
    <div className="dp-stage">
      <div className="dp-grid-container">
        <div
          className="dp-grid"
          style={{
            gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
            gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isCurrent = r === currentRow && c === currentCol
              const isFirstRow = r === 0 && c > 0
              const isFirstCol = c === 0 && r > 0
              let className = 'dp-cell'
              if (isCurrent) className = 'dp-cell active'
              else if (isFirstRow || isFirstCol) className = 'dp-cell base'
              else if (cell > 0) className = 'dp-cell filled'

              return (
                <motion.div
                  key={`${r}-${c}`}
                  className={className}
                  style={{ '--dp-accent': accent }}
                  layout
                  animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <span className="dp-cell-value">{cell}</span>
                  {!isFibonacci && (
                    <span className="dp-cell-coord">{r},{c}</span>
                  )}
                </motion.div>
              )
            })
          )}
        </div>
      </div>
      {result !== null && (
        <div className="dp-result">
          Result: <strong>{result}</strong>
        </div>
      )}
    </div>
  )
}

export default GridVisualizer
