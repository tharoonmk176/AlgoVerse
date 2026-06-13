export const defaultGraphNodes = [
  { id: 'A', x: 16, y: 46 },
  { id: 'B', x: 34, y: 22 },
  { id: 'C', x: 36, y: 70 },
  { id: 'D', x: 58, y: 34 },
  { id: 'E', x: 62, y: 76 },
  { id: 'F', x: 82, y: 50 },
]

export const defaultGraphEdges = [
  ['A', 'B', 4],
  ['A', 'C', 2],
  ['B', 'D', 5],
  ['B', 'E', 10],
  ['C', 'D', 1],
  ['C', 'E', 7],
  ['D', 'F', 3],
  ['E', 'F', 2],
]

export function createGraphNodes(nodeIds) {
  const count = nodeIds.length
  return nodeIds.map((id, index) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2
    return {
      id,
      x: 50 + Math.cos(angle) * 34,
      y: 50 + Math.sin(angle) * 34,
    }
  })
}

export function buildAdjacency(nodes, edges) {
  const adjacency = Object.fromEntries(nodes.map((node) => [node.id, []]))
  return edges.reduce((nextAdjacency, [from, to, weight]) => {
    if (!nextAdjacency[from] || !nextAdjacency[to]) return nextAdjacency
    nextAdjacency[from] = [...nextAdjacency[from], { node: to, weight }]
    nextAdjacency[to] = [...nextAdjacency[to], { node: from, weight }]
    return nextAdjacency
  }, adjacency)
}

export function parseGraphInput(input) {
  const edges = input
    .split(',')
    .map((edge) => edge.trim())
    .filter(Boolean)
    .map((edge) => {
      const match = edge.match(/^([a-z0-9]+)\s*[-:>]\s*([a-z0-9]+)(?:\s*:\s*(\d+))?$/i)
      if (!match) {
        throw new Error('Use edges like A-B:4, A-C:2, B-D')
      }
      const from = match[1].toUpperCase()
      const to = match[2].toUpperCase()
      const weight = Number(match[3] || 1)
      if (from === to) throw new Error('Self loops are not supported in this visualizer')
      return [from, to, weight]
    })

  const nodeIds = [...new Set(edges.flatMap(([from, to]) => [from, to]))].sort()
  if (nodeIds.length < 2 || edges.length < 1) {
    throw new Error('Add at least one edge between two nodes')
  }

  return {
    nodes: createGraphNodes(nodeIds),
    edges,
  }
}

export function formatGraphEdges(edges) {
  return edges.map(([from, to, weight]) => `${from}-${to}:${weight}`).join(', ')
}

export function createRandomGraph(size) {
  const nodeIds = Array.from({ length: size }, (_, index) => String.fromCharCode(65 + index))
  const edges = []
  const edgeKeys = new Set()

  for (let index = 0; index < nodeIds.length - 1; index += 1) {
    const weight = Math.floor(Math.random() * 9) + 1
    edges.push([nodeIds[index], nodeIds[index + 1], weight])
    edgeKeys.add(`${nodeIds[index]}-${nodeIds[index + 1]}`)
  }

  const targetEdges = Math.min(size + Math.floor(Math.random() * size), (size * (size - 1)) / 2)
  while (edges.length < targetEdges) {
    const fromIndex = Math.floor(Math.random() * size)
    const toIndex = Math.floor(Math.random() * size)
    if (fromIndex === toIndex) continue
    const [from, to] = [nodeIds[fromIndex], nodeIds[toIndex]].sort()
    const key = `${from}-${to}`
    if (edgeKeys.has(key)) continue
    edgeKeys.add(key)
    edges.push([from, to, Math.floor(Math.random() * 9) + 1])
  }

  return {
    nodes: createGraphNodes(nodeIds),
    edges,
  }
}

export async function runGraphAlgorithm(algorithmId, { edges, markStep, nodes, shouldStop = () => false, sourceNode }) {
  if (algorithmId === 'bfs') {
    return runBfs({ edges, markStep, nodes, shouldStop, sourceNode })
  }
  if (algorithmId === 'dfs') {
    return runDfs({ edges, markStep, nodes, shouldStop, sourceNode })
  }
  if (algorithmId === 'dijkstra') {
    return runDijkstra({ edges, markStep, nodes, shouldStop, sourceNode })
  }
  return { stopped: false }
}

async function runBfs({ edges, markStep, nodes, shouldStop, sourceNode }) {
  const adjacency = buildAdjacency(nodes, edges)
  const queue = [sourceNode]
  const visited = new Set([sourceNode])
  if (shouldStop()) return { stopped: true }
  await markStep({ node: sourceNode, visited: [...visited], message: `Queue starts at source node ${sourceNode}` })
  if (shouldStop()) return { stopped: true }

  while (queue.length) {
    if (shouldStop()) return { stopped: true }
    const node = queue.shift()
    for (const next of adjacency[node]) {
      if (shouldStop()) return { stopped: true }
      await markStep({
        node,
        edge: [node, next.node],
        visited: [...visited],
        message: `Inspecting edge ${node} to ${next.node}`,
      })
      if (shouldStop()) return { stopped: true }
      if (!visited.has(next.node)) {
        visited.add(next.node)
        queue.push(next.node)
        await markStep({
          node: next.node,
          edge: [node, next.node],
          visited: [...visited],
          message: `Visited ${next.node}; queue has ${queue.join(', ') || 'no nodes'}`,
        })
        if (shouldStop()) return { stopped: true }
      }
    }
  }
  return { stopped: false }
}

async function runDfs({ edges, markStep, nodes, shouldStop, sourceNode }) {
  const adjacency = buildAdjacency(nodes, edges)
  const visited = new Set()

  const visit = async (node, from = null) => {
    if (shouldStop()) return true
    visited.add(node)
    await markStep({
      node,
      edge: from ? [from, node] : null,
      visited: [...visited],
      message: `Depth-first visit at ${node}`,
    })
    if (shouldStop()) return true

    for (const next of adjacency[node]) {
      if (shouldStop()) return true
      if (!visited.has(next.node)) {
        if (await visit(next.node, node)) return true
      }
    }
    return false
  }

  const stopped = await visit(sourceNode)
  return { stopped }
}

async function runDijkstra({ edges, markStep, nodes, shouldStop, sourceNode }) {
  const adjacency = buildAdjacency(nodes, edges)
  const unvisited = new Set(nodes.map((node) => node.id))
  const distanceMap = Object.fromEntries(nodes.map((node) => [node.id, Infinity]))
  const settled = new Set()
  distanceMap[sourceNode] = 0

  while (unvisited.size) {
    if (shouldStop()) return { stopped: true }
    const node = [...unvisited].sort((a, b) => distanceMap[a] - distanceMap[b])[0]
    if (distanceMap[node] === Infinity) break
    unvisited.delete(node)
    settled.add(node)

    await markStep({
      node,
      visited: [...settled],
      distanceMap,
      message: `Settled ${node} with distance ${distanceMap[node]}`,
    })
    if (shouldStop()) return { stopped: true }

    for (const next of adjacency[node]) {
      if (shouldStop()) return { stopped: true }
      if (!unvisited.has(next.node)) continue
      const candidate = distanceMap[node] + next.weight
      await markStep({
        node,
        edge: [node, next.node],
        visited: [...settled],
        distanceMap,
        message: `Testing ${node} to ${next.node}: ${distanceMap[node]} + ${next.weight}`,
      })
      if (shouldStop()) return { stopped: true }
      if (candidate < distanceMap[next.node]) {
        distanceMap[next.node] = candidate
        await markStep({
          node: next.node,
          edge: [node, next.node],
          visited: [...settled, next.node],
          distanceMap,
          message: `Updated ${next.node} to ${candidate}`,
        })
        if (shouldStop()) return { stopped: true }
      }
    }
  }
  return { stopped: false }
}
