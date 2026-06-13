import { sleep } from '../sorting/algorithms'

export { sleep }

export const defaultSearchArray = [6, 11, 18, 27, 34, 42, 49, 56, 65, 73, 80, 91]

export function createRandomSearchArray(size) {
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 96) + 5)
  return arr.sort((a, b) => a - b)
}

export const searchAlgorithms = {
  linearSearch,
  binarySearch,
}

export async function linearSearch(array, target, setArray, setCurrentIndices, setFound, speed, shouldStop = () => false) {
  const arr = [...array]
  for (let i = 0; i < arr.length; i++) {
    if (shouldStop()) return { stopped: true, found: false, index: -1 }
    setCurrentIndices([i])
    setFound(false)
    await sleep(speed)
    if (shouldStop()) return { stopped: true, found: false, index: -1 }
    if (arr[i] === target) {
      setCurrentIndices([i])
      setFound(true)
      return { stopped: false, found: true, index: i }
    }
  }
  setCurrentIndices([])
  setFound(false)
  return { stopped: false, found: false, index: -1 }
}

export async function binarySearch(array, target, setArray, setCurrentIndices, setFound, speed, shouldStop = () => false) {
  const arr = [...array]
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    if (shouldStop()) return { stopped: true, found: false, index: -1 }
    const mid = Math.floor((left + right) / 2)
    setCurrentIndices([mid, left, right])
    setFound(false)
    await sleep(speed)
    if (shouldStop()) return { stopped: true, found: false, index: -1 }

    if (arr[mid] === target) {
      setCurrentIndices([mid])
      setFound(true)
      return { stopped: false, found: true, index: mid }
    }

    if (arr[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  setCurrentIndices([])
  setFound(false)
  return { stopped: false, found: false, index: -1 }
}
