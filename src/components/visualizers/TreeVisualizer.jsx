import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { getTreeLayout, treeToArray } from '../../algorithms/trees'

function TreeVisualizer({ treeRoot, activeIndices, found, accent }) {
  const layout = useMemo(() => {
    if (!treeRoot) return []
    return getTreeLayout(treeRoot)
  }, [treeRoot])

  const allItems = useMemo(() => {
    if (!treeRoot) return []
    return treeToArray(treeRoot)
  }, [treeRoot])

  const visitedNodeIds = useMemo(() => {
    if (!activeIndices.length || !allItems.length) return new Set()
    return new Set(activeIndices.map((idx) => allItems[idx]?.id).filter(Boolean))
  }, [activeIndices, allItems])

  if (!layout.length) {
    return (
      <div className="graph-stage" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8' }}>No tree data. Generate or input values to begin.</p>
      </div>
    )
  }

  const spacingX = 14
  const spacingY = 16
  const offsetX = 12
  const offsetY = 12
  const svgWidth = Math.max(layout.length * spacingX + 20, 100)
  const svgHeight = (Math.max(...layout.map((p) => p.y)) + 2) * spacingY

  const nodeRadius = 4

  const nodeMap = {}
  layout.forEach(({ node, x, y }) => {
    nodeMap[node.id] = { x, y, value: node.value }
  })

  const edges = layout
    .filter(({ node }) => node.left || node.right)
    .flatMap(({ node, x, y }) => {
      const result = []
      if (node.left && nodeMap[node.left.id]) {
        result.push({ fromId: node.left.id, fromValue: node.left.value, x1: x, y1: y, x2: nodeMap[node.left.id].x, y2: nodeMap[node.left.id].y })
      }
      if (node.right && nodeMap[node.right.id]) {
        result.push({ fromId: node.right.id, fromValue: node.right.value, x1: x, y1: y, x2: nodeMap[node.right.id].x, y2: nodeMap[node.right.id].y })
      }
      return result
    })

  return (
    <div className="graph-stage">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} role="img" aria-label="Tree visualization" style={{ width: '100%', height: '100%' }}>
        {edges.map((edge) => {
          const active = visitedNodeIds.has(edge.fromId)
          return (
            <motion.line
              key={`${edge.fromValue}-${edge.x2}-${edge.y2}`}
              x1={edge.x1 * spacingX + offsetX}
              y1={edge.y1 * spacingY + offsetY}
              x2={edge.x2 * spacingX + offsetX}
              y2={edge.y2 * spacingY + offsetY}
              className={active ? 'edge active' : 'edge'}
              style={{ '--graph-accent': accent }}
              animate={{ pathLength: active ? [0, 1] : 1 }}
              transition={{ duration: 0.35 }}
            />
          )
        })}

        {layout.map(({ node, x, y }) => {
          const isVisited = visitedNodeIds.has(node.id)
          const isFound = found && isVisited
          let className = 'node'
          if (isFound) className = 'node active'
          else if (isVisited) className = 'node visited'

          return (
            <g key={node.id}>
              <motion.circle
                cx={x * spacingX + offsetX}
                cy={y * spacingY + offsetY}
                r={nodeRadius}
                className={className}
                style={{ '--graph-accent': accent }}
                animate={{ scale: isFound ? 1.15 : isVisited ? 1.08 : 1 }}
              />
              <text
                className="node-label"
                x={x * spacingX + offsetX}
                y={y * spacingY + offsetY + 1.3}
                style={{ fontSize: '3.5px' }}
              >
                {node.value}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default TreeVisualizer
