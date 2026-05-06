export default function PrintHeader({ title, sub, date }) {
  return (
    <div style={{
      display: 'none',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '2px solid #004d8a',
    }}
      className="print-only"
    >
      <div style={{
        fontSize: '10px',
        fontWeight: '500',
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        color: '#00B4DD',
        marginBottom: '4px',
      }}>
        Marco de Competencias en Didacticas Mediadas por TIC — Univirtual UTP
      </div>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '18px',
        fontWeight: '700',
        color: '#f0f4f8',
        marginBottom: '4px',
      }}>
        {title}
      </div>
      <div style={{
        display: 'flex',
        gap: '16px',
        fontSize: '11px',
        color: '#8ab0cc',
      }}>
        <span>{sub}</span>
        <span>·</span>
        <span>{date}</span>
      </div>
    </div>
  )
}