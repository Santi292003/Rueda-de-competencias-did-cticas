const META_LABELS = {
  nombre:      'Nombre del docente',
  facultad:    'Facultad',
  programa:    'Programa académico',
  vinculacion: 'Tipo de vinculación',
  experiencia: 'Años de experiencia',
  formacion:   'Nivel de formación',
  modalidad:   'Modalidad',
}

export default function ValidationReport({ detail, fileName }) {
  if (!detail) return null

  // Error de columnas de caracterización faltantes
  if (detail.metaError) {
    return (
      <div style={{
        background: 'rgba(224,82,82,0.08)',
        border: '1px solid var(--s1)',
        borderRadius: 'var(--radius)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '16px' }}>❌</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--s1)', marginBottom: '2px' }}>
              El archivo no tiene el formato correcto
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {fileName} — faltan columnas obligatorias de caracterización
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--s4)', marginBottom: '6px' }}>
              ✓ Columnas encontradas
            </div>
            {detail.found.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ninguna</div>
            ) : (
              detail.found.map(col => (
                <div key={col} style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '2px 0' }}>
                  {META_LABELS[col] || col}
                </div>
              ))
            )}
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--s1)', marginBottom: '6px' }}>
              ✗ Columnas faltantes
            </div>
            {detail.missing.map(col => (
              <div key={col} style={{ fontSize: '12px', color: 'var(--s1)', padding: '2px 0' }}>
                {META_LABELS[col] || col}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface2)',
          borderRadius: '7px',
          padding: '10px 14px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
        }}>
          💡 Descarga la plantilla CSV para ver el formato correcto y asegúrate de que los encabezados coincidan exactamente.
        </div>
      </div>
    )
  }

  // Carga exitosa con resumen
  return (
    <div style={{
      background: 'rgba(62,201,122,0.06)',
      border: '1px solid rgba(62,201,122,0.3)',
      borderRadius: 'var(--radius)',
      padding: '12px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: '15px' }}>✅</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--s5)', marginBottom: '2px' }}>
          Archivo cargado correctamente
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {detail.foundItems} de {detail.totalCols} columnas de ítems encontradas
          {detail.missingItems.length > 0 && ` · ${detail.missingItems.length} no encontradas`}
        </div>
      </div>

      {detail.missingItems.length > 0 && (
        <details style={{ width: '100%' }}>
          <summary style={{
            fontSize: '11px',
            color: 'var(--s2)',
            cursor: 'pointer',
            userSelect: 'none',
            marginTop: '4px',
          }}>
            Ver columnas no encontradas ({detail.missingItems.length})
          </summary>
          <div style={{
            marginTop: '8px',
            padding: '10px 12px',
            background: 'var(--bg-surface2)',
            borderRadius: '7px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
          }}>
            {detail.missingItems.map(col => (
              <span key={col} style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '2px 7px',
                fontFamily: 'monospace',
              }}>
                {col}
              </span>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}