export interface BibleVerse {
  id: string;
  reference: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const bibleVerses: BibleVerse[] = [
  {
    id: '1',
    reference: '요한복음 3:16',
    text: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라',
    category: '사랑',
    difficulty: 'medium'
  },
  {
    id: '2',
    reference: '빌립보서 4:13',
    text: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라',
    category: '능력',
    difficulty: 'easy'
  },
  {
    id: '3',
    reference: '시편 23:1',
    text: '여호와는 나의 목자시니 내게 부족함이 없으리로다',
    category: '평안',
    difficulty: 'easy'
  },
  {
    id: '4',
    reference: '로마서 8:28',
    text: '우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라',
    category: '약속',
    difficulty: 'hard'
  },
  {
    id: '5',
    reference: '잠언 3:5-6',
    text: '너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라',
    category: '신뢰',
    difficulty: 'medium'
  },
  {
    id: '6',
    reference: '마태복음 28:19-20',
    text: '그러므로 너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 세례를 베풀고 내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라',
    category: '사명',
    difficulty: 'hard'
  },
  {
    id: '7',
    reference: '갈라디아서 2:20',
    text: '내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라',
    category: '정체성',
    difficulty: 'medium'
  },
  {
    id: '8',
    reference: '고린도전서 10:13',
    text: '사람이 감당할 시험 밖에는 너희가 당한 것이 없나니 오직 하나님은 미쁘사 너희가 감당하지 못할 시험 당함을 허락하지 아니하시고',
    category: '시험',
    difficulty: 'hard'
  }
];

export const categories = Array.from(new Set(bibleVerses.map(verse => verse.category)));