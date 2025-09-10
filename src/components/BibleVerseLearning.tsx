import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  BookOpen,
  Target,
  Filter,
  Sparkles,
  Heart,
  ArrowLeft,
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  ShoppingCart,
  X,
  Home,
} from "lucide-react";
import { Quiz } from "./Quiz";
import { FlashCard } from "./FlashCard";
import { Progress } from "./Progress";
import { SheepyLogo } from "./SheepyLogo";
import { bibleVerses, BibleVerse } from "../data/bibleVerses";
import { motion } from "motion/react";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner@2.0.3";
import {
  getAvailableBibleStructure,
  getChaptersForBook,
  getVersesForChapter,
  parseReference,
  getSectionEmoji,
  Testament,
  BibleSection,
} from "../utils/bibleParser";

type AppState =
  | "menu"
  | "selecting-book"
  | "selecting-chapter"
  | "selecting-verse"
  | "my-verses"
  | "study-mode-select"
  | "quiz"
  | "flashcard"
  | "completed";

export function BibleVerseLearning() {
  const [appState, setAppState] = useState<AppState>("menu");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<string>("all");
  const [selectedVerses, setSelectedVerses] = useState<
    BibleVerse[]
  >([]);

  // Navigation state
  const [selectedTestament, setSelectedTestament] =
    useState<Testament | null>(null);
  const [selectedSection, setSelectedSection] =
    useState<BibleSection | null>(null);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedChapter, setSelectedChapter] =
    useState<number>(0);

  // Get all categories dynamically from bibleVerses
  const allCategories = Array.from(
    new Set(bibleVerses.map((verse) => verse.category)),
  );
  const bibleStructure = getAvailableBibleStructure();

  const startVerseSelection = () => {
    setAppState("selecting-book");
    setSelectedTestament(null);
    setSelectedSection(null);
    setSelectedBook("");
    setSelectedChapter(0);
  };

  const selectBook = (book: string) => {
    setSelectedBook(book);
    setAppState("selecting-chapter");
  };

  const selectChapter = (chapter: number) => {
    setSelectedChapter(chapter);
    setAppState("selecting-verse");
  };

  const addVerse = (verse: BibleVerse) => {
    if (!selectedVerses.find((v) => v.id === verse.id)) {
      setSelectedVerses((prev) => [...prev, verse]);
      toast.success(`📖 ${verse.reference} 구절이 암송바구니에 추가되었습니다!`, {
        duration: 2000,
        position: "top-center",
      });
    }
  };

  const removeVerse = (verseId: string) => {
    const verse = selectedVerses.find((v) => v.id === verseId);
    setSelectedVerses((prev) =>
      prev.filter((v) => v.id !== verseId),
    );
    if (verse) {
      toast.info(`🗑️ ${verse.reference} 구절이 암송바구니에서 제거되었습니다`, {
        duration: 2000,
        position: "top-center",
      });
    }
  };

  const startStudyModeSelection = () => {
    if (selectedVerses.length === 0) return;

    // Apply difficulty filter if selected
    let filteredVerses = [...selectedVerses];
    if (selectedDifficulty !== "all") {
      filteredVerses = filteredVerses.filter(
        (verse) => verse.difficulty === selectedDifficulty,
      );
    }
    if (selectedCategory !== "all") {
      filteredVerses = filteredVerses.filter(
        (verse) => verse.category === selectedCategory,
      );
    }

    if (filteredVerses.length === 0) {
      alert("선택한 필터 조건에 맞는 구절이 없습니다.");
      return;
    }

    setAppState("study-mode-select");
  };

  const startQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setAppState("quiz");
  };

  const startFlashCard = () => {
    setCurrentIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setAppState("flashcard");
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    setTotalQuestions((prev) => prev + 1);
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setScore((prev) => prev + 10);
    }

    // Apply filters for quiz
    let quizVerses = [...selectedVerses];
    if (selectedDifficulty !== "all") {
      quizVerses = quizVerses.filter(
        (verse) => verse.difficulty === selectedDifficulty,
      );
    }
    if (selectedCategory !== "all") {
      quizVerses = quizVerses.filter(
        (verse) => verse.category === selectedCategory,
      );
    }

    if (currentIndex < quizVerses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setAppState("completed");
    }
  };

  const resetToMenu = () => {
    setAppState("menu");
    setCurrentIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setSelectedTestament(null);
    setSelectedSection(null);
    setSelectedBook("");
    setSelectedChapter(0);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setAppState("quiz");
  };

  const getFilteredSelectedVerses = () => {
    let filtered = [...selectedVerses];
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (verse) => verse.category === selectedCategory,
      );
    }
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (verse) => verse.difficulty === selectedDifficulty,
      );
    }
    return filtered;
  };

  const getCurrentQuizVerse = () => {
    const filtered = getFilteredSelectedVerses();
    return filtered[currentIndex];
  };

  if (appState === "menu") {
    return (
      <div className="flex flex-col px-4 py-6 h-full bg-gradient-to-br from-sheepy-soft-blue via-sheepy-cream to-white">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SheepyLogo size="large" showText={false} />
          </div>
          <h1 className="text-3xl mb-2 text-sheepy-blue font-[Space_Grotesk] font-bold text-[36px] px-[1px] py-[0px]">
            Sheepy Bible
          </h1>
          <p className="text-lg text-sheepy-blue/80 mb-2 not-italic font-bold">
            쉬피와 함께하는 성경암송
          </p>
          <p className="text-muted-foreground">
            하나님의 말씀을 마음에 새겨보세요 🙏💖
          </p>
        </div>

        {/* Cart Status */}
        {selectedVerses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="p-4 border-2 border-sheepy-blue/30 bg-gradient-to-r from-white/90 to-sheepy-soft-blue/30 backdrop-blur-sm shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-sheepy-blue rounded-full flex items-center justify-center shadow-md">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm text-sheepy-blue mb-1 font-medium">
                      🛒 구절 암송바구니
                    </h3>
                    <Badge className="gradient-sheepy-blue text-white border-0">
                      {selectedVerses.length}개 구절 담김
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAppState("my-verses")}
                  className="hover:bg-sheepy-blue hover:text-white transition-all duration-200"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  관리하기
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Study settings when verses are selected */}
        {selectedVerses.length > 0 && (
          <Card className="p-6 mb-6 border-2 border-sheepy-blue/20 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-sheepy-blue" />
              <h3 className="text-lg text-sheepy-blue">
                🎛️ 퀴즈 설정
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">
                  카테고리
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌈 전체</SelectItem>
                    {allCategories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block">
                  난이도
                </label>
                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="난이도 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌈 전체</SelectItem>
                    <SelectItem value="easy">
                      🟢 쉬움
                    </SelectItem>
                    <SelectItem value="medium">
                      🟡 보통
                    </SelectItem>
                    <SelectItem value="hard">
                      🔴 어려움
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 text-sm text-center">
              <Badge className="gradient-sheepy-blue text-white border-0">
                🎯 퀴즈 구절:{" "}
                {getFilteredSelectedVerses().length}개
              </Badge>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex-1 space-y-4">
          <Card
            className="p-6 cursor-pointer border-2 border-sheepy-blue/20 bg-white/80 backdrop-blur-sm floating-animation hover:scale-105 hover:-translate-y-2 active:scale-95 transition-all duration-300 hover:shadow-lg hover:border-sheepy-blue/40"
            onClick={startVerseSelection}
          >
            <div className="text-center">
              <div className="w-16 h-16 gradient-sheepy-blue rounded-full flex items-center justify-center shadow-md mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl flex items-center justify-center gap-2 text-sheepy-blue mb-2">
                📚 구절 추가하기
                <Sparkles className="w-5 h-5 text-sheepy-light-blue" />
              </h3>
              <p className="text-muted-foreground">
                성경에서 구절을 선택해 나만의 퀴즈를
                만들어보세요
              </p>
            </div>
          </Card>

          {selectedVerses.length > 0 && (
            <Card
              className="p-6 cursor-pointer border-2 border-sheepy-blue/20 bg-white/80 backdrop-blur-sm floating-animation hover:scale-105 hover:-translate-y-2 active:scale-95 transition-all duration-300 hover:shadow-lg hover:border-sheepy-blue/40"
              onClick={startStudyModeSelection}
            >
              <div className="text-center">
                <div className="w-16 h-16 gradient-sheepy-warm rounded-full flex items-center justify-center shadow-md mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl flex items-center justify-center gap-2 text-sheepy-blue mb-2">
                  🧠 학습 시작하기
                  <Heart className="w-4 h-4 text-red-500" />
                </h3>
                <p className="text-muted-foreground">
                  퀴즈와 플래시카드로 구절을 암송해보세요 ✨
                </p>
                <Badge className="gradient-pink-red text-white border-0 mt-4">
                  🏆 {getFilteredSelectedVerses().length}개
                  구절로 시작
                </Badge>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (appState === "selecting-book") {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-sheepy-soft-blue via-sheepy-cream to-white">
        {/* Header */}
        <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToMenu}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-xl text-sheepy-blue">
                📖 성경책 선택
              </h2>
              <p className="text-sm text-muted-foreground">
                학습할 성경책을 선택하세요
              </p>
            </div>
          </div>
        </div>

        {/* All Books List with Sections */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {bibleStructure.map((testament, testamentIndex) => (
              <div key={testament.name}>
                {/* Testament Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 gradient-sheepy-blue rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg text-sheepy-blue font-medium">
                      {testament.name}
                    </h3>
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-sheepy-blue/30 to-transparent"></div>
                </div>

                {/* Sections within Testament */}
                <div className="space-y-4">
                  {testament.sections.map(
                    (section, sectionIndex) => (
                      <div key={section.title}>
                        {/* Section Header */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">
                            {getSectionEmoji(section.title)}
                          </span>
                          <h4 className="text-base text-sheepy-blue/80 font-medium">
                            {section.title}
                          </h4>
                          <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* Books Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {section.books.map(
                            (book, bookIndex) => (
                              <motion.div
                                key={book}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay:
                                    testamentIndex * 0.1 +
                                    sectionIndex * 0.05 +
                                    bookIndex * 0.02,
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Card
                                  className="p-3 cursor-pointer border border-gray-200 bg-white/80 hover:border-sheepy-blue/40 hover:bg-sheepy-soft-blue/30 transition-all duration-200"
                                  onClick={() =>
                                    selectBook(book)
                                  }
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 gradient-sheepy-blue rounded flex items-center justify-center flex-shrink-0">
                                      <BookOpen className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-sm text-sheepy-blue font-medium truncate">
                                      {book}
                                    </span>
                                  </div>
                                </Card>
                              </motion.div>
                            ),
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (appState === "selecting-chapter") {
    const chapters = getChaptersForBook(selectedBook);

    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-sheepy-soft-blue via-sheepy-cream to-white">
        {/* Header */}
        <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAppState("selecting-book")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-xl text-sheepy-blue">
                📋 {selectedBook}
              </h2>
              <p className="text-sm text-muted-foreground">
                장을 선택하세요
              </p>
            </div>
          </div>
        </div>

        {/* Chapter Grid */}
        <ScrollArea className="flex-1 p-4">
          <div className="grid grid-cols-4 gap-3">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className="p-4 cursor-pointer border-2 border-gray-200 bg-white/80 hover:border-sheepy-blue/40 transition-all duration-200 text-center"
                  onClick={() => selectChapter(chapter)}
                >
                  <div className="text-lg text-sheepy-blue font-medium">
                    {chapter}장
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (appState === "selecting-verse") {
    const verses = getVersesForChapter(
      selectedBook,
      selectedChapter,
    );

    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-sheepy-soft-blue via-sheepy-cream to-white">
        {/* Header */}
        <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAppState("selecting-chapter")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-xl text-sheepy-blue">
                📃 {selectedBook} {selectedChapter}장
              </h2>
              <p className="text-sm text-muted-foreground">
                구절을 터치해서 암송바구니에 추가하세요
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAppState("selecting-book")}
              className="text-xs"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              다른 책
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAppState("selecting-chapter")}
              className="text-xs"
            >
              📋 다른 장
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToMenu}
              className="text-xs"
            >
              <Home className="w-3 h-3 mr-1" />
              홈
            </Button>
          </div>
        </div>

        {/* Verse List */}
        <ScrollArea className="flex-1 p-4 pb-24">
          <div className="space-y-3">
            {verses.map((verse, index) => {
              const isSelected = selectedVerses.find(
                (v) => v.id === verse.id,
              );
              const parsed = parseReference(verse.reference);

              return (
                <motion.div
                  key={verse.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-4 cursor-pointer border-2 transition-all duration-300 shadow-sm ${
                      isSelected
                        ? "border-sheepy-blue bg-gradient-to-r from-sheepy-soft-blue/70 to-sheepy-soft-blue/50 shadow-md"
                        : "border-gray-200 bg-white/80 hover:border-sheepy-blue/40 hover:shadow-md"
                    }`}
                    onClick={() =>
                      isSelected
                        ? removeVerse(verse.id)
                        : addVerse(verse)
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1">
                        <motion.div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                            isSelected
                              ? "bg-sheepy-blue border-sheepy-blue text-white shadow-lg"
                              : "border-gray-300 text-gray-500 hover:border-sheepy-blue/50"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isSelected ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            parsed ? parsed.verse : "?"
                          )}
                        </motion.div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {verse.reference}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              verse.difficulty === "easy"
                                ? "bg-green-100 text-green-700"
                                : verse.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {verse.difficulty === "easy"
                              ? "🟢 쉬움"
                              : verse.difficulty === "medium"
                                ? "🟡 보통"
                                : "🔴 어려움"}
                          </Badge>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Badge className="bg-sheepy-blue text-white text-xs">
                                ✅ 암송바구니에 담김
                              </Badge>
                            </motion.div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {verse.text}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Fixed Bottom Cart */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
          <div className="p-4 bg-white/95 backdrop-blur-md border-t border-gray-200">
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="flex items-center gap-3"
            >
              <Button
                onClick={() => setAppState("my-verses")}
                className="flex-1 gradient-sheepy-blue text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={selectedVerses.length === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                암송바구니 ({selectedVerses.length})
              </Button>
              {selectedVerses.length > 0 && (
                <Button
                  onClick={startStudyModeSelection}
                  className="gradient-sheepy-warm text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  🎓 학습 시작
                </Button>
              )}
            </motion.div>
            
            {selectedVerses.length > 0 && (
              <div className="flex items-center justify-center mt-2">
                <Badge className="bg-green-100 text-green-700 text-xs">
                  🎉 {selectedVerses.length}개 구절이 준비되었습니다!
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (appState === "my-verses") {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-sheepy-soft-blue via-sheepy-cream to-white">
        {/* Header */}
        <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToMenu}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-xl text-sheepy-blue flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                구절 암송바구니
              </h2>
              <p className="text-sm text-muted-foreground">
                선택한 구절들을 확인하고 관리하세요
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="gradient-sheepy-blue text-white border-0">
              🛒 총 {selectedVerses.length}개 구절
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={startVerseSelection}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              더 추가하기
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedVerses([])}
              disabled={selectedVerses.length === 0}
              className="text-xs text-red-600 hover:text-red-700"
            >
              <X className="w-3 h-3 mr-1" />
              전체 비우기
            </Button>
          </div>
        </div>

        {/* Selected Verses List */}
        <ScrollArea className="flex-1 p-4 pb-24">
          {selectedVerses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-muted-foreground mb-4 text-lg">
                암송바구니가 비어있습니다
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                성경 구절을 선택해서 나만의 암송 퀴즈를 만들어보세요
              </p>
              <Button 
                onClick={startVerseSelection}
                className="gradient-sheepy-blue text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                구절 추가하기
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedVerses.map((verse, index) => (
                <motion.div
                  key={verse.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className="p-4 border-2 border-sheepy-blue/20 bg-white/80 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 gradient-sheepy-blue rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-xs font-medium"
                          >
                            📖 {verse.reference}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              verse.difficulty === "easy"
                                ? "bg-green-100 text-green-700"
                                : verse.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {verse.difficulty === "easy"
                              ? "🟢 쉬움"
                              : verse.difficulty === "medium"
                                ? "🟡 보통"
                                : "🔴 어려움"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700"
                          >
                            {verse.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                          {verse.text}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVerse(verse.id)}
                        className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Fixed Bottom Actions */}
        {selectedVerses.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
            <div className="p-4 bg-white/95 backdrop-blur-md border-t border-gray-200">
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="space-y-3"
              >
                <div className="text-center">
                  <Badge className="bg-green-100 text-green-700 text-sm px-3 py-1">
                    🎉 {selectedVerses.length}개 구절로 퀴즈 준비 완료!
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={startVerseSelection}
                    variant="outline"
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    더 추가
                  </Button>
                  <Button
                    onClick={startStudyModeSelection}
                    className="flex-1 gradient-sheepy-warm text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    🎓 학습 시작
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (appState === "study-mode-select") {
    return (
      <div className="flex flex-col px-4 py-6 h-full bg-gradient-to-br from-sheepy-soft-blue via-sheepy-cream to-white">
        {/* Header */}
        <div className="p-4 border-b bg-white/80 backdrop-blur-sm rounded-t-lg mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToMenu}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-xl text-sheepy-blue">
                🎓 학습 방법 선택
              </h2>
              <p className="text-sm text-muted-foreground">
                어떤 방식으로 구절을 암송하시겠어요?
              </p>
            </div>
          </div>

          <div className="text-center">
            <Badge className="gradient-sheepy-blue text-white border-0">
              📚 {getFilteredSelectedVerses().length}개 구절 준비됨
            </Badge>
          </div>
        </div>

        {/* Study Mode Options */}
        <div className="flex-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              className="p-6 cursor-pointer border-2 border-sheepy-blue/20 bg-white/80 backdrop-blur-sm hover:scale-105 hover:-translate-y-2 active:scale-95 transition-all duration-300 hover:shadow-lg hover:border-purple-300"
              onClick={startQuiz}
            >
              <div className="text-center">
                <div className="w-16 h-16 gradient-purple-pink rounded-full flex items-center justify-center shadow-md mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl flex items-center justify-center gap-2 text-sheepy-blue mb-2">
                  🧠 퀴즈 모드
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </h3>
                <p className="text-muted-foreground mb-4">
                  다양한 문제 유형으로 실력을 테스트해보세요
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">빈칸 채우기</Badge>
                  <Badge variant="outline" className="text-xs">객관식</Badge>
                  <Badge variant="outline" className="text-xs">단어 순서</Badge>
                  <Badge variant="outline" className="text-xs">키워드 선택</Badge>
                  <Badge variant="outline" className="text-xs">첫 글자 힌트</Badge>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className="p-6 cursor-pointer border-2 border-sheepy-blue/20 bg-white/80 backdrop-blur-sm hover:scale-105 hover:-translate-y-2 active:scale-95 transition-all duration-300 hover:shadow-lg hover:border-blue-300"
              onClick={startFlashCard}
            >
              <div className="text-center">
                <div className="w-16 h-16 gradient-blue-teal rounded-full flex items-center justify-center shadow-md mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl flex items-center justify-center gap-2 text-sheepy-blue mb-2">
                  🃏 플래시카드 모드
                  <Heart className="w-5 h-5 text-blue-500" />
                </h3>
                <p className="text-muted-foreground mb-4">
                  카드를 뒤집어가며 자연스럽게 암송해보세요
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">출처 → 내용</Badge>
                  <Badge variant="outline" className="text-xs">내용 → 출처</Badge>
                  <Badge variant="outline" className="text-xs">자기 평가</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Tips */}
        <div className="mt-6">
          <Card className="p-4 border border-gray-200 bg-sheepy-cream/50">
            <p className="text-sm text-muted-foreground text-center">
              💡 <span className="font-medium">팁:</span> 플래시카드로 기본 암송을 한 후 퀴즈로 실력을 점검해보세요!
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (appState === "quiz") {
    const currentVerse = getCurrentQuizVerse();
    if (!currentVerse) {
      return (
        <div className="flex items-center justify-center h-full">
          <Card className="p-8 text-center">
            <h3 className="text-lg mb-4">
              퀴즈할 구절이 없습니다
            </h3>
            <Button onClick={resetToMenu}>
              메인으로 돌아가기
            </Button>
          </Card>
        </div>
      );
    }

    return (
      <Quiz
        verse={currentVerse}
        onNext={handleQuizAnswer}
        currentIndex={currentIndex}
        totalCount={getFilteredSelectedVerses().length}
        score={score}
      />
    );
  }

  if (appState === "flashcard") {
    const currentVerse = getCurrentQuizVerse();
    if (!currentVerse) {
      return (
        <div className="flex items-center justify-center h-full">
          <Card className="p-8 text-center">
            <h3 className="text-lg mb-4">
              학습할 구절이 없습니다
            </h3>
            <Button onClick={resetToMenu}>
              메인으로 돌아가기
            </Button>
          </Card>
        </div>
      );
    }

    return (
      <FlashCard
        verse={currentVerse}
        onNext={handleQuizAnswer}
        currentIndex={currentIndex}
        totalCount={getFilteredSelectedVerses().length}
        score={score}
      />
    );
  }

  if (appState === "completed") {
    return (
      <Progress
        totalQuestions={totalQuestions}
        correctAnswers={correctAnswers}
        score={score}
        onRestart={restartQuiz}
        onBackToMenu={resetToMenu}
      />
    );
  }

  return null;
}