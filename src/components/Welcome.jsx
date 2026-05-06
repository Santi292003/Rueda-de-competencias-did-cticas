export default function Welcome({ onDownloadTemplate }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px',
      gap: '32px',
      textAlign: 'center',
    }}>

      {/* Rueda decorativa */}
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'conic-gradient(var(--s1) 0deg 51deg, var(--s2) 51deg 102deg, var(--s3) 102deg 153deg, var(--s4) 153deg 204deg, var(--s5) 204deg 255deg, var(--s4) 255deg 306deg, var(--s3) 306deg 360deg)',
        opacity: 0.7,
        flexShrink: 0,
      }} />

      {/* Texto */}
      <div style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '22px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          lineHeight: '1.3',
        }}>
          Bienvenido a la Rueda de Competencias
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: '1.7',
        }}>
          Esta herramienta permite visualizar y analizar el nivel de competencias
          docentes en tecnologías digitales a partir de los resultados de la
          encuesta de autopercepción.
        </p>
      </div>

      {/* Pasos */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '600px',
      }}>
        {[
          { num: '1', text: 'Descarga la plantilla CSV y complétala con los datos de la encuesta' },
          { num: '2', text: 'Arrastra el archivo CSV a la zona de carga o búscalo en tu computador' },
          { num: '3', text: 'Explora los resultados usando los filtros de facultad, programa y docente' },
        ].map(step => (
          <div key={step.num} style={{
            flex: '1',
            minWidth: '160px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
            }}>
              {step.num}
            </span>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
            }}>
              {step.text}
            </p>
          </div>
        ))}
      </div>

      {/* Botón plantilla */}
      <button
        onClick={onDownloadTemplate}
        style={{
          fontFamily: 'inherit',
          fontSize: '13px',
          fontWeight: '500',
          padding: '10px 24px',
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'opacity .15s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        ⬇ Descargar plantilla CSV
      </button>

    </div>
  )
}