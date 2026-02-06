import { useState } from 'react';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('အမည်ကို အနည်းဆုံး ၂ လုံး ထည့်ပါ');
      return;
    }
    onStart(name.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#003366] to-[#004080] flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 animate-fadeIn">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-slow">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-center text-white mb-2">
            ICT Department (PEDC)
          </h1>
          
          <h2 className="text-lg md:text-xl text-center text-cyan-300 mb-6">
            ကျန်းမာရေးဆိုင်ရာ လွဲမှားမှုများနှင့် ဗဟုသုတ
          </h2>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <p className="text-gray-300 text-center text-sm md:text-base">
              မြန်မာလူမျိုးများကြားတွင် လွဲမှားနေသော ကျန်းမာရေးဆိုင်ရာ ယူဆချက်များကို 
              ပဟေဠိမေးခွန်းများဖြင့် စမ်းသပ်၍ မှန်ကန်သော ဗဟုသုတများ ရယူလိုက်ပါ။
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-cyan-300 mb-2 text-sm">
                သင့်အမည်ကို ထည့်သွင်းပါ
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="ဥပမာ - မောင်မောင်"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
              />
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] transition-all duration-300"
            >
              စတင်မည် 🚀
            </button>
          </form>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="text-2xl mb-1">📚</div>
              <p className="text-xs text-gray-300">၆ အမျိုးအစား</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">❓</div>
              <p className="text-xs text-gray-300">၆၀ မေးခွန်း</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🏆</div>
              <p className="text-xs text-gray-300">အဆင့်ဇယား</p>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          © 2026 ICT Department (PEDC) - ပုသိမ်ပညာရေးဒီဂရီကောလိပ်
        </p>
      </div>
    </div>
  );
}
