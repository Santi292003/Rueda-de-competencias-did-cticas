import { fmtVal } from '../hooks/useScores.js'

export default function ContextBanner({ title, sub, count, globalAvg }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '12px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--text-primary)',
          marginBottom: '3px',
        }}>
          {title}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {sub}
        </div>
      </div>
      <Stat value={count} label="Docentes" />
      <Stat value={fmtVal(globalAvg)} label="Promedio global" />
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2px',
      padding: '0 14px',
      borderLeft: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent)' }}>
        {value}
      </div>
      <div style={{
        fontSize: '9px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '.05em',
      }}>
        {label}
      </div>
    </div>
  )
}