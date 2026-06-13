import { useMemo, useRef, useState } from 'react'
import './App.css'
import { algorithmCatalog } from './algorithms/catalog'
import {
  defaultArray,
  createRandomArray,
  parseArrayInput,
  sleep,
  sortingAlgorithms,
} from './algorithms/sorting'
import {
  createRandomGraph,
  defaultGraphEdges,
  defaultGraphNodes,
  formatGraphEdges,
  parseGraphInput,
  runGraphAlgorithm,
} from './algorithms/graphs'
import ControlRange from './components/common/ControlRange'
import Metric from './components/common/Metric'
import ComplexityCard from './components/panels/ComplexityCard'
import GraphVisualizer from './components/visualizers/GraphVisualizer'
import SortingVisualizer from './components/visualizers/SortingVisualizer'

function App() {
  const stopRequestedRef = useRef(false)
  const [category, setCategory] = useState('sorting')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort')
  const [array, setArray] = useState(defaultArray)
  const [arraySize, setArraySize] = useState(defaultArray.length)
  const [manualInput, setManualInput] = useState('')
  const [graphNodes, setGraphNodes] = useState(defaultGraphNodes)
  const [graphEdges, setGraphEdges] = useState(defaultGraphEdges)
  const [graphInput, setGraphInput] = useState(formatGraphEdges(defaultGraphEdges))
  const [graphSize, setGraphSize] = useState(defaultGraphNodes.length)
  const [sourceNode, setSourceNode] = useState('A')
  const [speed, setSpeed] = useState(120)
  const [isRunning, setIsRunning] = useState(false)
  const [currentIndices, setCurrentIndices] = useState([])
  const [visitedNodes, setVisitedNodes] = useState([])
  const [activeNode, setActiveNode] = useState(null)
  const [activeEdge, setActiveEdge] = useState(null)
  const [distances, setDistances] = useState({})
  const [status, setStatus] = useState('Ready to run')
  const [inputError, setInputError] = useState('')

  const activeAlgorithm = useMemo(
    () => algorithmCatalog[category].find((algorithm) => algorithm.id === selectedAlgorithm),
    [category, selectedAlgorithm],
  )

  const clearHighlights = () => {
    setCurrentIndices([])
    setVisitedNodes([])
    setActiveNode(null)
    setActiveEdge(null)
    setDistances({})
  }

  const switchCategory = (nextCategory) => {
    setCategory(nextCategory)
    setSelectedAlgorithm(algorithmCatalog[nextCategory][0].id)
    setInputError('')
    clearHighlights()
    setStatus('Ready to run')
  }

  const generateRandomArray = (size = arraySize) => {
    setArray(createRandomArray(size))
    setArraySize(size)
    setManualInput('')
    setInputError('')
    clearHighlights()
    setStatus('New array generated')
  }

  const applyManualInput = (event) => {
    event.preventDefault()
    try {
      const values = parseArrayInput(manualInput)
      setArray(values)
      setArraySize(values.length)
      setInputError('')
      clearHighlights()
      setStatus('Custom array loaded')
    } catch (error) {
      setInputError(error.message)
    }
  }

  const applyGraphInput = (event) => {
    event.preventDefault()
    try {
      const graph = parseGraphInput(graphInput)
      setGraphNodes(graph.nodes)
      setGraphEdges(graph.edges)
      setGraphSize(graph.nodes.length)
      setSourceNode(graph.nodes[0].id)
      setInputError('')
      clearHighlights()
      setStatus('Custom graph loaded')
    } catch (error) {
      setInputError(error.message)
    }
  }

  const generateRandomGraph = (size = graphSize) => {
    const graph = createRandomGraph(size)
    setGraphNodes(graph.nodes)
    setGraphEdges(graph.edges)
    setGraphInput(formatGraphEdges(graph.edges))
    setGraphSize(size)
    setSourceNode(graph.nodes[0].id)
    setInputError('')
    clearHighlights()
    setStatus('Random graph generated')
  }

  const markGraphStep = async ({ node, edge, visited, distanceMap, message }) => {
    if (stopRequestedRef.current) return
    setActiveNode(node)
    setActiveEdge(edge || null)
    setVisitedNodes(visited)
    if (distanceMap) setDistances({ ...distanceMap })
    setStatus(message)
    await sleep(speed * 2)
  }

  const runSorting = async () => {
    const sort = sortingAlgorithms[selectedAlgorithm]
    if (!sort) return
    setStatus(`${activeAlgorithm.name} is comparing values`)
    const result = await sort(array, setArray, setCurrentIndices, speed, () => stopRequestedRef.current)
    if (result?.stopped) {
      clearHighlights()
      setStatus(`${activeAlgorithm.name} stopped`)
      return
    }
    setStatus(`${activeAlgorithm.name} complete`)
  }

  const runGraph = async () => {
    setStatus(`${activeAlgorithm.name} started from node ${sourceNode}`)
    await runGraphAlgorithm(selectedAlgorithm, {
      edges: graphEdges,
      markStep: markGraphStep,
      nodes: graphNodes,
      shouldStop: () => stopRequestedRef.current,
      sourceNode,
    })
    if (stopRequestedRef.current) {
      clearHighlights()
      setStatus(`${activeAlgorithm.name} stopped`)
      return
    }
    setActiveNode(null)
    setActiveEdge(null)
    setStatus(`${activeAlgorithm.name} complete`)
  }

  const start = async () => {
    if (isRunning) return
    stopRequestedRef.current = false
    setIsRunning(true)
    clearHighlights()

    try {
      if (category === 'sorting') {
        await runSorting()
      } else {
        await runGraph()
      }
    } finally {
      setIsRunning(false)
      stopRequestedRef.current = false
    }
  }

  const stop = () => {
    if (!isRunning) return
    stopRequestedRef.current = true
    setStatus('Stopping after the current animation step')
  }

  const reset = () => {
    stopRequestedRef.current = true
    clearHighlights()
    setInputError('')
    setStatus('Ready to run')

    if (category === 'sorting') {
      setArray(defaultArray)
      setArraySize(defaultArray.length)
      setManualInput('')
    }

    if (category === 'graph') {
      setGraphNodes(defaultGraphNodes)
      setGraphEdges(defaultGraphEdges)
      setGraphInput(formatGraphEdges(defaultGraphEdges))
      setGraphSize(defaultGraphNodes.length)
      setSourceNode('A')
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <h1>DSA Visualizer</h1>
          <p className="hero-copy">
            An Interactive workspace for watching sorting and graph algorithms move through
            real data step by step.
          </p>
        </div>
        <div className="hero-metrics" aria-label="Visualizer summary">
          <Metric label="Status" value={isRunning ? 'Running' : 'Ready'} />
        </div>
      </section>

      <section className="workspace">
        <aside className="sidebar">
          <div className="section-title">
            <span>Library</span>
            <strong>{activeAlgorithm.tag}</strong>
          </div>

          <div className="category-switcher" role="tablist" aria-label="Algorithm categories">
            {Object.keys(algorithmCatalog).map((item) => (
              <button
                key={item}
                type="button"
                className={category === item ? 'active' : ''}
                onClick={() => switchCategory(item)}
                disabled={isRunning}
              >
                {item === 'sorting' ? 'Sorting' : 'Graphs'}
              </button>
            ))}
          </div>

          <div className="algorithm-list">
            {algorithmCatalog[category].map((algorithm) => (
              <button
                key={algorithm.id}
                type="button"
                className={selectedAlgorithm === algorithm.id ? 'algorithm-card active' : 'algorithm-card'}
                onClick={() => setSelectedAlgorithm(algorithm.id)}
                disabled={isRunning}
                style={{ '--algorithm-accent': algorithm.accent }}
              >
                <span>{algorithm.name}</span>
                <small>{algorithm.complexity.average}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="stage-panel">
          <div className="stage-header">
            <div>
              <p className="eyebrow">{activeAlgorithm.tag} visualizer</p>
              <h2>{activeAlgorithm.name}</h2>
            </div>
            <div className="status-pill">{status}</div>
          </div>

          {category === 'sorting' ? (
            <SortingVisualizer array={array} activeIndices={currentIndices} accent={activeAlgorithm.accent} />
          ) : (
            <GraphVisualizer
              activeEdge={activeEdge}
              activeNode={activeNode}
              distances={distances}
              edges={graphEdges}
              nodes={graphNodes}
              visitedNodes={visitedNodes}
              accent={activeAlgorithm.accent}
            />
          )}
        </section>

        <aside className="control-panel">
          <div className="section-title">
            <span>Controls</span>
            <strong>{speed}ms</strong>
          </div>

          {category === 'sorting' && (
            <>
              <form className="input-row" onSubmit={applyManualInput}>
                <input
                  value={manualInput}
                  onChange={(event) => setManualInput(event.target.value)}
                  placeholder="12, 4, 31, 8"
                  disabled={isRunning}
                  aria-label="Comma separated array values"
                />
                <button type="submit" disabled={isRunning}>
                  Set
                </button>
              </form>
              {inputError && <p className="field-error">{inputError}</p>}

              <ControlRange
                label={`Array size: ${arraySize}`}
                min="5"
                max="36"
                value={arraySize}
                disabled={isRunning}
                onChange={(event) => generateRandomArray(Number(event.target.value))}
              />

              <button className="secondary-action" type="button" onClick={() => generateRandomArray()} disabled={isRunning}>
                Randomize Array
              </button>
            </>
          )}

          {category === 'graph' && (
            <>
              <form className="graph-input-form" onSubmit={applyGraphInput}>
                <label>
                  <span>Edges</span>
                  <textarea
                    value={graphInput}
                    onChange={(event) => setGraphInput(event.target.value)}
                    placeholder="A-B:4, A-C:2, B-D:5"
                    disabled={isRunning}
                    rows="4"
                    aria-label="Comma separated graph edges"
                  />
                </label>
                <button className="secondary-action" type="submit" disabled={isRunning}>
                  Set Graph
                </button>
              </form>
              {inputError && <p className="field-error">{inputError}</p>}

              <label className="select-control">
                <span>Source node</span>
                <select
                  value={sourceNode}
                  onChange={(event) => {
                    setSourceNode(event.target.value)
                    clearHighlights()
                  }}
                  disabled={isRunning}
                >
                  {graphNodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.id}
                    </option>
                  ))}
                </select>
              </label>

              <ControlRange
                label={`Graph nodes: ${graphSize}`}
                min="3"
                max="10"
                value={graphSize}
                disabled={isRunning}
                onChange={(event) => generateRandomGraph(Number(event.target.value))}
              />

              <button className="secondary-action" type="button" onClick={() => generateRandomGraph()} disabled={isRunning}>
                Randomize Graph
              </button>

              <div className="graph-note">
                <strong>{graphNodes.length} nodes / {graphEdges.length} edges</strong>
                <span>Format edges as A-B:4. The weight is optional and defaults to 1.</span>
              </div>
            </>
          )}

          <ControlRange
            label={`Frame delay: ${speed}ms`}
            min="30"
            max="450"
            value={speed}
            disabled={false}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />

          <div className="action-grid">
            <button className="primary-action" type="button" onClick={start} disabled={isRunning}>
              {isRunning ? 'Running' : 'Start'}
            </button>
            <button className="danger-action" type="button" onClick={stop} disabled={!isRunning}>
              Stop
            </button>
            <button className="secondary-action" type="button" onClick={reset} disabled={isRunning}>
              Reset
            </button>
          </div>

          <ComplexityCard algorithm={activeAlgorithm} />
        </aside>
      </section>
    </main>
  )
}

export default App
