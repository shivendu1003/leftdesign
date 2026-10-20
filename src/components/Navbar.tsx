import React from 'react';
import type { HoldingHand, AppLayout, ThemeMode } from '../types';
import {
  Smartphone,
  BarChart3,
  BookOpen,
  Hand,
  Sun,
  Moon,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Props {
  activeTab: 'payment' | 'observer' | 'case-study';
  onSelectTab: (tab: 'payment' | 'observer' | 'case-study') => void;
  holdingHand: HoldingHand;
  onOpenHandSelector: () => void;
  layout: AppLayout;
  onToggleLayout: (layout: AppLayout) => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  showReachOverlay: boolean;
  onToggleReachOverlay: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  holdingHand,
  onOpenHandSelector,
  layout,
  onToggleLayout,
  themeMode,
  onToggleTheme,
  showReachOverlay,
  onToggleReachOverlay,
}) => {
  return (
    <header className="w-full bg-white dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-800 sticky top-0 z-40 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Project Title & College Subhead */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-xl shadow-md">
              <Hand className="w-6 h-6 -scale-x-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                  LefDesign
                </span>
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  (Left by Design)
                </span>
                <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  Design Thinking Project
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 max-w-[280px] sm:max-w-none truncate">
                Rethinking Everyday Experiences for Left-Handed Users • Persona: Roshni, 42
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={() => onSelectTab('payment')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                activeTab === 'payment'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Payment Demo</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('observer')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                activeTab === 'observer'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Observer Testing</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('case-study')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                activeTab === 'case-study'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span className="hidden sm:inline">Design Thinking</span>
              <span className="sm:hidden">Brief</span>
            </button>
          </nav>

          {/* Quick Utility Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Layout Mode Switcher */}
            <button
              type="button"
              onClick={() => onToggleLayout(layout === 'left-thumb' ? 'usual' : 'left-thumb')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                layout === 'left-thumb'
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
              title="Toggle between Left-thumb and Usual layouts"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{layout === 'left-thumb' ? 'Left-Thumb' : 'Usual'}</span>
            </button>

            {/* Holding Hand Indicator & Quick Switch */}
            <button
              type="button"
              onClick={onOpenHandSelector}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-bold hover:border-emerald-600 transition-colors cursor-pointer"
              title="Change holding hand"
            >
              <Hand className={`w-3.5 h-3.5 ${holdingHand === 'left' ? '-scale-x-100 text-emerald-600' : ''}`} />
              <span className="capitalize">{holdingHand} hand</span>
            </button>

            {/* Reach Heatmap Overlay Button */}
            <button
              type="button"
              onClick={onToggleReachOverlay}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                showReachOverlay
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 text-emerald-900 dark:text-emerald-300'
                  : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title={showReachOverlay ? 'Hide reachability zones' : 'Show reachability heatmap overlay'}
              aria-label="Toggle reachability zone overlay"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Theme Toggle (Sunlight Readable vs Night Market) */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
              title={`Switch to ${themeMode === 'sunlight' ? 'Night market theme' : 'Sunlight readable theme'}`}
              aria-label="Toggle theme mode"
            >
              {themeMode === 'sunlight' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
