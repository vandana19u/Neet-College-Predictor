# 🩺 NEET 2025 College Predictor with Lead Capture

[![Live Predictor](https://img.shields.io/badge/Live_URL-Active-emerald?style=for-the-badge&logo=github)](https://vandana19u.github.io/Neet-College-Predictor/)
[![Mobile First](https://img.shields.io/badge/Mobile-First-blue?style=for-the-badge&logo=android)](https://vandana19u.github.io/Neet-College-Predictor/)
[![License](https://img.shields.io/badge/License-MIT-slate?style=for-the-badge)](LICENSE)

A mobile-first, high-converting NEET UG 2025 Government MBBS College Predictor built for **NEETprep** (Associate, CEO's Office Take-Home Assignment).

---

## 📌 Executive Summary
Every year, over 22 lakh aspirants search for answers on what MBBS college their NEET marks can fetch. This tool solves that anxiety with instant rank estimation, dynamic All India Quota (15%) college predictions grouped into **Safe**, **Moderate**, and **Reach** buckets, while capturing qualified student leads (Name, Phone, Score, Category, State, UTM attribution) with minimal drop-off.

---

## 🚀 Key Features

### 1. Mobile-First Aspirant Journey
- **Rank Estimator Engine:** Instant linear interpolation from raw score (0–720) to estimated All India Rank (AIR) across 18 benchmark anchor points.
- **Progressive Disclosure Lead Gate:** Students input score, category, and state first. The specific college report is gated behind a high-intent modal collecting Name and 10-digit Indian mobile number (`/^[6-9]\d{9}$/`).
- **3-Tier College Bucketing:**
  - 🟢 **Safe:** AIR $\le 85\%$ of closing rank.
  - 🟡 **Moderate:** $85\% < \text{AIR} \le 100\%$ of closing rank.
  - 🔵 **Reach:** $100\% < \text{AIR} \le 115\%$ of closing rank.
  - Capped at top 10 colleges per bucket, sorted by closing rank.
- **Home State Advantage:** Automatic detection and visual badging for colleges situated in the student's home state.
- **Empathetic Empty State:** If no AIQ colleges qualify, guides students toward 85% State Quota counselling and semi-govt options rather than a dead-end.

### 2. High-Conversion Lead Storage & Privacy
- **Lead Capture Fields:** Name, Phone, Score, Category, State, Predicted Rank, Score Band, Timestamp, Device, and Full UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`).
- **Data Privacy & Masking:** Built-in phone number masking toggle (`98201*****`) in the admin table for safe public grading links and data governance.
- **Duplicate Prevention:** In-session deduplication alerts returning students.
- **Lead Storage Options:**
  1. Local persistent storage (`localStorage` & events engine).
  2. One-click CSV export directly from the admin panel.
  3. Real-time Google Sheets Webhook integration via `scripts/GoogleSheetWebhook.gs`.

### 3. Analytics Funnel & Attribution
- Real-time funnel tracking for:
  - `page_view`
  - `form_start`
  - `form_submit`
  - `result_view`
  - `cta_click` (WhatsApp share, free counselling mentorship callback)
- Pre-tagged campaign links for WhatsApp Groups, Instagram Stories, and LinkedIn.

---

## 🛠️ Tech Stack
- **Framework:** React 19 + Vite 6 (Ultra-fast load time, sub-100KB gzip bundle, optimized for mid-range Android on mobile 4G)
- **Styling:** Tailwind CSS v4 (Mobile-first utility design, responsive touch targets)
- **Icons & Visuals:** Lucide React, Canvas Confetti
- **Deployment:** Vercel / Cloudflare Pages / Netlify / GitHub Pages

---

## 📦 How to Run Locally

### Prerequisites
- Node.js 18+ (tested on Node.js 24)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/neetprep-college-predictor.git
cd neetprep-college-predictor

# Install dependencies
npm install

# Start development server
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📊 Where Leads & Analytics Are Stored

1. **In-App Admin Dashboard (`/admin` or top navigation):**
   - Click **"Leads & Analytics"** in the top right header.
   - View visual conversion rates, drop-off analysis, channel attribution, and the full lead registry.
   - Toggle **"Phone: Masked"** to protect privacy when sharing screenshots or live links.
   - Click **"Export CSV"** to download raw leads anytime.
2. **Google Sheets Sync (Optional Real-Time Sync):**
   - A ready-to-deploy Google Apps Script is provided in [`scripts/GoogleSheetWebhook.gs`](./scripts/GoogleSheetWebhook.gs).
   - Paste the script into Google Sheets, deploy as a Web App, and paste the URL in the Admin Dashboard to stream leads live into Google Sheets!

---

## 🤖 Use of AI Disclosure
In accordance with the assignment guidelines, AI (Google DeepMind Antigravity) was used to accelerate development:
- **Code Generation & Scaffold:** Fast-tracked React component composition, Tailwind v4 styling, and responsive layout testing.
- **Mathematical Validation:** Verified linear interpolation logic and bucketing edge cases against the provided 2025 MCC closing rank dataset.
- **Documentation:** Drafted the half-page PRD, Loom demo walkthrough script, and structured README.

---

## 📄 Submission Checklist
- [x] Live URL opens on mobile without errors
- [x] Test submissions appear in lead storage with complete UTM parameters
- [x] Real-time conversion funnel events tracked (`page_view`, `form_start`, `form_submit`, `result_view`, `cta_click`)
- [x] Mandatory data disclaimer rendered on results page
- [x] Half-page PRD included (`PRD.md`)
- [x] 3-Minute Loom demo script included (`LOOM_SCRIPT.md`)
