import { useState, useCallback } from 'react'
import { ITEM_MAP } from '../data/itemMap.js'
import { DIMENSIONS } from '../data/dimensions.js'

// ── Helpers ────────────────────────────────────────────────────────────────

export function scoreColor(v) {
  if (v === null || v === undefined) return '#444'
  if (v <= 1.5) return '#e05252'
  if (v <= 2.5) return '#e8884a'
  if (v <= 3.5) return '#d4b800'
  if (v <= 4.5) return '#7dbe5e'
  return '#3ec97a'
}

export function scoreFrac(v) {
  if (v === null || v === undefined) return null
  return 1 - ((v - 1) / 4) * 0.86
}

export function fmtVal(v) {
  if (v === null || v === undefined || isNaN(v)) return '—'
  const r = Math.round(v * 10) / 10
  return Number.isInteger(r) ? r.toString() : r.toFixed(1)
}

// ── Core calculation ───────────────────────────────────────────────────────

// Receives an array of raw CSV rows, returns a 2D array:
// scores[dimIndex][desIndex] = float | null
export function calcScores(rows) {
  if (!rows || rows.length === 0) {
    return DIMENSIONS.map(() => [null, null, null])
  }

  // Accumulators: { 'DT_D1': [sum, count], ... }
  const acc = {}
  DIMENSIONS.forEach(dim => {
    ;['D1', 'D2', 'D3'].forEach(d => {
      acc[`${dim.code}_${d}`] = [0, 0]
    })
  })

  // For each item, average its value across all rows, then distribute to targets
  ITEM_MAP.forEach(item => {
    const vals = rows
      .map(row => parseFloat(row[item.col]))
      .filter(v => !isNaN(v) && v >= 1 && v <= 5)

    if (vals.length === 0) return

    const avg = vals.reduce((a, b) => a + b, 0) / vals.length

    item.targets.forEach(([dimCode, desCode]) => {
      const key = `${dimCode}_${desCode}`
      if (acc[key]) {
        acc[key][0] += avg
        acc[key][1] += 1
      }
    })
  })

  // Build matrix
  return DIMENSIONS.map(dim =>
    ['D1', 'D2', 'D3'].map(d => {
      const [sum, count] = acc[`${dim.code}_${d}`]
      return count > 0 ? sum / count : null
    })
  )
}

// Dimension average = simple mean of its desempeños (ignoring nulls)
export function calcDimAvg(scores, dimIndex) {
  const vals = scores[dimIndex].filter(v => v !== null)
  if (vals.length === 0) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

// Global average across all non-null scores
export function calcGlobalAvg(scores) {
  const vals = scores.flat().filter(v => v !== null)
  if (vals.length === 0) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

// ── Filter logic (union) ───────────────────────────────────────────────────

const FILTER_KEYS = ['vinculacion', 'experiencia', 'formacion', 'modalidad']

export function applyFilters(csvData, { selectedFacultad, selectedPrograma, activeFilters }) {
  if (!csvData.length) return []

  let rows = [...csvData]

  // Cascade (intersection within cascade)
  if (selectedFacultad) {
    rows = rows.filter(r => (r.facultad || '').trim() === selectedFacultad)
  }
  if (selectedPrograma) {
    rows = rows.filter(r => (r.programa || '').trim() === selectedPrograma)
  }

  // Characteristic filters — union across all active values
  const anyActive = FILTER_KEYS.some(k => activeFilters[k].length > 0)
  if (anyActive) {
    rows = rows.filter(row =>
      FILTER_KEYS.some(k => {
        if (!activeFilters[k].length) return false
        return activeFilters[k].includes((row[k] || '').trim())
      })
    )
  }

  return rows
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useScores(csvData) {
  const [selectedFacultad, setSelectedFacultad] = useState('')
  const [selectedPrograma, setSelectedPrograma] = useState('')
  const [selectedDocente, setSelectedDocente] = useState(null) // row index | null
  const [activeFilters, setActiveFilters] = useState({
    vinculacion: [],
    experiencia: [],
    formacion: [],
    modalidad: [],
  })

  // Derived filtered rows
  const filteredRows = useCallback(() => {
    if (selectedDocente !== null && csvData[selectedDocente]) {
      return [csvData[selectedDocente]]
    }
    return applyFilters(csvData, { selectedFacultad, selectedPrograma, activeFilters })
  }, [csvData, selectedFacultad, selectedPrograma, selectedDocente, activeFilters])

  const rows = filteredRows()
  const scores = calcScores(rows)
  const globalAvg = calcGlobalAvg(scores)

  // Context label for the banner
  const contextLabel = (() => {
    if (selectedDocente !== null && csvData[selectedDocente]) {
      return csvData[selectedDocente].nombre || 'Docente'
    }
    if (selectedPrograma) return selectedPrograma
    if (selectedFacultad) return selectedFacultad
    return 'Universidad Tecnologica de Pereira'
  })()

  const contextSub = (() => {
    if (selectedDocente !== null) return 'Docente individual'
    if (selectedPrograma) return 'Programa — promedio del grupo'
    if (selectedFacultad) return 'Facultad — promedio del grupo'
    const anyActive = Object.values(activeFilters).some(v => v.length > 0)
    if (anyActive) return 'Filtros activos — promedio del grupo'
    return 'Promedio general — todos los docentes'
  })()

  // Actions
  const onFacultadChange = useCallback(val => {
    setSelectedFacultad(val)
    setSelectedPrograma('')
    setSelectedDocente(null)
  }, [])

  const onProgramaChange = useCallback(val => {
    setSelectedPrograma(val)
    setSelectedDocente(null)
  }, [])

  const onDocenteChange = useCallback(val => {
    setSelectedDocente(val === '' ? null : Number(val))
  }, [])

  const toggleFilter = useCallback((key, value) => {
    setActiveFilters(prev => {
      const current = prev[key]
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [key]: next }
    })
    setSelectedDocente(null)
  }, [])

  const clearFilter = useCallback(key => {
    setActiveFilters(prev => ({ ...prev, [key]: [] }))
  }, [])

  const resetAll = useCallback(() => {
    setSelectedFacultad('')
    setSelectedPrograma('')
    setSelectedDocente(null)
    setActiveFilters({ vinculacion: [], experiencia: [], formacion: [], modalidad: [] })
  }, [])

  return {
    // State
    selectedFacultad,
    selectedPrograma,
    selectedDocente,
    activeFilters,
    // Derived
    rows,
    scores,
    globalAvg,
    contextLabel,
    contextSub,
    // Actions
    onFacultadChange,
    onProgramaChange,
    onDocenteChange,
    toggleFilter,
    clearFilter,
    resetAll,
  }
}