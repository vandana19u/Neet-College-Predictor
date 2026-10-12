import React from 'react';
import { BarChart3, ShieldCheck, Stethoscope, Sparkles } from 'lucide-react';

export default function Header({ currentView, setCurrentView, leadCount }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setCurrentView('predictor')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">NEETprep</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">2025</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-0.5">AIQ Govt College Predictor</p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2">
          {currentView === 'predictor' ? (
            <button
              onClick={() => setCurrentView('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="View Leads & Analytics Funnel"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Leads & Analytics</span>
              {leadCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                  {leadCount}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('predictor')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
            >
              <span>← Back to Predictor</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
