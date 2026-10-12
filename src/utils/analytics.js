// Analytics & Lead Tracking Manager for NEETprep College Predictor

const STORAGE_KEY_LEADS = 'neetprep_leads_v1';
const STORAGE_KEY_EVENTS = 'neetprep_events_v1';
const STORAGE_KEY_WEBHOOK = 'neetprep_webhook_url';

/**
 * Detect device type
 */
export function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

/**
 * Extract UTM and referral parameters from the current URL
 */
export function getUtmParams() {
  if (typeof window === 'undefined') {
    return {
      utm_source: 'direct',
      utm_medium: 'none',
      utm_campaign: 'none',
      utm_term: '',
      utm_content: '',
      referrer: 'direct',
    };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const utm_source = searchParams.get('utm_source') || 'direct';
  const utm_medium = searchParams.get('utm_medium') || 'none';
  const utm_campaign = searchParams.get('utm_campaign') || 'none';
  const utm_term = searchParams.get('utm_term') || '';
  const utm_content = searchParams.get('utm_content') || '';
  const referrer = document.referrer ? new URL(document.referrer).hostname : 'direct';

  return {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer,
  };
}

/**
 * Categorize score into analytical score band
 */
export function getScoreBand(score) {
  const s = Number(score);
  if (s >= 650) return '650-720 (Tier-1 AIIMS/Top Govt)';
  if (s >= 600) return '600-649 (High Govt MBBS Chance)';
  if (s >= 550) return '550-599 (Moderate Govt MBBS Chance)';
  if (s >= 500) return '500-549 (Borderline Govt / State Quota)';
  if (s >= 400) return '400-499 (Reserved/State Quota Focused)';
  return '<400 (Deemed / BDS / State Cutoff)';
}

/**
 * Log an event to localStorage and forward to any configured webhook or console
 */
export function logEvent(eventName, properties = {}) {
  const utm = getUtmParams();
  const device = getDeviceType();

  const eventPayload = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    event: eventName,
    properties: {
      ...utm,
      device,
      ...properties,
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const existingEvents = JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS) || '[]');
    existingEvents.push(eventPayload);
    // Keep last 500 events
    if (existingEvents.length > 500) existingEvents.shift();
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(existingEvents));
  } catch (err) {
    console.warn('Could not persist event to localStorage', err);
  }

  // Also notify listeners for real-time admin view updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('neetprep_event_logged', { detail: eventPayload }));
  }

  // If external webhook is configured (e.g. Google Sheets, Zapier), fire async
  dispatchWebhook('event', eventPayload);

  return eventPayload;
}

/**
 * Save lead to persistent storage and optional webhook
 */
export async function saveLead(leadData) {
  const utm = getUtmParams();
  const id = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  const leadRecord = {
    id,
    name: leadData.name.trim(),
    phone: leadData.phone.trim(),
    score: Number(leadData.score),
    category: leadData.category,
    state: leadData.state,
    predicted_rank: leadData.predicted_rank,
    score_band: getScoreBand(leadData.score),
    timestamp,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    device: getDeviceType(),
    is_test: Boolean(leadData.is_test || leadData.phone.startsWith('0000') || leadData.name.toLowerCase().includes('test')),
  };

  try {
    const existingLeads = JSON.parse(localStorage.getItem(STORAGE_KEY_LEADS) || '[]');
    // Check duplicate phone in existing leads
    const isDuplicate = existingLeads.some((l) => l.phone === leadRecord.phone);
    leadRecord.is_duplicate = isDuplicate;

    existingLeads.unshift(leadRecord);
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(existingLeads));
  } catch (err) {
    console.warn('Could not persist lead to localStorage', err);
  }

  // Fire form_submit event
  logEvent('form_submit', {
    score_band: leadRecord.score_band,
    category: leadRecord.category,
    state: leadRecord.state,
    predicted_rank: leadRecord.predicted_rank,
    utm_source: leadRecord.utm_source,
    is_duplicate: leadRecord.is_duplicate,
  });

  // Dispatch to Google Sheets / Webhook if configured
  await dispatchWebhook('lead', leadRecord);

  // Notify UI
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('neetprep_lead_saved', { detail: leadRecord }));
  }

  return leadRecord;
}

/**
 * Retrieve all leads
 */
export function getStoredLeads() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_LEADS) || '[]');
  } catch {
    return [];
  }
}

/**
 * Retrieve all logged events
 */
export function getStoredEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS) || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear leads / reset (for testing)
 */
export function clearStoredLeads() {
  localStorage.removeItem(STORAGE_KEY_LEADS);
  window.dispatchEvent(new CustomEvent('neetprep_lead_saved'));
}

/**
 * Seed initial mock/sample data if empty so admin dashboard looks complete on first demo
 */
export function seedSampleDataIfEmpty() {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_LEADS) || '[]');
    if (existing.length === 0) {
      const sampleLeads = [
        {
          id: 'lead_sample_1',
          name: 'Aarav Mehta',
          phone: '9820123456',
          score: 642,
          category: 'UR',
          state: 'Maharashtra',
          predicted_rank: 210,
          score_band: '600-649 (High Govt MBBS Chance)',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          utm_source: 'whatsapp_group',
          utm_medium: 'social',
          utm_campaign: 'neet_counselling_2025',
          device: 'Mobile',
          is_test: false,
          is_duplicate: false,
        },
        {
          id: 'lead_sample_2',
          name: 'Ananya Sharma',
          phone: '9811456789',
          score: 585,
          category: 'OBC',
          state: 'Delhi',
          predicted_rank: 3100,
          score_band: '550-599 (Moderate Govt MBBS Chance)',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          utm_source: 'instagram_story',
          utm_medium: 'social',
          utm_campaign: 'bio_link',
          device: 'Mobile',
          is_test: false,
          is_duplicate: false,
        },
        {
          id: 'lead_sample_3',
          name: 'Rohan Verma',
          phone: '9799234567',
          score: 605,
          category: 'EWS',
          state: 'Rajasthan',
          predicted_rank: 1180,
          score_band: '600-649 (High Govt MBBS Chance)',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          utm_source: 'linkedin',
          utm_medium: 'social',
          utm_campaign: 'post_launch',
          device: 'Desktop',
          is_test: false,
          is_duplicate: false,
        },
        {
          id: 'lead_sample_4',
          name: 'Test Candidate',
          phone: '9999900000',
          score: 600,
          category: 'UR',
          state: 'Delhi',
          predicted_rank: 1300,
          score_band: '600-649 (High Govt MBBS Chance)',
          timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
          utm_source: 'direct',
          utm_medium: 'none',
          utm_campaign: 'none',
          device: 'Mobile',
          is_test: true,
          is_duplicate: false,
        }
      ];
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(sampleLeads));

      // Also seed matching events for funnel analytics
      const sampleEvents = [
        { id: 'evt_1', event: 'page_view', properties: { utm_source: 'whatsapp_group', device: 'Mobile' }, timestamp: new Date(Date.now() - 3600000 * 6).toISOString() },
        { id: 'evt_2', event: 'form_start', properties: { utm_source: 'whatsapp_group', device: 'Mobile' }, timestamp: new Date(Date.now() - 3600000 * 5.8).toISOString() },
        { id: 'evt_3', event: 'form_submit', properties: { utm_source: 'whatsapp_group', category: 'UR', score_band: '600-649' }, timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
        { id: 'evt_4', event: 'result_view', properties: { safe_count: 10, moderate_count: 2, reach_count: 1 }, timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
        { id: 'evt_5', event: 'page_view', properties: { utm_source: 'instagram_story', device: 'Mobile' }, timestamp: new Date(Date.now() - 3600000 * 4).toISOString() },
        { id: 'evt_6', event: 'form_start', properties: { utm_source: 'instagram_story', device: 'Mobile' }, timestamp: new Date(Date.now() - 3600000 * 3.8).toISOString() },
        { id: 'evt_7', event: 'form_submit', properties: { utm_source: 'instagram_story', category: 'OBC', score_band: '550-599' }, timestamp: new Date(Date.now() - 3600000 * 3).toISOString() },
        { id: 'evt_8', event: 'result_view', properties: { safe_count: 8, moderate_count: 3, reach_count: 2 }, timestamp: new Date(Date.now() - 3600000 * 3).toISOString() },
        { id: 'evt_9', event: 'cta_click', properties: { cta_type: 'whatsapp_share' }, timestamp: new Date(Date.now() - 3600000 * 2.8).toISOString() },
        { id: 'evt_10', event: 'page_view', properties: { utm_source: 'linkedin', device: 'Desktop' }, timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString() },
        { id: 'evt_11', event: 'form_start', properties: { utm_source: 'linkedin', device: 'Desktop' }, timestamp: new Date(Date.now() - 3600000 * 2.2).toISOString() },
        { id: 'evt_12', event: 'form_submit', properties: { utm_source: 'linkedin', category: 'EWS', score_band: '600-649' }, timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
        { id: 'evt_13', event: 'result_view', properties: { safe_count: 10, moderate_count: 1, reach_count: 2 }, timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
        { id: 'evt_14', event: 'page_view', properties: { utm_source: 'direct', device: 'Mobile' }, timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString() },
        { id: 'evt_15', event: 'form_start', properties: { utm_source: 'direct', device: 'Mobile' }, timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString() },
        { id: 'evt_16', event: 'form_submit', properties: { utm_source: 'direct', category: 'UR', score_band: '600-649' }, timestamp: new Date(Date.now() - 3600000 * 1).toISOString() },
        { id: 'evt_17', event: 'result_view', properties: { safe_count: 10, moderate_count: 1, reach_count: 1 }, timestamp: new Date(Date.now() - 3600000 * 1).toISOString() },
      ];
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(sampleEvents));
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Configure external webhook URL (e.g., Google Apps Script)
 */
export function setWebhookUrl(url) {
  localStorage.setItem(STORAGE_KEY_WEBHOOK, url);
}

export function getWebhookUrl() {
  return localStorage.getItem(STORAGE_KEY_WEBHOOK) || '';
}

/**
 * Dispatch data to webhook if configured
 */
async function dispatchWebhook(type, data) {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'no-cors', // standard for Google Apps Script Webhooks
      body: JSON.stringify({ type, data, timestamp: new Date().toISOString() }),
    });
  } catch (err) {
    console.warn('Webhook dispatch failed:', err);
  }
}

/**
 * Mask Indian phone numbers for public links / privacy
 * E.g., 9820123456 -> 98201***** or 98****3456
 */
export function maskPhone(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 10) {
    return cleaned.slice(0, 5) + '*****';
  }
  return '*****';
}
