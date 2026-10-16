import { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import Confetti from './Confetti';

interface Props {
  onContinue: () => void;
}

export default function CelebrationScreen({ onContinue }: Props) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Confetti />

      <div className="animate-pop-in glass-card rounded-[2rem] px-8 py-12 sm:px-20 sm:py-16">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Sparkles size={36} className="text-[#ff7aac]" />
          <Heart size={56} fill="#ff4f94" color="#ff4f94" className="animate-heartbeat" />
          <Sparkles size={36} className="text-[#ff7aac]" />
        </div>

        <h1 className="font-script text-4xl leading-tight text-[#e83a7e] sm:text-7xl">
          YAAAAAY! ❤️
        </h1>
        <p className="mt-4 text-xl font-semibold text-[#c92a65] sm:text-3xl">
          I knew you would say yes! 🥰
        </p>
        <p className="mt-3 text-base text-[#e83a7e]/80 sm:text-lg">
          Now let's plan our perfect date...
        </p>
      </div>

      {showButton && (
        <button
          onClick={onContinue}
          className="animate-pop-in yes-grow mt-10 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff4f94] to-[#e83a7e] px-10 py-4 text-lg font-bold text-white shadow-lg hover:shadow-2xl"
          style={{ boxShadow: '0 6px 24px rgba(232, 58, 126, 0.4)' }}
        >
          <Heart size={22} fill="white" color="white" />
          Let's plan it! 📅
        </button>
      )}
    </div>
  );
}
