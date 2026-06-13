import { motion } from 'framer-motion'

function GraphVisualizer({ activeEdge, activeNode, distances, edges, nodes, visitedNodes, accent }) {
  const visited = new Set(visitedNodes)

  const isActiveEdge = (from, to) =>
    activeEdge && ((activeEdge[0] === from && activeEdge[1] === to) || (activeEdge[0] === to && activeEdge[1] === from))

  return (
    <div className="graph-stage">
      <svg viewBox="0 0 100 100" role="img" aria-label="Graph algorithm visualization">
        {edges.map(([from, to, weight]) => {
          const source = nodes.find((node) => node.id === from)
          const target = nodes.find((node) => node.id === to)
          if (!source || !target) return null
          const active = isActiveEdge(from, to)
          return (
            <g key={`${from}-${to}`}>
              <motion.line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={active ? 'edge active' : 'edge'}
                style={{ '--graph-accent': accent }}
                animate={{ pathLength: active ? [0, 1] : 1 }}
                transition={{ duration: 0.35 }}
              />
              <text className="edge-label" x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 2}>
                {weight}
              </text>
            </g>
          )
        })}

        {nodes.map((node) => {
          const isVisited = visited.has(node.id)
          const isActive = activeNode === node.id
          const distance = distances[node.id]
          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isActive ? 7.5 : 6.2}
                className={isActive ? 'node active' : isVisited ? 'node visited' : 'node'}
                style={{ '--graph-accent': accent }}
                animate={{ scale: isActive ? 1.12 : 1 }}
              />
              <text className="node-label" x={node.x} y={node.y + 1.3}>
                {node.id}
              </text>
              {distance !== undefined && (
                <text className="distance-label" x={node.x} y={node.y + 12}>
                  {distance === Infinity ? '∞' : distance}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default GraphVisualizer
