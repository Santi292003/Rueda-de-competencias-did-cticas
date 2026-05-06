// Cada entrada define qué columna del CSV contribuye
// a qué desempeños (código de dimensión + D1/D2/D3)
export const ITEM_MAP = [
  // COMPETENCIA TECNOLOGICA
  { col: 'p9_1',      targets: [['DT', 'D1']] },
  { col: 'p9_2',      targets: [['DT', 'D2']] },
  { col: 'p9_3',      targets: [['DT', 'D1']] },
  { col: 'p9_4',      targets: [['DT', 'D1'], ['DED', 'D1']] },
  { col: 'p9_5',      targets: [['DT', 'D2']] },
  { col: 'p9_6',      targets: [['DT', 'D1']] },
  { col: 'p9_nueva1', targets: [['DT', 'D3']] },
  { col: 'p9_nueva2', targets: [['DT', 'D3']] },
  { col: 'p9_nueva3', targets: [['DT', 'D1']] },

  // DIDACTICA DISCIPLINAR — bloques por area
  { col: 'p11_1', targets: [['DDD', 'D3']] },
  { col: 'p11_2', targets: [['DDD', 'D1']] },
  { col: 'p11_3', targets: [['DDD', 'D2']] },

  { col: 'p12_1', targets: [['DDD', 'D1']] },
  { col: 'p12_2', targets: [['DDD', 'D2']] },
  { col: 'p12_3', targets: [['DDD', 'D3']] },

  { col: 'p13_1', targets: [['DDD', 'D3']] },
  { col: 'p13_2', targets: [['DDD', 'D2']] },
  { col: 'p13_3', targets: [['DDD', 'D1']] },

  { col: 'p14_1', targets: [['DDD', 'D3']] },
  { col: 'p14_2', targets: [['DDD', 'D2']] },
  { col: 'p14_3', targets: [['DDD', 'D1']] },

  { col: 'p15_1', targets: [['DDD', 'D1'], ['DDD', 'D3']] },
  { col: 'p15_2', targets: [['DDD', 'D2']] },
  { col: 'p15_3', targets: [['DDD', 'D3']] },

  { col: 'p16_1', targets: [['DDD', 'D3']] },
  { col: 'p16_2', targets: [['DDD', 'D2']] },
  { col: 'p16_3', targets: [['DDD', 'D1'], ['DDD', 'D3']] },

  { col: 'p17_1', targets: [['DDD', 'D3']] },
  { col: 'p17_2', targets: [['DDD', 'D1'], ['DDD', 'D3']] },
  { col: 'p17_3', targets: [['DDD', 'D2']] },

  // COMPETENCIA PEDAGOGICA
  { col: 'p18_1', targets: [['DCP', 'D1']] },
  { col: 'p18_2', targets: [['DDE', 'D2'], ['DCP', 'D1']] },
  { col: 'p18_3', targets: [['DCP', 'D3'], ['DCP', 'D1']] },
  { col: 'p18_4', targets: [['DCP', 'D1']] },
  { col: 'p18_5', targets: [['DCP', 'D1']] },
  { col: 'p18_6', targets: [['DDE', 'D1'], ['DDE', 'D3']] },

  // EVALUACION DEL APRENDIZAJE
  { col: 'p19_1', targets: [['DEA', 'D1']] },
  { col: 'p19_2', targets: [['DEA', 'D1']] },
  { col: 'p19_3', targets: [['DEA', 'D2']] },
  { col: 'p19_4', targets: [['DEA', 'D3']] },
  { col: 'p19_5', targets: [['DEA', 'D1']] },

  // ETICA DIGITAL
  { col: 'p20_1', targets: [['DED', 'D3']] },
  { col: 'p20_2', targets: [['DED', 'D1']] },
  { col: 'p20_3', targets: [['DED', 'D1']] },
  { col: 'p20_4', targets: [['DED', 'D2']] },
  { col: 'p20_5', targets: [['DED', 'D3']] },

  // ANALITICA / DISENO DE EXPERIENCIAS
  { col: 'p21_1', targets: [['DDE', 'D3'], ['DEA', 'D3']] },
  { col: 'p21_2', targets: [['DDE', 'D3']] },
  { col: 'p21_3', targets: [['DEA', 'D3'], ['DDE', 'D3']] },
  { col: 'p21_4', targets: [['DDE', 'D3']] },
  { col: 'p21_5', targets: [['DEA', 'D3']] },

  // DESARROLLO PROFESIONAL DOCENTE
  { col: 'p22_1', targets: [['DDP', 'D1']] },
  { col: 'p22_2', targets: [['DDP', 'D3']] },
  { col: 'p22_3', targets: [['DDP', 'D2']] },
  { col: 'p22_4', targets: [['DDP', 'D3']] },
  { col: 'p22_5', targets: [['DDP', 'D3']] },
];