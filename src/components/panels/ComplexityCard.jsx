import Metric from '../common/Metric'

function ComplexityCard({ algorithm }) {
  const { complexity } = algorithm

  return (
    <div className="complexity-card">
      <div>
        <h3>{algorithm.name}</h3>
        <p>{algorithm.summary}</p>
      </div>
      <div className="complexity-grid">
        <Metric label="Best" value={complexity.best} />
        <Metric label="Average" value={complexity.average} />
        <Metric label="Worst" value={complexity.worst} />
        <Metric label="Space" value={complexity.space} />
      </div>
    </div>
  )
}

export default ComplexityCard
