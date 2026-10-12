import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ScoreForm from './components/ScoreForm.jsx';
import LeadModal from './components/LeadModal.jsx';
import ResultsView from './components/ResultsView.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import DisclaimerFooter from './components/DisclaimerFooter.jsx';
import { predictColleges } from './utils/predictor.js';
import { logEvent, getStoredLeads, seedSampleDataIfEmpty } from './utils/analytics.js';

export default function App() {
  const [currentView, setCurrentView] = useState('predictor'); // 'predictor' | 'admin'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [predictionResults, setPredictionResults] = useState(null);
  const [capturedLead, setCapturedLead] = useState(null);
  const [leadCount, setLeadCount] = useState(0);

  // Initialize page view and initial counts
  useEffect(() => {
    seedSampleDataIfEmpty();
    setLeadCount(getStoredLeads().length);

    // Fire page_view event as required by tracking spec
    logEvent('page_view');

    const handleLeadUpdate = () => {
      setLeadCount(getStoredLeads().length);
    };

    window.addEventListener('neetprep_lead_saved', handleLeadUpdate);
    return () => window.removeEventListener('neetprep_lead_saved', handleLeadUpdate);
  }, []);

  // When user clicks "Predict My Colleges" on the main score form
  const handleScoreFormSubmit = (data) => {
    setPendingFormData(data);
    setIsModalOpen(true);
  };

  // When user successfully submits the lead form (Name + Phone)
  const handleLeadCaptureSuccess = (lead) => {
    setCapturedLead(lead);
    setIsModalOpen(false);

    // Calculate colleges using prediction logic
    const results = predictColleges(lead.score, lead.category, lead.state);
    setPredictionResults(results);

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to search another score
  const handleReset = () => {
    setPredictionResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Sticky Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        leadCount={leadCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-2">
        {currentView === 'admin' ? (
          <AdminDashboard onBackToPredictor={() => setCurrentView('predictor')} />
        ) : (
          <>
            {/* If Results are NOT unlocked yet */}
            {!predictionResults ? (
              <div className="max-w-2xl mx-auto">
                <Hero />
                <ScoreForm
                  onFormComplete={handleScoreFormSubmit}
                  initialValues={pendingFormData || {}}
                />
              </div>
            ) : (
              /* If Results ARE unlocked after lead form submission */
              <ResultsView
                results={predictionResults}
                leadInfo={capturedLead}
                onReset={handleReset}
              />
            )}
          </>
        )}

        {/* Mandatory Data Disclaimer Footer */}
        <DisclaimerFooter />
      </main>

      {/* Lead Capture Modal (Must-have: Results show ONLY after lead is captured) */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={pendingFormData || {}}
        onSuccess={handleLeadCaptureSuccess}
      />
    </div>
  );
}
