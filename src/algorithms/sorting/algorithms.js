export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const bubbleSort = async (array, setArray, setCurrentIndices, speed, shouldStop = () => false) => {
  const arr = [...array]
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (shouldStop()) return { stopped: true, array: arr }
      setCurrentIndices([j, j + 1])
      await sleep(speed)
      if (shouldStop()) return { stopped: true, array: arr }

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        setArray([...arr])
        await sleep(speed)
        if (shouldStop()) return { stopped: true, array: arr }
      }
    }
  }

  setCurrentIndices([])
  return { stopped: false, array: arr }
}

export const selectionSort = async (array, setArray, setCurrentIndices, speed, shouldStop = () => false) => {
  const arr = [...array]
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    if (shouldStop()) return { stopped: true, array: arr }
    let minIdx = i
    setCurrentIndices([i])
    await sleep(speed)
    if (shouldStop()) return { stopped: true, array: arr }

    for (let j = i + 1; j < n; j++) {
      if (shouldStop()) return { stopped: true, array: arr }
      setCurrentIndices([i, j])
      await sleep(speed)
      if (shouldStop()) return { stopped: true, array: arr }

      if (arr[j] < arr[minIdx]) {
        minIdx = j
      }
    }

    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      setArray([...arr])
      await sleep(speed)
      if (shouldStop()) return { stopped: true, array: arr }
    }
  }

  setCurrentIndices([])
  return { stopped: false, array: arr }
}

export const insertionSort = async (array, setArray, setCurrentIndices, speed, shouldStop = () => false) => {
  const arr = [...array]

  for (let i = 1; i < arr.length; i++) {
    if (shouldStop()) return { stopped: true, array: arr }
    const key = arr[i]
    let j = i - 1

    setCurrentIndices([i])
    await sleep(speed)
    if (shouldStop()) return { stopped: true, array: arr }

    while (j >= 0 && arr[j] > key) {
      if (shouldStop()) return { stopped: true, array: arr }
      setCurrentIndices([j, j + 1])
      arr[j + 1] = arr[j]
      setArray([...arr])
      await sleep(speed)
      if (shouldStop()) return { stopped: true, array: arr }
      j--
    }

    arr[j + 1] = key
    setArray([...arr])
    await sleep(speed)
    if (shouldStop()) return { stopped: true, array: arr }
  }

  setCurrentIndices([])
  return { stopped: false, array: arr }
}

export const mergeSort = async (array, setArray, setCurrentIndices, speed, shouldStop = () => false) => {
  const arr = [...array]

  const merge = async (left, mid, right) => {
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)
    let i = 0
    let j = 0
    let k = left

    while (i < leftArr.length && j < rightArr.length) {
      if (shouldStop()) return true
      setCurrentIndices([left + i, mid + 1 + j])
      await sleep(speed)
      if (shouldStop()) return true

      if (leftArr[i] <= rightArr[j]) {
        arr[k++] = leftArr[i++]
      } else {
        arr[k++] = rightArr[j++]
      }
      setArray([...arr])
      await sleep(speed)
      if (shouldStop()) return true
    }

    while (i < leftArr.length) {
      if (shouldStop()) return true
      arr[k++] = leftArr[i++]
      setArray([...arr])
      await sleep(speed)
      if (shouldStop()) return true
    }

    while (j < rightArr.length) {
      if (shouldStop()) return true
      arr[k++] = rightArr[j++]
      setArray([...arr])
      await sleep(speed)
      if (shouldStop()) return true
    }

    return false
  }

  const mergeSortHelper = async (left, right) => {
    if (shouldStop()) return true
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      if (await mergeSortHelper(left, mid)) return true
      if (await mergeSortHelper(mid + 1, right)) return true
      if (await merge(left, mid, right)) return true
    }
    return false
  }

  const stopped = await mergeSortHelper(0, arr.length - 1)
  if (stopped) return { stopped: true, array: arr }
  setCurrentIndices([])
  return { stopped: false, array: arr }
}

export const quickSort = async (array, setArray, setCurrentIndices, speed, shouldStop = () => false) => {
  const arr = [...array]

  const partition = async (low, high) => {
    if (shouldStop()) return null
    const pivot = arr[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      if (shouldStop()) return null
      setCurrentIndices([j, high])
      await sleep(speed)
      if (shouldStop()) return null

      if (arr[j] < pivot) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        setArray([...arr])
        await sleep(speed)
        if (shouldStop()) return null
      }
    }

    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    setArray([...arr])
    await sleep(speed)
    if (shouldStop()) return null

    return i + 1
  }

  const quickSortHelper = async (low, high) => {
    if (shouldStop()) return true
    if (low < high) {
      const pi = await partition(low, high)
      if (pi === null) return true
      if (await quickSortHelper(low, pi - 1)) return true
      if (await quickSortHelper(pi + 1, high)) return true
    }
    return false
  }

  const stopped = await quickSortHelper(0, arr.length - 1)
  if (stopped) return { stopped: true, array: arr }
  setCurrentIndices([])
  return { stopped: false, array: arr }
}
