import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, MapPin, Layers, Target, ChevronRight } from 'lucide-react';
import { indianStates, categories } from '../data/states.js';
import { estimateAir } from '../utils/predictor.js';
import { logEvent } from '../utils/analytics.js';

export default function ScoreForm({ onFormComplete, initialValues = {} }) {
  const [score, setScore] = useState(initialValues.score !== undefined ? initialValues.score : 600);
  const [category, setCategory] = useState(initialValues.category || 'UR');
  const [homeState, setHomeState] = useState(initialValues.homeState || 'Delhi');
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState('');

  // Calculate live preview rank
  const liveAir = estimateAir(score);

  // Trigger form_start on first interaction
  const handleInteraction = (field) => {
    if (!hasStarted) {
      setHasStarted(true);
      logEvent('form_start', { field_touched: field });
    }
  };

  const handleScoreChange = (val) => {
    handleInteraction('score');
    const numeric = Number(val);
    if (isNaN(numeric)) {
      setScore('');
    } else {
      setScore(Math.min(720, Math.max(0, numeric)));
    }
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (score === '' || score < 0 || score > 720) {
      setError('Please enter a valid NEET score between 0 and 720.');
      return;
    }
    if (!category) {
      setError('Please select your category.');
      return;
    }
    if (!homeState) {
      setError('Please select your home state.');
      return;
    }

    onFormComplete({
      score: Number(score),
      category,
      homeState,
      estimatedAir: liveAir,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-6 mb-6">
      {/* 1. Score Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span>1. Your NEET Score (0 – 720)</span>
          </label>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Out of 720
          </span>
        </div>

        <div className="relative">
          <input
            type="number"
            min="0"
            max="720"
            value={score}
            onChange={(e) => handleScoreChange(e.target.value)}
            onFocus={() => handleInteraction('score')}
            placeholder="e.g. 620"
            className="w-full text-2xl font-black text-slate-900 px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:outline-none transition-all tracking-wide"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            <span className="text-[11px] font-semibold text-emerald-800">Est. AIR:</span>
            <span className="text-xs font-extrabold text-emerald-700">~{liveAir.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Quick Score Chips for mid-range mobile user convenience */}
        <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-slate-400 font-medium shrink-0">Quick presets:</span>
          {[650, 620, 600, 580, 550, 500].map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => handleScoreChange(s)}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 ${
                score === s
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Category Selector */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-800 mb-2">
          2. Your NEET Category
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => {
                handleInteraction('category');
                setCategory(cat.id);
              }}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center justify-center gap-0.5 ${
                category === cat.id
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{cat.id}</span>
              <span className={`text-[10px] font-medium ${category === cat.id ? 'text-emerald-700' : 'text-slate-400'}`}>
                {cat.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Home State Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Your Home State</span>
          </label>
          <span className="text-[11px] text-slate-500 font-medium">For state quota advantage</span>
        </div>
        <select
          value={homeState}
          onChange={(e) => {
            handleInteraction('homeState');
            setHomeState(e.target.value);
          }}
          onFocus={() => handleInteraction('homeState')}
          className="w-full text-sm font-semibold text-slate-800 px-3.5 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
        >
          {indianStates.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-extrabold text-base rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <span>Predict My Colleges</span>
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>

      <p className="text-center text-[11px] text-slate-400 font-medium mt-3">
        ⚡ Instant AIQ 15% Govt MBBS cutoffs • Safe, Moderate & Reach
      </p>
    </form>
  );
}
