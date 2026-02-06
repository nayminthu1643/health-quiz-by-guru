import { getRankTitle } from '../data/questions';

export interface ScoreRecord {
  playerName: string;
  categoryId: string;
  categoryName: string;
  score: number;
  total: number;
  time: number;
  date: string;
}

interface LeaderboardSectionProps {
  scores: ScoreRecord[];
}

export function LeaderboardSection({ scores }: LeaderboardSectionProps) {
  // Sort by percentage, then by time
  const sortedScores = [...scores].sort((a, b) => {
    const percentageA = (a.score / a.total) * 100;
    const percentageB = (b.score / b.total) * 100;
    if (percentageB !== percentageA) return percentageB - percentageA;
    return a.time - b.time;
  });

  const topScores = sortedScores.slice(0, 20);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">🏆 အဆင့်ဇယား</h2>
        <p className="text-gray-600">ထိပ်တန်း ပဟေဠိဖြေဆိုသူများ</p>
      </div>

      {topScores.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">ရလဒ်များ မရှိသေးပါ</h3>
          <p className="text-gray-500">ပဟေဠိဖြေဆိုပြီးပါက ဤနေရာတွင် သင့်အမည် ပေါ်လာပါမည်။</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#001f3f] to-[#003366] text-white p-4">
            <div className="grid grid-cols-12 gap-2 text-sm font-bold">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">အမည်</div>
              <div className="col-span-3">အမျိုးအစား</div>
              <div className="col-span-2 text-center">အမှတ်</div>
              <div className="col-span-2 text-center">ရာခိုင်နှုန်း</div>
              <div className="col-span-1 text-center">⏱️</div>
            </div>
          </div>

          {/* Scores */}
          <div className="divide-y divide-gray-100">
            {topScores.map((record, index) => {
              const percentage = Math.round((record.score / record.total) * 100);
              const rank = getRankTitle(record.score, record.total);
              
              return (
                <div
                  key={index}
                  className={`grid grid-cols-12 gap-2 p-4 items-center hover:bg-gray-50 transition-colors animate-slideIn ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-white' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="col-span-1 text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (
                      <span className="text-gray-500 font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800">{record.playerName}</span>
                      <span className="text-sm">{rank.emoji}</span>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {record.categoryName}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-bold text-blue-600">{record.score}/{record.total}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full ${
                          percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 text-center text-sm text-gray-500">
                    {Math.floor(record.time / 60)}:{(record.time % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rank Levels */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">အဆင့်သတ်မှတ်ချက်များ</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { emoji: '🏆', title: 'ကျန်းမာရေးပညာရှင်', range: '90% အထက်', color: 'from-yellow-400 to-yellow-500' },
            { emoji: '🥇', title: 'ကျန်းမာရေးချန်ပီယံ', range: '80-89%', color: 'from-yellow-300 to-yellow-400' },
            { emoji: '🥈', title: 'ကျန်းမာရေးသံတမန်', range: '70-79%', color: 'from-gray-300 to-gray-400' },
            { emoji: '🥉', title: 'ကျန်းမာရေးစူးစမ်းသူ', range: '60-69%', color: 'from-amber-500 to-amber-600' },
            { emoji: '📚', title: 'ကျန်းမာရေးလေ့လာသူ', range: '50-59%', color: 'from-blue-400 to-blue-500' },
            { emoji: '🌱', title: 'ကျန်းမာရေးစတင်သူ', range: '50% အောက်', color: 'from-green-400 to-green-500' },
          ].map((level, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${level.color} p-4 rounded-xl text-white text-center`}
            >
              <div className="text-2xl mb-1">{level.emoji}</div>
              <div className="font-bold text-sm">{level.title}</div>
              <div className="text-xs opacity-90">{level.range}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
