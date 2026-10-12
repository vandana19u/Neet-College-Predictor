import React from 'react';
import { AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function DisclaimerFooter() {
  return (
    <footer className="mt-12 pt-8 pb-12 border-t border-slate-200 text-slate-500 text-xs">
      {/* Disclaimer Box */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 mb-8 text-amber-900">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5 leading-relaxed text-[11px] sm:text-xs">
            <h5 className="font-extrabold uppercase tracking-wider text-amber-950">
              Important Disclaimer & Counselling Advisory
            </h5>
            <p>
              The cutoff figures and rank estimations presented here are indicative and prepared for guidance. A portion of the figures originates from published MCC 2025 All India Quota (15%) counselling summaries, and the remaining values are mathematical projections based on prevailing trends.
            </p>
            <p className="text-amber-800">
              This predictor does not replace official MCC / NTA counselling allotment rounds. Actual allotment depends on seat matrix fluctuations, state seat expansions, and individual candidate choices.
            </p>
          </div>
        </div>
      </div>

      {/* Sources & References */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-400 font-medium mb-6">
        <span className="font-semibold text-slate-600">Reference Sources:</span>
        <a 
          href="https://collegedunia.com/articles/e-457-last-year-neet-cut-off-for-mbbs-government-college" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-emerald-600 flex items-center gap-1 transition-colors"
        >
          Collegedunia Cutoffs <ExternalLink className="w-3 h-3" />
        </a>
        <a 
          href="https://news.allen.in/all-india-neet-counselling-2025-second-round-provisional-seat-allotment/amp/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-emerald-600 flex items-center gap-1 transition-colors"
        >
          Allen MCC Round 2 Summary <ExternalLink className="w-3 h-3" />
        </a>
        <a 
          href="https://www.pw.live/neet/exams/neet-2025-marks-vs-rank" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-emerald-600 flex items-center gap-1 transition-colors"
        >
          PW Marks vs Rank <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-[11px] text-slate-400">
        <p>© 2026 NEETprep. Built for NEET Aspirants & Parents across India.</p>
        <p className="mt-1 text-[10px] text-slate-400">Associate, CEO's Office Assignment • Mobile-First Edition</p>
      </div>
    </footer>
  );
}
