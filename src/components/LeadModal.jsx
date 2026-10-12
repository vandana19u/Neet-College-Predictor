import React, { useState } from 'react';
import { X, Lock, Phone, User, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { saveLead, getStoredLeads } from '../utils/analytics.js';

export default function LeadModal({ isOpen, onClose, formData, onSuccess }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isTest, setIsTest] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');

  if (!isOpen) return null;

  // Validate Indian 10-digit mobile number
  const validatePhone = (num) => {
    const cleaned = num.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    setError('');

    // Check if phone was previously submitted
    if (val.length === 10) {
      const existing = getStoredLeads();
      const match = existing.find((l) => l.phone === val);
      if (match) {
        setDuplicateWarning(`Welcome back! We found an earlier report for ${match.name}. Submitting will update your latest prediction.`);
      } else {
        setDuplicateWarning('');
      }
    } else {
      setDuplicateWarning('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError('Please enter your full name (at least 2 letters).');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setIsSubmitting(true);

    try {
      const lead = await saveLead({
        name: trimmedName,
        phone,
        score: formData.score,
        category: formData.category,
        state: formData.homeState,
        predicted_rank: formData.estimatedAir,
        is_test: isTest,
      });

      setIsSubmitting(false);
      onSuccess(lead);
    } catch (err) {
      setIsSubmitting(false);
      setError('Something went wrong while saving your prediction. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
              Final Step
            </span>
            <span className="text-xs text-emerald-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 50 Colleges Analyzed
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight leading-tight">
            Unlock Your College Report
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Where should we send your detailed NEET cutoffs & updates?
          </p>

          {/* Quick confirmation chips */}
          <div className="mt-3.5 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-lg">
              Score: <strong className="text-white">{formData.score}/720</strong>
            </span>
            <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-lg">
              Category: <strong className="text-white">{formData.category}</strong>
            </span>
            <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-lg">
              Est. AIR: <strong className="text-white">~{formData.estimatedAir?.toLocaleString('en-IN')}</strong>
            </span>
          </div>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Student / Parent Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Dr. Rajesh Sharma"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Mobile Number Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              10-Digit Mobile Number *
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1 pointer-events-none text-slate-600 font-bold text-sm">
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="98765 43210"
                className="w-full pl-18 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold tracking-wider text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
              />
            </div>

            {/* Mandatory Consent Note (from prompt) */}
            <p className="mt-2 text-[11px] text-slate-500 flex items-start gap-1.5 leading-snug">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>We'll use this number to share your result and NEET counselling updates. No spam, ever.</span>
            </p>

            {/* Duplicate phone warning if applicable */}
            {duplicateWarning && (
              <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{duplicateWarning}</span>
              </div>
            )}
          </div>

          {/* Test Lead Checkbox for Evaluators */}
          <div className="pt-1 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isTest}
                onChange={(e) => setIsTest(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span className="font-medium text-slate-600">Mark as test submission</span>
            </label>
            <span className="text-[10px] text-slate-400">For evaluators</span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
              <span>Unlocking Results...</span>
            ) : (
              <>
                <span>View Predicted Colleges</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
