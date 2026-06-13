import { motion } from 'framer-motion'

/**
 * Phase 3: The Visualization Canvas & Framer Motion
 * 
 * This component renders vertical bars for each element in the array,
 * using Framer Motion's layout animation for smooth transitions when
 * elements are swapped or moved.
 */
function VisualizerCanvas({ array, currentIndices, maxValue = 100 }) {
  // Find max value in array for scaling
  const max = Math.max(...array, maxValue)

  return (
    <div className="w-full h-96 bg-gray-900 dark:bg-gray-800 rounded-lg p-6 flex items-end justify-center gap-1 md:gap-2 border border-gray-700 dark:border-gray-600 overflow-hidden">
      {array.length === 0 ? (
        <div className="text-gray-400 dark:text-gray-500 text-center">
          No array data to visualize
        </div>
      ) : (
        <motion.div 
          className="flex items-end justify-center gap-1 md:gap-2 w-full h-full"
          layout
        >
          {array.map((value, index) => {
            // Determine if this bar is being compared (highlighted)
            const isComparing = currentIndices.includes(index)
            
            // Calculate height as percentage of max value
            const heightPercent = (value / max) * 100
            
            return (
              <motion.div
                key={index}
                layout
                className={`flex-1 rounded-t-md transition-all duration-100 flex flex-col items-center justify-end pb-2 ${
                  isComparing
                    ? 'bg-red-500 dark:bg-red-600 shadow-lg shadow-red-500/50'
                    : 'bg-blue-500 dark:bg-blue-600'
                }`}
                style={{
                  height: `${heightPercent}%`,
                }}
                animate={{
                  backgroundColor: isComparing ? '#ef4444' : '#3b82f6',
                }}
                transition={{
                  layout: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  },
                  backgroundColor: {
                    duration: 0.2,
                  },
                }}
                title={`Value: ${value}`}
              >
                {/* Show value on bar if array is small */}
                {array.length <= 20 && (
                  <div className="text-xs text-white font-bold text-center">
                    {value}
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

export default VisualizerCanvas
