import { useState, useCallback } from 'react'
import { ITEM_MAP } from '../data/itemMap.js'

// Columnas de caracterización obligatorias
const META_COLS = ['nombre', 'facultad', 'programa', 'vinculacion', 'experiencia', 'formacion', 'modalidad']

// Todas las columnas de ítems esperadas
const ITEM_COLS = ITEM_MAP.map(i => i.col)

function splitLine(line) {
  const result = []
  let cur = ''
  let inQuote = false
  for (const ch of line) {
    if (ch === '"') { inQuote = !inQuote }
    else if (ch === ',' && !inQuote) { result.push(cur); cur = '' }
    else { cur += ch }
  }
  result.push(cur)
  return result
}

function parseCSV(text) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter(l => l.trim())

  if (lines.length < 2) {
    throw new Error('El CSV debe tener encabezado y al menos una fila de datos.')
  }

  const headers = lines[0]
    .split(',')
    .map(h => h.trim().toLowerCase().replace(/['"]/g, ''))

  // Verificar columnas de caracterización
  const missingMeta = META_COLS.filter(c => !headers.includes(c))
  if (missingMeta.length > 0) {
    throw new Error(`Faltan columnas de caracterizacion: ${missingMeta.join(', ')}`)
  }

  // Advertir (no bloquear) si faltan columnas de ítems
  const missingItems = ITEM_COLS.filter(c => !headers.includes(c))

  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const vals = splitLine(lines[i])
    if (vals.length < 3) continue
    const row = {}
    headers.forEach((h, idx) => {
      row[h] = (vals[idx] || '').trim().replace(/^["']|["']$/g, '')
    })
    rows.push(row)
  }

  if (rows.length === 0) {
    throw new Error('No se encontraron filas válidas en el CSV.')
  }

  return { rows, missingItems }
}

export function useCsvData() {
  const [csvData, setCsvData] = useState([])
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [warnings, setWarnings] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  const loadFile = useCallback(file => {
    if (!file) return
    if (!file.name.endsWith('.csv')) {
      setError('El archivo debe ser .csv')
      return
    }

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const { rows, missingItems } = parseCSV(e.target.result)
        setCsvData(rows)
        setFileName(file.name)
        setIsLoaded(true)
        setError('')
        setWarnings(
          missingItems.length > 0
            ? [`Algunos ítems de la encuesta no se encontraron en el archivo (${missingItems.length} columnas). Los desempeños afectados mostrarán "—". Esto es normal si el CSV proviene de una versión anterior de la encuesta.`]
            : []
        )
      } catch (err) {
        setError(err.message)
        setIsLoaded(false)
      }
    }
    reader.readAsText(file, 'UTF-8')
  }, [])

  const reset = useCallback(() => {
    setCsvData([])
    setFileName('')
    setError('')
    setWarnings([])
    setIsLoaded(false)
  }, [])

  // Derived selectors — extraen valores únicos para poblar filtros y selectores
  const getUnique = useCallback((key) => {
    const seen = new Set()
    csvData.forEach(row => {
      const v = (row[key] || '').trim()
      if (v) seen.add(v)
    })
    return [...seen].sort()
  }, [csvData])

  const getProgramasByFacultad = useCallback(facultad => {
    const seen = new Set()
    csvData
      .filter(r => (r.facultad || '').trim() === facultad)
      .forEach(r => {
        const v = (r.programa || '').trim()
        if (v) seen.add(v)
      })
    return [...seen].sort()
  }, [csvData])

  const getDocentesByPrograma = useCallback((facultad, programa) => {
    return csvData
      .map((r, idx) => ({ idx, name: r.nombre || `Docente ${idx + 1}` }))
      .filter((_, idx) => {
        const r = csvData[idx]
        return (
          (r.facultad || '').trim() === facultad &&
          (r.programa || '').trim() === programa
        )
      })
  }, [csvData])

  return {
    csvData,
    fileName,
    error,
    warnings,
    isLoaded,
    loadFile,
    reset,
    getUnique,
    getProgramasByFacultad,
    getDocentesByPrograma,
  }
}