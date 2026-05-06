import { useState } from 'react'

function ScorePill({ level, color, label, meaning }) {
  return (
    <tr>
      <td style={{ padding: '7px 9px', borderBottom: '0.5px solid var(--border)', verticalAlign: 'top' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '20px', height: '20px', borderRadius: '50%',
          background: color, color: '#fff', fontSize: '11px', fontWeight: '700',
        }}>
          {level}
        </span>
      </td>
      <td style={{ padding: '7px 9px', borderBottom: '0.5px solid var(--border)', color: 'var(--text-secondary)', fontSize: '12px', verticalAlign: 'top' }}>
        {label}
      </td>
      <td style={{ padding: '7px 9px', borderBottom: '0.5px solid var(--border)', color: 'var(--text-muted)', fontSize: '12px', verticalAlign: 'top' }}>
        {meaning}
      </td>
    </tr>
  )
}

function DimRow({ color, name, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '0.5px solid var(--border)' }}>
      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
      <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500', flex: 1 }}>{name}</span>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', flex: 2, lineHeight: '1.4' }}>{desc}</span>
    </div>
  )
}

export default function InstructionsModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Botón */}
      <button
        onClick={() => setOpen(true)}
        style={{
          fontFamily: 'inherit',
          fontSize: '12px',
          fontWeight: '500',
          padding: '7px 14px',
          background: 'transparent',
          color: 'var(--accent)',
          border: '1px solid var(--accent)',
          borderRadius: '7px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          transition: 'background .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,180,221,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="6.5"/>
          <path d="M8 11v-1m0-1.5c0-1.5 2-1.5 2-3a2 2 0 1 0-4 0"/>
        </svg>
        Instrucciones y leyenda
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(2,23,43,0.85)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            maxWidth: '660px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '28px 32px',
            position: 'relative',
          }}>
            {/* Cerrar */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', top: '14px', right: '16px',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: '20px',
                cursor: 'pointer', lineHeight: 1,
              }}
            >
              ×
            </button>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Instrucciones — Rueda de Competencias
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Marco de Competencias en Didacticas Mediadas por TIC — UTP
            </p>

            <Section title="Modos de visualizacion">
              <p style={pStyle}>
                <strong style={{ color: 'var(--text-primary)' }}>Vista por desempeños:</strong> 21 segmentos — cada segmento es un desempeño (D1, D2, D3) dentro de su dimension.
              </p>
              <p style={pStyle}>
                <strong style={{ color: 'var(--text-primary)' }}>Vista por dimensiones:</strong> 7 segmentos — cada uno muestra el promedio de los desempeños de esa dimension.
              </p>
            </Section>

            <Section title="Como leer el grafico">
              <div style={{ background: 'var(--bg-surface2)', borderRadius: '8px', padding: '14px 16px', marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                  La rueda se lee <strong style={{ color: 'var(--text-primary)' }}>desde el centro hacia afuera</strong>.
                  Un puntaje alto (5) mantiene el segmento concentrado cerca del centro — indica dominio consolidado.
                  Un puntaje bajo (1) extiende el segmento hasta el borde exterior en rojo — señala un area critica.
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Entre mas llena y roja se vea la rueda desde afuera, mas critico es el perfil. Una rueda verde concentrada al centro indica un perfil docente solido.
                </p>
              </div>
            </Section>

            <Section title="Escala de valoracion">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr>
                    {['Nivel', 'Etiqueta encuesta', 'Significado'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '6px 9px', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '.05em', textTransform: 'uppercase' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <ScorePill level={1} color="#e05252" label="Nunca"          meaning="Explorador inicial — no aplica sistematicamente" />
                  <ScorePill level={2} color="#e8884a" label="Rara vez"       meaning="Explorador — aplica de forma basica o esporadica" />
                  <ScorePill level={3} color="#d4b800" label="A veces"        meaning="Integrador — aplica de forma regular" />
                  <ScorePill level={4} color="#7dbe5e" label="Frecuentemente" meaning="Innovador — aplica con autonomia e innovacion" />
                  <ScorePill level={5} color="#3ec97a" label="Siempre"        meaning="Lider — transforma y comparte la practica" />
                </tbody>
              </table>
            </Section>

            <Section title="Las siete dimensiones">
              <GroupLabel>Fundamentos pedagogicos y didacticos</GroupLabel>
              <DimRow color="#7aafd4" name="Competencia Tecnologica"        desc="Gestion de herramientas, plataformas y recursos digitales" />
              <DimRow color="#5ec4a0" name="Didactica Disciplinar TIC"      desc="Traduccion de saberes disciplinares mediante tecnologia" />
              <DimRow color="#8dc87a" name="Diseno de Experiencias"         desc="Planificacion de experiencias educativas digitales" />
              <DimRow color="#d4c060" name="Competencia Pedagogica"         desc="Principios pedagogicos en entornos digitales" />
              <GroupLabel>Fundamentos tecnologicos y del aprendizaje</GroupLabel>
              <DimRow color="#a888d0" name="Evaluacion del Aprendizaje"     desc="Estrategias evaluativas en entornos digitales" />
              <GroupLabel>Fundamentos para el desarrollo profesional</GroupLabel>
              <DimRow color="#e888b8" name="Etica Digital"                  desc="Docencia responsable, critica e inclusiva" />
              <DimRow color="#f4a0d0" name="Desarrollo Profesional Docente" desc="Reflexion, formacion e innovacion educativa" />
            </Section>

            <Section title="Filtros">
              <p style={pStyle}>
                Los filtros de caracterizacion (vinculacion, modalidad, formacion, experiencia) son independientes y se combinan con <strong style={{ color: 'var(--text-primary)' }}>union</strong> — se incluye cualquier docente que cumpla al menos uno de los valores seleccionados.
              </p>
              <p style={pStyle}>
                La cascada <strong style={{ color: 'var(--text-primary)' }}>Facultad → Programa → Docente</strong> opera en paralelo y restringe la vista al grupo seleccionado.
              </p>
            </Section>

          </div>
        </div>
      )}
    </>
  )
}

// Helpers internos
const pStyle = { fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '8px' }

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '10px' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function GroupLabel({ children }) {
  return (
    <div style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '12px 0 4px', paddingLeft: '2px' }}>
      {children}
    </div>
  )
}