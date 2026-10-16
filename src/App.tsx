import { useState } from 'react';
import FloatingDecorations from '@/components/FloatingDecorations';
import QuestionScreen from '@/components/QuestionScreen';
import CelebrationScreen from '@/components/CelebrationScreen';
import DatePlanningScreen from '@/components/DatePlanningScreen';

type Screen = 'question' | 'celebration' | 'planning';

function App() {
  const [screen, setScreen] = useState<Screen>('question');

  return (
    <div className="romantic-bg min-h-screen w-full overflow-x-hidden">
      <FloatingDecorations />

      {screen === 'question' && (
        <QuestionScreen onYes={() => setScreen('celebration')} />
      )}

      {screen === 'celebration' && (
        <CelebrationScreen onContinue={() => setScreen('planning')} />
      )}

      {screen === 'planning' && <DatePlanningScreen />}
    </div>
  );
}

export default App;
