export const DIMENSIONS = [
  { name: 'Competencia Tecnologica',        color: '#7aafd4', code: 'DT'  },
  { name: 'Didactica Disciplinar TIC',      color: '#5ec4a0', code: 'DDD' },
  { name: 'Diseno de Experiencias',         color: '#8dc87a', code: 'DDE' },
  { name: 'Competencia Pedagogica',         color: '#d4c060', code: 'DCP' },
  { name: 'Evaluacion del Aprendizaje',     color: '#a888d0', code: 'DEA' },
  { name: 'Etica Digital',                  color: '#e888b8', code: 'DED' },
  { name: 'Desarrollo Profesional Docente', color: '#f4a0d0', code: 'DDP' },
];

export const GROUPS = [
  {
    key: 'pedagogico',
    icon: '🎓',
    title: 'Fundamentos pedagogicos y didacticos',
    dims: [0, 1, 2, 3],
  },
  {
    key: 'tecnologico',
    icon: '💻',
    title: 'Fundamentos tecnologicos y del aprendizaje',
    dims: [4],
  },
  {
    key: 'profesional',
    icon: '🏫',
    title: 'Fundamentos para el desarrollo profesional',
    dims: [5, 6],
  },
];

export const SCORE_LABELS = {
  1: 'Nunca',
  2: 'Rara vez',
  3: 'A veces',
  4: 'Frecuentemente',
  5: 'Siempre',
};

export const FILTER_DEFINITIONS = {
  vinculacion:  ['Planta', 'Transitorio', 'Catedra'],
  modalidad:    ['Presencial', 'Hibrida', 'Virtual'],
  formacion:    ['Pregrado', 'Especializacion', 'Maestria', 'Doctorado'],
  experiencia:  ['0 - 2', '3 - 5', '6 - 10', '11 - 20', 'Mas de 20'],
};