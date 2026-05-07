export default function Spinner({ message = 'Procesando...' }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 0',
    }}>
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        border: '2px solid var(--border)',
        borderTopColor: 'var(--accent)',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }} />
      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        {message}
      </span>
    </div>
  )
}