import { useMemo } from 'react';

const HEART_EMOJIS = ['❤️', '💖', '💕', '💗', '💝', '🩷', '❣️'];
const PETAL_EMOJIS = ['🌸', '🌺', '🌷', '🪷', '💮'];

interface Decoration {
  id: number;
  type: 'heart' | 'petal' | 'sparkle';
  left: number;
  delay: number;
  duration: number;
  emoji: string;
  size: number;
  drift: number;
}

function buildDecorations(): Decoration[] {
  const items: Decoration[] = [];
  // Hearts
  for (let i = 0; i < 18; i++) {
    items.push({
      id: i,
      type: 'heart',
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 7 + Math.random() * 6,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      size: 16 + Math.random() * 28,
      drift: 0,
    });
  }
  // Petals
  for (let i = 0; i < 14; i++) {
    items.push({
      id: 100 + i,
      type: 'petal',
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 9 + Math.random() * 7,
      emoji: PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)],
      size: 14 + Math.random() * 20,
      drift: (Math.random() - 0.5) * 200,
    });
  }
  // Sparkles
  for (let i = 0; i < 16; i++) {
    items.push({
      id: 200 + i,
      type: 'sparkle',
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
      emoji: '✨',
      size: 10 + Math.random() * 14,
      drift: 0,
    });
  }
  return items;
}

export default function FloatingDecorations() {
  const decorations = useMemo(buildDecorations, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {decorations.map((d) => (
        <span
          key={d.id}
          className="absolute bottom-0 select-none"
          style={{
            left: `${d.left}%`,
            fontSize: `${d.size}px`,
            ['--drift' as string]: `${d.drift}px`,
            animation: `${
              d.type === 'petal' ? 'petalFall' : d.type === 'sparkle' ? 'sparklePulse' : 'floatUp'
            } ${d.duration}s ${d.type === 'sparkle' ? 'ease-in-out' : 'linear'} ${
              d.delay
            }s infinite`,
            ...(d.type === 'sparkle' && { top: `${Math.random() * 100}%`, bottom: 'auto' }),
          }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}
