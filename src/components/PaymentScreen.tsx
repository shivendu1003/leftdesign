import React, { useState, useEffect, useRef } from 'react';
import type { HoldingHand, AppLayout, PaymentStep } from '../types';
import {
  playAudioFeedback,
  triggerVibration,
  speakAmount,
  speakCalmMessage,
} from '../utils/sound';
import {
  ShieldCheck,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Delete,
  Eye,
  EyeOff,
  ArrowRight,
  Hand,
  Layers,
} from 'lucide-react';

interface Props {
  holdingHand: HoldingHand;
  layout: AppLayout;
  onToggleLayout: (layout: AppLayout) => void;
  onOpenHandSelector: () => void;
  onTrialComplete: (data: {
    timeTakenSeconds: number;
    wrongTaps: number;
    switchedHands: boolean;
    layout: AppLayout;
    holdingHand: HoldingHand;
  }) => void;
  showReachOverlay: boolean;
  onToggleReachOverlay: () => void;
}

const DEMO_PIN = '1234';

export const PaymentScreen: React.FC<Props> = ({
  holdingHand,
  layout,
  onToggleLayout,
  onOpenHandSelector,
  onTrialComplete,
  showReachOverlay,
  onToggleReachOverlay,
}) => {
  const [pin, setPin] = useState<string>('');
  const [step, setStep] = useState<PaymentStep>('enter-pin');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPinDigits, setShowPinDigits] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [switchedHandsForTrial, setSwitchedHandsForTrial] = useState<boolean>(false);

  // Metrics for observer trial
  const [wrongTaps, setWrongTaps] = useState<number>(0);
  const [trialStartTime, setTrialStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // Demo amount can be ₹180 (as specified in prompt)
  const [amount] = useState<string>('₹180');
  const [vendorName] = useState<string>('Vegetable Stall (Raju Farm Fresh)');

  const isLeftThumbMode = layout === 'left-thumb' && holdingHand === 'left';
  const isRightThumbMode = layout === 'left-thumb' && holdingHand === 'right';
  const isUsualLayout = layout === 'usual';

  // Stopwatch effect
  useEffect(() => {
    if (trialStartTime && step === 'enter-pin') {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(Number(((Date.now() - trialStartTime) / 1000).toFixed(1)));
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [trialStartTime, step]);

  const startTimerIfNeeded = () => {
    if (!trialStartTime) {
      setTrialStartTime(Date.now());
    }
  };

  const handleDigit = (digit: string) => {
    startTimerIfNeeded();
    if (pin.length >= 4) return;

    if (soundEnabled) playAudioFeedback('digit');
    triggerVibration(35);

    const nextPin = pin + digit;
    setPin(nextPin);
    setErrorMessage('');
  };

  const handleClear = () => {
    startTimerIfNeeded();
    if (pin.length === 0) return;

    if (soundEnabled) playAudioFeedback('clear');
    triggerVibration(55);

    setPin((prev) => prev.slice(0, -1));
    setWrongTaps((prev) => prev + 1); // Clearing indicates an amended tap
  };

  const handleMissedTap = () => {
    // Record accidental tap outside keys
    startTimerIfNeeded();
    if (soundEnabled) playAudioFeedback('miss');
    setWrongTaps((prev) => prev + 1);
  };

  const handleSpeakAmount = () => {
    setIsSpeaking(true);
    speakAmount(amount, 'Vegetable Stall');
    setTimeout(() => setIsSpeaking(false), 3500);
  };

  const handlePay = () => {
    startTimerIfNeeded();

    if (pin.length < 4) {
      if (soundEnabled) playAudioFeedback('error');
      triggerVibration([50, 50]);
      setErrorMessage('Please enter all 4 digits of your PIN before paying.');
      speakCalmMessage('Please enter all 4 digits of your PIN before paying.');
      return;
    }

    setStep('verifying');

    setTimeout(() => {
      if (pin === DEMO_PIN) {
        // Success!
        const totalDuration = trialStartTime
          ? Number(((Date.now() - trialStartTime) / 1000).toFixed(1))
          : elapsedSeconds;

        if (soundEnabled) playAudioFeedback('success');
        triggerVibration([40, 60, 40]);
        setStep('success');

        onTrialComplete({
          timeTakenSeconds: totalDuration,
          wrongTaps,
          switchedHands: switchedHandsForTrial,
          layout,
          holdingHand,
        });
      } else {
        // Calm, non-punitive error
        if (soundEnabled) playAudioFeedback('error');
        triggerVibration([80, 80]);
        setWrongTaps((prev) => prev + 1);
        setStep('error');
        const calmNote = 'That PIN did not match. Try again. Take your time, no money was deducted.';
        setErrorMessage(calmNote);
        speakCalmMessage(calmNote);
      }
    }, 450);
  };

  const handleResetForNewTrial = () => {
    setPin('');
    setStep('enter-pin');
    setErrorMessage('');
    setTrialStartTime(null);
    setElapsedSeconds(0);
    setWrongTaps(0);
    setSwitchedHandsForTrial(false);
  };

  const fillDemoPin = () => {
    setPin('1234');
    setErrorMessage('');
    if (soundEnabled) playAudioFeedback('digit');
  };

  return (
    <div
      onClick={(e) => {
        // Detect click on empty container space as potential missed tap
        const target = e.target as HTMLElement;
        if (target.getAttribute('data-tap-target') !== 'key' && !target.closest('button')) {
          handleMissedTap();
        }
      }}
      className={`relative w-full max-w-md mx-auto flex flex-col justify-between rounded-[2.5rem] border-4 border-stone-800 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 shadow-2xl overflow-hidden min-h-[720px] select-none transition-colors duration-200 ${
        showReachOverlay
          ? holdingHand === 'left'
            ? 'reach-arc-left-easy'
            : 'reach-arc-right-easy'
          : ''
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Visual Reachability Overlay Label if Active */}
      {showReachOverlay && (
        <div className="absolute top-2 left-2 right-2 z-30 pointer-events-none flex items-center justify-between px-3 py-1 bg-emerald-900/90 text-emerald-200 text-xs font-bold rounded-full shadow backdrop-blur">
          <span>
            🟢 Comfort thumb arc ({holdingHand === 'left' ? 'Left hand hold' : 'Right hand hold'})
          </span>
          <span>Red = High strain / Drop risk</span>
        </div>
      )}

      {/* TOP BAR: Permanent High-Contrast Amount & Recipient */}
      {/* Kept at the absolute top away from thumb reach so the hand never covers it! */}
      <header className="p-5 pb-3 bg-white dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-800 shadow-sm relative z-20">
        {/* Top Status & Safe Demo Badge */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>LefDesign • Demo (No real money)</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Reach Overlay Toggle Button on Phone */}
            <button
              type="button"
              onClick={onToggleReachOverlay}
              className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                showReachOverlay
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 text-emerald-900 dark:text-emerald-300'
                  : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title="Toggle reachability zone overlay"
              aria-label="Toggle reachability zone overlay"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 focus-visible:ring-2 focus-visible:ring-emerald-600"
              title={soundEnabled ? 'Mute tap sounds' : 'Enable tap sounds'}
              aria-label={soundEnabled ? 'Mute tap sounds' : 'Enable tap sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Hand Switcher Shortcut */}
            <button
              type="button"
              onClick={onOpenHandSelector}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 focus-visible:ring-2 focus-visible:ring-emerald-600"
              title="Change holding hand"
            >
              <Hand className={`w-3.5 h-3.5 ${holdingHand === 'left' ? '-scale-x-100' : ''}`} />
              <span className="capitalize">{holdingHand}</span>
            </button>
          </div>
        </div>

        {/* Pinned Amount Card: NEVER obscured by thumb */}
        <div className="mt-2 p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Paying recipient
            </p>
            <h1 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate max-w-[210px]">
              {vendorName}
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-stone-950 dark:text-white tracking-tight">
                {amount}
              </span>
              <span className="text-xs text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                Verified
              </span>
            </div>
          </div>

          {/* Spoken Readout Button */}
          <button
            type="button"
            onClick={handleSpeakAmount}
            className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer min-w-[72px] min-h-[64px] focus-visible:ring-2 focus-visible:ring-emerald-600 ${
              isSpeaking
                ? 'bg-emerald-700 text-white border-emerald-800 animate-pulse'
                : 'bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 text-stone-800 dark:text-stone-200 hover:border-emerald-600'
            }`}
            aria-label="Read amount aloud using speech"
          >
            <Volume2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <span className="text-[11px] font-bold leading-tight">Read aloud</span>
          </button>
        </div>

        {/* Visibility Guarantee Banner */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 px-1">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Amount stays at top away from hand
          </span>
          {trialStartTime && step === 'enter-pin' && (
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
              ⏱ {elapsedSeconds}s
            </span>
          )}
        </div>
      </header>

      {/* MIDDLE SECTION: PIN Indicators & Calm Messaging */}
      <div className="flex-1 flex flex-col justify-center px-6 py-4 space-y-4">
        {/* SUCCESS STATE */}
        {step === 'success' ? (
          <div className="text-center space-y-4 py-6 animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 border-4 border-emerald-600 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100">
                {amount} paid to Vegetable Stall
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Payment completed successfully with zero stress.
              </p>
            </div>

            <div className="rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Layout tested:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 uppercase">
                  {layout === 'left-thumb' ? 'Left-thumb reach' : 'Usual centered'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Holding hand:</span>
                <span className="font-bold capitalize">{holdingHand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Time taken:</span>
                <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
                  {elapsedSeconds}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Wrong / amended taps:</span>
                <span className="font-bold">{wrongTaps}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetForNewTrial}
              className="w-full min-h-[56px] py-3.5 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-emerald-600"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Test another payment</span>
            </button>
          </div>
        ) : (
          /* ENTER PIN & ERROR STATE */
          <div className="space-y-4">
            {/* PIN Dots Display */}
            <div className="space-y-2 text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                  Enter 4-digit UPI PIN
                </span>
                <button
                  type="button"
                  onClick={() => setShowPinDigits(!showPinDigits)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-md"
                  title={showPinDigits ? 'Hide PIN' : 'Peek PIN'}
                  aria-label={showPinDigits ? 'Hide PIN' : 'Show PIN digits'}
                >
                  {showPinDigits ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* 4 PIN Indicators */}
              <div className="flex justify-center items-center gap-4 py-2">
                {[0, 1, 2, 3].map((index) => {
                  const isFilled = index < pin.length;
                  return (
                    <div
                      key={index}
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-150 flex items-center justify-center ${
                        isFilled
                          ? 'bg-emerald-700 border-emerald-800 dark:bg-emerald-500 dark:border-emerald-400 scale-110 shadow-sm'
                          : 'border-stone-400 dark:border-stone-600 bg-stone-100 dark:bg-stone-800'
                      }`}
                    >
                      {isFilled && showPinDigits && (
                        <span className="text-xs font-bold text-white dark:text-stone-950 font-mono">
                          {pin[index]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calm Error Banner (if error occurred) */}
            {errorMessage ? (
              <div
                className="rounded-2xl p-3.5 bg-amber-50 dark:bg-amber-950/70 border-2 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 text-xs space-y-1.5 animate-fadeIn"
                role="alert"
              >
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-amber-800 dark:text-amber-300">
                    Take your time. Demo PIN is 1234.
                  </span>
                  <button
                    type="button"
                    onClick={fillDemoPin}
                    className="underline font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 cursor-pointer"
                  >
                    Use 1234
                  </button>
                </div>
              </div>
            ) : (
              /* Plain text reassurance specified in prompt */
              <div className="text-center space-y-1 px-2">
                <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl py-2 px-3">
                  You can clear a digit before paying. No money is deducted until you tap Pay.
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Demo PIN is <strong className="text-stone-700 dark:text-stone-200 font-mono">1234</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM KEYPAD & PAY BUTTON SECTION */}
      {step !== 'success' && (
        <div
          className={`p-4 pt-3 bg-stone-100 dark:bg-stone-900/90 border-t-2 border-stone-200 dark:border-stone-800 relative z-10 ${
            isLeftThumbMode
              ? 'pl-3 pr-5' // slight bias to left thumb reach
              : isRightThumbMode
              ? 'pr-3 pl-5' // slight bias to right thumb reach
              : ''
          }`}
        >
          {/* Layout Quick Indicator */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2 px-1">
            <span className="font-semibold flex items-center gap-1.5">
              <span>Layout:</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {isUsualLayout ? 'Usual (Pay bottom-right)' : 'Left-thumb reach'}
              </span>
            </span>

            <button
              type="button"
              onClick={() => onToggleLayout(isUsualLayout ? 'left-thumb' : 'usual')}
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Switch to {isUsualLayout ? 'Left-thumb' : 'Usual'}
            </button>
          </div>

          {/* KEYPAD GRID */}
          {/* All touch targets are at least 56px (specifically 60px–64px high) */}
          <div className="space-y-2.5">
            {/* Rows 1 to 3: Standard Digit Order 1-9 */}
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
            ].map((row, rowIdx) => (
              <div
                key={rowIdx}
                className={`grid grid-cols-3 gap-2.5 ${
                  isLeftThumbMode ? 'mr-auto max-w-[94%]' : isRightThumbMode ? 'ml-auto max-w-[94%]' : ''
                }`}
              >
                {row.map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    data-tap-target="key"
                    onClick={() => handleDigit(digit)}
                    className="min-h-[58px] sm:min-h-[62px] rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-2xl font-bold font-mono shadow-sm hover:border-emerald-600 dark:hover:border-emerald-500 active:bg-emerald-50 dark:active:bg-emerald-950 active:scale-95 transition-all flex items-center justify-center cursor-pointer focus-visible:ring-3 focus-visible:ring-emerald-600"
                    aria-label={`Digit ${digit}`}
                  >
                    {digit}
                  </button>
                ))}
              </div>
            ))}

            {/* Row 4 & Pay Button: Configured based on Hand & Layout Mode */}
            {/*
              In Usual Layout:
                Clear key, 0 key, and Pay button on the right (forces left thumb to stretch 80mm across screen!)
              In Left-Thumb Layout (for left hand hold):
                Pay button and Clear button are placed inside the left thumb's natural sweep arc!
            */}
            {isUsualLayout ? (
              /* USUAL LAYOUT: Pay button at bottom right, requiring long stretch for left thumb */
              <div className="grid grid-cols-3 gap-2.5">
                {/* Clear key */}
                <button
                  type="button"
                  data-tap-target="key"
                  onClick={handleClear}
                  className="min-h-[58px] sm:min-h-[62px] rounded-2xl bg-stone-200 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-sm font-bold shadow-sm hover:border-red-400 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer focus-visible:ring-3 focus-visible:ring-emerald-600"
                  aria-label="Clear last digit"
                >
                  <Delete className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                  <span className="text-[11px]">Clear</span>
                </button>

                {/* 0 Key */}
                <button
                  type="button"
                  data-tap-target="key"
                  onClick={() => handleDigit('0')}
                  className="min-h-[58px] sm:min-h-[62px] rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-2xl font-bold font-mono shadow-sm hover:border-emerald-600 active:scale-95 transition-all flex items-center justify-center cursor-pointer focus-visible:ring-3 focus-visible:ring-emerald-600"
                  aria-label="Digit 0"
                >
                  0
                </button>

                {/* Pay Button placed at bottom right (Usual right-handed bias) */}
                <button
                  type="button"
                  data-tap-target="key"
                  onClick={handlePay}
                  className="min-h-[58px] sm:min-h-[62px] rounded-2xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-sm shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer focus-visible:ring-3 focus-visible:ring-emerald-600"
                  aria-label="Pay 180 rupees"
                >
                  <span>Pay</span>
                  <span className="text-xs font-mono font-semibold">{amount}</span>
                </button>
              </div>
            ) : holdingHand === 'left' ? (
              /* LEFT-THUMB LAYOUT: Optimized for Left-Handed Holding */
              /* The Pay button is positioned at the natural bottom-left sweep arc of the left thumb! */
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2.5 mr-auto max-w-[94%]">
                  {/* Clear Button */}
                  <button
                    type="button"
                    data-tap-target="key"
                    onClick={handleClear}
                    className="min-h-[58px] sm:min-h-[62px] rounded-2xl bg-stone-200 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold shadow-sm hover:border-amber-500 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer focus-visible:ring-3 focus-visible:ring-emerald-600"
                    aria-label="Clear last digit"
                  >
                    <Delete className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                    <span>Clear</span>
                  </button>

                  {/* 0 Key */}
                  <button
                    type="button"
                    data-tap-target="key"
                    onClick={() => handleDigit('0')}
                    className="min-h-[58px] sm:min-h-[62px] rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-2xl font-bold font-mono shadow-sm hover:border-emerald-600 active:scale-95 transition-all flex items-center justify-center cursor-pointer focus-visible:ring-3 focus-visible:ring-emerald-600"
                    aria-label="Digit 0"
                  >
                    0
                  </button>

                  {/* Quick Reset / Undo Key */}
                  <button
                    type="button"
                    data-tap-target="key"
                    onClick={() => setPin('')}
                    className="min-h-[58px] sm:min-h-[62px] rounded-2xl bg-stone-100 dark:bg-stone-800/60 border-2 border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs font-semibold shadow-sm hover:border-stone-400 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer focus-visible:ring-3 focus-visible:ring-emerald-600"
                    aria-label="Reset all digits"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Dedicated Ergonomic Pay Button anchored directly in left thumb comfort arc */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-tap-target="key"
                    onClick={handlePay}
                    className="flex-1 min-h-[60px] rounded-2xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-900/20 active:scale-95 transition-all flex items-center justify-between px-5 cursor-pointer focus-visible:ring-4 focus-visible:ring-emerald-600"
                    aria-label="Pay 180 rupees with left thumb"
                  >
                    <div className="text-left">
                      <span className="block text-xs uppercase tracking-wider text-emerald-200">
                        Left-thumb reach
                      </span>
                      <span className="text-base font-extrabold">Pay {amount}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-700 dark:bg-emerald-500 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              /* RIGHT-THUMB LAYOUT: Mirrored for right hand hold */
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2.5 ml-auto max-w-[94%]">
                  <button
                    type="button"
                    data-tap-target="key"
                    onClick={() => setPin('')}
                    className="min-h-[58px] sm:min-h-[62px] rounded-2xl bg-stone-100 dark:bg-stone-800/60 border-2 border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs font-semibold shadow-sm hover:border-stone-400 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="button"
                    data-tap-target="key"
                    onClick={() => handleDigit('0')}
                    className="min-h-[58px] sm:min-h-[62px] rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-2xl font-bold font-mono shadow-sm hover:border-emerald-600 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                  >
                    0
                  </button>

                  <button
                    type="button"
                    data-tap-target="key"
                    onClick={handleClear}
                    className="min-h-[58px] sm:min-h-[62px] rounded-2xl bg-stone-200 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold shadow-sm hover:border-amber-500 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                  >
                    <Delete className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                    <span>Clear</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-tap-target="key"
                    onClick={handlePay}
                    className="flex-1 min-h-[60px] rounded-2xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-900/20 active:scale-95 transition-all flex items-center justify-between px-5 cursor-pointer"
                  >
                    <div className="text-left">
                      <span className="block text-xs uppercase tracking-wider text-emerald-200">
                        Right-thumb reach
                      </span>
                      <span className="text-base font-extrabold">Pay {amount}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-700 dark:bg-emerald-500 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Observer Hand-switch toggle during trial */}
          <div className="mt-3 pt-2.5 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span className="text-[11px]">Observer: Did tester switch hands?</span>
            <button
              type="button"
              onClick={() => setSwitchedHandsForTrial(!switchedHandsForTrial)}
              className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
                switchedHandsForTrial
                  ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              {switchedHandsForTrial ? 'Yes (Switched)' : 'No (One hand)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
