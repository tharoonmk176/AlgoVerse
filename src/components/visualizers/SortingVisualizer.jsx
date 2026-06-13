import { motion } from 'framer-motion'

function SortingVisualizer({ array, activeIndices, accent }) {
  const max = Math.max(...array, 1)

  return (
    <div className="sorting-stage">
      <motion.div className="bars" layout>
        {array.map((value, index) => {
          const isActive = activeIndices.includes(index)
          return (
            <motion.div
              key={`${index}-${value}`}
              layout
              className={isActive ? 'bar active' : 'bar'}
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
    </div>
  )
}

export default SortingVisualizer
