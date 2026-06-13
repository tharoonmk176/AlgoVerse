import { motion } from 'framer-motion'

function StackQueueVisualizer({ values, activeIndices, operation, algorithmId, accent }) {
  const isStack = algorithmId?.startsWith('stack')

  return (
    <div className="sq-stage">
      <div className="sq-header">
        <span className="sq-type">{isStack ? 'Stack (LIFO)' : 'Queue (FIFO)'}</span>
        <span className="sq-size">{values.length} items</span>
      </div>

      {operation && <div className="sq-operation">{operation}</div>}

      <div className={isStack ? 'sq-container stack' : 'sq-container queue'}>
        {isStack ? (
          <div className="sq-stack">
            {values.map((value, index) => {
              const isActive = activeIndices.includes(index)
              const isTop = index === values.length - 1
              return (
                <motion.div
                  key={`${index}-${value}`}
                  layout
                  className={isActive ? 'sq-item active' : isTop ? 'sq-item top' : 'sq-item'}
                  style={{ '--sq-accent': accent }}
                  transition={{ layout: { type: 'spring', stiffness: 400, damping: 30 } }}
                >
                  <span className="sq-value">{value}</span>
                  {isTop && <span className="sq-pointer">TOP</span>}
                </motion.div>
              )
            })}
            {!values.length && <div className="sq-empty">Stack is empty</div>}
          </div>
        ) : (
          <div className="sq-queue">
            {values.map((value, index) => {
              const isActive = activeIndices.includes(index)
              const isFront = index === 0
              const isRear = index === values.length - 1
              return (
                <motion.div
                  key={`${index}-${value}`}
                  layout
                  className={isActive ? 'sq-item active' : isFront ? 'sq-item front' : isRear ? 'sq-item rear' : 'sq-item'}
                  style={{ '--sq-accent': accent }}
                  transition={{ layout: { type: 'spring', stiffness: 400, damping: 30 } }}
                >
                  <span className="sq-value">{value}</span>
                  {isFront && <span className="sq-pointer">FRONT</span>}
                  {isRear && <span className="sq-pointer rear">REAR</span>}
                </motion.div>
              )
            })}
            {!values.length && <div className="sq-empty">Queue is empty</div>}
          </div>
        )}
      </div>
    </div>
  )
}

export default StackQueueVisualizer
