const LEVELS = [
  { value: 1, color: '#e05252', label: 'Nunca' },
  { value: 2, color: '#e8884a', label: 'Rara vez' },
  { value: 3, color: '#d4b800', label: 'A veces' },
  { value: 4, color: '#7dbe5e', label: 'Frecuentemente' },
  { value: 5, color: '#3ec97a', label: 'Siempre' },
]

export default function WheelLegend() {
  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}>
      {LEVELS.map(({ value, color, label }) => (
        <div key={value} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: '#9e9bb8',
        }}>
          <span style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            background: color,
            flexShrink: 0,
            display: 'inline-block',
          }} />
          {value} — {label}
        </div>
      ))}
    </div>
  )
}