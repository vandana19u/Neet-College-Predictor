# NEET 2025 College Predictor (with Lead Capture)

A mobile-friendly web tool built for NEET UG aspirants and parents to estimate their All India Rank (AIR) and see which 15% All India Quota (AIQ) government medical colleges they are likely to get, while capturing qualified leads for NEETprep.

- **Live URL:** [https://vandana19u.github.io/Neet-College-Predictor/](https://vandana19u.github.io/Neet-College-Predictor/)
- **Built for:** Take-Home Assignment (Associate, CEO's Office at NEETprep)

---

## What this does

Every year after NEET results, over 20 lakh students know their marks (e.g. 605/720) and category, but MCC seat allotment happens strictly on All India Rank. 

This tool solves that gap in three steps:
1. **Instant Rank Estimation:** Takes the student's score (0–720) and linearly interpolates it across the 18 anchor points provided in the dataset to calculate an estimated AIR in real time.
2. **Low-Friction Lead Capture:** Shows the user their estimated rank right away as a preview, but gates the detailed college shortlist behind a short lead form (Name + 10-digit Indian mobile number).
3. **Safe / Moderate / Reach Categorization:** Compares the predicted rank against 2025 closing ranks of 50 government medical colleges across UR, OBC, EWS, SC, and ST categories.
   - **Safe:** AIR $\le$ 85% of closing cutoff (high certainty).
   - **Moderate:** 85% to 100% of closing cutoff (realistic round 2 / mop-up target).
   - **Reach:** 100% to 115% of closing cutoff (borderline / stray vacancy).
   - Colleges within the student's home state get a "Home State" tag.
   - If a student scores below AIQ qualifying cutoffs, instead of an empty screen, it shows clear advice pointing them toward 85% State Quota counselling and semi-government options with a callback button.

---

## Analytics & Lead Management

The assignment requires end-to-end funnel visibility and attribution tracking:

- **Events Tracked:** `page_view` $\rightarrow$ `form_start` $\rightarrow$ `form_submit` $\rightarrow$ `result_view` $\rightarrow$ `cta_click` (WhatsApp share and mentor callback clicks).
- **Attribution:** Captures `utm_source`, `utm_medium`, and `utm_campaign` from URL query parameters. Includes pre-tagged helper links in the admin view for WhatsApp groups, Instagram stories, and LinkedIn.
- **Admin Dashboard (`/admin` or via the top header):**
  - Live conversion funnel with step-by-step drop-off percentages.
  - Channel-wise lead breakdown.
  - Leads table with a **Phone Masking toggle** (`98201*****`) for privacy when sharing snapshots publicly.
  - One-click CSV export.
  - Optional Google Apps Script webhook integration (`scripts/GoogleSheetWebhook.gs`) to pipe leads directly into a Google Sheet in real time.

---

## Tech Stack & Design Choices

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide icons.
- **Why Vite + React?** Kept the total gzipped bundle size under 100 KB so the page loads in less than 1.5 seconds on mid-range Android devices on mobile data.
- **Why progressive lead gating?** Asking for a phone number immediately on page load usually triggers a 50%+ bounce rate. By letting students input their score and category first and seeing their rank preview, intent is already built before the phone number is asked.

---

## Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/vandana19u/Neet-College-Predictor.git
cd Neet-College-Predictor

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

To test the production build:
```bash
npm run build
npm run preview
```

---

## How AI Was Used

As encouraged by the assignment prompt:
- Used AI coding assistants to quickly scaffold the React component boilerplate and Tailwind layout.
- Used AI to sanity-check the linear interpolation formula and edge cases (scores $\ge 686$ and scores $< 144$).
- Refined the UX copy, empty-state guidance, and the 3-minute Loom presentation script.

---

## Repository Files

- `src/utils/predictor.js` — Rank interpolation and Safe/Moderate/Reach college bucketing logic.
- `src/utils/analytics.js` — Event logger, UTM parameter parser, and localStorage lead store.
- `src/components/AdminDashboard.jsx` — Built-in funnel analytics, masked lead desk, and CSV exporter.
- `scripts/GoogleSheetWebhook.gs` — Ready-to-use Google Apps Script to receive leads in Google Sheets.
- `PRD.md` — Half-page PRD document covering problem, MVP scope, trade-offs, and metrics.
- `LOOM_SCRIPT.md` — Timed 3-minute video walkthrough script.
