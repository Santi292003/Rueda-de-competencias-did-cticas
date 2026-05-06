const LEVELS = [
  { value: 1, color: 'var(--s1)', label: 'Nunca' },
  { value: 2, color: 'var(--s2)', label: 'Rara vez' },
  { value: 3, color: 'var(--s3)', label: 'A veces' },
  { value: 4, color: 'var(--s4)', label: 'Frecuentemente' },
  { value: 5, color: 'var(--s5)', label: 'Siempre' },
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
          color: 'var(--text-secondary)',
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