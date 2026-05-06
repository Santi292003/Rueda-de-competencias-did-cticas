import { fmtVal } from '../hooks/useScores.js'

export default function ContextBanner({ title, sub, count, globalAvg }) {
  return (
    <div style={{
      background: '#272736',
      border: '1px solid #38384f',
      borderRadius: '10px',
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
          color: '#e8e6f0',
          marginBottom: '3px',
        }}>
          {title}
        </div>
        <div style={{ fontSize: '11px', color: '#6e6c88' }}>
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
      borderLeft: '1px solid #38384f',
    }}>
      <div style={{
        fontSize: '18px',
        fontWeight: '700',
        color: '#7b9fd4',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '9px',
        color: '#6e6c88',
        textTransform: 'uppercase',
        letterSpacing: '.05em',
      }}>
        {label}
      </div>
    </div>
  )
}