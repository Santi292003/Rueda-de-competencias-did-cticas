import { useState, useRef } from 'react'
import { useCsvData } from './hooks/useCsvData.js'
import { useScores } from './hooks/useScores.js'
import Wheel from './components/Wheel.jsx'
import WheelToggle from './components/WheelToggle.jsx'
import WheelLegend from './components/WheelLegend.jsx'
import ContextBanner from './components/ContextBanner.jsx'
import ScoreCards from './components/ScoreCards.jsx'
import FilterPanel from './components/FilterPanel.jsx'
import SummaryTable from './components/SummaryTable.jsx'
import PrintButton from './components/PrintButton.jsx'
import Welcome from './components/Welcome.jsx'
import { ITEM_MAP } from './data/itemMap.js'
import PrintHeader from './components/PrintHeader.jsx'
import InstructionsModal from './components/InstructionsModal.jsx'
import { useEffect } from 'react'
import Spinner from './components/Spinner.jsx'
import ValidationReport from './components/ValidationReport.jsx'

export default function App() {
  const csv = useCsvData()
  const scores = useScores(csv.csvData)
  const [wheelMode, setWheelMode] = useState('desempenios')
  const printRef = useRef(null)
  useEffect(() => {
  const base = 'Rueda de Competencias — UTP'
  if (!csv.isLoaded) {
    document.title = base
    return
  }
  if (scores.selectedDocente !== null) {
    const row = csv.csvData[scores.selectedDocente]
    document.title = `${row?.nombre || 'Docente'} — ${base}`
  } else if (scores.selectedPrograma) {
    document.title = `${scores.selectedPrograma} — ${base}`
  } else if (scores.selectedFacultad) {
    document.title = `${scores.selectedFacultad} — ${base}`
  } else {
    document.title = base
  }
}, [csv.isLoaded, scores.selectedFacultad, scores.selectedPrograma, scores.selectedDocente])

  function handleFile(e) {
    const file = e.target.files[0]
    if (file) csv.loadFile(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) csv.loadFile(file)
  }

  const facultades = csv.getUnique('facultad')
  const programas = scores.selectedFacultad
    ? csv.getProgramasByFacultad(scores.selectedFacultad)
    : []
  const docentes = scores.selectedPrograma
    ? csv.getDocentesByPrograma(scores.selectedFacultad, scores.selectedPrograma)
    : []

  function downloadTemplate() {
    const metaCols = 'nombre,facultad,programa,vinculacion,experiencia,formacion,modalidad'
    const itemCols = ITEM_MAP.map(i => i.col).join(',')
    const header = metaCols + ',' + itemCols
    const example = 'Juan Garcia,Bellas Artes y Humanidades,Musica,Planta,6 - 10,Maestria,Presencial,' +
      Array(ITEM_MAP.length).fill(3).join(',')
    const blob = new Blob([header + '\n' + example + '\n'], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'plantilla_rueda_utp.csv'
    a.click()
    URL.revokeObjectURL(url)
}

const hasActiveFilters =
  scores.selectedFacultad !== '' ||
  scores.selectedPrograma !== '' ||
  scores.selectedDocente !== null ||
  Object.values(scores.activeFilters).some(v => v.length > 0)

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{
        paddingBottom: '16px',
        borderBottom: '1.5px solid var(--border)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
      }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: '500',
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '5px',
          }}>
            Marco de Competencias en Didacticas Mediadas por TIC
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '20px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: '1.25',
          }}>
            Rueda de Competencias Docentes — UTP
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            Vicerrectoria Academica · Univirtual
          </p>
        </div>
        <InstructionsModal />
      </div>

      {/* CSV Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '20px',
      }}>
        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
          Cargar datos:
        </span>

        <div
          onClick={() => !csv.isLoaded && document.getElementById('csv-input').click()}
          onDragOver={e => { if (!csv.isLoaded) e.preventDefault() }}
          onDrop={e => { if (!csv.isLoaded) handleDrop(e) }}
          style={{
            flex: 1,
            minWidth: '180px',
            border: `1.5px dashed ${csv.isLoaded ? 'var(--s5)' : 'var(--border)'}`,
            borderRadius: '8px',
            padding: '9px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            cursor: csv.isLoaded ? 'default' : 'pointer',
            fontSize: '12px',
            color: csv.isLoaded ? 'var(--s5)' : 'var(--text-muted)',
          }}
        >
          <span>{csv.isLoaded
            ? `✓ ${csv.fileName} — ${csv.csvData.length} docentes`
            : 'Arrastra el CSV aqui o haz clic para buscar'}
          </span>
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
        </div>

        {/* Botón cambiar archivo */}
        {csv.isLoaded && (
          <button
            onClick={() => {
              csv.reset()
              scores.resetAll()
              const input = document.getElementById('csv-input')
              if (input) input.value = ''
            }}
            style={{
              fontFamily: 'inherit',
              fontSize: '11px',
              fontWeight: '500',
              padding: '7px 12px',
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: '7px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color .15s, border-color .15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--s1)'
              e.currentTarget.style.borderColor = 'var(--s1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            ✕ Cambiar archivo
          </button>
        )}
        {csv.isLoading && (
          <Spinner message="Cargando y procesando el archivo..." />
        )}

        {/* Reporte de validación */}
        {!csv.isLoading && (csv.error || csv.validationDetail) && (
          <div style={{ width: '100%' }}>
            {csv.error && csv.error !== '__META__' && (
              <p style={{ color: 'var(--s1)', fontSize: '12px' }}>❌ {csv.error}</p>
            )}
            <ValidationReport
              detail={csv.validationDetail}
              fileName={csv.fileName}
            />
          </div>
        )}
      </div>

      {/* Contenido — bienvenida o dashboard */}
      {csv.isLoaded ? (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

          {/* Panel de filtros */}
          <div className="no-print" style={{ width: '220px', flexShrink: 0 }}>
            <FilterPanel
              facultades={facultades}
              selectedFacultad={scores.selectedFacultad}
              programas={programas}
              selectedPrograma={scores.selectedPrograma}
              docentes={docentes.map(d => ({ value: d.idx, label: d.name }))}
              selectedDocente={scores.selectedDocente}
              onFacultadChange={scores.onFacultadChange}
              onProgramaChange={scores.onProgramaChange}
              onDocenteChange={scores.onDocenteChange}
              activeFilters={scores.activeFilters}
              onToggleFilter={scores.toggleFilter}
              onClearFilter={scores.clearFilter}
              onResetAll={scores.resetAll}
            />
          </div>

          {/* Contenido principal */}
          <div ref={printRef} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <PrintHeader
              title={scores.contextLabel}
              sub={scores.contextSub}
              date={new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
            />
            <ContextBanner
              title={scores.contextLabel}
              sub={scores.contextSub}
              count={scores.rows.length}
              globalAvg={scores.globalAvg}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div className="no-print">
                <WheelToggle mode={wheelMode} onChange={setWheelMode} />
              </div>
              <Wheel
                scores={scores.scores}
                mode={wheelMode}
                centerLabel={scores.contextLabel}
                hasActiveFilters={hasActiveFilters}
              />
              <WheelLegend />
            </div>
            <ScoreCards scores={scores.scores} mode={wheelMode} />
            {scores.selectedPrograma && (
              <SummaryTable rows={scores.rows} />
            )}
            <div className="no-print" style={{
              paddingTop: '16px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                1=Nunca · 2=Rara vez · 3=A veces · 4=Frecuentemente · 5=Siempre
              </span>
              <PrintButton contentRef={printRef} />
            </div>
          </div>

        </div>
      ) : (
        <Welcome onDownloadTemplate={downloadTemplate} />
      )}

    </div>
  )
}