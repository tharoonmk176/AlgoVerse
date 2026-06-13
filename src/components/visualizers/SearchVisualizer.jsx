import { motion } from 'framer-motion'

function SearchVisualizer({ array, activeIndices, found, target, accent }) {
  const max = Math.max(...array, 1)
  const [midIdx, leftIdx, rightIdx] = activeIndices.length === 3 ? activeIndices : [activeIndices[0], null, null]

  return (
    <div className="sorting-stage">
      <motion.div className="bars" layout>
        {array.map((value, index) => {
          let className = 'bar'
          if (activeIndices.includes(index)) {
            if (found && index === activeIndices[0]) {
              className = 'bar found'
            } else if (index === midIdx) {
              className = 'bar searching-mid'
            } else if (index === leftIdx || index === rightIdx) {
              className = 'bar searching-bound'
            } else {
              className = 'bar searching-active'
            }
          }

          return (
            <motion.div
              key={`${index}-${value}`}
              layout
              className={className}
              style={{
                '--bar-height': `${Math.max((value / max) * 100, 6)}%`,
                '--bar-accent': accent,
              }}
              transition={{ layout: { type: 'spring', stiffness: 280, damping: 28 } }}
            >
              {array.length <= 18 && <span>{value}</span>}
            </motion.div>
          )
        })}
      </motion.div>
      {target !== null && (
        <div className="search-target-label">Searching for: {target}</div>
      )}
    </div>
  )
}

export default SearchVisualizer
