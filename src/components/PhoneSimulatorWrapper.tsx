import React from 'react';
import type { HoldingHand, AppLayout } from '../types';
import {
  Hand,
  Layers,
} from 'lucide-react';

interface Props {
  children: React.ReactNode;
  holdingHand: HoldingHand;
  layout: AppLayout;
  onToggleLayout: (layout: AppLayout) => void;
  showReachOverlay: boolean;
  onToggleReachOverlay: () => void;
  onOpenHandSelector: () => void;
}

export const PhoneSimulatorWrapper: React.FC<Props> = ({
  children,
  holdingHand,
  layout,
  onToggleLayout,
  showReachOverlay,
  onToggleReachOverlay,
  onOpenHandSelector,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
      {/* Left Column: Context, Layout Switcher & Ergonomic Comparison Explainer */}
      <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
        {/* Comparison Mode Controller Card */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Interactive Comparison Mode
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              A/B Testing
            </span>
          </div>

          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Compare Keypad & Pay Layouts
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Switch between the standard right-biased app architecture and the Left-by-Design
            thumb-anchored layout to experience the difference in reach and comfort.
          </p>

          {/* Toggle Buttons */}
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={() => onToggleLayout('usual')}
              className={`p-3 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                layout === 'usual'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-md ring-2 ring-amber-500'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <span className="text-base">📱</span>
              <span>Usual Layout</span>
              <span className="text-[10px] text-stone-500 font-normal">
                Centred, Pay bottom-right
              </span>
            </button>

            <button
              type="button"
              onClick={() => onToggleLayout('left-thumb')}
              className={`p-3 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                layout === 'left-thumb'
                  ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-500'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <span className="text-base">✨</span>
              <span>Left-Thumb Layout</span>
              <span className="text-[10px] text-emerald-200 font-normal">
                Ergonomic radial sweep
              </span>
            </button>
          </div>

          {/* Detailed Ergonomic Comparison */}
          <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/50 p-4 border border-stone-200 dark:border-stone-700 text-xs space-y-3">
            <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <span>{layout === 'usual' ? '⚠️ What fails in Usual Layout:' : '✅ Why Left-Thumb Layout succeeds:'}</span>
            </div>

            {layout === 'usual' ? (
              <ul className="space-y-2 text-stone-600 dark:text-stone-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>
                    <strong>Bottom-Right Pay button</strong> requires a ~80mm thumb reach across the
                    diagonal, risking phone drops.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>
                    Forces Roshni to bring in her <strong>right hand</strong> (which is covered in
                    vegetable dirt and moisture).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>
                    The <strong>left palm covers the screen</strong> while typing digits.
                  </span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-stone-600 dark:text-stone-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓</span>
                  <span>
                    <strong>Pay button sits in natural sweep</strong> of the left thumb at the lower
                    comfort anchor.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓</span>
                  <span>
                    <strong>Right hand remains 100% free</strong> to weigh produce, pack bags, and
                    serve customers.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓</span>
                  <span>
                    <strong>Amount is pinned at the top</strong>, completely unobstructed by fingers
                    or palm.
                  </span>
                </li>
              </ul>
            )}
          </div>

          {/* Reachability Heatmap Overlay Switch */}
          <button
            type="button"
            onClick={onToggleReachOverlay}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              showReachOverlay
                ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-300'
                : 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-600'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>
              {showReachOverlay ? 'Hide Thumb Reach Overlay' : 'Show Thumb Reach Arc Overlay'}
            </span>
          </button>
        </div>

        {/* Vendor Persona Simulation Snapshot Card */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🥬</span>
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Testing Context: Roshni&apos;s Stall
              </h4>
              <p className="text-xs text-stone-500">Left hand holding • Right hand bagging</p>
            </div>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            &ldquo;When people crowd my stall with bags, I get nervous. If I hold my phone with my
            left hand, I can&apos;t reach the pay button with one thumb on normal apps. With this left
            layout, my thumb just touches Pay easily.&rdquo;
          </p>
        </div>
      </div>

      {/* Right Column: Simulated Mobile Phone Frame with Prototype */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center order-1 lg:order-2">
        {/* Subtle Grip Cue */}
        <div className="mb-3 text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2">
          <Hand className={`w-4 h-4 text-emerald-700 dark:text-emerald-400 ${holdingHand === 'left' ? '-scale-x-100' : ''}`} />
          <span>
            Simulated Phone Grip: {holdingHand === 'left' ? 'Left hand holding' : 'Right hand holding'}
          </span>
          <button
            type="button"
            onClick={onOpenHandSelector}
            className="text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-900 cursor-pointer ml-1"
          >
            Switch hand
          </button>
        </div>

        {/* Interactive Prototype Embedded */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};
