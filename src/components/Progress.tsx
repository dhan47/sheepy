import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Trophy, Target, BookOpen, RotateCcw } from 'lucide-react';

interface ProgressProps {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export function Progress({ totalQuestions, correctAnswers, score, onRestart, onBackToMenu }: ProgressProps) {
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "훌륭합니다! 완벽에 가까운 성과입니다!", color: "text-green-600" };
    if (accuracy >= 70) return { message: "잘했습니다! 좋은 성과입니다!", color: "text-blue-600" };
    if (accuracy >= 50) return { message: "괜찮습니다! 조금 더 연습해보세요!", color: "text-yellow-600" };
    return { message: "다시 도전해보세요! 연습하면 늘어날 거예요!", color: "text-orange-600" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="flex flex-col items-center px-4 py-6 h-full bg-gradient-to-br from-sheepy-soft-blue via-sheepy-cream to-white">
      <div className="flex-1 flex flex-col justify-center w-full max-w-md">
        {/* Results Header */}
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl mb-2 text-sheepy-blue">학습 완료!</h2>
          <p className={`text-lg ${performance.color}`}>{performance.message}</p>
        </div>

        {/* Statistics Cards */}
        <div className="space-y-4 mb-8">
          <Card className="p-6 border-2 border-sheepy-blue/20 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-sheepy-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">정답률</p>
                  <p className="text-2xl text-sheepy-blue">{accuracy}%</p>
                </div>
              </div>
              <Badge className={`text-lg px-3 py-1 ${accuracy >= 70 ? "gradient-sheepy-blue text-white border-0" : "bg-gray-100 text-gray-600"}`}>
                {correctAnswers}/{totalQuestions}
              </Badge>
            </div>
          </Card>

          <Card className="p-6 border-2 border-sheepy-blue/20 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">총 점수</p>
                  <p className="text-2xl text-sheepy-blue">{score}점</p>
                </div>
              </div>
              <Badge className="gradient-yellow-orange text-white border-0 text-lg px-3 py-1">
                평균 {totalQuestions > 0 ? Math.round(score / totalQuestions) : 0}점
              </Badge>
            </div>
          </Card>

          <Card className="p-6 border-2 border-sheepy-blue/20 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-sheepy-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">학습한 구절</p>
                  <p className="text-2xl text-sheepy-blue">{totalQuestions}개</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Visualization */}
        <Card className="p-6 mb-8 border-2 border-sheepy-blue/20 bg-white/90 backdrop-blur-sm">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>진행률</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="gradient-sheepy-warm h-3 rounded-full transition-all duration-1000"
                style={{ width: '100%' }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl text-green-600">{correctAnswers}</p>
              <p className="text-sm text-muted-foreground">맞춤</p>
            </div>
            <div>
              <p className="text-2xl text-red-600">{totalQuestions - correctAnswers}</p>
              <p className="text-sm text-muted-foreground">틀림</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <Button onClick={onRestart} className="w-full" size="lg">
          <RotateCcw className="w-5 h-5 mr-2" />
          다시 학습하기
        </Button>
        <Button onClick={onBackToMenu} variant="outline" className="w-full" size="lg">
          메인으로 돌아가기
        </Button>
      </div>
    </div>
  );
}