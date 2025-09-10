import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { CheckCircle, XCircle, Target, Brain, Zap, Shuffle, Lightbulb, Tags } from 'lucide-react';
import { BibleVerse } from '../data/verses';

interface QuizProps {
  verse: BibleVerse;
  onNext: (isCorrect: boolean) => void;
  currentIndex: number;
  totalCount: number;
  score: number;
}

type QuizMode = 'fill-blank' | 'multiple-choice' | 'word-order' | 'first-letter' | 'keyword-select';

export function Quiz({ verse, onNext, currentIndex, totalCount, score }: QuizProps) {
  const [quizMode, setQuizMode] = useState<QuizMode>('fill-blank');
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [blankWord, setBlankWord] = useState('');
  const [blankIndex, setBlankIndex] = useState(0);
  const [textWithBlank, setTextWithBlank] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [wordOrderWords, setWordOrderWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [keywordOptions, setKeywordOptions] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [firstLetterHint, setFirstLetterHint] = useState('');

  useEffect(() => {
    resetQuiz();
  }, [verse]);

  const resetQuiz = () => {
    setUserAnswer('');
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
    setSelectedWords([]);
    setSelectedKeywords([]);
    
    // Randomly choose quiz mode from all available modes
    const modes: QuizMode[] = ['fill-blank', 'multiple-choice', 'word-order', 'first-letter', 'keyword-select'];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    setQuizMode(mode);

    switch (mode) {
      case 'fill-blank':
        setupFillBlankQuiz();
        break;
      case 'multiple-choice':
        setupMultipleChoiceQuiz();
        break;
      case 'word-order':
        setupWordOrderQuiz();
        break;
      case 'first-letter':
        setupFirstLetterQuiz();
        break;
      case 'keyword-select':
        setupKeywordSelectQuiz();
        break;
    }
  };

  const setupFillBlankQuiz = () => {
    const words = verse.text.split(' ').filter(word => word.length > 2);
    const randomIndex = Math.floor(Math.random() * words.length);
    const wordToBlank = words[randomIndex].replace(/[.,!?]/g, '');
    
    setBlankWord(wordToBlank);
    const textParts = verse.text.split(' ');
    const blankIdx = textParts.findIndex(word => word.replace(/[.,!?]/g, '') === wordToBlank);
    setBlankIndex(blankIdx);
    
    const textWithBlankGenerated = textParts.map((word, idx) => 
      idx === blankIdx ? '______' : word
    ).join(' ');
    
    setTextWithBlank(textWithBlankGenerated);
  };

  const setupMultipleChoiceQuiz = () => {
    // Create options with correct reference and 3 wrong ones
    const wrongReferences = [
      '요한복음 1:1', '마태복음 5:3', '시편 119:105', '로마서 1:16',
      '에베소서 2:8', '야고보서 1:17', '고린도전서 13:4', '히브리서 11:1'
    ].filter(ref => ref !== verse.reference);
    
    const shuffledWrong = wrongReferences.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [verse.reference, ...shuffledWrong].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const setupWordOrderQuiz = () => {
    // Split verse into words and shuffle them
    const words = verse.text.split(' ').filter(word => word.trim());
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    setWordOrderWords(shuffledWords);
  };

  const setupFirstLetterQuiz = () => {
    // Create hint with first letters of each word
    const words = verse.text.split(' ');
    const hint = words.map(word => {
      const cleanWord = word.replace(/[.,!?]/g, '');
      return cleanWord.charAt(0).toUpperCase() + '___';
    }).join(' ');
    setFirstLetterHint(hint);
  };

  const setupKeywordSelectQuiz = () => {
    // Extract important words from the verse (longer than 2 characters)
    const words = verse.text.split(' ').map(word => word.replace(/[.,!?]/g, ''));
    const keywords = words.filter(word => word.length > 2);
    
    // Add some random wrong words
    const wrongWords = ['사랑', '믿음', '소망', '은혜', '평안', '기쁨', '축복', '구원', '생명', '빛'];
    const availableWrong = wrongWords.filter(word => !keywords.includes(word));
    
    // Take 3-5 correct keywords and 3-4 wrong ones
    const selectedKeywords = keywords.slice(0, Math.min(5, keywords.length));
    const selectedWrong = availableWrong.slice(0, 4);
    
    const allKeywordOptions = [...selectedKeywords, ...selectedWrong].sort(() => Math.random() - 0.5);
    setKeywordOptions(allKeywordOptions);
  };

  const checkAnswer = () => {
    let correct = false;
    
    switch (quizMode) {
      case 'fill-blank':
        const normalizedUserAnswer = userAnswer.toLowerCase().trim().replace(/[.,!?]/g, '');
        const normalizedBlankWord = blankWord.toLowerCase().trim();
        correct = normalizedUserAnswer === normalizedBlankWord;
        break;
      case 'multiple-choice':
        correct = selectedOption === verse.reference;
        break;
      case 'word-order':
        const originalWords = verse.text.split(' ').filter(word => word.trim());
        correct = selectedWords.length === originalWords.length && 
                 selectedWords.every((word, index) => word === originalWords[index]);
        break;
      case 'first-letter':
        const normalizedInput = userAnswer.toLowerCase().trim();
        const normalizedVerse = verse.text.toLowerCase().trim();
        // Allow for minor differences in punctuation
        const similarity = calculateSimilarity(normalizedInput, normalizedVerse);
        correct = similarity > 0.8; // 80% similarity threshold
        break;
      case 'keyword-select':
        const verseWords = verse.text.split(' ').map(word => word.replace(/[.,!?]/g, ''));
        const correctKeywords = verseWords.filter(word => word.length > 2);
        const selectedCorrect = selectedKeywords.filter(word => correctKeywords.includes(word));
        const selectedWrong = selectedKeywords.filter(word => !correctKeywords.includes(word));
        correct = selectedCorrect.length >= Math.min(3, correctKeywords.length) && selectedWrong.length === 0;
        break;
    }
    
    setIsCorrect(correct);
    setShowResult(true);
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const minLength = Math.min(words1.length, words2.length);
    const maxLength = Math.max(words1.length, words2.length);
    
    let matches = 0;
    for (let i = 0; i < minLength; i++) {
      if (words1[i] === words2[i]) matches++;
    }
    
    return matches / maxLength;
  };

  const toggleWordSelection = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const toggleKeywordSelection = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const renderQuizContent = () => {
    const getQuizTitle = () => {
      switch (quizMode) {
        case 'fill-blank':
          return { icon: <Zap className="w-5 h-5 text-yellow-500" />, text: "빈칸을 채워주세요 ✨" };
        case 'multiple-choice':
          return { icon: <Target className="w-5 h-5 text-sheepy-blue" />, text: "이 구절의 출처는? 🎯" };
        case 'word-order':
          return { icon: <Shuffle className="w-5 h-5 text-purple-500" />, text: "단어를 순서대로 배열하세요 🔄" };
        case 'first-letter':
          return { icon: <Lightbulb className="w-5 h-5 text-orange-500" />, text: "첫 글자 힌트로 구절을 완성하세요 💡" };
        case 'keyword-select':
          return { icon: <Tags className="w-5 h-5 text-green-500" />, text: "이 구절에 포함된 단어들을 선택하세요 🏷️" };
        default:
          return { icon: <Brain className="w-5 h-5" />, text: "퀴즈" };
      }
    };

    const { icon, text } = getQuizTitle();

    return (
      <div>
        <h3 className="text-lg mb-4 text-center flex items-center justify-center gap-2 text-sheepy-blue">
          {icon}
          {text}
        </h3>

        <motion.div whileHover={{ scale: 1.02 }} className="inline-block mb-4">
          <Badge className="gradient-sheepy-blue text-white border-0">
            📖 {verse.reference}
          </Badge>
        </motion.div>

        {/* Quiz Type Specific Content */}
        {quizMode === 'fill-blank' && (
          <div>
            <p className="text-base leading-relaxed mb-6">{textWithBlank}</p>
            {!showResult ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="답을 입력하세요 💭"
                  className="text-center text-lg py-3 focus:ring-purple-500 border-purple-200"
                  onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
                />
              </motion.div>
            ) : (
              renderResult(blankWord)
            )}
          </div>
        )}

        {quizMode === 'multiple-choice' && (
          <div>
            <p className="text-base leading-relaxed mb-6 text-center">"{verse.text}"</p>
            {!showResult ? (
              <div className="space-y-3">
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={selectedOption === option ? "default" : "outline"}
                      className={`w-full justify-center transition-all ${
                        selectedOption === option 
                          ? 'gradient-sheepy-blue text-white border-0' 
                          : 'hover:bg-sheepy-soft-blue hover:border-sheepy-blue/30'
                      }`}
                      onClick={() => setSelectedOption(option)}
                    >
                      {selectedOption === option ? '✅ ' : '📖 '}{option}
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              renderResult(verse.reference)
            )}
          </div>
        )}

        {quizMode === 'word-order' && (
          <div>
            <div className="mb-4 p-3 bg-sheepy-soft-blue/30 rounded-lg min-h-[60px] border-2 border-dashed border-sheepy-blue/30">
              <p className="text-sm text-muted-foreground mb-2">선택한 순서:</p>
              <div className="flex flex-wrap gap-2">
                {selectedWords.map((word, index) => (
                  <motion.div
                    key={`selected-${index}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 bg-sheepy-blue text-white rounded-full text-sm cursor-pointer"
                    onClick={() => setSelectedWords(selectedWords.filter((_, i) => i !== index))}
                  >
                    {index + 1}. {word} ✕
                  </motion.div>
                ))}
              </div>
            </div>
            {!showResult ? (
              <div className="flex flex-wrap gap-2">
                {wordOrderWords.map((word, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className={`${
                        selectedWords.includes(word) 
                          ? 'opacity-50 bg-gray-100' 
                          : 'hover:bg-purple-50 hover:border-purple-300'
                      }`}
                      onClick={() => !selectedWords.includes(word) && setSelectedWords([...selectedWords, word])}
                      disabled={selectedWords.includes(word)}
                    >
                      {word}
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              renderResult(verse.text)
            )}
          </div>
        )}

        {quizMode === 'first-letter' && (
          <div>
            <p className="text-base leading-relaxed mb-6 font-mono bg-orange-50 p-4 rounded-lg border">
              {firstLetterHint}
            </p>
            {!showResult ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="힌트를 보고 구절을 완성하세요 🔍"
                  className="text-center text-lg py-3 focus:ring-orange-500 border-orange-200"
                  onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
                />
              </motion.div>
            ) : (
              renderResult(verse.text)
            )}
          </div>
        )}

        {quizMode === 'keyword-select' && (
          <div>
            <p className="text-base leading-relaxed mb-4 text-center italic">"{verse.text}"</p>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              위 구절에 포함된 단어들을 모두 선택하세요 ({selectedKeywords.length}개 선택됨)
            </p>
            {!showResult ? (
              <div className="flex flex-wrap gap-2">
                {keywordOptions.map((keyword, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={selectedKeywords.includes(keyword) ? "default" : "outline"}
                      className={`${
                        selectedKeywords.includes(keyword) 
                          ? 'gradient-green-blue text-white border-0' 
                          : 'hover:bg-green-50 hover:border-green-300'
                      }`}
                      onClick={() => toggleKeywordSelection(keyword)}
                    >
                      {selectedKeywords.includes(keyword) ? '✅ ' : '🏷️ '}{keyword}
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              renderResult('키워드 선택 완료')
            )}
          </div>
        )}
      </div>
    );
  };

  const renderResult = (correctAnswer: string) => (
    <motion.div 
      className="text-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <motion.div 
        className={`flex items-center justify-center gap-2 mb-4 text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        {isCorrect ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
        <span>{isCorrect ? '🎉 정답입니다!' : '😅 틀렸습니다!'}</span>
      </motion.div>
      {!isCorrect && (
        <motion.div 
          className="text-sm text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          정답: <span className="text-purple-600 font-medium">✨ {correctAnswer} ✨</span>
        </motion.div>
      )}
      <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
        📖 {verse.reference}: {verse.text}
      </p>
    </motion.div>
  );

  const handleNext = () => {
    onNext(isCorrect);
    resetQuiz();
  };

  const getButtonDisabledState = () => {
    switch (quizMode) {
      case 'fill-blank':
      case 'first-letter':
        return !userAnswer.trim();
      case 'multiple-choice':
        return !selectedOption;
      case 'word-order':
        return selectedWords.length === 0;
      case 'keyword-select':
        return selectedKeywords.length === 0;
      default:
        return false;
    }
  };

  return (
    <div className="flex flex-col px-4 py-6 h-full bg-gradient-to-br from-sheepy-soft-blue via-sheepy-cream to-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Brain className="w-5 h-5 text-sheepy-blue" />
          <span className="text-sm text-sheepy-blue">🧠 퀴즈 타임</span>
        </motion.div>
        
        <motion.div 
          className="text-lg text-sheepy-blue"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {currentIndex + 1} / {totalCount}
        </motion.div>
        
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <Badge className="gradient-yellow-orange text-white border-0">
            🏆 {score}점
          </Badge>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="w-full bg-white/50 rounded-full h-3 mb-8 overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="gradient-sheepy-warm h-3 rounded-full transition-all duration-500 relative"
          style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
        </motion.div>
      </motion.div>

      {/* Quiz Content */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 mb-6 border-2 border-sheepy-blue/20 bg-white/90 backdrop-blur-sm">
            {renderQuizContent()}
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="w-full">
        {!showResult ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={checkAnswer}
              disabled={getButtonDisabledState()}
              className="w-full gradient-sheepy-warm text-white border-0 text-lg py-3 disabled:opacity-50 disabled:gradient-none disabled:bg-gray-300"
            >
              🎯 확인하기
            </Button>
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleNext} 
              className="w-full gradient-sheepy-blue text-white border-0 text-lg py-3"
            >
              다음 문제 🚀
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}