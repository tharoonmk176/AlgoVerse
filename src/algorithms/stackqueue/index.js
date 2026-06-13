import { sleep } from '../sorting/algorithms'

export { sleep }

export const defaultStackValues = [10, 20, 30, 40, 50]
export const defaultQueueValues = [10, 20, 30, 40, 50]

export function createRandomValues(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
}

export const stackQueueAlgorithms = {
  stackPush,
  stackPop,
  queueEnqueue,
  queueDequeue,
}

export async function stackPush(values, setValues, setCurrentIndices, setOperation, speed, shouldStop = () => false) {
  const arr = [...values]
  const newValue = Math.floor(Math.random() * 90) + 10
  arr.push(newValue)
  setValues([...arr])
  setCurrentIndices([arr.length - 1])
  setOperation(`push(${newValue})`)
  await sleep(speed)
  if (shouldStop()) return { stopped: true }
  setCurrentIndices([])
  return { stopped: false }
}

export async function stackPop(values, setValues, setCurrentIndices, setOperation, speed, shouldStop = () => false) {
  const arr = [...values]
  if (!arr.length) {
    setOperation('Stack is empty!')
    await sleep(speed)
    return { stopped: false }
  }
  const popped = arr.pop()
  setCurrentIndices([arr.length])
  setOperation(`pop() → ${popped}`)
  await sleep(speed)
  if (shouldStop()) return { stopped: true }
  setValues([...arr])
  setCurrentIndices([])
  return { stopped: false }
}

export async function queueEnqueue(values, setValues, setCurrentIndices, setOperation, speed, shouldStop = () => false) {
  const arr = [...values]
  const newValue = Math.floor(Math.random() * 90) + 10
  arr.push(newValue)
  setValues([...arr])
  setCurrentIndices([arr.length - 1])
  setOperation(`enqueue(${newValue})`)
  await sleep(speed)
  if (shouldStop()) return { stopped: true }
  setCurrentIndices([])
  return { stopped: false }
}

export async function queueDequeue(values, setValues, setCurrentIndices, setOperation, speed, shouldStop = () => false) {
  const arr = [...values]
  if (!arr.length) {
    setOperation('Queue is empty!')
    await sleep(speed)
    return { stopped: false }
  }
  const dequeued = arr.shift()
  setCurrentIndices([0])
  setOperation(`dequeue() → ${dequeued}`)
  await sleep(speed)
  if (shouldStop()) return { stopped: true }
  setValues([...arr])
  setCurrentIndices([])
  return { stopped: false }
}
