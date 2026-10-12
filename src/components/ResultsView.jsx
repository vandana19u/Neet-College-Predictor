import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  TrendingUp, 
  MapPin, 
  Sparkles, 
  Share2, 
  PhoneCall, 
  RotateCcw, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { logEvent } from '../utils/analytics.js';

export default function ResultsView({ results, leadInfo, onReset }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'safe', 'moderate', 'reach'
  const [showCallModal, setShowCallModal] = useState(false);

  const {
    estimatedAir,
    score,
    category,
    homeState,
    safe = [],
    moderate = [],
    reach = [],
    totalSafeMatches = 0,
    totalModerateMatches = 0,
    totalReachMatches = 0,
  } = results;

  const totalColleges = safe.length + moderate.length + reach.length;

  useEffect(() => {
    // Fire result_view event once
    logEvent('result_view', {
      safe_count: safe.length,
      moderate_count: moderate.length,
      reach_count: reach.length,
      total_matches: totalColleges,
      estimated_air: estimatedAir,
      score,
      category,
    });

    // Fire celebratory confetti if high safe matches
    if (safe.length > 0) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#34d399', '#6ee7b7']
        });
      } catch (e) {}
    }
  }, []);

  // WhatsApp Share button logic
  const handleWhatsAppShare = () => {
    logEvent('cta_click', { cta_type: 'whatsapp_share' });

    const shareUrl = `${window.location.origin}${window.location.pathname}?utm_source=whatsapp_share&utm_medium=referral&utm_campaign=peer_share`;
    const text = `🎯 Hey! I scored ${score}/720 in NEET 2025 (AIR ~${estimatedAir.toLocaleString('en-IN')}) and found ${safe.length} Safe Govt MBBS Colleges under 15% AIQ!\n\nCheck which medical colleges you can get with your score here:\n👉 ${shareUrl}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Free Counselling Call CTA logic
  const handleCounsellingClick = () => {
    logEvent('cta_click', { cta_type: 'counselling_call' });
    setShowCallModal(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. High Impact Result Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-900/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                NEET UG 2025 AIQ Report
              </span>
              <span className="text-xs text-slate-300 font-medium">Prepared for {leadInfo?.name || 'Aspirant'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Estimated AIR: <span className="text-emerald-400">~{estimatedAir.toLocaleString('en-IN')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Based on Score <strong className="text-white">{score}/720</strong> • Category: <strong className="text-white">{category}</strong> • Home State: <strong className="text-white">{homeState}</strong>
            </p>
          </div>

          <button
            onClick={onReset}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Check Another Score</span>
          </button>
        </div>

        {/* 3-Bucket Summary Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 relative z-10">
          {/* Safe */}
          <div 
            onClick={() => setActiveTab('safe')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'safe'
                ? 'bg-emerald-500/25 border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide">Safe</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{safe.length}</div>
            <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">AIR ≤ 85% cutoff</p>
          </div>

          {/* Moderate */}
          <div 
            onClick={() => setActiveTab('moderate')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'moderate'
                ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">Moderate</span>
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{moderate.length}</div>
            <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">85% to 100% cutoff</p>
          </div>

          {/* Reach */}
          <div 
            onClick={() => setActiveTab('reach')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'reach'
                ? 'bg-sky-500/25 border-sky-400 ring-2 ring-sky-400/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wide">Reach</span>
              <TrendingUp className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{reach.length}</div>
            <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">100% to 115% cutoff</p>
          </div>
        </div>

        {/* Quick Social & Action Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <button
            onClick={handleWhatsAppShare}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share My Result on WhatsApp</span>
          </button>

          <button
            onClick={handleCounsellingClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 active:scale-[0.98] text-xs font-extrabold shadow-md transition-all cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Get Free NEETprep Counselling Call</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Bucket Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          All Matches ({totalColleges})
        </button>

        <button
          onClick={() => setActiveTab('safe')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'safe'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Safe ({safe.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderate')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'moderate'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/60'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Moderate ({moderate.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reach')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reach'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/60'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Reach ({reach.length})</span>
        </button>
      </div>

      {/* 3. College Listings by Bucket */}
      <div className="space-y-6">
        {/* SAFE BUCKET */}
        {(activeTab === 'all' || activeTab === 'safe') && (
          <BucketSection
            title="Safe Colleges"
            subtitle="Estimated AIR is comfortably within 85% of 2025 AIQ closing cutoff. Very high probability of admission."
            icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
            colorClass="emerald"
            badgeText="High Probability"
            colleges={safe}
            homeState={homeState}
          />
        )}

        {/* MODERATE BUCKET */}
        {(activeTab === 'all' || activeTab === 'moderate') && (
          <BucketSection
            title="Moderate Colleges"
            subtitle="Estimated AIR is between 85% and 100% of closing cutoff. Strong chance in Round 2 or Mop-up rounds."
            icon={<HelpCircle className="w-5 h-5 text-amber-600" />}
            colorClass="amber"
            badgeText="Realistic Target"
            colleges={moderate}
            homeState={homeState}
          />
        )}

        {/* REACH BUCKET */}
        {(activeTab === 'all' || activeTab === 'reach') && (
          <BucketSection
            title="Reach Colleges"
            subtitle="Estimated AIR is within 100% to 115% of closing cutoff. Keep in choice filling for stray vacancy rounds."
            icon={<TrendingUp className="w-5 h-5 text-sky-600" />}
            colorClass="sky"
            badgeText="Borderline / Aspirational"
            colleges={reach}
            homeState={homeState}
          />
        )}

        {/* 4. Empty State if 0 matches */}
        {totalColleges === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No AIQ 15% Govt MBBS Matches Found
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              With a score of <strong>{score}</strong> (estimated AIR <strong>~{estimatedAir.toLocaleString('en-IN')}</strong>), securing a seat under <strong>15% All India Quota</strong> in the top 50 government medical colleges is unlikely.
            </p>

            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Recommended Alternative Paths:
              </h4>
              <div className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>85% State Quota Counselling:</strong> Cutoffs for state government colleges in {homeState} are typically significantly lower than AIQ!</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Semi-Govt & Deemed Universities:</strong> Explore top non-profit trust institutes with subsidized seats.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>BDS / BAMS / BHUSH:</strong> High clinical demand alternatives with immediate admission chances.</span>
              </div>
            </div>

            <button
              onClick={handleCounsellingClick}
              className="mt-6 w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Talk to a NEETprep State Quota Mentor (Free)</span>
            </button>
          </div>
        )}
      </div>

      {/* Free Counselling Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Request Received!
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              A senior NEETprep MBBS counsellor will contact <strong>{leadInfo?.phone || 'you'}</strong> shortly to discuss personalized choice filling for {homeState} and AIQ Round 1.
            </p>
            <button
              onClick={() => setShowCallModal(false)}
              className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for College Bucket Section
function BucketSection({ title, subtitle, icon, colorClass, badgeText, colleges, homeState }) {
  if (colleges.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{title}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {colleges.length} {colleges.length === 10 ? '(Showing Top 10)' : 'colleges'}
              </span>
            </h3>
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-4">{subtitle}</p>

      {/* College Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {colleges.map((col, idx) => (
          <div
            key={col.id}
            className={`p-4 rounded-2xl border transition-all hover:shadow-md ${
              col.isHomeState
                ? 'border-emerald-300 bg-emerald-50/40'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {/* Top row: Badges */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider bg-slate-100 text-slate-700">
                  {col.type}
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  #{idx + 1}
                </span>
              </div>

              {/* Home State Badge */}
              {col.isHomeState && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                  <span>🏠</span>
                  <span>Home State</span>
                </span>
              )}
            </div>

            {/* College Name & Location */}
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2">
              {col.college}
            </h4>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{col.city}, {col.state}</span>
            </div>

            {/* Cutoff & Buffer Metrics */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">2025 Closing AIR</span>
                <span className="font-black text-slate-800 text-sm">
                  AIR {col.closingRank?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Quota</span>
                <span className="text-xs font-semibold text-slate-600">
                  {col.categoryUsed} Quota (15%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
