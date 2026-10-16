import { useEffect, useMemo } from 'react';

const CONFETTI_COLORS = [
  '#ff4f94',
  '#ff7aac',
  '#ffa6c4',
  '#ffc9db',
  '#ffe4ec',
  '#f43f5e',
  '#e83a7e',
  '#fbbf24',
  '#fde047',
  '#ffffff',
];
const CONFETTI_SHAPES = ['❤️', '💖', '💕', '✨', '🎉', '🌸', '🌹', '💝'];

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  isEmoji: boolean;
  emoji: string;
  size: number;
}

function buildPieces(): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];
  for (let i = 0; i < 60; i++) {
    const isEmoji = Math.random() > 0.5;
    pieces.push({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2.5 + Math.random() * 2.5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      isEmoji,
      emoji: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
      size: isEmoji ? 16 + Math.random() * 20 : 8 + Math.random() * 10,
    });
  }
  return pieces;
}

export default function Confetti() {
  const pieces = useMemo(buildPieces, []);

  // Clean up after animation
  useEffect(() => {
    const timers: number[] = [];
    pieces.forEach((p) => {
      timers.push(
        window.setTimeout(() => {}, (p.delay + p.duration) * 1000),
      );
    });
    return () => timers.forEach((t) => clearTimeout(t));
  }, [pieces]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ...(p.isEmoji
              ? {
                  fontSize: `${p.size}px`,
                }
              : {
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }),
          }}
        >
          {p.isEmoji ? p.emoji : ''}
        </span>
      ))}
    </div>
  );
}
