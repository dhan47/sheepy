import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  BookOpen,
  Quote
} from 'lucide-react';
import { BibleVerse } from '../data/bibleVerses';

interface FlashCardProps {
  verse: BibleVerse;
  onNext: (wasCorrect: boolean) => void;
  currentIndex: number;
  totalCount: number;
  score: number;
}

type CardSide = 'reference' | 'text';
type StudyMode = 'reference-to-text' | 'text-to-reference';

export function FlashCard({ verse, onNext, currentIndex, totalCount, score }: FlashCardProps) {
  const [currentSide, setCurrentSide] = useState<CardSide>('reference');
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode] = useState<StudyMode>(() => 
    Math.random() > 0.5 ? 'reference-to-text' : 'text-to-reference'
  );
  const [hasRevealed, setHasRevealed] = useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    setCurrentSide(currentSide === 'reference' ? 'text' : 'reference');
    if (!hasRevealed) setHasRevealed(true);
  };

  const handleResponse = (wasCorrect: boolean) => {
    onNext(wasCorrect);
    setIsFlipped(false);
    setCurrentSide('reference');
    setHasRevealed(false);
  };

  const getFrontContent = () => {
    if (studyMode === 'reference-to-text') {
      return {
        title: '📖 성경 구절 출처',
        content: verse.reference,
        hint: '이 구절의 내용을 기억해보세요',
        icon: <BookOpen className="w-6 h-6 text-sheepy-blue" />
      };
    } else {
      return {
        title: '📝 성경 구절 내용',
        content: verse.text,
        hint: '이 구절의 출처를 기억해보세요',
        icon: <Quote className="w-6 h-6 text-sheepy-blue" />
      };
    }
  };

  const getBackContent = () => {
    if (studyMode === 'reference-to-text') {
      return {
        title: '📝 구절 내용',
        content: verse.text,
        icon: <Quote className="w-6 h-6 text-green-600" />
      };
    } else {
      return {
        title: '📖 구절 출처',
        content: verse.reference,
        icon: <BookOpen className="w-6 h-6 text-green-600" />
      };
    }
  };

  const frontContent = getFrontContent();
  const backContent = getBackContent();

  return (
    <div className="flex flex-col px-4 py-6 h-full bg-gradient-to-br from-sheepy-soft-blue via-sheepy-cream to-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Eye className="w-5 h-5 text-sheepy-blue" />
          <span className="text-sm text-sheepy-blue">🃏 플래시카드</span>
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
          <Badge className="gradient-purple-pink text-white border-0">
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
          className="gradient-purple-pink h-3 rounded-full transition-all duration-500 relative"
          style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
        </motion.div>
      </motion.div>

      {/* FlashCard */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="perspective-1000 mb-8">
          <motion.div
            className="relative w-full h-80 preserve-3d cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
            onClick={flipCard}
          >
            {/* Front Side */}
            <Card className="absolute inset-0 w-full h-full backface-hidden border-2 border-sheepy-blue/20 bg-gradient-to-br from-white to-sheepy-soft-blue/30">
              <div className="h-full p-8 flex flex-col justify-center text-center">
                <motion.div
                  className="mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {frontContent.icon}
                </motion.div>
                
                <h3 className="text-lg mb-4 text-sheepy-blue font-medium">
                  {frontContent.title}
                </h3>
                
                <Badge className="mb-6 gradient-sheepy-blue text-white border-0 mx-auto">
                  {verse.category}
                </Badge>
                
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xl leading-relaxed text-gray-700 font-medium">
                    {frontContent.content}
                  </p>
                </div>
                
                <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  {frontContent.hint}
                </p>
              </div>
            </Card>

            {/* Back Side */}
            <Card className="absolute inset-0 w-full h-full backface-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-white rotate-y-180">
              <div className="h-full p-8 flex flex-col justify-center text-center">
                <motion.div
                  className="mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: isFlipped ? 1 : 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {backContent.icon}
                </motion.div>
                
                <h3 className="text-lg mb-4 text-green-700 font-medium">
                  {backContent.title}
                </h3>
                
                <Badge className="mb-6 bg-green-500 text-white border-0 mx-auto">
                  정답 공개! ✨
                </Badge>
                
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xl leading-relaxed text-gray-700 font-medium">
                    {backContent.content}
                  </p>
                </div>

                <div className="mt-4 p-4 bg-white/70 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{verse.reference}</span>
                    <br />
                    "{verse.text}"
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        {!hasRevealed ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={flipCard}
              className="w-full gradient-sheepy-blue text-white border-0 text-lg py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              🔄 뒤집어서 확인하기
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground mb-4">
              이 구절을 얼마나 잘 기억하고 있었나요?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={() => handleResponse(false)}
                  variant="outline"
                  className="w-full border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  😅 잘 모르겠어요
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={() => handleResponse(true)}
                  className="w-full gradient-green-blue text-white border-0"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  🎉 잘 알고 있어요!
                </Button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}