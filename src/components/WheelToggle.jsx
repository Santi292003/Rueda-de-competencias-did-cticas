export default function WheelToggle({ mode, onChange }) {
  const btn = (value, label) => (
    <button
      onClick={() => onChange(value)}
      style={{
        fontFamily: 'inherit',
        fontSize: '12px',
        fontWeight: '500',
        padding: '7px 16px',
        background: mode === value ? 'var(--bg-surface2)' : 'transparent',
        color: mode === value ? 'var(--text-primary)' : 'var(--text-muted)',
        border: 'none',
        borderRadius: '7px',
        cursor: 'pointer',
        transition: 'background .15s, color .15s',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{
      display: 'flex',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '4px',
      gap: '4px',
    }}>
      {btn('desempenios', 'Vista por desempeños')}
      {btn('dimensiones', 'Vista por dimensiones')}
    </div>
  )
}