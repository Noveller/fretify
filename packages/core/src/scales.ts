export interface ScaleFormula {
  name: string;
  intervals: number[];
  category: 'scale' | 'mode' | 'pentatonic';
}

export const SCALES: ScaleFormula[] = [
  // Гаммы
  { name: 'Мажор',            intervals: [0,2,4,5,7,9,11], category: 'scale' },
  { name: 'Минор',            intervals: [0,2,3,5,7,8,10], category: 'scale' },
  { name: 'Гарм. минор',      intervals: [0,2,3,5,7,8,11], category: 'scale' },
  { name: 'Мел. минор',       intervals: [0,2,3,5,7,9,11], category: 'scale' },
  // Лады
  { name: 'Дориан',           intervals: [0,2,3,5,7,9,10], category: 'mode' },
  { name: 'Фригийский',       intervals: [0,1,3,5,7,8,10], category: 'mode' },
  { name: 'Лидийский',        intervals: [0,2,4,6,7,9,11], category: 'mode' },
  { name: 'Миксолидийский',   intervals: [0,2,4,5,7,9,10], category: 'mode' },
  { name: 'Локрийский',       intervals: [0,1,3,5,6,8,10], category: 'mode' },
  { name: 'Фриг. доминанта',  intervals: [0,1,4,5,7,8,10], category: 'mode' },
  // Пентатоники
  { name: 'Мажорная',         intervals: [0,2,4,7,9],      category: 'pentatonic' },
  { name: 'Минорная',         intervals: [0,3,5,7,10],     category: 'pentatonic' },
  { name: 'Блюз',             intervals: [0,3,5,6,7,10],   category: 'pentatonic' },
];
