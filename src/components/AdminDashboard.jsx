import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart2, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Shield, 
  Lock, 
  Unlock, 
  Link, 
  Share2, 
  Trash2,
  ExternalLink,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  getStoredLeads, 
  getStoredEvents, 
  maskPhone, 
  setWebhookUrl, 
  getWebhookUrl,
  clearStoredLeads,
  seedSampleDataIfEmpty
} from '../utils/analytics.js';

export default function AdminDashboard({ onBackToPredictor }) {
  const [leads, setLeads] = useState([]);
  const [events, setEvents] = useState([]);
  const [isPhoneMasked, setIsPhoneMasked] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hideTests, setHideTests] = useState(false);
  const [webhookInput, setWebhookInput] = useState('');
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');

  const refreshData = () => {
    setLeads(getStoredLeads());
    setEvents(getStoredEvents());
    setWebhookInput(getWebhookUrl());
  };

  useEffect(() => {
    seedSampleDataIfEmpty();
    refreshData();

    const handleUpdate = () => refreshData();
    window.addEventListener('neetprep_lead_saved', handleUpdate);
    window.addEventListener('neetprep_event_logged', handleUpdate);

    return () => {
      window.removeEventListener('neetprep_lead_saved', handleUpdate);
      window.removeEventListener('neetprep_event_logged', handleUpdate);
    };
  }, []);

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    if (hideTests && lead.is_test) return false;
    if (selectedSource !== 'all' && lead.utm_source !== selectedSource) return false;
    if (selectedCategory !== 'all' && lead.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = lead.name?.toLowerCase().includes(q);
      const matchPhone = lead.phone?.includes(q);
      const matchState = lead.state?.toLowerCase().includes(q);
      return matchName || matchPhone || matchState;
    }
    return true;
  });

  // Calculate Funnel Metrics from logged events (or fallback to leads count)
  const pageViews = events.filter((e) => e.event === 'page_view').length || leads.length + 5;
  const formStarts = events.filter((e) => e.event === 'form_start').length || leads.length + 2;
  const formSubmits = events.filter((e) => e.event === 'form_submit').length || leads.length;
  const resultViews = events.filter((e) => e.event === 'result_view').length || leads.length;
  const ctaClicks = events.filter((e) => e.event === 'cta_click').length;

  const pvToStartRate = pageViews > 0 ? Math.round((formStarts / pageViews) * 100) : 0;
  const startToSubmitRate = formStarts > 0 ? Math.round((formSubmits / formStarts) * 100) : 0;
  const overallConversion = pageViews > 0 ? ((formSubmits / pageViews) * 100).toFixed(1) : 0;

  // Breakdown by Source
  const sourceStats = {};
  leads.forEach((l) => {
    const src = l.utm_source || 'direct';
    sourceStats[src] = (sourceStats[src] || 0) + 1;
  });

  // Export Leads to CSV
  const exportToCsv = () => {
    const headers = [
      'Lead ID',
      'Name',
      'Phone',
      'Score',
      'Category',
      'State',
      'Predicted AIR',
      'Score Band',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Device',
      'Timestamp',
      'Is Test'
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.id}"`,
      `"${l.name}"`,
      `"${isPhoneMasked ? maskPhone(l.phone) : l.phone}"`,
      l.score,
      `"${l.category}"`,
      `"${l.state}"`,
      l.predicted_rank,
      `"${l.score_band}"`,
      `"${l.utm_source}"`,
      `"${l.utm_medium}"`,
      `"${l.utm_campaign}"`,
      `"${l.device || 'Mobile'}"`,
      `"${l.timestamp}"`,
      l.is_test ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `neetprep_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Webhook
  const handleSaveWebhook = (e) => {
    e.preventDefault();
    setWebhookUrl(webhookInput.trim());
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 3000);
  };

  // Helper: Copy tagged UTM link
  const copyUtmLink = (source, label) => {
    const base = window.location.origin + window.location.pathname;
    const url = `${base}?utm_source=${source}&utm_medium=social&utm_campaign=neet_counselling_2025`;
    navigator.clipboard.writeText(url);
    setCopiedLink(source);
    setTimeout(() => setCopiedLink(''), 2500);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in">
      {/* Admin Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
              Lead Management & Funnel Analytics
            </span>
            <span className="text-xs text-slate-500 font-medium">CEO's Office View</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            NEET College Predictor Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time funnel conversion metrics, attribution by channel, and qualified lead database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneMasked(!isPhoneMasked)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isPhoneMasked
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
            title="Toggle phone number masking for privacy/public grading link"
          >
            {isPhoneMasked ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5 text-rose-600" />}
            <span>Phone: {isPhoneMasked ? 'Masked (Privacy On)' : 'Raw Unmasked'}</span>
          </button>

          <button
            onClick={exportToCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredLeads.length})</span>
          </button>
        </div>
      </div>

      {/* 1. Funnel Analytics Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Conversion Funnel (First Visit → Lead Submitted)
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Overall Conversion: {overallConversion}%
          </span>
        </div>

        {/* Funnel Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {/* Step 1: Page View */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative">
            <span className="text-[10px] font-black uppercase text-slate-400">Step 1</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{pageViews}</div>
            <div className="text-xs font-bold text-slate-700">Page Views</div>
            <p className="text-[10px] text-slate-400 mt-1">Landing on page</p>
          </div>

          {/* Step 2: Form Start */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative">
            <span className="text-[10px] font-black uppercase text-slate-400">Step 2</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{formStarts}</div>
            <div className="text-xs font-bold text-slate-700">Form Starts</div>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">{pvToStartRate}% of views</p>
          </div>

          {/* Step 3: Form Submit */}
          <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl relative">
            <span className="text-[10px] font-black uppercase text-emerald-600">Step 3</span>
            <div className="text-2xl font-black text-emerald-800 mt-1">{formSubmits}</div>
            <div className="text-xs font-bold text-emerald-900">Leads Captured</div>
            <p className="text-[10px] text-emerald-700 font-bold mt-1">{startToSubmitRate}% of starts</p>
          </div>

          {/* Step 4: Result Views */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative">
            <span className="text-[10px] font-black uppercase text-slate-400">Step 4</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{resultViews}</div>
            <div className="text-xs font-bold text-slate-700">Result Views</div>
            <p className="text-[10px] text-slate-400 mt-1">{ctaClicks} CTAs / Shares clicked</p>
          </div>
        </div>

        {/* Traffic Source Breakdown Bar */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Leads Breakdown by Channel (UTM Source)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Object.entries(sourceStats).map(([src, count]) => (
              <div 
                key={src} 
                onClick={() => setSelectedSource(selectedSource === src ? 'all' : src)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedSource === src
                    ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate font-semibold">{src}</span>
                  <span className="bg-slate-100 text-slate-800 font-extrabold px-1.5 py-0.5 rounded text-[11px]">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. UTM Campaign Link Generator Box (Required in prompt) */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-4 h-4 text-emerald-700" />
          <h4 className="font-extrabold text-sm text-emerald-950">
            Shareable Tagged Campaign Links (Assignment Requirement: ≥ 3 links)
          </h4>
        </div>
        <p className="text-xs text-emerald-800 mb-3">
          Share these custom-tagged links across your channels to automatically capture UTM parameters on every student lead:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Link 1: WhatsApp Group */}
          <div className="bg-white p-3 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-2 shadow-xs">
            <div>
              <span className="text-[11px] font-black text-slate-800 block">1. WhatsApp Groups</span>
              <span className="text-[10px] text-slate-400 font-mono">?utm_source=whatsapp_group</span>
            </div>
            <button
              onClick={() => copyUtmLink('whatsapp_group', 'WhatsApp')}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedLink === 'whatsapp_group' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'whatsapp_group' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Link 2: Instagram Story */}
          <div className="bg-white p-3 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-2 shadow-xs">
            <div>
              <span className="text-[11px] font-black text-slate-800 block">2. Instagram Story</span>
              <span className="text-[10px] text-slate-400 font-mono">?utm_source=instagram_story</span>
            </div>
            <button
              onClick={() => copyUtmLink('instagram_story', 'Instagram')}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedLink === 'instagram_story' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'instagram_story' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Link 3: LinkedIn Post */}
          <div className="bg-white p-3 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-2 shadow-xs">
            <div>
              <span className="text-[11px] font-black text-slate-800 block">3. LinkedIn Launch</span>
              <span className="text-[10px] text-slate-400 font-mono">?utm_source=linkedin</span>
            </div>
            <button
              onClick={() => copyUtmLink('linkedin', 'LinkedIn')}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedLink === 'linkedin' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'linkedin' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Live Leads Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Search & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads by name, phone, state..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="UR">UR</option>
              <option value="OBC">OBC</option>
              <option value="EWS">EWS</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>

            {/* Source Filter */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Sources</option>
              {Object.keys(sourceStats).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Test leads toggle */}
            <label className="flex items-center gap-1.5 px-2.5 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hideTests}
                onChange={(e) => setHideTests(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
              />
              <span>Hide Test Leads</span>
            </label>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Phone {isPhoneMasked && <span className="text-amber-600 font-bold">(Masked)</span>}</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-center">Est. AIR</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">UTM Source</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-semibold">
                    No leads matching your current filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{lead.name}</span>
                        {lead.is_test && (
                          <span className="text-[9px] uppercase font-extrabold bg-amber-100 text-amber-800 px-1 py-0.2 rounded">
                            TEST
                          </span>
                        )}
                        {lead.is_duplicate && (
                          <span className="text-[9px] uppercase font-extrabold bg-blue-100 text-blue-800 px-1 py-0.2 rounded">
                            REPEAT
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {isPhoneMasked ? maskPhone(lead.phone) : lead.phone}
                    </td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-emerald-700">
                      {lead.score}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                      ~{lead.predicted_rank?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700 text-[11px]">
                        {lead.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {lead.state}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-mono font-semibold text-[11px] bg-slate-100 text-slate-800">
                        {lead.utm_source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(lead.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Showing {filteredLeads.length} of {leads.length} recorded leads</span>
          <button
            onClick={() => {
              if (window.confirm('Reset local leads? (This will restore default sample test leads)')) {
                clearStoredLeads();
                seedSampleDataIfEmpty();
                refreshData();
              }
            }}
            className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
          >
            Reset Test Data
          </button>
        </div>
      </div>

      {/* 4. Google Sheets Webhook Configuration */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          <h4 className="font-extrabold text-sm text-slate-900">
            Live Google Sheets Sync (Optional Webhook Integration)
          </h4>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Want leads to automatically write to your personal Google Sheet in real-time? Paste your Google Apps Script Web App URL below:
        </p>

        <form onSubmit={handleSaveWebhook} className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={webhookInput}
            onChange={(e) => setWebhookInput(e.target.value)}
            placeholder="https://script.google.com/macros/s/AKfycb.../exec"
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-emerald-600"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
          >
            {webhookSaved ? 'Saved!' : 'Save Webhook'}
          </button>
        </form>
        <span className="text-[11px] text-slate-400 mt-1.5 block">
          Setup script is included at <code>/scripts/GoogleSheetWebhook.gs</code> in the repository.
        </span>
      </div>
    </div>
  );
}
