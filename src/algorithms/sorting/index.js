import {
  bubbleSort,
  insertionSort,
  mergeSort,
  quickSort,
  selectionSort,
  sleep,
} from './algorithms'

export {
  bubbleSort,
  insertionSort,
  mergeSort,
  quickSort,
  selectionSort,
  sleep,
}

export const defaultArray = [42, 18, 73, 11, 56, 91, 34, 65, 27, 80, 49, 6]

export const sortingAlgorithms = {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
}

export function createRandomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 96) + 5)
}

export function parseArrayInput(input) {
  const values = input
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map(Number)

  if (!values.length || values.some((value) => Number.isNaN(value))) {
    throw new Error('Enter numbers separated by commas, for example 12, 4, 31, 8')
  }

  return values
}
