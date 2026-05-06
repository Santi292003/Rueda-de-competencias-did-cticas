import { useState } from 'react'
import { useCsvData } from './hooks/useCsvData.js'
import { useScores } from './hooks/useScores.js'
import Wheel from './components/Wheel.jsx'
import WheelToggle from './components/WheelToggle.jsx'
import WheelLegend from './components/WheelLegend.jsx'
import ContextBanner from './components/ContextBanner.jsx'
import ScoreCards from './components/ScoreCards.jsx'
import FilterPanel from './components/FilterPanel.jsx'
import SummaryTable from './components/SummaryTable.jsx'

export default function App() {
  const csv = useCsvData()
  const scores = useScores(csv.csvData)
  const [wheelMode, setWheelMode] = useState('desempenios')

  function handleFile(e) {
    const file = e.target.files[0]
    if (file) csv.loadFile(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) csv.loadFile(file)
  }

  // Derived data for FilterPanel selectors
  const facultades = csv.getUnique('facultad')
  const programas = scores.selectedFacultad
    ? csv.getProgramasByFacultad(scores.selectedFacultad)
    : []
  const docentes = scores.selectedPrograma
    ? csv.getDocentesByPrograma(scores.selectedFacultad, scores.selectedPrograma)
    : []

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{
        paddingBottom: '16px',
        borderBottom: '1.5px solid #38384f',
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
            color: '#7b9fd4',
            marginBottom: '5px',
          }}>
            Marco de Competencias en Didacticas Mediadas por TIC
          </div>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            fontWeight: '700',
            color: '#e8e6f0',
            lineHeight: '1.25',
          }}>
            Rueda de Competencias Docentes — UTP
          </h1>
          <p style={{ fontSize: '12px', color: '#9e9bb8', marginTop: '3px' }}>
            Vicerrectoria Academica · Univirtual
          </p>
        </div>
      </div>

      {/* CSV Bar */}
      <div style={{
        background: '#272736',
        border: '1px solid #38384f',
        borderRadius: '10px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '20px',
      }}>
        <span style={{ fontSize: '12px', fontWeight: '500', color: '#9e9bb8' }}>
          Cargar datos:
        </span>

        <div
          onClick={() => document.getElementById('csv-input').click()}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          style={{
            flex: 1,
            minWidth: '180px',
            border: `1.5px dashed ${csv.isLoaded ? '#3ec97a' : '#38384f'}`,
            borderRadius: '8px',
            padding: '9px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            cursor: 'pointer',
            fontSize: '12px',
            color: csv.isLoaded ? '#3ec97a' : '#6e6c88',
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

        {csv.error && (
          <p style={{ color: '#e05252', fontSize: '12px', width: '100%' }}>
            ❌ {csv.error}
          </p>
        )}
        {csv.warnings.map((w, i) => (
          <p key={i} style={{ color: '#e8884a', fontSize: '12px', width: '100%' }}>
            ⚠️ {w}
          </p>
        ))}
      </div>

      {/* Main layout */}
      {csv.isLoaded && (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

          {/* Panel de filtros */}
          <div style={{ width: '220px', flexShrink: 0 }}>
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
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <ContextBanner
              title={scores.contextLabel}
              sub={scores.contextSub}
              count={scores.rows.length}
              globalAvg={scores.globalAvg}
            />

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}>
              <WheelToggle mode={wheelMode} onChange={setWheelMode} />
              <Wheel
                scores={scores.scores}
                mode={wheelMode}
                centerLabel={scores.contextLabel}
              />
              <WheelLegend />
            </div>

            <ScoreCards scores={scores.scores} mode={wheelMode} />
            {scores.selectedPrograma && (
              <SummaryTable rows={scores.rows} />
            )}
          </div>
        </div>
      )}

    </div>
  )
}