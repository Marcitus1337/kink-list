function Legend({ scale }) {
  return (
    <div className="legend" aria-label="Legende der Antwortmöglichkeiten">
      {scale.map((option) => (
        <div className="legend-item" key={option.value}>
          <span className={`legend-dot color-${option.color}`} />
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  );
}

export default Legend;