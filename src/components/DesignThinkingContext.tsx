import React from 'react';
import {
  HelpCircle,
  Lightbulb,
  Shield,
  Eye,
  Hand,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const DesignThinkingContext: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title & Banner */}
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
          <Lightbulb className="w-3.5 h-3.5" />
          College Design Thinking Case Study
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          Left by Design: Rethinking Everyday Experiences for Left-Handed Users
        </h2>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
          Most digital payment experiences are unconsciously designed for a right-handed world. When
          a vendor holds her smartphone with her left hand, typical payment flows force unnatural
          thumb hyperextension, conceal the transaction amount under the palm, and provoke deep
          anxiety around irreversible mistakes.
        </p>

        {/* The Core How Might We Question Highlight Card */}
        <div className="mt-4 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            Central How Might We (HMW) Question
          </span>
          <blockquote className="text-lg sm:text-xl font-extrabold italic text-stone-900 dark:text-stone-100 leading-snug">
            &ldquo;How might we help Roshni, a left-handed vendor, complete each payment confidently
            on her own, with her other hand busy and customers waiting?&rdquo;
          </blockquote>
        </div>
      </div>

      {/* PERSONA CARD: ROSHNI, 42 */}
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 border-2 border-emerald-600 flex items-center justify-center text-emerald-800 dark:text-emerald-200 font-black text-2xl shadow-inner">
              🥕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">Roshni</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 font-semibold text-stone-600 dark:text-stone-300">
                  Age 42
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                Vegetable Vendor • 2 years of basic smartphone use
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold">
            <Hand className="w-4 h-4 text-emerald-700 dark:text-emerald-400 -scale-x-100" />
            <span>Holds phone in Left Hand</span>
          </div>
        </div>

        {/* 3 Pillars of Roshni's Reality */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-stone-500 dark:text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Physical Constraint
            </div>
            <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
              Her right hand is wet, muddy, or busy bagging potatoes and weighing coriander. She{' '}
              <strong>must rely exclusively on her left holding thumb</strong> to unlock, type, and
              pay.
            </p>
          </div>

          <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-stone-500 dark:text-stone-400">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Social Pressure
            </div>
            <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
              Queue of impatient morning shoppers waiting in front of her stall. Feeling rushed leads
              to trembling fingers and heightened anxiety over tapping the wrong key.
            </p>
          </div>

          <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-stone-500 dark:text-stone-400">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Cognitive Model & Self-Blame
            </div>
            <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
              She firmly believes that{' '}
              <em>&ldquo;a single wrong tap cannot be undone and will drain my stall earnings.&rdquo;</em>{' '}
              When a payment fails, she blames herself rather than the right-biased interface.
            </p>
          </div>
        </div>
      </div>

      {/* THE 4 ERGONOMIC & EMOTIONAL REDESIGN PRINCIPLES */}
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span>The Four Pillars of Left-by-Design Architecture</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
              <Eye className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>1. Top-Anchored Amount (Zero Palm Occlusion)</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              When holding a phone with the left hand, the meat of the palm and base of the thumb
              naturally sweep across the bottom and mid-screen. Standard apps place amount totals and
              reassurance badges right where the left palm rests, blinding the user. We anchor the
              amount, recipient, and speech verification permanently at the top.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
              <Hand className="w-4 h-4 text-emerald-700 dark:text-emerald-400 -scale-x-100" />
              <span>2. Natural Radial Arc Keypad & Left Pay Anchor</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              The human thumb articulates around the carpometacarpal joint at the lower corner of the
              holding hand. Placing the Pay button at the far bottom-right forces left-handed vendors
              into extreme hyperextension (~80mm stretch) or phone dropping. Our left-thumb layout
              nests the Pay button within the effortless left sweep.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
              <Shield className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>3. Calm, Non-Punitive Error Architecture</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Standard apps flash aggressive red banners and count down attempts, triggering acute
              panic in users like Roshni. We use warm sentence case, explain what happened without
              accusation, and explicitly state:{' '}
              <em>&ldquo;You can clear a digit before paying. No money was deducted.&rdquo;</em>
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>4. High-Contrast Outdoor Legibility (Sunlight Ready)</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Vegetable vendors work outdoors under direct sunlight and glare. We reject generic
              crypto/fintech purple gradients and delicate gray text in favor of bold, earthy forest
              greens, warm terracotta accents, high-contrast typography (exceeding WCAG AAA), and
              touch targets of at least 56px to 64px.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
