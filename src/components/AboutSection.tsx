import { useState, useEffect } from 'react';

export function AboutSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  
  // Google Drive File ID
  const fileId = '1Hv2wZYqEhT3blR65pHAA9iwFt7N6s_ns';
  
  // Multiple Google Drive image URL formats for fallback - thumbnail works best
  const imageUrls = [
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
    `https://lh3.googleusercontent.com/d/${fileId}=w400`,
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://drive.google.com/uc?id=${fileId}`,
  ];

  const handleImageError = () => {
    console.log(`Image URL ${currentUrlIndex} failed, trying next...`);
    if (currentUrlIndex < imageUrls.length - 1) {
      setCurrentUrlIndex(prev => prev + 1);
      setImageLoaded(false);
    } else {
      setImageError(true);
    }
  };

  // Reset loaded state when URL changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentUrlIndex]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">📖 အကြောင်း</h2>
        <p className="text-gray-600">Website နှင့် ဖန်တီးသူအကြောင်း</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-[#001f3f] via-[#002855] to-[#003366] rounded-3xl shadow-2xl p-6 md:p-8 mb-8 text-white animate-fadeIn relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -ml-24 -mb-24"></div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Profile Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border-4 border-cyan-400 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
              {!imageError ? (
                <img
                  src={imageUrls[currentUrlIndex]}
                  alt="မောင်နေမင်းသူ"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">နမသ</span>
                </div>
              )}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/50 to-blue-600/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full p-2.5 shadow-lg border-2 border-white animate-glow">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">မောင်နေမင်းသူ</h3>
            <p className="text-cyan-300 mb-4 flex items-center justify-center md:justify-start gap-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              ဆရာအတတ်သင် သင်တန်းသား
            </p>
            
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex items-center justify-center md:justify-start gap-3 bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20 transition-colors cursor-default">
                <span className="text-cyan-400 text-lg">🎓</span>
                <span>စတုတ္ထနှစ်-ဒုတိယနှစ်ဝက်သင်တန်းသား</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20 transition-colors cursor-default">
                <span className="text-cyan-400 text-lg">🏫</span>
                <span>ပုသိမ်ပညာရေးဒီဂရီကောလိပ်</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20 transition-colors cursor-default">
                <span className="text-cyan-400 text-lg">📋</span>
                <span>တန်းခွဲ - ၃ | ခုံအမှတ် - ၁၄၃</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20 transition-colors cursor-default">
                <span className="text-cyan-400 text-lg">📍</span>
                <span>ငါးသိုင်းချောင်းမြို့၊ ရေကြည်မြို့နယ်၊ ဧရာဝတီတိုင်းဒေသကြီး</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Website */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">ရည်ရွယ်ချက်</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            မြန်မာလူမျိုးများကြားတွင် ကျန်းမာရေးဆိုင်ရာ မှားယွင်းသော ယူဆချက်များကို ပြုပြင်ပြောင်းလဲစေရန်နှင့် 
            မှန်ကန်သော ကျန်းမာရေးဗဟုသုတများ ပျံ့နှံ့စေရန် ရည်ရွယ်၍ ဤ Website ကို ဖန်တီးထားပါသည်။
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">လုပ်ဖြစ်ရခြင်း</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            ICT ဆရာဦးဖြိုးမောင်၏ Project လုပ်ငန်းပေးအရ Website ပုံစံ ဖန်တီးခြင်းသည် သင့်လျော်သည်ဟု စိတ်ကူးမိကာ ဤ Website ကို ဖန်တီးဖြစ်ခဲ့သည်။ ထို့အပြင် မြန်မာလူမျိုးများကြားတွင် ကျန်းမာရေးဆိုင်ရာ မှားယွင်းသော ယူဆချက်များကို ပြုပြင်ပြောင်းလဲစေရန်နှင့် မှန်ကန်သော ကျန်းမာရေးဗဟုသုတများ ပျံ့နှံ့စေရန် ရည်ရွယ်၍ ဤ Website ကို ဖန်တီးဖြစ်ခဲ့ပါသည်။          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">အကျုံးဝင်သော အကြောင်းအရာများ</h3>
          </div>
          <ul className="text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-orange-500">🍲</span> အစားအသောက်ဆိုင်ရာ မှားယွင်းယူဆချက်များ
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-500">💊</span> ဆေးဝါးသုံးစွဲမှုဆိုင်ရာ မှားယွင်းယူဆချက်များ
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">🌿</span> ရိုးရာကုထုံးဆိုင်ရာ မှားယွင်းယူဆချက်များ
            </li>
            <li className="flex items-center gap-2">
              <span className="text-pink-500">🤰</span> ကိုယ်ဝန်ဆောင်ဆိုင်ရာ မှားယွင်းယူဆချက်များ
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-500">✨</span> အရေပြားဆိုင်ရာ မှားယွင်းယူဆချက်များ
            </li>
            <li className="flex items-center gap-2">
              <span className="text-teal-500">🧠</span> စိတ်ကျန်းမာရေးဆိုင်ရာ မှားယွင်းယူဆချက်များ
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">နည်းပညာများ</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Netlify'].map((tech) => (
              <span
                key={tech}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="text-gray-600 mt-4">
            ခေတ်မီ Web နည်းပညာများကို အသုံးပြု၍ တည်ဆောက်ထားပြီး Mobile, Tablet, PC 
            အားလုံးတွင် အသုံးပြုနိုင်ပါသည်။
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="font-bold text-yellow-800 mb-2">အရေးကြီးသော မှတ်ချက်</h4>
            <p className="text-yellow-700 text-sm">
              ဤ Website သည် ကျန်းမာရေးပညာပေးရန် ရည်ရွယ်ထားပြီး ဆေးပညာဆိုင်ရာ အကြံဉာဏ် 
              မဟုတ်ပါ။ ကျန်းမာရေးပြဿနာများအတွက် ဆရာဝန်နှင့် တိုင်ပင်ပါ။
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
