import React from 'react';
import { Award, Compass, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <div className="pt-6 pb-4 text-center px-4">
      {/* Intent Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-3 shadow-xs">
        <Award className="w-3.5 h-3.5 text-emerald-600" />
        <span>MCC 2025 Counselling Data • AIQ 15%</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
        Know Which <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">Govt MBBS College</span> You Can Get
      </h1>

      {/* Subhead for aspirants */}
      <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
        Don’t guess your chances. Enter your score to get an estimated All India Rank and your exact <strong className="text-slate-800">Safe, Moderate & Reach</strong> government medical colleges.
      </p>

      {/* Micro Trust Stats */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-3 text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 50 Top Govt Medical Colleges
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Linear Rank Interpolation
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 100% Free & Instant
        </span>
      </div>
    </div>
  );
}
