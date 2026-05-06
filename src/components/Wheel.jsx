import { useEffect, useRef } from 'react'
import { DIMENSIONS } from '../data/dimensions.js'
import { scoreColor, scoreFrac, fmtVal, calcDimAvg } from '../hooks/useScores.js'

const DESEMPENIOS = ['D1', 'D2', 'D3']

function drawBase(ctx, cx, cy, R, innerR) {
  // Fondo del círculo
  ctx.beginPath()
  ctx.arc(cx, cy, R + 2, 0, Math.PI * 2)
  ctx.fillStyle = '#272736'
  ctx.fill()

  // Anillos de referencia
  for (let g = 1; g <= 5; g++) {
    const r = innerR + (R - innerR) * (g / 5)
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = g === 5
      ? 'rgba(224,82,82,0.22)'
      : 'rgba(255,255,255,0.06)'
    ctx.lineWidth = g === 5 ? 1.5 : 0.5
    ctx.stroke()
  }

  // Números de escala
  ctx.font = '9px "DM Sans", sans-serif'
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
  ctx.fillStyle = '#1e1e2a'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1
  ctx.stroke()

  if (label) {
    ctx.font = '500 10px "DM Sans", sans-serif'
    ctx.fillStyle = '#9e9bb8'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label.slice(0, 12), cx, cy)
  }
}

function drawDimLabel(ctx, cx, cy, R, midA, name) {
  const lx = cx + Math.cos(midA) * (R + 32)
  const ly = cy + Math.sin(midA) * (R + 32)
  ctx.save()
  ctx.translate(lx, ly)
  const normA = ((midA % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
  const rot = (normA <= Math.PI / 2 || normA >= Math.PI * 1.5)
    ? midA - Math.PI / 2
    : midA + Math.PI / 2
  ctx.rotate(rot)
  ctx.font = '500 10px "DM Sans", sans-serif'
  ctx.fillStyle = '#c8c6e0'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Word wrap
  const words = name.split(' ')
  const lines = []
  let cur = ''
  words.forEach(w => {
    if ((cur + ' ' + w).trim().length > 13 && cur) {
      lines.push(cur)
      cur = w
    } else {
      cur = (cur + ' ' + w).trim()
    }
  })
  if (cur) lines.push(cur)

  const lh = 12
  const off = -(lines.length - 1) * lh / 2
  lines.forEach((ln, i) => ctx.fillText(ln, 0, off + i * lh))
  ctx.restore()
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

      if (v === null || v === undefined) {
        // Sin datos — franja sutil
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a1) * innerR, cy + Math.sin(a1) * innerR)
        ctx.arc(cx, cy, innerR + 6, a1, a2)
        ctx.lineTo(cx + Math.cos(a2) * innerR, cy + Math.sin(a2) * innerR)
        ctx.arc(cx, cy, innerR, a2, a1, true)
        ctx.closePath()
        ctx.fillStyle = 'rgba(255,255,255,0.06)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.1)'
        ctx.lineWidth = 0.5
        ctx.stroke()
        // Label tenue
        ctx.save()
        ctx.translate(cx + Math.cos(midA) * (innerR + 14), cy + Math.sin(midA) * (innerR + 14))
        ctx.rotate(midA + Math.PI / 2)
        ctx.font = '9px "DM Sans", sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('D' + (di + 1), 0, 0)
        ctx.restore()
        continue
      }

      const frac = scoreFrac(v)
      const outerR = innerR + (R - innerR) * frac

      // Relleno
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, outerR, a1, a2)
      ctx.closePath()
      ctx.fillStyle = scoreColor(v)
      ctx.globalAlpha = 0.8
      ctx.fill()
      ctx.globalAlpha = 1

      // Borde
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(a1) * innerR, cy + Math.sin(a1) * innerR)
      ctx.arc(cx, cy, outerR, a1, a2)
      ctx.lineTo(cx + Math.cos(a2) * innerR, cy + Math.sin(a2) * innerR)
      ctx.arc(cx, cy, innerR, a2, a1, true)
      ctx.closePath()
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'
      ctx.lineWidth = 0.7
      ctx.stroke()

      // Etiqueta D1/D2/D3
      const lr = innerR + (R - innerR) * frac * 0.52
      ctx.save()
      ctx.translate(cx + Math.cos(midA) * lr, cy + Math.sin(midA) * lr)
      ctx.rotate(midA + Math.PI / 2)
      ctx.font = '500 9px "DM Sans", sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('D' + (di + 1), 0, 0)
      ctx.restore()
    }

    // Separador entre dimensiones
    const a1c = startAngle + ci * D * sliceAngle
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a1c) * innerR, cy + Math.sin(a1c) * innerR)
    ctx.lineTo(cx + Math.cos(a1c) * (R + 3), cy + Math.sin(a1c) * (R + 3))
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Etiqueta de dimensión
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

    if (v === null) {
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(a1) * innerR, cy + Math.sin(a1) * innerR)
      ctx.arc(cx, cy, innerR + 8, a1, a2)
      ctx.lineTo(cx + Math.cos(a2) * innerR, cy + Math.sin(a2) * innerR)
      ctx.arc(cx, cy, innerR, a2, a1, true)
      ctx.closePath()
      ctx.fillStyle = 'rgba(255,255,255,0.06)'
      ctx.fill()
    } else {
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

      // Valor dentro del segmento
      const lr = innerR + (R - innerR) * scoreFrac(v) * 0.5
      ctx.save()
      ctx.translate(cx + Math.cos(midA) * lr, cy + Math.sin(midA) * lr)
      ctx.rotate(midA + Math.PI / 2)
      ctx.font = '600 10px "DM Sans", sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(fmtVal(v), 0, 0)
      ctx.restore()
    }

    // Separador
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a1) * innerR, cy + Math.sin(a1) * innerR)
    ctx.lineTo(cx + Math.cos(a1) * (R + 3), cy + Math.sin(a1) * (R + 3))
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    drawDimLabel(ctx, cx, cy, R, midA, DIMENSIONS[ci].name)
  }
}

// ── Componente ─────────────────────────────────────────────────────────────

export default function Wheel({ scores, mode = 'desempenios', centerLabel = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const cx = W / 2
    const cy = H / 2
    const R = 222
    const innerR = 22

    if (mode === 'dimensiones') {
      drawDimensiones(ctx, cx, cy, R, innerR, scores)
    } else {
      drawDesempenios(ctx, cx, cy, R, innerR, scores)
    }

    drawCenter(ctx, cx, cy, innerR, centerLabel)
  }, [scores, mode, centerLabel])

  return (
    <canvas
      ref={canvasRef}
      width={580}
      height={580}
      style={{ display: 'block', width: '580px', height: '580px' }}
    />
  )
}