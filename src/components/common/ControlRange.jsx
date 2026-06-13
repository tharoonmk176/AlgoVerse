function ControlRange({ label, ...props }) {
  return (
    <label className="range-control">
      <span>{label}</span>
      <input type="range" {...props} />
    </label>
  )
}

export default ControlRange
