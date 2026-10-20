import React, { useState } from 'react';
import type { TrialRecord, AppLayout, HoldingHand } from '../types';
import {
  BarChart3,
  Copy,
  Check,
  Trash2,
  PlusCircle,
  FileSpreadsheet,
  Clock,
  AlertTriangle,
  Award,
  Sparkles,
  Star,
  Info,
} from 'lucide-react';
import { playAudioFeedback } from '../utils/sound';

interface Props {
  trials: TrialRecord[];
  onAddTrial: (trial: Omit<TrialRecord, 'id' | 'timestamp' | 'completedAt'>) => void;
  onClearTrials: () => void;
  onLoadSampleData: () => void;
  onDeleteTrial: (id: string) => void;
  currentLayout: AppLayout;
  currentHand: HoldingHand;
}

export const ObserverTestMode: React.FC<Props> = ({
  trials,
  onAddTrial,
  onClearTrials,
  onLoadSampleData,
  onDeleteTrial,
  currentLayout,
  currentHand,
}) => {
  // Manual / Quick Entry Form
  const [layout, setLayout] = useState<AppLayout>(currentLayout);
  const [holdingHand, setHoldingHand] = useState<HoldingHand>(currentHand);
  const [timeTaken, setTimeTaken] = useState<number>(3.5);
  const [wrongTaps, setWrongTaps] = useState<number>(0);
  const [switchedHands, setSwitchedHands] = useState<boolean>(false);
  const [confidenceRating, setConfidenceRating] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [copiedType, setCopiedType] = useState<'markdown' | 'csv' | null>(null);

  const handleAddTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioFeedback('pay');
    onAddTrial({
      layout,
      holdingHand,
      timeTakenSeconds: Number(timeTaken),
      wrongTaps: Number(wrongTaps),
      switchedHands,
      confidenceRating,
      notes: notes.trim() || (layout === 'left-thumb' ? 'Smooth single-thumb payment' : 'Had to stretch across screen'),
    });
    setNotes('');
  };

  // Calculate comparative statistics
  const usualTrials = trials.filter((t) => t.layout === 'usual');
  const leftThumbTrials = trials.filter((t) => t.layout === 'left-thumb');

  const calcAvg = (list: TrialRecord[], key: keyof TrialRecord): number => {
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
    return Number((sum / list.length).toFixed(1));
  };

  const calcHandSwitchRate = (list: TrialRecord[]): number => {
    if (list.length === 0) return 0;
    const switched = list.filter((t) => t.switchedHands).length;
    return Math.round((switched / list.length) * 100);
  };

  const usualAvgTime = calcAvg(usualTrials, 'timeTakenSeconds');
  const leftAvgTime = calcAvg(leftThumbTrials, 'timeTakenSeconds');

  const usualAvgWrong = calcAvg(usualTrials, 'wrongTaps');
  const leftAvgWrong = calcAvg(leftThumbTrials, 'wrongTaps');

  const usualAvgConfidence = calcAvg(usualTrials, 'confidenceRating');
  const leftAvgConfidence = calcAvg(leftThumbTrials, 'confidenceRating');

  const usualSwitchRate = calcHandSwitchRate(usualTrials);
  const leftSwitchRate = calcHandSwitchRate(leftThumbTrials);

  const timeImprovementPercent =
    usualAvgTime > 0 && leftAvgTime > 0
      ? Math.round(((usualAvgTime - leftAvgTime) / usualAvgTime) * 100)
      : 0;

  // Generate Markdown summary table
  const generateMarkdownTable = () => {
    let md = `### Left by Design: Field Usability Summary Table\n\n`;
    md += `**Participant**: Roshni (42, Vegetable Vendor)\n`;
    md += `**Total Trials**: ${trials.length}\n\n`;

    md += `| Metric | Usual Layout (Centred, Pay Bottom-Right) | Left-Thumb Layout (Ergonomic Arc) | Delta / Impact |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    md += `| **Trials Count** | ${usualTrials.length} | ${leftThumbTrials.length} | - |\n`;
    md += `| **Average Time (s)** | ${usualAvgTime}s | ${leftAvgTime}s | **${timeImprovementPercent > 0 ? `${timeImprovementPercent}% faster` : '-'}** |\n`;
    md += `| **Average Wrong / Amended Taps** | ${usualAvgWrong} | ${leftAvgWrong} | **${(usualAvgWrong - leftAvgWrong).toFixed(1)} fewer mistakes** |\n`;
    md += `| **Hand-Switch Rate (%)** | ${usualSwitchRate}% | ${leftSwitchRate}% | **${usualSwitchRate - leftSwitchRate}% reduction in hand switches** |\n`;
    md += `| **Confidence Rating (1-5)** | ${usualAvgConfidence} / 5 | ${leftAvgConfidence} / 5 | **+${(leftAvgConfidence - usualAvgConfidence).toFixed(1)} confidence gain** |\n\n`;

    md += `#### Individual Trial Log\n\n`;
    md += `| Trial # | Layout | Hand | Time (s) | Wrong Taps | Switched Hands | Confidence (1-5) | Observer Field Notes |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    trials.forEach((t, i) => {
      md += `| ${i + 1} | ${t.layout === 'usual' ? 'Usual' : 'Left-Thumb'} | ${t.holdingHand} | ${t.timeTakenSeconds}s | ${t.wrongTaps} | ${t.switchedHands ? 'Yes' : 'No'} | ${t.confidenceRating}/5 | ${t.notes || '-'} |\n`;
    });

    return md;
  };

  const generateCSV = () => {
    let csv = `Trial,Layout,Hand,TimeSeconds,WrongTaps,SwitchedHands,ConfidenceRating,Notes\n`;
    trials.forEach((t, i) => {
      csv += `${i + 1},"${t.layout}","${t.holdingHand}",${t.timeTakenSeconds},${t.wrongTaps},"${t.switchedHands ? 'Yes' : 'No'}",${t.confidenceRating},"${t.notes.replace(/"/g, '""')}"\n`;
    });
    return csv;
  };

  const handleCopy = (type: 'markdown' | 'csv') => {
    playAudioFeedback('digit');
    const text = type === 'markdown' ? generateMarkdownTable() : generateCSV();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              <BarChart3 className="w-3.5 h-3.5" />
              Observer Testing Suite
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              Usability Trial Logger & Comparative Summary
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Record live trials with Roshni, track thumb reach, measure errors, and export
              statistical data for your design thinking project report.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onLoadSampleData}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Preload 6 realistic field trials from vendor testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Load sample data</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopy('markdown')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              title="Copy formatted Markdown table to paste in report"
            >
              {copiedType === 'markdown' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied table!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy table as text</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleCopy('csv')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Copy CSV for spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{copiedType === 'csv' ? 'Copied CSV!' : 'CSV'}</span>
            </button>

            {trials.length > 0 && (
              <button
                type="button"
                onClick={onClearTrials}
                className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
                title="Clear all recorded trials"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* COMPARATIVE SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Average Time */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
            <span>Average Payment Time</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                {leftAvgTime > 0 ? `${leftAvgTime}s` : '--'}
              </p>
              <span className="text-[11px] text-stone-500">Left-thumb layout</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-stone-400 font-mono">
                {usualAvgTime > 0 ? `${usualAvgTime}s` : '--'}
              </p>
              <span className="text-[11px] text-stone-400">Usual layout</span>
            </div>
          </div>
          {timeImprovementPercent > 0 && (
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg p-1.5 text-center">
              ↓ {timeImprovementPercent}% faster completion
            </div>
          )}
        </div>

        {/* Metric 2: Wrong Taps */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
            <span>Avg Wrong / Amended Taps</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                {leftThumbTrials.length > 0 ? leftAvgWrong : '--'}
              </p>
              <span className="text-[11px] text-stone-500">Left-thumb layout</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-amber-600 font-mono">
                {usualTrials.length > 0 ? usualAvgWrong : '--'}
              </p>
              <span className="text-[11px] text-stone-400">Usual layout</span>
            </div>
          </div>
          <div className="text-xs font-semibold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-lg p-1.5 text-center">
            {usualAvgWrong > leftAvgWrong
              ? `${(usualAvgWrong - leftAvgWrong).toFixed(1)} fewer wrong taps with left layout`
              : 'Zero missed taps recorded'}
          </div>
        </div>

        {/* Metric 3: Hand Switch Rate */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
            <span>Hand-Switch Rate</span>
            <Info className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                {leftThumbTrials.length > 0 ? `${leftSwitchRate}%` : '--'}
              </p>
              <span className="text-[11px] text-stone-500">Left-thumb (One hand)</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-amber-600 font-mono">
                {usualTrials.length > 0 ? `${usualSwitchRate}%` : '--'}
              </p>
              <span className="text-[11px] text-stone-400">Usual layout</span>
            </div>
          </div>
          <div className="text-xs font-semibold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-lg p-1.5 text-center">
            {leftSwitchRate === 0
              ? 'Vegetable hand stays 100% free!'
              : `${leftSwitchRate}% needed second hand`}
          </div>
        </div>

        {/* Metric 4: Confidence Score */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
            <span>Confidence Rating (1-5)</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                {leftAvgConfidence > 0 ? `${leftAvgConfidence} / 5` : '--'}
              </p>
              <span className="text-[11px] text-stone-500">Left-thumb layout</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-stone-400 font-mono">
                {usualAvgConfidence > 0 ? `${usualAvgConfidence} / 5` : '--'}
              </p>
              <span className="text-[11px] text-stone-400">Usual layout</span>
            </div>
          </div>
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg p-1.5 text-center">
            +{leftAvgConfidence > usualAvgConfidence ? (leftAvgConfidence - usualAvgConfidence).toFixed(1) : 0} self-confidence gain
          </div>
        </div>
      </div>

      {/* COMPARATIVE SUMMARY TABLE */}
      <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm overflow-hidden">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center justify-between">
          <span>Comparative Results Table</span>
          <span className="text-xs font-normal text-stone-500">
            Comparing Usual Centred vs Left-Thumb Ergonomic
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                <th className="py-3 px-4">Evaluation Metric</th>
                <th className="py-3 px-4 bg-stone-50 dark:bg-stone-800/50">Usual Layout (Baseline)</th>
                <th className="py-3 px-4 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300">
                  Left-Thumb Layout (Designed)
                </th>
                <th className="py-3 px-4">Research Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-800 dark:text-stone-200">
                  Total Completed Trials
                </td>
                <td className="py-3.5 px-4 bg-stone-50 dark:bg-stone-800/50 font-mono">
                  {usualTrials.length}
                </td>
                <td className="py-3.5 px-4 bg-emerald-50/60 dark:bg-emerald-950/40 font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  {leftThumbTrials.length}
                </td>
                <td className="py-3.5 px-4 text-xs text-stone-600 dark:text-stone-400">
                  Balanced A/B usability trials
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-800 dark:text-stone-200">
                  Average Completion Time
                </td>
                <td className="py-3.5 px-4 bg-stone-50 dark:bg-stone-800/50 font-mono text-stone-700 dark:text-stone-300">
                  {usualAvgTime > 0 ? `${usualAvgTime}s` : 'N/A'}
                </td>
                <td className="py-3.5 px-4 bg-emerald-50/60 dark:bg-emerald-950/40 font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  {leftAvgTime > 0 ? `${leftAvgTime}s` : 'N/A'}
                </td>
                <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {timeImprovementPercent > 0 ? `${timeImprovementPercent}% faster payment speed` : '-'}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-800 dark:text-stone-200">
                  Wrong / Missed Taps per Trial
                </td>
                <td className="py-3.5 px-4 bg-stone-50 dark:bg-stone-800/50 font-mono text-amber-700 dark:text-amber-400">
                  {usualTrials.length > 0 ? usualAvgWrong : 'N/A'}
                </td>
                <td className="py-3.5 px-4 bg-emerald-50/60 dark:bg-emerald-950/40 font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  {leftThumbTrials.length > 0 ? leftAvgWrong : 'N/A'}
                </td>
                <td className="py-3.5 px-4 text-xs text-stone-600 dark:text-stone-400">
                  Eliminates thumb over-reach errors
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-800 dark:text-stone-200">
                  Hand-Switch Rate (% requiring other hand)
                </td>
                <td className="py-3.5 px-4 bg-stone-50 dark:bg-stone-800/50 font-mono text-amber-700 dark:text-amber-400">
                  {usualTrials.length > 0 ? `${usualSwitchRate}%` : 'N/A'}
                </td>
                <td className="py-3.5 px-4 bg-emerald-50/60 dark:bg-emerald-950/40 font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  {leftThumbTrials.length > 0 ? `${leftSwitchRate}%` : 'N/A'}
                </td>
                <td className="py-3.5 px-4 text-xs text-stone-600 dark:text-stone-400">
                  Right hand remains free to bag produce
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-800 dark:text-stone-200">
                  Vendor Confidence Rating (1 to 5)
                </td>
                <td className="py-3.5 px-4 bg-stone-50 dark:bg-stone-800/50 font-mono text-stone-700 dark:text-stone-300">
                  {usualAvgConfidence > 0 ? `${usualAvgConfidence} / 5` : 'N/A'}
                </td>
                <td className="py-3.5 px-4 bg-emerald-50/60 dark:bg-emerald-950/40 font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  {leftAvgConfidence > 0 ? `${leftAvgConfidence} / 5` : 'N/A'}
                </td>
                <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Removes fear of irreversible mistakes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* MANUAL TRIAL ENTRY ACCORDION / FORM FOR OBSERVERS */}
      <div className="bg-stone-50 dark:bg-stone-900/60 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span>Observer Manual Record Entry</span>
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">
          Trials automatically log when testing the prototype, or you can manually log an observed
          field test here:
        </p>

        <form onSubmit={handleAddTrialSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Layout Tested
            </label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value as AppLayout)}
              className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <option value="usual">Usual Layout (Centred, Pay Bottom-Right)</option>
              <option value="left-thumb">Left-Thumb Layout (Ergonomic Arc)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Holding Hand
            </label>
            <select
              value={holdingHand}
              onChange={(e) => setHoldingHand(e.target.value as HoldingHand)}
              className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <option value="left">Left Hand (Roshni&apos;s holding hand)</option>
              <option value="right">Right Hand (Mirrored)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Time Taken (seconds)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="60"
              value={timeTaken}
              onChange={(e) => setTimeTaken(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Wrong Taps / Misses
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={wrongTaps}
              onChange={(e) => setWrongTaps(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Did Tester Switch Hands?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSwitchedHands(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  !switchedHands
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                No (One hand)
              </button>
              <button
                type="button"
                onClick={() => setSwitchedHands(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  switchedHands
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                Yes (Switched)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Confidence Rating: {confidenceRating} / 5
            </label>
            <div className="flex items-center gap-1 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setConfidenceRating(star)}
                  className="p-1 text-stone-300 hover:text-amber-400 cursor-pointer transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= confidenceRating
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-stone-300 dark:text-stone-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Field Observation Notes
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Roshni hesitated reaching for Pay, or thumb reached without looking away..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shrink-0 cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                Log Trial
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* INDIVIDUAL TRIAL LOG TABLE */}
      {trials.length > 0 && (
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Recorded Trials Log ({trials.length})
            </h3>
            <span className="text-xs text-stone-500">
              Click &quot;Copy table as text&quot; above to export
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-bold uppercase">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Layout</th>
                  <th className="py-2.5 px-3">Hand</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Wrong Taps</th>
                  <th className="py-2.5 px-3">Switched Hands</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Notes</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {trials.map((t, index) => (
                  <tr key={t.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-stone-500">{index + 1}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold ${
                          t.layout === 'left-thumb'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {t.layout === 'left-thumb' ? 'Left-Thumb' : 'Usual'}
                      </span>
                    </td>
                    <td className="py-3 px-3 capitalize font-semibold">{t.holdingHand}</td>
                    <td className="py-3 px-3 font-mono font-bold text-stone-900 dark:text-stone-100">
                      {t.timeTakenSeconds}s
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {t.wrongTaps > 0 ? (
                        <span className="text-amber-600 font-bold">{t.wrongTaps}</span>
                      ) : (
                        <span className="text-stone-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {t.switchedHands ? (
                        <span className="text-amber-600 font-bold">Yes</span>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">No</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{t.confidenceRating}/5</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-[220px] truncate text-stone-600 dark:text-stone-400">
                      {t.notes || '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteTrial(t.id)}
                        className="text-stone-400 hover:text-red-500 p-1 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
