export type ExerciseDef =
  | { type: 'chord-hear'; chord: string; distractors: [string, string, string] }
  | { type: 'scale-hear'; rootNote: number; scale: string; distractors: [string, string, string] };

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  xpReward: number;
  exercises: ExerciseDef[];
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  lessons: Lesson[];
}

// Standard open/barre voicings for chord playback (string 0 = low E)
export const CHORD_FRETS: Record<string, number[]> = {
  'Am': [0,  0, 2, 2, 1, 0],
  'Em': [0,  2, 2, 0, 0, 0],
  'Dm': [-1, 0, 0, 2, 3, 1],
  'Bm': [-1, 2, 4, 4, 3, 2],
  'C':  [-1, 3, 2, 0, 1, 0],
  'G':  [3,  2, 0, 0, 0, 3],
  'D':  [-1,-1, 0, 2, 3, 2],
  'A':  [-1, 0, 2, 2, 2, 0],
  'E':  [0,  2, 2, 1, 0, 0],
  'F':   [ 1,  3, 3, 2, 1, 1],
  'Am7': [-1,  0, 2, 0, 1, 0],
  'Em7': [ 0,  2, 0, 0, 0, 0],
  'Dm7': [-1, -1, 0, 2, 1, 1],
  'G7':  [ 3,  2, 0, 0, 0, 1],
  'D7':  [-1, -1, 0, 2, 1, 2],
  'E7':  [ 0,  2, 0, 1, 0, 0],
  'A7':  [-1,  0, 2, 0, 2, 0],
  'Cmaj7': [-1, 3, 2, 0, 0, 0],
  'Fmaj7': [-1, -1, 3, 2, 1, 0],
};

export const MODULES: Module[] = [
  {
    id: 'chords',
    title: 'Аккорды',
    subtitle: 'Учись слышать и узнавать аккорды на слух',
    lessons: [
      {
        id: 'chords-minor',
        title: 'Минорные аккорды',
        subtitle: 'Am · Em · Dm · Bm',
        xpReward: 10,
        exercises: [
          { type: 'chord-hear', chord: 'Am', distractors: ['Em', 'Dm', 'Bm'] },
          { type: 'chord-hear', chord: 'Em', distractors: ['Am', 'Dm', 'Bm'] },
          { type: 'chord-hear', chord: 'Dm', distractors: ['Am', 'Em', 'Bm'] },
          { type: 'chord-hear', chord: 'Bm', distractors: ['Am', 'Em', 'Dm'] },
          { type: 'chord-hear', chord: 'Am', distractors: ['Dm', 'Em', 'Bm'] },
          { type: 'chord-hear', chord: 'Em', distractors: ['Am', 'Bm', 'Dm'] },
        ],
      },
      {
        id: 'chords-major',
        title: 'Мажорные аккорды',
        subtitle: 'C · G · D · A · E',
        xpReward: 10,
        exercises: [
          { type: 'chord-hear', chord: 'C', distractors: ['G', 'D', 'A'] },
          { type: 'chord-hear', chord: 'G', distractors: ['C', 'D', 'A'] },
          { type: 'chord-hear', chord: 'D', distractors: ['C', 'G', 'A'] },
          { type: 'chord-hear', chord: 'A', distractors: ['C', 'G', 'D'] },
          { type: 'chord-hear', chord: 'E', distractors: ['C', 'G', 'D'] },
          { type: 'chord-hear', chord: 'G', distractors: ['E', 'A', 'D'] },
        ],
      },
      {
        id: 'chords-mixed',
        title: 'Мажор и минор',
        subtitle: 'Am · Em · C · G · D',
        xpReward: 15,
        exercises: [
          { type: 'chord-hear', chord: 'Am', distractors: ['C',  'G',  'Em'] },
          { type: 'chord-hear', chord: 'G',  distractors: ['Am', 'C',  'D']  },
          { type: 'chord-hear', chord: 'C',  distractors: ['Am', 'G',  'D']  },
          { type: 'chord-hear', chord: 'Em', distractors: ['Am', 'C',  'G']  },
          { type: 'chord-hear', chord: 'D',  distractors: ['Dm', 'C',  'G']  },
          { type: 'chord-hear', chord: 'Dm', distractors: ['D',  'Am', 'C']  },
          { type: 'chord-hear', chord: 'Am', distractors: ['Em', 'G',  'D']  },
        ],
      },
      {
        id: 'chords-seventh',
        title: 'Септаккорды',
        subtitle: 'Am7 · Em7 · G7 · D7 · Cmaj7',
        xpReward: 15,
        exercises: [
          { type: 'chord-hear', chord: 'Am7',   distractors: ['Am',   'Em7',   'Dm7']   },
          { type: 'chord-hear', chord: 'Em7',   distractors: ['Em',   'Am7',   'G7']    },
          { type: 'chord-hear', chord: 'G7',    distractors: ['G',    'D7',    'Am7']   },
          { type: 'chord-hear', chord: 'D7',    distractors: ['D',    'G7',    'A7']    },
          { type: 'chord-hear', chord: 'Cmaj7', distractors: ['C',    'Am7',   'Fmaj7'] },
          { type: 'chord-hear', chord: 'A7',    distractors: ['A',    'Am7',   'D7']    },
          { type: 'chord-hear', chord: 'Am7',   distractors: ['Cmaj7','G7',    'Em7']   },
          { type: 'chord-hear', chord: 'G7',    distractors: ['Cmaj7','Am7',   'D7']    },
        ],
      },
    ],
  },
  {
    id: 'scales',
    title: 'Гаммы',
    subtitle: 'Учись слышать характер гамм и ладов',
    lessons: [
      {
        id: 'scales-major-minor',
        title: 'Мажор и минор',
        subtitle: 'Самое главное различие',
        xpReward: 10,
        exercises: [
          { type: 'scale-hear', rootNote: 9, scale: 'Мажор',  distractors: ['Минор', 'Мажорная', 'Минорная'] },
          { type: 'scale-hear', rootNote: 2, scale: 'Минор',  distractors: ['Мажор', 'Минорная', 'Мажорная'] },
          { type: 'scale-hear', rootNote: 7, scale: 'Мажор',  distractors: ['Минор', 'Мажорная', 'Дориан'] },
          { type: 'scale-hear', rootNote: 4, scale: 'Минор',  distractors: ['Мажор', 'Дориан',   'Минорная'] },
          { type: 'scale-hear', rootNote: 0, scale: 'Мажор',  distractors: ['Минор', 'Минорная', 'Дориан']  },
          { type: 'scale-hear', rootNote: 9, scale: 'Минор',  distractors: ['Мажор', 'Дориан',   'Мажорная'] },
        ],
      },
      {
        id: 'scales-pentatonic',
        title: 'Пентатоники',
        subtitle: 'Мажорная · Минорная · Блюз',
        xpReward: 10,
        exercises: [
          { type: 'scale-hear', rootNote: 9, scale: 'Мажорная', distractors: ['Минорная', 'Блюз',      'Мажор']    },
          { type: 'scale-hear', rootNote: 9, scale: 'Минорная', distractors: ['Мажорная', 'Блюз',      'Минор']    },
          { type: 'scale-hear', rootNote: 9, scale: 'Блюз',     distractors: ['Минорная', 'Мажорная',  'Минор']    },
          { type: 'scale-hear', rootNote: 2, scale: 'Мажорная', distractors: ['Минорная', 'Блюз',      'Мажор']    },
          { type: 'scale-hear', rootNote: 4, scale: 'Минорная', distractors: ['Мажорная', 'Блюз',      'Минор']    },
          { type: 'scale-hear', rootNote: 7, scale: 'Блюз',     distractors: ['Минорная', 'Мажорная',  'Минор']    },
        ],
      },
      {
        id: 'scales-modes',
        title: 'Лады',
        subtitle: 'Дориан · Фригийский · Миксолидийский',
        xpReward: 15,
        exercises: [
          { type: 'scale-hear', rootNote: 9, scale: 'Дориан',       distractors: ['Минор',       'Фригийский',    'Миксолидийский'] },
          { type: 'scale-hear', rootNote: 9, scale: 'Фригийский',   distractors: ['Дориан',      'Минор',         'Локрийский']     },
          { type: 'scale-hear', rootNote: 9, scale: 'Миксолидийский', distractors: ['Мажор',     'Дориан',        'Лидийский']      },
          { type: 'scale-hear', rootNote: 7, scale: 'Лидийский',    distractors: ['Мажор',       'Миксолидийский','Дориан']         },
          { type: 'scale-hear', rootNote: 9, scale: 'Дориан',       distractors: ['Минор',       'Миксолидийский','Фригийский']     },
          { type: 'scale-hear', rootNote: 9, scale: 'Локрийский',   distractors: ['Фригийский',  'Минор',         'Дориан']         },
        ],
      },
    ],
  },
  {
    id: 'rhythm',
    title: 'Ритм',
    subtitle: 'Скоро',
    lessons: [],
  },
];
