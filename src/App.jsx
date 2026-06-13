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
import {
  defaultSearchArray,
  createRandomSearchArray,
  searchAlgorithms,
} from './algorithms/searching'
import {
  createTreeFromValues,
  defaultTreeValues,
  createRandomTree,
  parseTreeInput,
  treeAlgorithms,
} from './algorithms/trees'
import {
  dpAlgorithms,
  defaultGridRows,
  defaultGridCols,
} from './algorithms/dp'
import {
  defaultStackValues,
  defaultQueueValues,
  createRandomValues,
  stackQueueAlgorithms,
} from './algorithms/stackqueue'
import ControlRange from './components/common/ControlRange'
import Metric from './components/common/Metric'
import ComplexityCard from './components/panels/ComplexityCard'
import GraphVisualizer from './components/visualizers/GraphVisualizer'
import SortingVisualizer from './components/visualizers/SortingVisualizer'
import SearchVisualizer from './components/visualizers/SearchVisualizer'
import TreeVisualizer from './components/visualizers/TreeVisualizer'
import GridVisualizer from './components/visualizers/GridVisualizer'
import StackQueueVisualizer from './components/visualizers/StackQueueVisualizer'

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

  const [searchTarget, setSearchTarget] = useState('')
  const [found, setFound] = useState(false)
  const [treeRoot, setTreeRoot] = useState(null)
  const [dpTable, setDpTable] = useState([])
  const [dpGrid, setDpGrid] = useState([])
  const [currentCell, setCurrentCell] = useState([-1, -1])
  const [dpResult, setDpResult] = useState(null)
  const [fibN, setFibN] = useState(10)
  const [gridRows, setGridRows] = useState(defaultGridRows)
  const [gridCols, setGridCols] = useState(defaultGridCols)
  const [sqValues, setSqValues] = useState(defaultStackValues)
  const [sqOperation, setSqOperation] = useState('')

  const categoryTitles = {
    sorting: 'Sorting',
    graph: 'Graphs',
    searching: 'Searching',
    trees: 'Trees',
    dp: 'DP',
    stackqueue: 'Stack/Queue',
  }

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
    setFound(false)
    setCurrentCell([-1, -1])
    setDpResult(null)
    setSqOperation('')
  }

  const switchCategory = (nextCategory) => {
    setCategory(nextCategory)
    setSelectedAlgorithm(algorithmCatalog[nextCategory][0].id)
    setInputError('')
    clearHighlights()
    setStatus('Ready to run')

    if (nextCategory === 'trees') {
      setTreeRoot(createTreeFromValues(defaultTreeValues))
    }
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

  const generateRandomSearchArray = (size = arraySize) => {
    const arr = createRandomSearchArray(size)
    setArray(arr)
    setArraySize(size)
    setManualInput('')
    setInputError('')
    clearHighlights()
    setStatus('New sorted array generated')
  }

  const generateRandomTree = (size = arraySize) => {
    const values = createRandomTree(size)
    const arr = []
    const queue = [values]
    while (queue.length) {
      const node = queue.shift()
      if (node) {
        arr.push(node.value)
        if (node.left) queue.push(node.left)
        if (node.right) queue.push(node.right)
      }
    }
    setArray(arr)
    setArraySize(arr.length)
    setTreeRoot(values)
    setManualInput('')
    setInputError('')
    clearHighlights()
    setStatus('New random tree generated')
  }

  const applyTreeInput = (event) => {
    event.preventDefault()
    try {
      const values = parseTreeInput(manualInput)
      setArray(values)
      setArraySize(values.length)
      setInputError('')
      clearHighlights()
      setStatus('Custom tree values loaded')
    } catch (error) {
      setInputError(error.message)
    }
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

  const runSearching = async () => {
    const search = searchAlgorithms[selectedAlgorithm]
    if (!search) return
    const target = Number(searchTarget)
    if (isNaN(target)) {
      setInputError('Enter a valid number to search for')
      return
    }
    setInputError('')
    setStatus(`${activeAlgorithm.name} is searching for ${target}`)
    const result = await search(array, target, setArray, setCurrentIndices, setFound, speed, () => stopRequestedRef.current)
    if (result?.stopped) {
      clearHighlights()
      setStatus(`${activeAlgorithm.name} stopped`)
      return
    }
    if (result.found) {
      setStatus(`${activeAlgorithm.name} found ${target} at index ${result.index}`)
    } else {
      setStatus(`${activeAlgorithm.name} did not find ${target}`)
    }
  }

  const runTrees = async () => {
    const algo = treeAlgorithms[selectedAlgorithm]
    if (!algo) return
    setStatus(`${activeAlgorithm.name} running`)

    let result
    if (selectedAlgorithm === 'bstInsert') {
      result = await algo(array, setArray, setCurrentIndices, setTreeRoot, speed, () => stopRequestedRef.current)
    } else if (selectedAlgorithm === 'bstSearch') {
      const target = Number(searchTarget)
      if (isNaN(target)) {
        setInputError('Enter a valid number to search for')
        return
      }
      setInputError('')
      result = await algo(array, target, setArray, setCurrentIndices, setTreeRoot, setFound, speed, () => stopRequestedRef.current)
      if (result?.found) {
        setStatus(`${activeAlgorithm.name} found ${target}`)
      } else {
        setStatus(`${activeAlgorithm.name} did not find ${target}`)
      }
    } else {
      result = await algo(array, setArray, setCurrentIndices, setTreeRoot, speed, () => stopRequestedRef.current)
    }
    if (result?.stopped) {
      clearHighlights()
      setStatus(`${activeAlgorithm.name} stopped`)
      return
    }
    setStatus(`${activeAlgorithm.name} complete`)
  }

  const runDp = async () => {
    const algo = dpAlgorithms[selectedAlgorithm]
    if (!algo) return
    setStatus(`${activeAlgorithm.name} running`)

    let result
    if (selectedAlgorithm === 'fibonacci') {
      result = await algo(fibN, setDpTable, setCurrentIndices, setDpResult, speed, () => stopRequestedRef.current)
    } else if (selectedAlgorithm === 'gridTraveler') {
      result = await algo(gridRows, gridCols, setDpGrid, setCurrentCell, speed, () => stopRequestedRef.current)
    }
    if (result?.stopped) {
      clearHighlights()
      setStatus(`${activeAlgorithm.name} stopped`)
      return
    }
    setStatus(`${activeAlgorithm.name} complete`)
  }

  const runStackQueue = async () => {
    const algo = stackQueueAlgorithms[selectedAlgorithm]
    if (!algo) return
    setStatus(`${activeAlgorithm.name} running`)
    const result = await algo(sqValues, setSqValues, setCurrentIndices, setSqOperation, speed, () => stopRequestedRef.current)
    if (result?.stopped) {
      clearHighlights()
      setStatus(`${activeAlgorithm.name} stopped`)
      return
    }
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
      } else if (category === 'graph') {
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
      } else if (category === 'searching') {
        await runSearching()
      } else if (category === 'trees') {
        await runTrees()
      } else if (category === 'dp') {
        await runDp()
      } else if (category === 'stackqueue') {
        await runStackQueue()
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

    if (category === 'searching') {
      setArray(defaultSearchArray)
      setArraySize(defaultSearchArray.length)
      setManualInput('')
      setSearchTarget('')
      setFound(false)
    }

    if (category === 'trees') {
      setArray(defaultTreeValues)
      setArraySize(defaultTreeValues.length)
      setManualInput('')
      setTreeRoot(createTreeFromValues(defaultTreeValues))
      setFound(false)
      setSearchTarget('')
    }

    if (category === 'dp') {
      setDpTable([])
      setDpGrid([])
      setDpResult(null)
      setCurrentCell([-1, -1])
      setFibN(10)
      setGridRows(defaultGridRows)
      setGridCols(defaultGridCols)
    }

    if (category === 'stackqueue') {
      setSqValues(selectedAlgorithm?.startsWith('stack') ? defaultStackValues : defaultQueueValues)
      setSqOperation('')
    }
  }

  const handleCategorySpecificReset = (algorithmId) => {
    if (category === 'stackqueue') {
      setSqValues(algorithmId?.startsWith('stack') ? defaultStackValues : defaultQueueValues)
      setSqOperation('')
      clearHighlights()
      setStatus('Reset to defaults')
    }
  }

  const renderVisualizer = () => {
    switch (category) {
      case 'sorting':
        return <SortingVisualizer array={array} activeIndices={currentIndices} accent={activeAlgorithm.accent} />
      case 'graph':
        return (
          <GraphVisualizer
            activeEdge={activeEdge}
            activeNode={activeNode}
            distances={distances}
            edges={graphEdges}
            nodes={graphNodes}
            visitedNodes={visitedNodes}
            accent={activeAlgorithm.accent}
          />
        )
      case 'searching':
        return (
          <SearchVisualizer
            array={array}
            activeIndices={currentIndices}
            found={found}
            target={searchTarget !== '' ? Number(searchTarget) : null}
            accent={activeAlgorithm.accent}
          />
        )
      case 'trees':
        return (
          <TreeVisualizer
            treeRoot={treeRoot}
            activeIndices={currentIndices}
            found={found}
            accent={activeAlgorithm.accent}
          />
        )
      case 'dp':
        return (
          <GridVisualizer
            grid={selectedAlgorithm === 'fibonacci' ? (dpTable.length > 0 ? [dpTable] : []) : dpGrid}
            currentCell={currentCell}
            result={dpResult}
            accent={activeAlgorithm.accent}
          />
        )
      case 'stackqueue':
        return (
          <StackQueueVisualizer
            values={sqValues}
            activeIndices={currentIndices}
            operation={sqOperation}
            algorithmId={selectedAlgorithm}
            accent={activeAlgorithm.accent}
          />
        )
      default:
        return null
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <h1>DSA Visualizer</h1>
          <p className="hero-copy">
            An Interactive workspace for watching algorithms move through real data step by step.
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
            <strong>{activeAlgorithm?.tag || ''}</strong>
          </div>

          <div className="category-switcher" role="tablist" aria-label="Algorithm categories" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {Object.keys(algorithmCatalog).map((item) => (
              <button
                key={item}
                type="button"
                className={category === item ? 'active' : ''}
                onClick={() => switchCategory(item)}
                disabled={isRunning}
              >
                {categoryTitles[item] || item}
              </button>
            ))}
          </div>

          <div className="algorithm-list">
            {algorithmCatalog[category].map((algorithm) => (
              <button
                key={algorithm.id}
                type="button"
                className={selectedAlgorithm === algorithm.id ? 'algorithm-card active' : 'algorithm-card'}
                onClick={() => {
                  setSelectedAlgorithm(algorithm.id)
                  handleCategorySpecificReset(algorithm.id)
                }}
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
              <p className="eyebrow">{activeAlgorithm?.tag || ''} visualizer</p>
              <h2>{activeAlgorithm?.name || ''}</h2>
            </div>
            <div className="status-pill">{status}</div>
          </div>

          {renderVisualizer()}
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

          {category === 'searching' && (
            <>
              <form className="input-row" onSubmit={applyManualInput}>
                <input
                  value={manualInput}
                  onChange={(event) => setManualInput(event.target.value)}
                  placeholder="6, 11, 18, 27, 34 (sorted)"
                  disabled={isRunning}
                  aria-label="Comma separated sorted array values"
                />
                <button type="submit" disabled={isRunning}>
                  Set
                </button>
              </form>
              {inputError && <p className="field-error">{inputError}</p>}

              <label className="select-control">
                <span>Target value</span>
                <input
                  type="number"
                  value={searchTarget}
                  onChange={(event) => setSearchTarget(event.target.value)}
                  disabled={isRunning}
                  placeholder="Enter a number to find"
                  style={{
                    padding: '12px',
                    border: '1px solid rgba(148, 163, 184, 0.22)',
                    borderRadius: '10px',
                    color: '#f8fafc',
                    background: 'rgba(2, 6, 23, 0.72)',
                    outline: 'none',
                  }}
                />
              </label>

              <ControlRange
                label={`Array size: ${arraySize}`}
                min="5"
                max="50"
                value={arraySize}
                disabled={isRunning}
                onChange={(event) => generateRandomSearchArray(Number(event.target.value))}
              />

              <button className="secondary-action" type="button" onClick={() => generateRandomSearchArray()} disabled={isRunning}>
                Randomize Sorted Array
              </button>
            </>
          )}

          {category === 'trees' && (
            <>
              <form className="input-row" onSubmit={applyTreeInput}>
                <input
                  value={manualInput}
                  onChange={(event) => setManualInput(event.target.value)}
                  placeholder="50, 25, 75, 12, 37"
                  disabled={isRunning}
                  aria-label="Comma separated tree values"
                />
                <button type="submit" disabled={isRunning}>
                  Set
                </button>
              </form>
              {inputError && <p className="field-error">{inputError}</p>}

              {(selectedAlgorithm === 'bstSearch') && (
                <label className="select-control">
                  <span>Target value</span>
                  <input
                    type="number"
                    value={searchTarget}
                    onChange={(event) => setSearchTarget(event.target.value)}
                    disabled={isRunning}
                    placeholder="Enter a number to find"
                    style={{
                      padding: '12px',
                      border: '1px solid rgba(148, 163, 184, 0.22)',
                      borderRadius: '10px',
                      color: '#f8fafc',
                      background: 'rgba(2, 6, 23, 0.72)',
                      outline: 'none',
                    }}
                  />
                </label>
              )}

              <ControlRange
                label={`Tree nodes: ${arraySize}`}
                min="3"
                max="31"
                value={arraySize}
                disabled={isRunning}
                onChange={(event) => {
                  setArraySize(Number(event.target.value))
                  generateRandomTree(Number(event.target.value))
                }}
              />

              <button className="secondary-action" type="button" onClick={() => generateRandomTree()} disabled={isRunning}>
                Randomize Tree
              </button>
            </>
          )}

          {category === 'dp' && (
            <>
              {selectedAlgorithm === 'fibonacci' && (
                <ControlRange
                  label={`n = ${fibN}`}
                  min="1"
                  max="30"
                  value={fibN}
                  disabled={isRunning}
                  onChange={(event) => {
                    setFibN(Number(event.target.value))
                    setDpTable([])
                    setDpResult(null)
                    clearHighlights()
                  }}
                />
              )}

              {selectedAlgorithm === 'gridTraveler' && (
                <>
                  <ControlRange
                    label={`Rows: ${gridRows}`}
                    min="2"
                    max="8"
                    value={gridRows}
                    disabled={isRunning}
                    onChange={(event) => {
                      setGridRows(Number(event.target.value))
                      setDpGrid([])
                      clearHighlights()
                    }}
                  />
                  <ControlRange
                    label={`Cols: ${gridCols}`}
                    min="2"
                    max="8"
                    value={gridCols}
                    disabled={isRunning}
                    onChange={(event) => {
                      setGridCols(Number(event.target.value))
                      setDpGrid([])
                      clearHighlights()
                    }}
                  />
                </>
              )}
            </>
          )}

          {category === 'stackqueue' && (
            <>
              <div className="graph-note">
                <strong>{sqValues.length} items</strong>
                <span>
                  {selectedAlgorithm?.startsWith('stack')
                    ? 'Stack: Last-In-First-Out (LIFO). Push adds to top, Pop removes from top.'
                    : 'Queue: First-In-First-Out (FIFO). Enqueue adds to rear, Dequeue removes from front.'}
                </span>
              </div>

              <button
                className="secondary-action"
                type="button"
                onClick={() => {
                  setSqValues(createRandomValues(5))
                  setSqOperation('')
                  clearHighlights()
                  setStatus('New random data')
                }}
                disabled={isRunning}
              >
                Randomize Data
              </button>
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

          {activeAlgorithm && <ComplexityCard algorithm={activeAlgorithm} />}
        </aside>
      </section>
    </main>
  )
}

export default App
