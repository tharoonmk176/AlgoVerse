import { useState } from 'react'
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
} from '../utils/sortingAlgorithms'

/**
 * Phase 2: The Control Panel Component
 * 
 * This component provides user controls for the visualizer:
 * - Manual input: Comma-separated values parsed into an array
 * - Number slider: Generate array with N random elements (5-100)
 * - Random button: Generate random array
 * - Speed slider: Control animation speed
 * - Start/Reset buttons: Control algorithm execution
 * - Algorithm selector: Choose which algorithm to visualize
 */
function ControlPanel({
  array,
  setArray,
  isSorting,
  setIsSorting,
  animationSpeed,
  setAnimationSpeed,
  selectedAlgorithm,
  setSelectedAlgorithm,
  setCurrentIndices,
}) {
  const [inputValue, setInputValue] = useState('')
  const [arraySize, setArraySize] = useState(array.length)
  const [errorMessage, setErrorMessage] = useState('')

  /**
   * Parse comma-separated input string into array of numbers
   * Trims whitespace and validates numeric values
   */
  const handleManualInput = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!inputValue.trim()) {
      setErrorMessage('Please enter at least one number')
      return
    }

    try {
      // Split by comma, trim whitespace, convert to numbers
      const parsedArray = inputValue
        .split(',')
        .map((val) => {
          const num = parseFloat(val.trim())
          if (isNaN(num)) {
            throw new Error(`"${val.trim()}" is not a valid number`)
          }
          return num
        })

      if (parsedArray.length === 0) {
        setErrorMessage('Please enter at least one number')
        return
      }

      setArray(parsedArray)
      setArraySize(parsedArray.length)
      setInputValue('')
      setCurrentIndices([])
    } catch (err) {
      setErrorMessage(`Error parsing input: ${err.message}`)
    }
  }

  /**
   * Generate a random array of specified size
   * Uses min=1 and max=100 for element values
   */
  const generateRandomArray = () => {
    setErrorMessage('')
    const newArray = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 100) + 1
    )
    setArray(newArray)
    setCurrentIndices([])
  }

  /**
   * Handle array size change from slider
   * Generates a new random array with the new size
   */
  const handleArraySizeChange = (e) => {
    const newSize = parseInt(e.target.value)
    setArraySize(newSize)

    // Generate new random array with new size
    const newArray = Array.from({ length: newSize }, () =>
      Math.floor(Math.random() * 100) + 1
    )
    setArray(newArray)
    setCurrentIndices([])
  }

  /**
   * Handle animation speed change
   * Lower value = faster animation
   */
  const handleSpeedChange = (e) => {
    setAnimationSpeed(parseInt(e.target.value))
  }

  /**
   * Reset the array to its original state and clear visualization
   */
  const handleReset = () => {
    setCurrentIndices([])
    setIsSorting(false)
  }

  /**
   * Start the selected sorting algorithm
   * Executes asynchronously to allow UI updates during sorting
   */
  const handleStartSort = async () => {
    setIsSorting(true)
    setErrorMessage('')

    try {
      let sortingFunction
      
      switch (selectedAlgorithm) {
        case 'bubbleSort':
          sortingFunction = bubbleSort
          break
        case 'selectionSort':
          sortingFunction = selectionSort
          break
        case 'insertionSort':
          sortingFunction = insertionSort
          break
        case 'mergeSort':
          sortingFunction = mergeSort
          break
        case 'quickSort':
          sortingFunction = quickSort
          break
        default:
          sortingFunction = bubbleSort
      }

      // Execute the sorting algorithm with current array and speed
      await sortingFunction(array, setArray, setCurrentIndices, animationSpeed)
    } catch (err) {
      setErrorMessage(`Sorting error: ${err.message}`)
    } finally {
      setIsSorting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 dark:text-gray-300 mb-2">
            Select Algorithm
          </label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isSorting}
            className="w-full px-4 py-2 bg-gray-700 dark:bg-gray-600 border border-gray-600 dark:border-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="bubbleSort">Bubble Sort</option>
            <option value="selectionSort">Selection Sort</option>
            <option value="insertionSort">Insertion Sort</option>
            <option value="mergeSort">Merge Sort</option>
            <option value="quickSort">Quick Sort</option>
          </select>
        </div>

        {/* Current Array Display */}
        <div>
          <label className="block text-sm font-medium text-gray-200 dark:text-gray-300 mb-2">
            Current Array
          </label>
          <div className="px-4 py-2 bg-gray-700 dark:bg-gray-600 border border-gray-600 dark:border-gray-500 rounded-lg text-sm font-mono text-gray-100 dark:text-gray-200 overflow-x-auto">
            [{array.join(', ')}]
          </div>
        </div>
      </div>

      {/* Manual Input Section */}
      <div>
        <label htmlFor="manualInput" className="block text-sm font-medium text-gray-200 dark:text-gray-300 mb-2">
          Manual Input (comma-separated values)
        </label>
        <form onSubmit={handleManualInput} className="flex gap-2">
          <input
            id="manualInput"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g., 5, 12, 3, 8, 1"
            disabled={isSorting}
            className="flex-1 px-4 py-2 bg-gray-700 dark:bg-gray-600 border border-gray-600 dark:border-gray-500 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isSorting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Set Array
          </button>
        </form>
        {errorMessage && (
          <p className="mt-2 text-sm text-red-400 dark:text-red-500">{errorMessage}</p>
        )}
      </div>

      {/* Array Size Slider */}
      <div>
        <label htmlFor="arraySize" className="block text-sm font-medium text-gray-200 dark:text-gray-300 mb-2">
          Array Size: {arraySize}
        </label>
        <input
          id="arraySize"
          type="range"
          min="5"
          max="100"
          value={arraySize}
          onChange={handleArraySizeChange}
          disabled={isSorting}
          className="w-full h-2 bg-gray-700 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span>5</span>
          <span>100</span>
        </div>
      </div>

      {/* Animation Speed Slider */}
      <div>
        <label htmlFor="animationSpeed" className="block text-sm font-medium text-gray-200 dark:text-gray-300 mb-2">
          Animation Speed: {animationSpeed}ms
        </label>
        <input
          id="animationSpeed"
          type="range"
          min="10"
          max="500"
          value={animationSpeed}
          onChange={handleSpeedChange}
          className="w-full h-2 bg-gray-700 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span>Faster (10ms)</span>
          <span>Slower (500ms)</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={generateRandomArray}
          disabled={isSorting}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Randomize
        </button>
        <button
          onClick={handleReset}
          disabled={isSorting}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Reset
        </button>
        <button
          onClick={handleStartSort}
          disabled={isSorting}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSorting ? 'Sorting...' : 'Start Sort'}
        </button>
      </div>

      {/* Info Message */}
      {isSorting && (
        <div className="p-3 bg-yellow-900 dark:bg-yellow-800 border border-yellow-700 dark:border-yellow-600 rounded-lg text-sm text-yellow-100 dark:text-yellow-200">
          ⚙️ Sorting in progress... Please wait.
        </div>
      )}
    </div>
  )
}

export default ControlPanel
