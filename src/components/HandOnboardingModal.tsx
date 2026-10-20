import React from 'react';
import type { HoldingHand } from '../types';
import { playAudioFeedback, triggerVibration } from '../utils/sound';
import { Hand, Smartphone, Check, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  currentHand: HoldingHand;
  onSelectHand: (hand: HoldingHand) => void;
  onClose: () => void;
}

export const HandOnboardingModal: React.FC<Props> = ({
  isOpen,
  currentHand,
  onSelectHand,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleSelect = (hand: HoldingHand) => {
    playAudioFeedback('digit');
    triggerVibration(40);
    onSelectHand(hand);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hand-select-title"
    >
      <div className="w-full max-w-md bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <Smartphone className="w-3.5 h-3.5" />
            LefDesign • Left by Design Setup
          </div>
          <h2
            id="hand-select-title"
            className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight"
          >
            Which hand do you hold your phone with?
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Choose the hand you usually hold your phone with. We position the keypad and the Pay
            button inside your thumb&apos;s natural sweep, so your other hand stays free and you never
            cover the amount.
          </p>
        </div>

        {/* Hand Options Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Hand Option */}
          <button
            type="button"
            onClick={() => handleSelect('left')}
            className={`group relative flex flex-col items-center justify-between p-5 rounded-2xl border-2 transition-all min-h-[160px] text-left cursor-pointer focus-visible:ring-4 focus-visible:ring-emerald-600 ${
              currentHand === 'left'
                ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:border-emerald-500 shadow-md ring-2 ring-emerald-600'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80 hover:border-emerald-300 dark:hover:border-stone-600'
            }`}
          >
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Optimized for Roshni
              </span>
              {currentHand === 'left' && (
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Illustration */}
            <div className="my-2 p-3 rounded-xl bg-stone-100 dark:bg-stone-800 group-hover:scale-105 transition-transform">
              <Hand className="w-10 h-10 text-emerald-800 dark:text-emerald-400 -scale-x-100" />
            </div>

            <div className="w-full text-center">
              <p className="text-lg font-bold text-stone-900 dark:text-stone-100">Left hand</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Left thumb reaches all keys
              </p>
            </div>
          </button>

          {/* Right Hand Option */}
          <button
            type="button"
            onClick={() => handleSelect('right')}
            className={`group relative flex flex-col items-center justify-between p-5 rounded-2xl border-2 transition-all min-h-[160px] text-left cursor-pointer focus-visible:ring-4 focus-visible:ring-emerald-600 ${
              currentHand === 'right'
                ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:border-emerald-500 shadow-md ring-2 ring-emerald-600'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80 hover:border-emerald-300 dark:hover:border-stone-600'
            }`}
          >
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Mirrored
              </span>
              {currentHand === 'right' && (
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Illustration */}
            <div className="my-2 p-3 rounded-xl bg-stone-100 dark:bg-stone-800 group-hover:scale-105 transition-transform">
              <Hand className="w-10 h-10 text-stone-700 dark:text-stone-300" />
            </div>

            <div className="w-full text-center">
              <p className="text-lg font-bold text-stone-900 dark:text-stone-100">Right hand</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Right thumb reaches all keys
              </p>
            </div>
          </button>
        </div>

        {/* Note on remembering */}
        <div className="rounded-xl bg-stone-100 dark:bg-stone-800/60 p-3.5 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2.5">
          <span className="text-base leading-none">💡</span>
          <div>
            <strong className="text-stone-800 dark:text-stone-200">
              Remembered for this session.
            </strong>{' '}
            You can toggle layouts or switch hands at any time during testing.
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={() => {
            playAudioFeedback('pay');
            triggerVibration(40);
            onClose();
          }}
          className="w-full min-h-[56px] py-3.5 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-emerald-600"
        >
          <span>Continue to payment test</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
