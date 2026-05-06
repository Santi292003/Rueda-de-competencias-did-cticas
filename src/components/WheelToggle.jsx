export default function WheelToggle({ mode, onChange }) {
  const btn = (value, label) => (
    <button
      onClick={() => onChange(value)}
      style={{
        fontFamily: 'inherit',
        fontSize: '12px',
        fontWeight: '500',
        padding: '7px 16px',
        background: mode === value ? '#303044' : 'transparent',
        color: mode === value ? '#e8e6f0' : '#6e6c88',
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
      background: '#272736',
      border: '1px solid #38384f',
      borderRadius: '10px',
      padding: '4px',
      gap: '4px',
    }}>
      {btn('desempenios', 'Vista por desempeños')}
      {btn('dimensiones', 'Vista por dimensiones')}
    </div>
  )
}