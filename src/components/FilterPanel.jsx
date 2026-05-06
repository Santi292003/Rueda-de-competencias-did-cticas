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
          background: locked ? '#38384f' : '#7b9fd4',
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
          color: locked ? '#38384f' : '#6e6c88',
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
        border: '1px solid #38384f',
        borderRadius: '6px',
        padding: '6px 8px',
        background: '#303044',
        color: disabled ? '#38384f' : '#e8e6f0',
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
      background: '#272736',
      border: '1px solid #38384f',
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: '#303044',
        borderBottom: '1px solid #38384f',
      }}>
        <span style={{
          fontSize: '10px',
          fontWeight: '500',
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          color: '#6e6c88',
        }}>
          {title}
        </span>
        <button
          onClick={onClear}
          style={{
            background: 'none',
            border: 'none',
            color: '#7b9fd4',
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
            color: '#9e9bb8',
          }}>
            <input
              type="checkbox"
              checked={active.includes(opt)}
              onChange={() => onToggle(filterKey, opt)}
              style={{ accentColor: '#7b9fd4', cursor: 'pointer' }}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}

export default function FilterPanel({
  // Cascade
  facultades,
  selectedFacultad,
  programas,
  selectedPrograma,
  docentes,
  selectedDocente,
  onFacultadChange,
  onProgramaChange,
  onDocenteChange,
  // Characteristic filters
  activeFilters,
  onToggleFilter,
  onClearFilter,
  onResetAll,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Cascada */}
      <div style={{
        background: '#272736',
        border: '1px solid #38384f',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 12px',
          background: '#303044',
          borderBottom: '1px solid #38384f',
          fontSize: '10px',
          fontWeight: '500',
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          color: '#6e6c88',
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

      {/* Filtros de caracterización */}
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

      {/* Reset */}
      <button
        onClick={onResetAll}
        style={{
          fontFamily: 'inherit',
          fontSize: '11px',
          fontWeight: '500',
          padding: '7px 10px',
          background: 'transparent',
          color: '#6e6c88',
          border: '1px solid #38384f',
          borderRadius: '7px',
          cursor: 'pointer',
          width: '100%',
          transition: 'color .15s, border-color .15s',
        }}
        onMouseEnter={e => { e.target.style.color = '#e05252'; e.target.style.borderColor = '#e05252' }}
        onMouseLeave={e => { e.target.style.color = '#6e6c88'; e.target.style.borderColor = '#38384f' }}
      >
        ↺ Limpiar todos los filtros
      </button>

    </div>
  )
}