import { useCsvData } from './hooks/useCsvData.js'
import { useScores, fmtVal } from './hooks/useScores.js'

function App() {
  const csv = useCsvData()
  const scores = useScores(csv.csvData)

  function handleFile(e) {
    csv.loadFile(e.target.files[0])
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>

      <h1 style={{ color: '#7b9fd4', marginBottom: '8px' }}>
        Rueda de Competencias — UTP
      </h1>
      <p style={{ color: '#9e9bb8', marginBottom: '24px' }}>
        Fase 1 — verificación de flujo de datos
      </p>

      {/* Carga de CSV */}
      <div style={{
        background: '#272736',
        border: '1px solid #38384f',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <p style={{ color: '#9e9bb8', fontSize: '13px', marginBottom: '10px' }}>
          Cargar CSV de prueba:
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          style={{ color: '#e8e6f0', fontSize: '13px' }}
        />
        {csv.error && (
          <p style={{ color: '#e05252', fontSize: '12px', marginTop: '8px' }}>
            ❌ {csv.error}
          </p>
        )}
        {csv.warnings.map((w, i) => (
          <p key={i} style={{ color: '#e8884a', fontSize: '12px', marginTop: '6px' }}>
            ⚠️ {w}
          </p>
        ))}
        {csv.isLoaded && (
          <p style={{ color: '#3ec97a', fontSize: '12px', marginTop: '8px' }}>
            ✅ {csv.fileName} — {csv.csvData.length} docentes cargados
          </p>
        )}
      </div>

      {/* Verificación de datos */}
      {csv.isLoaded && (
        <>
          {/* Contexto */}
          <div style={{
            background: '#272736',
            border: '1px solid #38384f',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#e8e6f0', fontWeight: '500', marginBottom: '4px' }}>
              {scores.contextLabel}
            </p>
            <p style={{ color: '#6e6c88', fontSize: '12px', marginBottom: '12px' }}>
              {scores.contextSub}
            </p>
            <p style={{ color: '#9e9bb8', fontSize: '13px' }}>
              Docentes en vista: <strong style={{ color: '#7b9fd4' }}>{scores.rows.length}</strong>
              &nbsp;·&nbsp;
              Promedio global: <strong style={{ color: '#7b9fd4' }}>{fmtVal(scores.globalAvg)}</strong>
            </p>
          </div>

          {/* Tabla de scores calculados */}
          <div style={{
            background: '#272736',
            border: '1px solid #38384f',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px',
            overflowX: 'auto'
          }}>
            <p style={{ color: '#6e6c88', fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Scores calculados (todos los docentes)
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', color: '#6e6c88', padding: '6px 8px', borderBottom: '1px solid #38384f' }}>Dimension</th>
                  <th style={{ textAlign: 'center', color: '#6e6c88', padding: '6px 8px', borderBottom: '1px solid #38384f' }}>D1</th>
                  <th style={{ textAlign: 'center', color: '#6e6c88', padding: '6px 8px', borderBottom: '1px solid #38384f' }}>D2</th>
                  <th style={{ textAlign: 'center', color: '#6e6c88', padding: '6px 8px', borderBottom: '1px solid #38384f' }}>D3</th>
                </tr>
              </thead>
              <tbody>
                {scores.scores.map((dimScores, i) => (
                  <tr key={i}>
                    <td style={{ color: '#9e9bb8', padding: '6px 8px', borderBottom: '0.5px solid #38384f' }}>
                      {i + 1}. {['DT','DDD','DDE','DCP','DEA','DED','DDP'][i]}
                    </td>
                    {dimScores.map((v, j) => (
                      <td key={j} style={{
                        textAlign: 'center',
                        padding: '6px 8px',
                        borderBottom: '0.5px solid #38384f',
                        color: v !== null ? '#e8e6f0' : '#38384f',
                        fontWeight: v !== null ? '500' : '400'
                      }}>
                        {fmtVal(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prueba de filtros */}
          <div style={{
            background: '#272736',
            border: '1px solid #38384f',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <p style={{ color: '#6e6c88', fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Prueba de filtros
            </p>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: '#9e9bb8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                Facultad:
              </label>
              <select
                value={scores.selectedFacultad}
                onChange={e => scores.onFacultadChange(e.target.value)}
                style={{ background: '#303044', color: '#e8e6f0', border: '1px solid #38384f', borderRadius: '6px', padding: '6px 8px', fontSize: '12px', width: '100%' }}
              >
                <option value="">— Todas —</option>
                {csv.getUnique('facultad').map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {scores.selectedFacultad && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: '#9e9bb8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                  Programa:
                </label>
                <select
                  value={scores.selectedPrograma}
                  onChange={e => scores.onProgramaChange(e.target.value)}
                  style={{ background: '#303044', color: '#e8e6f0', border: '1px solid #38384f', borderRadius: '6px', padding: '6px 8px', fontSize: '12px', width: '100%' }}
                >
                  <option value="">— Todos —</option>
                  {csv.getProgramasByFacultad(scores.selectedFacultad).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label style={{ color: '#9e9bb8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                Modalidad (union):
              </label>
              {csv.getUnique('modalidad').map(m => (
                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={scores.activeFilters.modalidad.includes(m)}
                    onChange={() => scores.toggleFilter('modalidad', m)}
                    style={{ accentColor: '#7b9fd4' }}
                  />
                  <span style={{ color: '#9e9bb8', fontSize: '12px' }}>{m}</span>
                </label>
              ))}
            </div>

            <button
              onClick={scores.resetAll}
              style={{ marginTop: '12px', background: 'transparent', border: '1px solid #38384f', color: '#6e6c88', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}
            >
              Limpiar filtros
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default App