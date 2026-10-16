import { useEffect, useRef, useState, useCallback } from 'react';
import { Heart, X } from 'lucide-react';

const FUNNY_MESSAGES = [
  'Hehe, try again! 😜',
  'Not so fast! 💨',
  'Give love a chance! ❤️',
  'You sure about that? 🤭',
  'Catch me if you can! 🏃‍♀️',
  "I'm slippery like soap! 🧼",
  'Nope! Try the other button 😏',
  'Wrong button, silly! 🫠',
  'My heart says no to No! 💘',
  'Is that your final answer? 🤔',
  'The No button is shy today 🙈',
  "Love > No, it's math! 📐",
];

const BUTTON_W = 140;
const BUTTON_H = 60;
const PADDING = 24;

function randomPosition(): { x: number; y: number } {
  const maxX = window.innerWidth - BUTTON_W - PADDING;
  const maxY = window.innerHeight - BUTTON_H - PADDING;
  return {
    x: PADDING + Math.random() * Math.max(maxX - PADDING, 0),
    y: PADDING + Math.random() * Math.max(maxY - PADDING, 0),
  };
}

interface Props {
  onYes: () => void;
}

export default function QuestionScreen({ onYes }: Props) {
  const [noPos, setNoPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [funnyMessage, setFunnyMessage] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [shakeNo, setShakeNo] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const initialized = useRef(false);

  // Initialize No button in a reasonable position
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setNoPos({
        x: window.innerWidth / 2 + 100,
        y: window.innerHeight / 2,
      });
    }
  }, []);

  const dodge = useCallback(() => {
    setNoPos(randomPosition());
    setFunnyMessage(FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]);
    setAttemptCount((c) => c + 1);
    setShakeNo(true);
    setTimeout(() => setShakeNo(false), 400);
  }, []);

  // Grow the Yes button after each failed attempt
  useEffect(() => {
    setYesScale(1 + Math.min(attemptCount * 0.15, 1.8));
  }, [attemptCount]);

  const handleYes = useCallback(() => {
    setIsCelebrating(true);
    setTimeout(onYes, 200);
  }, [onYes]);

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      {/* Question card */}
      <div className="glass-card animate-pop-in rounded-[2rem] px-8 py-10 text-center sm:px-16 sm:py-14">
        <div className="mb-4 flex justify-center">
          <Heart
            className="animate-heartbeat"
            size={56}
            fill="#ff4f94"
            color="#ff4f94"
            strokeWidth={1}
          />
        </div>
        <h1 className="font-script text-4xl leading-tight text-[#e83a7e] sm:text-6xl">
          Will you go on a date with me?
        </h1>
        <p className="mt-3 text-2xl sm:text-3xl">🥹 ❤️</p>
      </div>

      {/* Yes button */}
      <button
        onClick={handleYes}
        className="yes-grow mt-10 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff4f94] to-[#e83a7e] px-8 py-4 text-lg font-bold text-white shadow-lg hover:shadow-2xl"
        style={{
          transform: `scale(${yesScale})`,
          boxShadow: '0 6px 24px rgba(232, 58, 126, 0.4)',
        }}
      >
        <Heart size={22} fill="white" color="white" />
        Yes! ❤️
      </button>

      {/* Funny message */}
      <div className="mt-4 h-8 text-center">
        {funnyMessage && (
          <p className="animate-pop-in text-base font-semibold text-[#c92a65] sm:text-lg">
            {funnyMessage}
          </p>
        )}
      </div>

      {/* No button — positioned absolutely, dodges cursor */}
      <button
        onClick={dodge}
        onMouseEnter={dodge}
        onMouseMove={dodge}
        onTouchStart={dodge}
        onTouchMove={dodge}
        className={`dodge-transition fixed flex items-center gap-2 rounded-full border-2 border-[#ff7aac] bg-white px-6 py-3 text-base font-semibold text-[#c92a65] shadow-md hover:bg-[#fff5f7] ${
          shakeNo ? 'animate-shake' : ''
        }`}
        style={{
          left: `${noPos.x}px`,
          top: `${noPos.y}px`,
          width: `${BUTTON_W}px`,
          height: `${BUTTON_H}px`,
          opacity: isCelebrating ? 0 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        <X size={18} color="#c92a65" />
        No 💔
      </button>

      {/* Attempt counter */}
      {attemptCount > 0 && (
        <p className="mt-6 text-sm text-[#c92a65]/70">
          The No button has dodged you {attemptCount} time{attemptCount > 1 ? 's' : ''} 😅
        </p>
      )}
    </div>
  );
}
