import { useState } from 'react'
import { DIMENSIONS } from '../data/dimensions.js'
import { ITEM_MAP } from '../data/itemMap.js'
import { scoreColor, fmtVal } from '../hooks/useScores.js'

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
      if (acc[key]) { acc[key][0] += v; acc[key][1] += 1 }
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
      background: value !== null ? scoreColor(value) : 'var(--border)',
    }}>
      {fmtVal(value)}
    </span>
  )
}

function SortIcon({ active, direction }) {
  return (
    <span style={{
      fontSize: '9px',
      marginLeft: '3px',
      opacity: active ? 1 : 0.3,
      color: active ? 'var(--accent)' : 'var(--text-muted)',
    }}>
      {active ? (direction === 'desc' ? '▼' : '▲') : '▼'}
    </span>
  )
}

export default function SummaryTable({ rows }) {
  const [sortKey, setSortKey] = useState('global')
  const [sortDir, setSortDir] = useState('desc')

  if (!rows || rows.length <= 1) return null

  // Calcular scores para todas las filas
  const rowsWithScores = rows.map(row => ({
    row,
    scores: calcRowScores(row),
  })).map(({ row, scores }) => ({
    row,
    scores,
    dimAvgs: DIMENSIONS.map((_, ci) => dimAvg(scores, ci)),
    global: globalAvg(scores),
  }))

  // Ordenar
  const sorted = [...rowsWithScores].sort((a, b) => {
    let va, vb
    if (sortKey === 'global') {
      va = a.global ?? -1
      vb = b.global ?? -1
    } else {
      const ci = parseInt(sortKey)
      va = a.dimAvgs[ci] ?? -1
      vb = b.dimAvgs[ci] ?? -1
    }
    return sortDir === 'desc' ? vb - va : va - vb
  })

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const thStyle = (key) => ({
    textAlign: 'center',
    padding: '7px 8px',
    borderBottom: '1px solid var(--border)',
    color: sortKey === key ? 'var(--accent)' : 'var(--text-muted)',
    fontWeight: '500',
    fontSize: '9px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'color .15s',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '500',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          Detalle por docente
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Haz clic en un encabezado para ordenar
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr>
              <th style={{
                textAlign: 'left',
                padding: '7px 8px',
                borderBottom: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontWeight: '500',
                whiteSpace: 'nowrap',
              }}>
                Docente
              </th>
              {DIMENSIONS.map((dim, ci) => (
                <th
                  key={dim.code}
                  style={thStyle(String(ci))}
                  onClick={() => handleSort(String(ci))}
                >
                  {dim.name}
                  <SortIcon active={sortKey === String(ci)} direction={sortDir} />
                </th>
              ))}
              <th
                style={thStyle('global')}
                onClick={() => handleSort('global')}
              >
                Prom. global
                <SortIcon active={sortKey === 'global'} direction={sortDir} />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ row, dimAvgs, global }, i) => (
              <tr
                key={i}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{
                  padding: '7px 8px',
                  borderBottom: '0.5px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                }}>
                  {row.nombre || '—'}
                </td>
                {dimAvgs.map((v, ci) => (
                  <td key={ci} style={{
                    textAlign: 'center',
                    padding: '7px 8px',
                    borderBottom: '0.5px solid var(--border)',
                    background: sortKey === String(ci) ? 'rgba(0,180,221,0.04)' : 'transparent',
                  }}>
                    <Badge value={v} />
                  </td>
                ))}
                <td style={{
                  textAlign: 'center',
                  padding: '7px 8px',
                  borderBottom: '0.5px solid var(--border)',
                  background: sortKey === 'global' ? 'rgba(0,180,221,0.04)' : 'transparent',
                }}>
                  <Badge value={global} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}