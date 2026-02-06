import { useState, useEffect, useCallback } from 'react';
import { categories, getRankTitle } from '../data/questions';

interface QuizSectionProps {
  playerName: string;
  onScoreUpdate: (categoryId: string, score: number, total: number, time: number) => void;
}

interface AnswerState {
  trueFalse: boolean | null;
  multipleChoice: number | null;
  matching: number[];
  fillBlank: string;
  shortQuestion: string;
}

export function QuizSection({ playerName, onScoreUpdate }: QuizSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({
    trueFalse: null,
    multipleChoice: null,
    matching: [],
    fillBlank: '',
    shortQuestion: '',
  });
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [matchingSelection, setMatchingSelection] = useState<number | null>(null);

  const category = categories.find(c => c.id === selectedCategory);
  const currentQuestion = category?.questions[currentQuestionIndex];

  useEffect(() => {
    if (selectedCategory && !quizCompleted && !showResult) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleCheckAnswer();
            return 60;
          }
          return prev - 1;
        });
        setTotalTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedCategory, quizCompleted, showResult, currentQuestionIndex]);

  const resetAnswers = () => {
    setAnswers({
      trueFalse: null,
      multipleChoice: null,
      matching: currentQuestion?.type === 'matching' 
        ? new Array((currentQuestion as any).leftItems.length).fill(-1)
        : [],
      fillBlank: '',
      shortQuestion: '',
    });
    setMatchingSelection(null);
  };

  useEffect(() => {
    if (currentQuestion) {
      resetAnswers();
    }
  }, [currentQuestionIndex, selectedCategory]);

  const isAnswerProvided = useCallback((): boolean => {
    if (!currentQuestion) return false;
    
    switch (currentQuestion.type) {
      case 'trueFalse':
        return answers.trueFalse !== null;
      case 'multipleChoice':
        return answers.multipleChoice !== null;
      case 'matching':
        return answers.matching.length > 0 && answers.matching.every(a => a !== -1);
      case 'fillBlank':
        return answers.fillBlank.trim().length > 0;
      case 'shortQuestion':
        return answers.shortQuestion.trim().length > 0;
      default:
        return false;
    }
  }, [currentQuestion, answers]);

  const checkAnswer = (): boolean => {
    if (!currentQuestion) return false;

    switch (currentQuestion.type) {
      case 'trueFalse':
        return answers.trueFalse === currentQuestion.answer;
      case 'multipleChoice':
        return answers.multipleChoice === currentQuestion.answer;
      case 'matching':
        return JSON.stringify(answers.matching) === JSON.stringify(currentQuestion.answers);
      case 'fillBlank':
        return currentQuestion.acceptableAnswers.some(
          ans => answers.fillBlank.trim().toLowerCase() === ans.toLowerCase()
        );
      case 'shortQuestion':
        const userAnswer = answers.shortQuestion.toLowerCase();
        return currentQuestion.keywords.some(keyword => 
          userAnswer.includes(keyword.toLowerCase())
        );
      default:
        return false;
    }
  };

  const handleCheckAnswer = () => {
    const correct = checkAnswer();
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    if (category && currentQuestionIndex < category.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(60);
    } else {
      setQuizCompleted(true);
      if (category) {
        onScoreUpdate(category.id, score + (isCorrect ? 0 : 0), category.questions.length, totalTime);
      }
    }
  };

  const handleStartCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(60);
    setTotalTime(0);
    setQuizCompleted(false);
    setShowResult(false);
    resetAnswers();
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setQuizCompleted(false);
  };

  const handleMatchingClick = (index: number, isLeft: boolean) => {
    if (isLeft) {
      setMatchingSelection(index);
    } else if (matchingSelection !== null) {
      const newMatching = [...answers.matching];
      newMatching[matchingSelection] = index;
      setAnswers(prev => ({ ...prev, matching: newMatching }));
      setMatchingSelection(null);
    }
  };

  // Category Selection View
  if (!selectedCategory) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">ဉာဏ်စမ်းပဟေဠိ</h2>
          <p className="text-gray-600">အမျိုးအစားတစ်ခုကို ရွေးချယ်ပါ</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => handleStartCategory(cat.id)}
              className={`bg-gradient-to-br ${cat.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fadeIn`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
              <p className="text-sm opacity-90">{cat.description}</p>
              <div className="mt-4 bg-white/20 rounded-full px-4 py-1 inline-block">
                <span className="text-sm">မေးခွန်း {cat.questions.length} ခု</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Quiz Completed View
  if (quizCompleted && category) {
    const rank = getRankTitle(score, category.questions.length);
    const percentage = Math.round((score / category.questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 text-center animate-fadeIn">
          <div className="text-6xl mb-4 animate-pulse-slow">{rank.emoji}</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            ပဟေဠိပြီးဆုံးပါပြီ!
          </h2>
          <p className="text-gray-600 mb-6">{playerName}၊ သင်သည် {rank.title} ဖြစ်ပါသည်!</p>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold text-blue-600">{score}/{category.questions.length}</p>
                <p className="text-sm text-gray-500">မှန်ကန်မှု</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{percentage}%</p>
                <p className="text-sm text-gray-500">ရာခိုင်နှုန်း</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</p>
                <p className="text-sm text-gray-500">အချိန်</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-800">
              {percentage >= 80 
                ? '🎉 အလွန်ကောင်းမွန်ပါသည်! ကျန်းမာရေးဗဟုသုတ ကြွယ်ဝပါသည်။'
                : percentage >= 60
                ? '👍 ကောင်းပါသည်! ထပ်မံလေ့လာပါ။'
                : '💪 ကြိုးစားပါ! လေ့လာမှုက သင့်ကို ပိုကောင်းစေပါမည်။'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleStartCategory(category.id)}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              ထပ်စမ်းကြည့်မည်
            </button>
            <button
              onClick={handleBackToCategories}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              အမျိုးအစားများသို့
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question View
  if (!currentQuestion || !category) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 flex items-center justify-between">
        <button
          onClick={handleBackToCategories}
          className="text-gray-500 hover:text-gray-700 p-2"
        >
          ← ပြန်သွားမည်
        </button>
        <div className="flex items-center space-x-2">
          <span className={`text-2xl ${category.icon}`}>{category.icon}</span>
          <span className="font-bold text-gray-700">{category.name}</span>
        </div>
        <div className={`px-4 py-2 rounded-full font-bold ${
          timeLeft <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'
        }`}>
          ⏱️ {timeLeft}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500`}
          style={{ width: `${((currentQuestionIndex + 1) / category.questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-gray-100 px-4 py-1 rounded-full text-sm text-gray-600">
            မေးခွန်း {currentQuestionIndex + 1}/{category.questions.length}
          </span>
          <span className="bg-blue-100 px-4 py-1 rounded-full text-sm text-blue-600">
            အမှတ်: {score}
          </span>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">
          {currentQuestion.question}
        </h3>

        {/* True/False Question */}
        {currentQuestion.type === 'trueFalse' && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => !showResult && setAnswers(prev => ({ ...prev, trueFalse: true }))}
              disabled={showResult}
              className={`p-4 rounded-xl border-2 font-bold transition-all ${
                showResult
                  ? currentQuestion.answer === true
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : answers.trueFalse === true
                    ? 'bg-red-100 border-red-500 text-red-700'
                    : 'bg-gray-50 border-gray-200'
                  : answers.trueFalse === true
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-300'
              }`}
            >
              ✓ မှန်သည်
            </button>
            <button
              onClick={() => !showResult && setAnswers(prev => ({ ...prev, trueFalse: false }))}
              disabled={showResult}
              className={`p-4 rounded-xl border-2 font-bold transition-all ${
                showResult
                  ? currentQuestion.answer === false
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : answers.trueFalse === false
                    ? 'bg-red-100 border-red-500 text-red-700'
                    : 'bg-gray-50 border-gray-200'
                  : answers.trueFalse === false
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-300'
              }`}
            >
              ✗ မှားသည်
            </button>
          </div>
        )}

        {/* Multiple Choice Question */}
        {currentQuestion.type === 'multipleChoice' && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && setAnswers(prev => ({ ...prev, multipleChoice: index }))}
                disabled={showResult}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  showResult
                    ? currentQuestion.answer === index
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : answers.multipleChoice === index
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-200'
                    : answers.multipleChoice === index
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                }`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Matching Question */}
        {currentQuestion.type === 'matching' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              {currentQuestion.leftItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleMatchingClick(index, true)}
                  disabled={showResult}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    showResult
                      ? 'bg-gray-50 border-gray-200'
                      : matchingSelection === index
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {index + 1}. {item}
                  {answers.matching[index] !== undefined && answers.matching[index] !== -1 && (
                    <span className="ml-2 text-blue-600">→ {String.fromCharCode(65 + answers.matching[index])}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {currentQuestion.rightItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleMatchingClick(index, false)}
                  disabled={showResult || matchingSelection === null}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    showResult
                      ? 'bg-gray-50 border-gray-200'
                      : matchingSelection !== null
                      ? 'bg-gray-50 border-gray-200 hover:border-blue-300 cursor-pointer'
                      : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                  }`}
                >
                  {String.fromCharCode(65 + index)}. {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fill in the Blank Question */}
        {currentQuestion.type === 'fillBlank' && (
          <div>
            <input
              type="text"
              value={answers.fillBlank}
              onChange={(e) => !showResult && setAnswers(prev => ({ ...prev, fillBlank: e.target.value }))}
              disabled={showResult}
              placeholder="အဖြေကို ရိုက်ထည့်ပါ..."
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                showResult
                  ? isCorrect
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-100 border-red-500'
                  : 'border-gray-200 focus:border-blue-500 focus:outline-none'
              }`}
            />
            {showResult && !isCorrect && (
              <p className="mt-2 text-green-600">
                မှန်ကန်သော အဖြေ: {currentQuestion.answer}
              </p>
            )}
          </div>
        )}

        {/* Short Question */}
        {currentQuestion.type === 'shortQuestion' && (
          <div>
            <textarea
              value={answers.shortQuestion}
              onChange={(e) => !showResult && setAnswers(prev => ({ ...prev, shortQuestion: e.target.value }))}
              disabled={showResult}
              placeholder="အဖြေကို ရိုက်ထည့်ပါ..."
              rows={3}
              className={`w-full p-4 rounded-xl border-2 transition-all resize-none ${
                showResult
                  ? isCorrect
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-100 border-red-500'
                  : 'border-gray-200 focus:border-blue-500 focus:outline-none'
              }`}
            />
            {showResult && (
              <p className="mt-2 text-green-600">
                မှန်ကန်သော အဖြေ: {currentQuestion.answer}
              </p>
            )}
          </div>
        )}

        {/* Result Feedback */}
        {showResult && (
          <div className={`mt-6 p-4 rounded-xl animate-fadeIn ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{isCorrect ? '🎉' : '📚'}</span>
              <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'မှန်ကန်ပါသည်!' : 'မှားယွင်းပါသည်'}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6">
          {!showResult ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!isAnswerProvided()}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                isAnswerProvided()
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              အဖြေတိုက်စစ်မည်
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              {currentQuestionIndex < category.questions.length - 1 ? 'နောက်မေးခွန်း →' : 'ရလဒ်ကြည့်မည်'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
