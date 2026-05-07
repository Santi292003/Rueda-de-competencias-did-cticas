import { useEffect, useRef } from 'react'
import { DIMENSIONS } from '../data/dimensions.js'
import { scoreColor, scoreFrac, fmtVal, calcDimAvg } from '../hooks/useScores.js'

const DESEMPENIOS = ['D1', 'D2', 'D3']
const ANIM_DURATION = 600 // ms

// ── Interpolación lineal ───────────────────────────────────────────────────
function lerp(a, b, t) {
  if (a === null && b === null) return null
  if (a === null) return b
  if (b === null) return a
  return a + (b - a) * t
}

function lerpScores(from, to, t) {
  return from.map((dim, ci) =>
    dim.map((v, di) => lerp(v, to[ci][di], t))
  )
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

// ── Draw helpers ───────────────────────────────────────────────────────────
function drawBase(ctx, cx, cy, R, innerR) {
  ctx.beginPath()
  ctx.arc(cx, cy, R + 2, 0, Math.PI * 2)
  ctx.fillStyle = '#022a47'
  ctx.fill()

  for (let g = 1; g <= 5; g++) {
    const r = innerR + (R - innerR) * (g / 5)
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = g === 5 ? 'rgba(224,82,82,0.22)' : 'rgba(255,255,255,0.06)'
    ctx.lineWidth = g === 5 ? 1.5 : 0.5
    ctx.stroke()
  }

  ctx.font = '9px "Times New Roman", serif'
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  for (let v = 1; v <= 5; v++) {
    const r = innerR + (R - innerR) * scoreFrac(v)
    ctx.fillText(v, cx + 3, cy - r)
  }
}

function drawCenter(ctx, cx, cy, innerR, label) {
  ctx.beginPath()
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
  ctx.fillStyle = '#02172B'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1
  ctx.stroke()

  if (label) {
    const maxWidth = innerR * 1.6
    const words = label.split(' ')
    const lines = []
    let cur = ''
    words.forEach(w => {
      const test = cur ? cur + ' ' + w : w
      ctx.font = '500 9px "Times New Roman", serif'
      if (ctx.measureText(test).width > maxWidth && cur) {
        lines.push(cur)
        cur = w
      } else {
        cur = test
      }
    })
    if (cur) lines.push(cur)
    const visibleLines = lines.slice(0, 2)
    const lh = 11
    const off = -(visibleLines.length - 1) * lh / 2
    ctx.font = '500 9px "Times New Roman", serif'
    ctx.fillStyle = '#9e9bb8'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    visibleLines.forEach((ln, i) => ctx.fillText(ln, cx, cy + off + i * lh))
  }
}

function drawDimLabel(ctx, cx, cy, R, midA, name) {
  const dist = R + 38
  const lx = cx + Math.cos(midA) * dist
  const ly = cy + Math.sin(midA) * dist

  // Word wrap
  const words = name.split(' ')
  const lines = []
  let cur = ''
  words.forEach(w => {
    if ((cur + ' ' + w).trim().length > 12 && cur) {
      lines.push(cur)
      cur = w
    } else {
      cur = (cur + ' ' + w).trim()
    }
  })
  if (cur) lines.push(cur)

  // Alineación según posición en el círculo
  const normA = ((midA % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
  let align
  if (normA < Math.PI * 0.15 || normA > Math.PI * 1.85) {
    align = 'center' // arriba
  } else if (normA < Math.PI * 0.85) {
    align = 'left'   // derecha
  } else if (normA < Math.PI * 1.15) {
    align = 'center' // abajo
  } else {
    align = 'right'  // izquierda
  }

  ctx.font = '500 10px "Times New Roman", serif'
  ctx.fillStyle = '#c8c6e0'
  ctx.textAlign = align
  ctx.textBaseline = 'middle'

  const lh = 13
  const off = -(lines.length - 1) * lh / 2
  lines.forEach((ln, i) => {
    ctx.fillText(ln, lx, ly + off + i * lh)
  })
}

function drawSlice(ctx, cx, cy, R, innerR, a1, a2, v) {
  const midA = a1 + (a2 - a1) / 2

  if (v === null) {
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a1) * innerR, cy + Math.sin(a1) * innerR)
    ctx.arc(cx, cy, innerR + 6, a1, a2)
    ctx.lineTo(cx + Math.cos(a2) * innerR, cy + Math.sin(a2) * innerR)
    ctx.arc(cx, cy, innerR, a2, a1, true)
    ctx.closePath()
    ctx.fillStyle = 'rgba(255,255,255,0.06)'
    ctx.fill()
    return
  }

  const outerR = innerR + (R - innerR) * scoreFrac(v)

  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.arc(cx, cy, outerR, a1, a2)
  ctx.closePath()
  ctx.fillStyle = scoreColor(v)
  ctx.globalAlpha = 0.8
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.beginPath()
  ctx.moveTo(cx + Math.cos(a1) * innerR, cy + Math.sin(a1) * innerR)
  ctx.arc(cx, cy, outerR, a1, a2)
  ctx.lineTo(cx + Math.cos(a2) * innerR, cy + Math.sin(a2) * innerR)
  ctx.arc(cx, cy, innerR, a2, a1, true)
  ctx.closePath()
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'
  ctx.lineWidth = 0.7
  ctx.stroke()

  return { midA, outerR }
}

function drawDesempenios(ctx, cx, cy, R, innerR, scores) {
  const N = DIMENSIONS.length
  const D = 3
  const sliceAngle = (Math.PI * 2) / (N * D)
  const startAngle = -Math.PI / 2

  drawBase(ctx, cx, cy, R, innerR)

  for (let ci = 0; ci < N; ci++) {
    for (let di = 0; di < D; di++) {
      const si = ci * D + di
      const a1 = startAngle + si * sliceAngle
      const a2 = a1 + sliceAngle
      const v = scores[ci]?.[di]
      const midA = a1 + sliceAngle / 2

      const result = drawSlice(ctx, cx, cy, R, innerR, a1, a2, v)

      if (result && v !== null) {
        const lr = innerR + (R - innerR) * scoreFrac(v) * 0.52
        ctx.save()
        ctx.translate(cx + Math.cos(midA) * lr, cy + Math.sin(midA) * lr)
        ctx.rotate(midA + Math.PI / 2)

        // Etiqueta D1/D2/D3
        ctx.font = '500 8px "Times New Roman", serif'
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('D' + (di + 1), 0, -6)

        // Valor numérico
        ctx.font = '700 10px "Times New Roman", serif'
        ctx.fillStyle = 'rgba(255,255,255,0.95)'
        ctx.fillText(fmtVal(v), 0, 5)

        ctx.restore()
      }
    }

    const a1c = startAngle + ci * D * sliceAngle
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a1c) * innerR, cy + Math.sin(a1c) * innerR)
    ctx.lineTo(cx + Math.cos(a1c) * (R + 3), cy + Math.sin(a1c) * (R + 3))
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    const midA = startAngle + (ci * D + D / 2) * sliceAngle
    drawDimLabel(ctx, cx, cy, R, midA, DIMENSIONS[ci].name)
  }
}

function drawDimensiones(ctx, cx, cy, R, innerR, scores) {
  const N = DIMENSIONS.length
  const sliceAngle = (Math.PI * 2) / N
  const startAngle = -Math.PI / 2

  drawBase(ctx, cx, cy, R, innerR)

  for (let ci = 0; ci < N; ci++) {
    const a1 = startAngle + ci * sliceAngle
    const a2 = a1 + sliceAngle
    const midA = a1 + sliceAngle / 2
    const v = calcDimAvg(scores, ci)

    const result = drawSlice(ctx, cx, cy, R, innerR, a1, a2, v)

    if (result && v !== null) {
      const lr = innerR + (R - innerR) * scoreFrac(v) * 0.5
      ctx.save()
      ctx.translate(cx + Math.cos(midA) * lr, cy + Math.sin(midA) * lr)
      ctx.rotate(midA + Math.PI / 2)
      ctx.font = '600 10px "Times New Roman", serif'
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(fmtVal(v), 0, 0)
      ctx.restore()
    }

    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a1) * innerR, cy + Math.sin(a1) * innerR)
    ctx.lineTo(cx + Math.cos(a1) * (R + 3), cy + Math.sin(a1) * (R + 3))
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    drawDimLabel(ctx, cx, cy, R, midA, DIMENSIONS[ci].name)
  }
}

function drawFilterIndicator(ctx, cx, cy, R) {
  // Arco exterior pulsante — se dibuja como un anillo fino de acento
  const r = R + 10
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(0, 180, 221, 0.6)'
  ctx.lineWidth = 2.5
  ctx.setLineDash([6, 4])
  ctx.stroke()
  ctx.setLineDash([]) // resetear para no afectar otros trazos

  // Etiqueta en la parte superior
  ctx.font = '500 10px "Times New Roman", serif'
  ctx.fillStyle = 'rgba(0, 180, 221, 0.85)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Filtros activos', cx, cy - R - 22)
}

function getHoveredSegment(x, y, cx, cy, R, innerR, scores, mode) {
  const dx = x - cx
  const dy = y - cy
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist < innerR || dist > R) return null

  let angle = Math.atan2(dy, dx)
  const startAngle = -Math.PI / 2
  angle = ((angle - startAngle) + Math.PI * 2) % (Math.PI * 2)

  if (mode === 'dimensiones') {
    const N = DIMENSIONS.length
    const sliceAngle = (Math.PI * 2) / N
    const ci = Math.floor(angle / sliceAngle)
    if (ci < 0 || ci >= N) return null
    const v = calcDimAvg(scores, ci)
    if (v === null) return null
    const outerR = innerR + (R - innerR) * scoreFrac(v)
    if (dist > outerR) return null
    return {
      label: DIMENSIONS[ci].name,
      sub: 'Promedio dimension',
      value: v,
    }
  } else {
    const N = DIMENSIONS.length
    const D = 3
    const sliceAngle = (Math.PI * 2) / (N * D)
    const si = Math.floor(angle / sliceAngle)
    const ci = Math.floor(si / D)
    const di = si % D
    if (ci < 0 || ci >= N) return null
    const v = scores[ci]?.[di]
    if (v === null || v === undefined) return null
    const outerR = innerR + (R - innerR) * scoreFrac(v)
    if (dist > outerR) return null
    return {
      label: DIMENSIONS[ci].name,
      sub: `Desempeño D${di + 1}`,
      value: v,
    }
  }
}

// ── Componente ─────────────────────────────────────────────────────────────
export default function Wheel({ scores, mode = 'desempenios', centerLabel = '', hasActiveFilters = false }) {
  const canvasRef = useRef(null)

  // Refs para animación
  const animRef = useRef(null)
  const fromScores = useRef(scores)
  const toScores = useRef(scores)
  const startTime = useRef(null)
  const prevMode = useRef(mode)
  const tooltipRef = useRef(null)
  const hoveredRef = useRef(null)

  useEffect(() => {
    // Cancelar animación anterior si existe
    if (animRef.current) {
      cancelAnimationFrame(animRef.current)
    }

    // El punto de partida es donde estaba la animación al interrumpirse
    fromScores.current = toScores.current
    toScores.current = scores
    startTime.current = null
    prevMode.current = mode

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2
    const R = 222
    const innerR = 22

    function animate(timestamp) {
      if (!startTime.current) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const rawT = Math.min(elapsed / ANIM_DURATION, 1)
      const t = easeInOut(rawT)

      const interpolated = lerpScores(fromScores.current, toScores.current, t)

      ctx.clearRect(0, 0, W, H)

      if (mode === 'dimensiones') {
        drawDimensiones(ctx, cx, cy, R, innerR, interpolated)
      } else {
        drawDesempenios(ctx, cx, cy, R, innerR, interpolated)
      }
      if (hasActiveFilters) {
        drawFilterIndicator(ctx, cx, cy, R)
      }

      drawCenter(ctx, cx, cy, innerR, centerLabel)

      drawCenter(ctx, cx, cy, innerR, centerLabel)

      if (rawT < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        // Animación completa — guardar estado final
        fromScores.current = scores
      }
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [scores, mode, centerLabel])

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas
        ref={canvasRef}
        width={580}
        height={580}
        style={{ display: 'block', width: '580px', height: '580px', cursor: 'crosshair' }}
        onMouseMove={e => {
          const canvas = canvasRef.current
          if (!canvas) return
          const rect = canvas.getBoundingClientRect()
          const scaleX = canvas.width / rect.width
          const scaleY = canvas.height / rect.height
          const x = (e.clientX - rect.left) * scaleX
          const y = (e.clientY - rect.top) * scaleY
          const cx = canvas.width / 2
          const cy = canvas.height / 2

          const segment = getHoveredSegment(x, y, cx, cy, 222, 22, toScores.current, mode)
          const tooltip = tooltipRef.current
          if (!tooltip) return

          if (segment) {
            const color = scoreColor(segment.value)
            tooltip.innerHTML = `
              <div style="font-size:11px;color:#8ab0cc;margin-bottom:3px">${segment.sub}</div>
              <div style="font-size:13px;font-weight:600;color:#f0f4f8;margin-bottom:6px">${segment.label}</div>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="width:10px;height:10px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0"></span>
                <span style="font-size:18px;font-weight:700;color:${color}">${fmtVal(segment.value)}</span>
              </div>
            `
            tooltip.style.display = 'block'
            const containerRect = canvas.parentElement.getBoundingClientRect()
            let tx = e.clientX - containerRect.left + 14
            let ty = e.clientY - containerRect.top - 10
            if (tx + 170 > containerRect.width) tx = tx - 184
            if (ty + 90 > containerRect.height) ty = ty - 90
            tooltip.style.left = tx + 'px'
            tooltip.style.top = ty + 'px'
          } else {
            tooltip.style.display = 'none'
          }
        }}
        onMouseLeave={() => {
          if (tooltipRef.current) tooltipRef.current.style.display = 'none'
        }}
      />

      <div
        ref={tooltipRef}
        style={{
          display: 'none',
          position: 'absolute',
          pointerEvents: 'none',
          background: '#022a47',
          border: '1px solid #004d8a',
          borderRadius: '8px',
          padding: '10px 14px',
          minWidth: '160px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          zIndex: 10,
        }}
      />
    </div>
  )
}