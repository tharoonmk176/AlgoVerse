import { sleep } from '../sorting/algorithms'

export { sleep }

let treeNodeIdCounter = 0

export class TreeNode {
  constructor(value) {
    this.id = treeNodeIdCounter++
    this.value = value
    this.left = null
    this.right = null
    this.x = 0
    this.y = 0
  }
}

export function resetTreeNodeIdCounter() {
  treeNodeIdCounter = 0
}

export function createTreeFromValues(values) {
  resetTreeNodeIdCounter()
  if (!values.length) return null
  const root = new TreeNode(values[0])
  for (let i = 1; i < values.length; i++) {
    insertIntoTree(root, values[i])
  }
  return root
}

function insertIntoTree(node, value) {
  if (value < node.value) {
    if (node.left) {
      insertIntoTree(node.left, value)
    } else {
      node.left = new TreeNode(value)
    }
  } else {
    if (node.right) {
      insertIntoTree(node.right, value)
    } else {
      node.right = new TreeNode(value)
    }
  }
}

export function treeToArray(root) {
  if (!root) return []
  const result = []
  const queue = [root]
  while (queue.length) {
    const node = queue.shift()
    result.push({ id: node.id, value: node.value })
    if (node.left) queue.push(node.left)
    if (node.right) queue.push(node.right)
  }
  return result
}

export const defaultTreeValues = [50, 25, 75, 12, 37, 62, 87, 6, 18, 30, 45, 55, 70, 80, 95]

export function createRandomTree(size) {
  const values = Array.from({ length: size }, () => Math.floor(Math.random() * 96) + 5)
  const unique = [...new Set(values)]
  return createTreeFromValues(unique)
}

export function parseTreeInput(input) {
  const values = input
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
    .map(Number)

  if (!values.length || values.some((v) => Number.isNaN(v))) {
    throw new Error('Enter numbers separated by commas, for example 50, 25, 75, 12')
  }

  return values
}

function calculateTreeLayout(node, depth = 0, offset = 0, positions = []) {
  if (!node) return 0

  const leftWidth = calculateTreeLayout(node.left, depth + 1, offset, positions)
  const rightWidth = calculateTreeLayout(node.right, depth + 1, offset + leftWidth + 1, positions)

  const x = offset + leftWidth
  const y = depth

  positions.push({ node, x, y })

  return leftWidth + 1 + rightWidth
}

export function getTreeLayout(root) {
  const positions = []
  calculateTreeLayout(root, 0, 0, positions)
  return positions
}

export const treeAlgorithms = {
  bstInsert,
  bstSearch,
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
}

function insertSingleNode(root, value, pathIds) {
  if (!root) {
    return { root: new TreeNode(value), created: true }
  }

  let current = root
  while (true) {
    pathIds.push(current.id)
    if (value < current.value) {
      if (current.left) {
        current = current.left
      } else {
        current.left = new TreeNode(value)
        pathIds.push(current.left.id)
        return { root, created: true }
      }
    } else {
      if (current.right) {
        current = current.right
      } else {
        current.right = new TreeNode(value)
        pathIds.push(current.right.id)
        return { root, created: true }
      }
    }
  }
}

export async function bstInsert(values, setArray, setCurrentIndices, setTreeRoot, speed, shouldStop = () => false) {
  if (!values.length) return { stopped: false }
  if (shouldStop()) return { stopped: true }

  let root = null

  for (let i = 0; i < values.length; i++) {
    if (shouldStop()) return { stopped: true }
    const pathIds = []
    const result = insertSingleNode(root, values[i], pathIds)
    root = result.root

    const currentItems = treeToArray(root)
    const indices = currentItems.reduce((acc, item, idx) => {
      if (pathIds.includes(item.id)) acc.push(idx)
      return acc
    }, [])

    setTreeRoot(root)
    setCurrentIndices(indices)
    await sleep(speed * 2)
    if (shouldStop()) return { stopped: true }
  }

  setCurrentIndices([])
  return { stopped: false }
}

export async function bstSearch(array, target, setArray, setCurrentIndices, setTreeRoot, setFound, speed, shouldStop = () => false) {
  const root = createTreeFromValues(array)
  setTreeRoot(root)
  await sleep(speed)
  if (shouldStop()) return { stopped: true, found: false }

  let current = root
  const pathIds = []

  while (current) {
    if (shouldStop()) return { stopped: true, found: false }
    pathIds.push(current.id)
    const arr = treeToArray(root)
    const indices = arr.reduce((acc, item, idx) => {
      if (pathIds.includes(item.id)) acc.push(idx)
      return acc
    }, [])
    setCurrentIndices(indices)
    setFound(false)
    await sleep(speed)
    if (shouldStop()) return { stopped: true, found: false }

    if (target === current.value) {
      setFound(true)
      return { stopped: false, found: true }
    }

    if (target < current.value) {
      current = current.left
    } else {
      current = current.right
    }
  }

  setFound(false)
  return { stopped: false, found: false }
}

async function runTraversal(root, traversalFn, setArray, setCurrentIndices, setTreeRoot, speed, shouldStop = () => false) {
  setTreeRoot(root)
  await sleep(speed)
  if (shouldStop()) return { stopped: true }

  const visitedIds = []
  const allItems = treeToArray(root)

  await traversalFn(root, async (node) => {
    if (shouldStop()) return true
    visitedIds.push(node.id)
    const indices = allItems.reduce((acc, item, idx) => {
      if (visitedIds.includes(item.id)) acc.push(idx)
      return acc
    }, [])
    setCurrentIndices([...indices])
    await sleep(speed)
    if (shouldStop()) return true
    return false
  })

  if (shouldStop()) return { stopped: true }
  return { stopped: false }
}

export async function inorderTraversal(array, setArray, setCurrentIndices, setTreeRoot, speed, shouldStop = () => false) {
  const root = createTreeFromValues(array)
  const inorder = async (node, visit) => {
    if (!node) return
    if (await inorder(node.left, visit)) return true
    if (await visit(node)) return true
    if (await inorder(node.right, visit)) return true
    return false
  }
  return runTraversal(root, inorder, setArray, setCurrentIndices, setTreeRoot, speed, shouldStop)
}

export async function preorderTraversal(array, setArray, setCurrentIndices, setTreeRoot, speed, shouldStop = () => false) {
  const root = createTreeFromValues(array)
  const preorder = async (node, visit) => {
    if (!node) return
    if (await visit(node)) return true
    if (await preorder(node.left, visit)) return true
    if (await preorder(node.right, visit)) return true
    return false
  }
  return runTraversal(root, preorder, setArray, setCurrentIndices, setTreeRoot, speed, shouldStop)
}

export async function postorderTraversal(array, setArray, setCurrentIndices, setTreeRoot, speed, shouldStop = () => false) {
  const root = createTreeFromValues(array)
  const postorder = async (node, visit) => {
    if (!node) return
    if (await postorder(node.left, visit)) return true
    if (await postorder(node.right, visit)) return true
    if (await visit(node)) return true
    return false
  }
  return runTraversal(root, postorder, setArray, setCurrentIndices, setTreeRoot, speed, shouldStop)
}
