import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Navbar } from './components/Navbar';
import { QuizSection } from './components/QuizSection';
import { LeaderboardSection, ScoreRecord } from './components/LeaderboardSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { categories } from './data/questions';

export function App() {
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('quiz');
  const [scores, setScores] = useState<ScoreRecord[]>([]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('healthQuiz_playerName');
    const savedScores = localStorage.getItem('healthQuiz_scores');
    
    if (savedName) {
      setPlayerName(savedName);
    }
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  // Save scores to localStorage
  useEffect(() => {
    if (scores.length > 0) {
      localStorage.setItem('healthQuiz_scores', JSON.stringify(scores));
    }
  }, [scores]);

  const handleStart = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('healthQuiz_playerName', name);
  };

  const handleScoreUpdate = (categoryId: string, score: number, total: number, time: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category || !playerName) return;

    const newRecord: ScoreRecord = {
      playerName,
      categoryId,
      categoryName: category.name,
      score,
      total,
      time,
      date: new Date().toISOString(),
    };

    setScores(prev => [...prev, newRecord]);
  };

  // Welcome screen for new users
  if (!playerName) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        playerName={playerName}
      />

      <main className="pb-8">
        {activeSection === 'quiz' && (
          <QuizSection
            playerName={playerName}
            onScoreUpdate={handleScoreUpdate}
          />
        )}
        {activeSection === 'leaderboard' && (
          <LeaderboardSection scores={scores} />
        )}
        {activeSection === 'about' && (
          <AboutSection />
        )}
        {activeSection === 'contact' && (
          <ContactSection />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {[
            { id: 'quiz', icon: '🎯', label: 'ပဟေဠိ' },
            { id: 'leaderboard', icon: '🏆', label: 'အဆင့်' },
            { id: 'about', icon: '📖', label: 'အကြောင်း' },
            { id: 'contact', icon: '📞', label: 'ဆက်သွယ်' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                activeSection === item.id
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-16"></div>
    </div>
  );
}
