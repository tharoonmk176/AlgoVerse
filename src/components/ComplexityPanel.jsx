/**
 * Phase 5: Information Panel (Complexity Display)
 * 
 * This component displays the time and space complexity information
 * for the currently selected sorting algorithm using proper Big-O notation.
 */

const complexityData = {
  bubbleSort: {
    name: 'Bubble Sort',
    timeComplexity: {
      worst: 'O(n²)',
      average: 'O(n²)',
      best: 'O(n)',
    },
    spaceComplexity: 'O(1)',
    description:
      'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
  },
  selectionSort: {
    name: 'Selection Sort',
    timeComplexity: {
      worst: 'O(n²)',
      average: 'O(n²)',
      best: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description:
      'Divides the array into two parts: sorted and unsorted. Repeatedly selects the smallest element from the unsorted part and moves it to the sorted part.',
  },
  insertionSort: {
    name: 'Insertion Sort',
    timeComplexity: {
      worst: 'O(n²)',
      average: 'O(n²)',
      best: 'O(n)',
    },
    spaceComplexity: 'O(1)',
    description:
      'Builds the final sorted array one item at a time. It iterates through an input array, and for each element, finds the position it belongs in the sorted array and inserts it there.',
  },
  mergeSort: {
    name: 'Merge Sort',
    timeComplexity: {
      worst: 'O(n log n)',
      average: 'O(n log n)',
      best: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    description:
      'A divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves back together.',
  },
  quickSort: {
    name: 'Quick Sort',
    timeComplexity: {
      worst: 'O(n²)',
      average: 'O(n log n)',
      best: 'O(n log n)',
    },
    spaceComplexity: 'O(log n)',
    description:
      'A divide-and-conquer algorithm that selects a pivot element and partitions the array around it, then recursively sorts the partitions.',
  },
}

function ComplexityPanel({ selectedAlgorithm }) {
  const algo = complexityData[selectedAlgorithm]

  if (!algo) {
    return <div className="text-gray-400">Algorithm not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Algorithm Title */}
      <div>
        <h3 className="text-2xl font-bold text-white dark:text-white mb-2">
          {algo.name}
        </h3>
        <p className="text-gray-300 dark:text-gray-400">{algo.description}</p>
      </div>

      {/* Complexity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Complexity */}
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 dark:from-purple-800 dark:to-purple-700 rounded-lg p-4 border border-purple-700 dark:border-purple-600">
          <h4 className="text-lg font-semibold text-white mb-4">
            Time Complexity
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-purple-200 dark:text-purple-300">
                Worst Case
              </p>
              <p className="text-2xl font-mono font-bold text-purple-300 dark:text-purple-200">
                {algo.timeComplexity.worst}
              </p>
            </div>
            <div>
              <p className="text-sm text-purple-200 dark:text-purple-300">
                Average Case
              </p>
              <p className="text-2xl font-mono font-bold text-purple-300 dark:text-purple-200">
                {algo.timeComplexity.average}
              </p>
            </div>
            <div>
              <p className="text-sm text-purple-200 dark:text-purple-300">
                Best Case
              </p>
              <p className="text-2xl font-mono font-bold text-purple-300 dark:text-purple-200">
                {algo.timeComplexity.best}
              </p>
            </div>
          </div>
        </div>

        {/* Space Complexity */}
        <div className="bg-gradient-to-br from-cyan-900 to-cyan-800 dark:from-cyan-800 dark:to-cyan-700 rounded-lg p-4 border border-cyan-700 dark:border-cyan-600">
          <h4 className="text-lg font-semibold text-white mb-4">
            Space Complexity
          </h4>
          <div className="flex items-center justify-center h-32 md:h-auto">
            <div className="text-center">
              <p className="text-sm text-cyan-200 dark:text-cyan-300 mb-2">
                Auxiliary Space
              </p>
              <p className="text-4xl font-mono font-bold text-cyan-300 dark:text-cyan-200">
                {algo.spaceComplexity}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Characteristics */}
      <div className="bg-gray-800 dark:bg-gray-700 rounded-lg p-4 border border-gray-700 dark:border-gray-600">
        <h4 className="text-lg font-semibold text-white mb-3">
          Characteristics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {selectedAlgorithm === 'bubbleSort' && (
            <>
              <div className="text-sm text-gray-300">✓ Simple implementation</div>
              <div className="text-sm text-gray-300">✓ In-place sorting</div>
              <div className="text-sm text-gray-300">✓ Stable</div>
            </>
          )}
          {selectedAlgorithm === 'selectionSort' && (
            <>
              <div className="text-sm text-gray-300">✓ Simple implementation</div>
              <div className="text-sm text-gray-300">✓ In-place sorting</div>
              <div className="text-sm text-gray-300">✗ Unstable</div>
            </>
          )}
          {selectedAlgorithm === 'insertionSort' && (
            <>
              <div className="text-sm text-gray-300">✓ Adaptive</div>
              <div className="text-sm text-gray-300">✓ In-place sorting</div>
              <div className="text-sm text-gray-300">✓ Stable</div>
            </>
          )}
          {selectedAlgorithm === 'mergeSort' && (
            <>
              <div className="text-sm text-gray-300">✓ Stable</div>
              <div className="text-sm text-gray-300">✗ Not in-place</div>
              <div className="text-sm text-gray-300">✓ Divide & Conquer</div>
            </>
          )}
          {selectedAlgorithm === 'quickSort' && (
            <>
              <div className="text-sm text-gray-300">✓ Divide & Conquer</div>
              <div className="text-sm text-gray-300">✓ In-place sorting</div>
              <div className="text-sm text-gray-300">✗ Unstable</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComplexityPanel
