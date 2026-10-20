import { useState, useEffect } from 'react';
import type { HoldingHand, AppLayout, ThemeMode, TrialRecord } from './types';
import { Navbar } from './components/Navbar';
import { PaymentScreen } from './components/PaymentScreen';
import { ObserverTestMode } from './components/ObserverTestMode';
import { DesignThinkingContext } from './components/DesignThinkingContext';
import { HandOnboardingModal } from './components/HandOnboardingModal';
import { PhoneSimulatorWrapper } from './components/PhoneSimulatorWrapper';

const STORAGE_HAND_KEY = 'left_by_design_holding_hand';
const STORAGE_TRIALS_KEY = 'left_by_design_trials';

export function App() {
  const [activeTab, setActiveTab] = useState<'payment' | 'observer' | 'case-study'>('payment');

  // Holding hand (Left or Right) - remembered for session in localStorage
  const [holdingHand, setHoldingHand] = useState<HoldingHand>(() => {
    const saved = localStorage.getItem(STORAGE_HAND_KEY);
    return saved === 'right' || saved === 'left' ? saved : 'left';
  });

  // First screen modal opens if user has never selected a hand
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem(STORAGE_HAND_KEY);
  });

  // Layout mode: 'usual' or 'left-thumb'
  const [layout, setLayout] = useState<AppLayout>('left-thumb');

  // Theme mode: 'sunlight' (outdoor warm light) or 'night' (dark)
  const [themeMode, setThemeMode] = useState<ThemeMode>('sunlight');

  // Reach heatmap overlay toggle
  const [showReachOverlay, setShowReachOverlay] = useState<boolean>(false);

  // Observer recorded trials
  const [trials, setTrials] = useState<TrialRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TRIALS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Toast notification for trial logs
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TRIALS_KEY, JSON.stringify(trials));
    } catch {
      // ignore storage quota
    }
  }, [trials]);

  const handleSelectHand = (hand: HoldingHand) => {
    setHoldingHand(hand);
    localStorage.setItem(STORAGE_HAND_KEY, hand);
  };

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'sunlight' ? 'night' : 'sunlight'));
  };

  const handleAddTrial = (trialData: Omit<TrialRecord, 'id' | 'timestamp' | 'completedAt'>) => {
    const newRecord: TrialRecord = {
      ...trialData,
      id: 'trial-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      completedAt: new Date().toISOString(),
    };
    setTrials((prev) => [newRecord, ...prev]);

    setToastMessage(`Trial recorded: ${trialData.layout === 'left-thumb' ? 'Left-Thumb' : 'Usual'} in ${trialData.timeTakenSeconds}s`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTrialCompleteFromPayment = (data: {
    timeTakenSeconds: number;
    wrongTaps: number;
    switchedHands: boolean;
    layout: AppLayout;
    holdingHand: HoldingHand;
  }) => {
    handleAddTrial({
      layout: data.layout,
      holdingHand: data.holdingHand,
      timeTakenSeconds: data.timeTakenSeconds,
      wrongTaps: data.wrongTaps,
      switchedHands: data.switchedHands,
      confidenceRating: data.layout === 'left-thumb' ? 5 : 2,
      notes:
        data.layout === 'left-thumb'
          ? 'Completed single-handed with left thumb; amount clearly visible'
          : 'Had to stretch across screen to hit bottom-right Pay button',
    });
  };

  const handleDeleteTrial = (id: string) => {
    setTrials((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearTrials = () => {
    if (window.confirm('Clear all recorded usability trial data?')) {
      setTrials([]);
      localStorage.removeItem(STORAGE_TRIALS_KEY);
    }
  };

  const handleLoadSampleData = () => {
    const sampleData: TrialRecord[] = [
      {
        id: 'sample-1',
        timestamp: '10:14:02 AM',
        completedAt: new Date(Date.now() - 3600000).toISOString(),
        layout: 'usual',
        holdingHand: 'left',
        timeTakenSeconds: 8.4,
        wrongTaps: 3,
        switchedHands: true,
        confidenceRating: 2,
        notes: 'Strained thumb reaching bottom-right Pay; had to bring in produce hand',
      },
      {
        id: 'sample-2',
        timestamp: '10:18:22 AM',
        completedAt: new Date(Date.now() - 3000000).toISOString(),
        layout: 'usual',
        holdingHand: 'left',
        timeTakenSeconds: 7.2,
        wrongTaps: 2,
        switchedHands: true,
        confidenceRating: 2,
        notes: 'Palm covered amount while typing; double checked with customer',
      },
      {
        id: 'sample-3',
        timestamp: '10:22:45 AM',
        completedAt: new Date(Date.now() - 2400000).toISOString(),
        layout: 'usual',
        holdingHand: 'left',
        timeTakenSeconds: 6.9,
        wrongTaps: 1,
        switchedHands: true,
        confidenceRating: 3,
        notes: 'Rested phone against vegetable crate to tap Pay button',
      },
      {
        id: 'sample-4',
        timestamp: '10:27:10 AM',
        completedAt: new Date(Date.now() - 1800000).toISOString(),
        layout: 'left-thumb',
        holdingHand: 'left',
        timeTakenSeconds: 2.8,
        wrongTaps: 0,
        switchedHands: false,
        confidenceRating: 5,
        notes: 'Thumb rested naturally on left Pay bar; completed without looking down',
      },
      {
        id: 'sample-5',
        timestamp: '10:31:05 AM',
        completedAt: new Date(Date.now() - 1200000).toISOString(),
        layout: 'left-thumb',
        holdingHand: 'left',
        timeTakenSeconds: 3.1,
        wrongTaps: 0,
        switchedHands: false,
        confidenceRating: 5,
        notes: 'Right hand stayed completely free to weigh coriander',
      },
      {
        id: 'sample-6',
        timestamp: '10:35:40 AM',
        completedAt: new Date(Date.now() - 600000).toISOString(),
        layout: 'left-thumb',
        holdingHand: 'left',
        timeTakenSeconds: 2.6,
        wrongTaps: 0,
        switchedHands: false,
        confidenceRating: 5,
        notes: 'Instant confidence; remarked that undo button made her feel safe',
      },
    ];

    setTrials(sampleData);
    setToastMessage('Loaded 6 realistic field trials with Roshni');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        themeMode === 'night'
          ? 'dark bg-stone-950 text-stone-100'
          : 'bg-[#FAF8F5] text-stone-900'
      }`}
    >
      {/* Onboarding First-Screen Modal */}
      <HandOnboardingModal
        isOpen={isOnboardingOpen}
        currentHand={holdingHand}
        onSelectHand={handleSelectHand}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        holdingHand={holdingHand}
        onOpenHandSelector={() => setIsOnboardingOpen(true)}
        layout={layout}
        onToggleLayout={setLayout}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        showReachOverlay={showReachOverlay}
        onToggleReachOverlay={() => setShowReachOverlay(!showReachOverlay)}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white dark:bg-emerald-800 px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 text-xs font-bold flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'payment' && (
          <PhoneSimulatorWrapper
            holdingHand={holdingHand}
            layout={layout}
            onToggleLayout={setLayout}
            showReachOverlay={showReachOverlay}
            onToggleReachOverlay={() => setShowReachOverlay(!showReachOverlay)}
            onOpenHandSelector={() => setIsOnboardingOpen(true)}
          >
            <PaymentScreen
              holdingHand={holdingHand}
              layout={layout}
              onToggleLayout={setLayout}
              onOpenHandSelector={() => setIsOnboardingOpen(true)}
              onTrialComplete={handleTrialCompleteFromPayment}
              showReachOverlay={showReachOverlay}
              onToggleReachOverlay={() => setShowReachOverlay(!showReachOverlay)}
            />
          </PhoneSimulatorWrapper>
        )}

        {activeTab === 'observer' && (
          <ObserverTestMode
            trials={trials}
            onAddTrial={handleAddTrial}
            onClearTrials={handleClearTrials}
            onLoadSampleData={handleLoadSampleData}
            onDeleteTrial={handleDeleteTrial}
            currentLayout={layout}
            currentHand={holdingHand}
          />
        )}

        {activeTab === 'case-study' && <DesignThinkingContext />}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 py-4 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Left by Design • College Design Thinking Usability Research</span>
          <span>Tested for Roshni (42, Vegetable Vendor) • Zero Real Money Used</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
