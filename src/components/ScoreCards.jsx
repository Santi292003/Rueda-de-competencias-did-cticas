import { DIMENSIONS, GROUPS } from '../data/dimensions.js'
import { scoreColor, fmtVal, calcDimAvg } from '../hooks/useScores.js'

function ScoreDisplay({ value }) {
  const color = value !== null ? scoreColor(value) : '#38384f'
  return (
    <div style={{
      fontSize: '16px',
      fontWeight: '700',
      width: '48px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      border: `1.5px solid ${color}`,
      color: color,
    }}>
      {fmtVal(value)}
    </div>
  )
}

function DimCard({ dimIndex, scores, mode }) {
  const dim = DIMENSIONS[dimIndex]
  const desempenios = ['D1', 'D2', 'D3']

  return (
    <div style={{
      background: '#272736',
      border: '1px solid #38384f',
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        padding: '8px 11px',
        background: '#303044',
        borderBottom: '1px solid #38384f',
        minHeight: '40px',
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: dim.color,
          flexShrink: 0,
          marginTop: '3px',
          display: 'inline-block',
        }} />
        <span style={{
          fontSize: '11px',
          fontWeight: '500',
          color: '#e8e6f0',
          lineHeight: '1.35',
        }}>
          {dim.name}
        </span>
      </div>

      {/* Valores */}
      <div style={{ display: 'flex' }}>
        {mode === 'dimensiones' ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 4px 12px',
            gap: '5px',
          }}>
            <div style={{ fontSize: '9px', color: '#6e6c88', fontWeight: '500' }}>
              Promedio dimension
            </div>
            <ScoreDisplay value={calcDimAvg(scores, dimIndex)} />
          </div>
        ) : (
          desempenios.map((d, di) => (
            <div key={d} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px 4px 12px',
              gap: '5px',
              borderRight: di < 2 ? '1px solid #38384f' : 'none',
            }}>
              <div style={{ fontSize: '9px', color: '#6e6c88', fontWeight: '500' }}>
                {d}
              </div>
              <ScoreDisplay value={scores[dimIndex]?.[di] ?? null} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function FundamentoGroup({ group, scores, mode }) {
  const borderColors = {
    pedagogico: '#7aafd4',
    tecnologico: '#d4b040',
    profesional: '#e888b8',
  }
  const bgColors = {
    pedagogico: 'rgba(122,175,212,0.09)',
    tecnologico: 'rgba(212,176,64,0.09)',
    profesional: 'rgba(232,136,184,0.09)',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Header del grupo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 14px',
        borderRadius: '8px',
        borderLeft: `3px solid ${borderColors[group.key]}`,
        background: bgColors[group.key],
      }}>
        <span style={{ fontSize: '14px' }}>{group.icon}</span>
        <span style={{ fontSize: '12px', fontWeight: '500', color: '#e8e6f0' }}>
          {group.title}
        </span>
      </div>

      {/* Grid de tarjetas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
      }}>
        {group.dims.map(ci => (
          <DimCard
            key={ci}
            dimIndex={ci}
            scores={scores}
            mode={mode}
          />
        ))}
      </div>
    </div>
  )
}

export default function ScoreCards({ scores, mode = 'desempenios' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        fontSize: '11px',
        fontWeight: '500',
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: '#6e6c88',
      }}>
        {mode === 'desempenios'
          ? 'Valores por dimension y desempeno'
          : 'Valores por dimension'}
      </div>
      {GROUPS.map(group => (
        <FundamentoGroup
          key={group.key}
          group={group}
          scores={scores}
          mode={mode}
        />
      ))}
    </div>
  )
}