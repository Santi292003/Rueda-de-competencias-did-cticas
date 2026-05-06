import { FILTER_DEFINITIONS } from '../data/dimensions.js'

function CascadeStep({ number, label, locked, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: locked ? 'var(--border)' : 'var(--accent)',
          color: '#fff',
          fontSize: '9px',
          fontWeight: '700',
          flexShrink: 0,
        }}>
          {number}
        </span>
        <span style={{
          fontSize: '10px',
          fontWeight: '500',
          letterSpacing: '.04em',
          textTransform: 'uppercase',
          color: locked ? 'var(--border)' : 'var(--text-muted)',
        }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

function CascadeSelect({ value, onChange, options, placeholder, disabled }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        fontFamily: 'inherit',
        fontSize: '12px',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '6px 8px',
        background: 'var(--bg-surface2)',
        color: disabled ? 'var(--border)' : 'var(--text-primary)',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: '100%',
        opacity: disabled ? 0.4 : 1,
        transition: 'opacity .15s',
      }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </option>
      ))}
    </select>
  )
}

function FilterGroup({ title, filterKey, options, active, onToggle, onClear }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: 'var(--bg-surface2)',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          fontSize: '10px',
          fontWeight: '500',
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          {title}
        </span>
        <button
          onClick={onClear}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontSize: '10px',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Limpiar
        </button>
      </div>
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {options.map(opt => (
          <label key={opt} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '3px 4px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}>
            <input
              type="checkbox"
              checked={active.includes(opt)}
              onChange={() => onToggle(filterKey, opt)}
              style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}

export default function FilterPanel({
  facultades, selectedFacultad, programas, selectedPrograma,
  docentes, selectedDocente, onFacultadChange, onProgramaChange,
  onDocenteChange, activeFilters, onToggleFilter, onClearFilter, onResetAll,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 12px',
          background: 'var(--bg-surface2)',
          borderBottom: '1px solid var(--border)',
          fontSize: '10px',
          fontWeight: '500',
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          Ubicacion
        </div>
        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <CascadeStep number={1} label="Facultad" locked={false}>
            <CascadeSelect
              value={selectedFacultad}
              onChange={onFacultadChange}
              options={facultades}
              placeholder="— Todas las facultades —"
              disabled={false}
            />
          </CascadeStep>
          <CascadeStep number={2} label="Programa" locked={!selectedFacultad}>
            <CascadeSelect
              value={selectedPrograma}
              onChange={onProgramaChange}
              options={programas}
              placeholder={selectedFacultad ? '— Todos los programas —' : '— Elige una facultad —'}
              disabled={!selectedFacultad}
            />
          </CascadeStep>
          <CascadeStep number={3} label="Docente" locked={!selectedPrograma}>
            <CascadeSelect
              value={selectedDocente ?? ''}
              onChange={onDocenteChange}
              options={docentes}
              placeholder={selectedPrograma ? '— Promedio del programa —' : '— Elige un programa —'}
              disabled={!selectedPrograma}
            />
          </CascadeStep>
        </div>
      </div>

      {Object.entries(FILTER_DEFINITIONS).map(([key, opts]) => (
        <FilterGroup
          key={key}
          title={key.charAt(0).toUpperCase() + key.slice(1)}
          filterKey={key}
          options={opts}
          active={activeFilters[key]}
          onToggle={onToggleFilter}
          onClear={() => onClearFilter(key)}
        />
      ))}

      <button
        onClick={onResetAll}
        style={{
          fontFamily: 'inherit',
          fontSize: '11px',
          fontWeight: '500',
          padding: '7px 10px',
          background: 'transparent',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
          borderRadius: '7px',
          cursor: 'pointer',
          width: '100%',
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
        ↺ Limpiar todos los filtros
      </button>

    </div>
  )
}