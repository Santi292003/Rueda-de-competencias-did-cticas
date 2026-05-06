import { DIMENSIONS } from '../data/dimensions.js'
import { ITEM_MAP } from '../data/itemMap.js'
import { scoreColor, fmtVal } from '../hooks/useScores.js'

// Calcula scores individuales para una sola fila del CSV
function calcRowScores(row) {
  const acc = {}
  DIMENSIONS.forEach(dim => {
    ;['D1', 'D2', 'D3'].forEach(d => {
      acc[`${dim.code}_${d}`] = [0, 0]
    })
  })

  ITEM_MAP.forEach(item => {
    const v = parseFloat(row[item.col])
    if (isNaN(v) || v < 1 || v > 5) return
    item.targets.forEach(([dimCode, desCode]) => {
      const key = `${dimCode}_${desCode}`
      if (acc[key]) {
        acc[key][0] += v
        acc[key][1] += 1
      }
    })
  })

  return DIMENSIONS.map(dim =>
    ['D1', 'D2', 'D3'].map(d => {
      const [sum, count] = acc[`${dim.code}_${d}`]
      return count > 0 ? sum / count : null
    })
  )
}

function dimAvg(rowScores, ci) {
  const vals = rowScores[ci].filter(v => v !== null)
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
}

function globalAvg(rowScores) {
  const vals = rowScores.flat().filter(v => v !== null)
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
}

function Badge({ value }) {
  const bg = value !== null ? scoreColor(value) : '#444'
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '32px',
      padding: '2px 5px',
      borderRadius: '5px',
      fontWeight: '700',
      fontSize: '11px',
      color: '#fff',
      background: bg,
    }}>
      {fmtVal(value)}
    </span>
  )
}

export default function SummaryTable({ rows }) {
  if (!rows || rows.length <= 1) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{
        fontSize: '11px',
        fontWeight: '500',
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: '#6e6c88',
      }}>
        Detalle por docente
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr>
              <th style={{
                textAlign: 'left',
                padding: '7px 8px',
                borderBottom: '1px solid #38384f',
                color: '#6e6c88',
                fontWeight: '500',
                whiteSpace: 'nowrap',
              }}>
                Docente
              </th>
              {DIMENSIONS.map(dim => (
                <th key={dim.code} style={{
                  textAlign: 'center',
                  padding: '7px 8px',
                  borderBottom: '1px solid #38384f',
                  color: '#6e6c88',
                  fontWeight: '500',
                  fontSize: '9px',
                  whiteSpace: 'nowrap',
                  maxWidth: '80px',
                }}>
                  {dim.name}
                </th>
              ))}
              <th style={{
                textAlign: 'center',
                padding: '7px 8px',
                borderBottom: '1px solid #38384f',
                color: '#6e6c88',
                fontWeight: '500',
                whiteSpace: 'nowrap',
              }}>
                Prom.
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const rs = calcRowScores(row)
              const ga = globalAvg(rs)
              return (
                <tr key={i} style={{ transition: 'background .1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{
                    padding: '7px 8px',
                    borderBottom: '0.5px solid #38384f',
                    color: '#e8e6f0',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                  }}>
                    {row.nombre || '—'}
                  </td>
                  {DIMENSIONS.map((dim, ci) => (
                    <td key={dim.code} style={{
                      textAlign: 'center',
                      padding: '7px 8px',
                      borderBottom: '0.5px solid #38384f',
                    }}>
                      <Badge value={dimAvg(rs, ci)} />
                    </td>
                  ))}
                  <td style={{
                    textAlign: 'center',
                    padding: '7px 8px',
                    borderBottom: '0.5px solid #38384f',
                  }}>
                    <Badge value={ga} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}