import { BibleVerse, bibleVerses } from '../data/bibleVerses';

export interface ParsedReference {
  book: string;
  chapter: number;
  verse: number;
}

export interface BibleSection {
  title: string;
  books: string[];
}

export interface Testament {
  name: string;
  sections: BibleSection[];
}

// 성경 구조 정의
export const BIBLE_STRUCTURE: Testament[] = [
  {
    name: "구약성경 (39권)",
    sections: [
      {
        title: "율법서 (모세오경)",
        books: ["창세기", "출애굽기", "레위기", "민수기", "신명기"]
      },
      {
        title: "역사서",
        books: [
          "여호수아", "사사기", "룻기", "사무엘상", "사무엘하", 
          "열왕기상", "열왕기하", "역대상", "역대하", "에스라", 
          "느헤미야", "에스더"
        ]
      },
      {
        title: "시가서",
        books: ["욥기", "시편", "잠언", "전도서", "아가"]
      },
      {
        title: "예언서",
        books: [
          "이사야", "예레미야", "예레미야애가", "에스겔", "다니엘",
          "호세아", "요엘", "아모스", "오바댜", "요나", "미가", 
          "나훔", "하박국", "스바냐", "학개", "스가랴", "말라기"
        ]
      }
    ]
  },
  {
    name: "신약성경 (27권)",
    sections: [
      {
        title: "복음서",
        books: ["마태복음", "마가복음", "누가복음", "요한복음"]
      },
      {
        title: "역사서",
        books: ["사도행전"]
      },
      {
        title: "바울서신",
        books: [
          "로마서", "고린도전서", "고린도후서", "갈라디아서", "에베소서",
          "빌립보서", "골로새서", "데살로니가전서", "데살로니가후서",
          "디모데전서", "디모데후서", "디도서", "빌레몬서"
        ]
      },
      {
        title: "일반서신",
        books: [
          "히브리서", "야고보서", "베드로전서", "베드로후서",
          "요한일서", "요한이서", "요한삼서", "유다서"
        ]
      },
      {
        title: "예언서",
        books: ["요한계시록"]
      }
    ]
  }
];

export function parseReference(reference: string): ParsedReference | null {
  // "창세기 1:1" 형식을 파싱
  const match = reference.match(/^(.+)\s+(\d+):(\d+)$/);
  if (!match) return null;
  
  return {
    book: match[1].trim(),
    chapter: parseInt(match[2]),
    verse: parseInt(match[3])
  };
}

export function getBibleBooks(): string[] {
  const books = new Set<string>();
  bibleVerses.forEach(verse => {
    const parsed = parseReference(verse.reference);
    if (parsed) {
      books.add(parsed.book);
    }
  });
  return Array.from(books).sort();
}

export function getAvailableBibleStructure(): Testament[] {
  const availableBooks = new Set<string>();
  bibleVerses.forEach(verse => {
    const parsed = parseReference(verse.reference);
    if (parsed) {
      availableBooks.add(parsed.book);
    }
  });

  // 실제 데이터에 있는 책들만 포함하여 구조 반환
  return BIBLE_STRUCTURE.map(testament => ({
    ...testament,
    sections: testament.sections.map(section => ({
      ...section,
      books: section.books.filter(book => availableBooks.has(book))
    })).filter(section => section.books.length > 0) // 책이 없는 섹션은 제외
  })).filter(testament => testament.sections.length > 0); // 섹션이 없는 신/구약은 제외
}

export function getChaptersForBook(book: string): number[] {
  const chapters = new Set<number>();
  bibleVerses.forEach(verse => {
    const parsed = parseReference(verse.reference);
    if (parsed && parsed.book === book) {
      chapters.add(parsed.chapter);
    }
  });
  return Array.from(chapters).sort((a, b) => a - b);
}

export function getVersesForChapter(book: string, chapter: number): BibleVerse[] {
  return bibleVerses.filter(verse => {
    const parsed = parseReference(verse.reference);
    return parsed && parsed.book === book && parsed.chapter === chapter;
  }).sort((a, b) => {
    const aVerse = parseReference(a.reference)?.verse || 0;
    const bVerse = parseReference(b.reference)?.verse || 0;
    return aVerse - bVerse;
  });
}

export function formatReference(book: string, chapter: number, verse?: number): string {
  if (verse) {
    return `${book} ${chapter}:${verse}`;
  }
  return `${book} ${chapter}`;
}

export function getSectionEmoji(sectionTitle: string): string {
  const emojiMap: { [key: string]: string } = {
    '율법서 (모세오경)': '📜',
    '역사서': '🏛️',
    '시가서': '🎵',
    '예언서': '🔮',
    '복음서': '✝️',
    '바울서신': '✉️',
    '일반서신': '📨'
  };
  return emojiMap[sectionTitle] || '📖';
}