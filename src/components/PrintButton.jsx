import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

export default function PrintButton({ contentRef }) {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: 'Rueda de Competencias — UTP',
    pageStyle: `
      @page {
        margin: 14mm 12mm;
        size: A4 portrait;
      }
      @media print {
        body {
          background: #1e1e2a !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
  })

  return (
    <button
      onClick={handlePrint}
      style={{
        fontFamily: 'inherit',
        fontSize: '12px',
        fontWeight: '500',
        padding: '8px 20px',
        background: '#7b9fd4',
        color: '#fff',
        border: 'none',
        borderRadius: '7px',
        cursor: 'pointer',
        transition: 'opacity .15s',
      }}
      onMouseEnter={e => e.target.style.opacity = '.85'}
      onMouseLeave={e => e.target.style.opacity = '1'}
    >
      Imprimir / Guardar PDF
    </button>
  )
}