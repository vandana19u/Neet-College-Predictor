# Product Requirement Document (PRD): NEET College Predictor (MVP)

**Role:** Associate, CEO's Office, NEETprep  
**Author:** Candidate (Take-Home Assignment)  
**Date:** October 2026  
**Status:** Shipped (Live)

---

### 1. Problem Statement
Every year, ~22-24 lakh students appear for NEET UG. After results, aspirants and their anxious parents search Google, YouTube, and Telegram asking: *"With my score and category, which government medical college can I get?"* They know their raw marks and category, but MCC counselling seat allotments occur strictly by **All India Rank (AIR)**.

Without clear, accessible cutoff tools, students face extreme anxiety and fragmented counselling misinformation. For NEETprep, a high-trust, fast, and transparent college predictor is one of the highest-intent organic lead acquisition engines in ed-tech.

### 2. Target User & Persona
- **Primary Persona:** NEET Aspirant (17–20 years old) or parent (42–50 years old).
- **Environment:** Mid-range Android smartphone (e.g. Redmi, Realme, Samsung M-series), often on mobile data (3G/4G). Low patience, high anxiety.
- **Mental Model:** Knows their exact score (0–720), reservation category (UR/OBC/EWS/SC/ST), and home state. Does **not** know their exact All India Rank or MCC closing ranks.

### 3. Business Goal & Core Success Metric
- **Business Objective:** Maximize high-intent, qualified student leads (Name + Phone + Score + Category + State) at the lowest possible drop-off between landing and submitting the form.
- **North Star Metric:** **Visitor-to-Lead Conversion Rate (Page View → Lead Submit)**.
- **Target:** **≥ 45%** on mobile traffic.
- **Secondary Quality Metric:** Lead validity rate (≥ 90% valid 10-digit Indian mobile numbers without duplicates).

---

### 4. MVP Scope (What We Shipped)
1. **Zero-Friction Mobile Input (Step 1):**
   - Single-screen responsive inputs for Score (0–720), Category (UR, OBC, EWS, SC, ST), and Home State.
   - Real-time AIR calculation preview (via linear interpolation across 18 anchor points).
2. **Progressive Lead Capture Gate (Step 2):**
   - Modal trigger upon clicking *"Predict My Colleges"*.
   - Name + 10-digit Indian mobile number validation (`/^[6-9]\d{9}$/`).
   - Phone deduplication check and one-line privacy consent notice.
   - Full attribution capture: `utm_source`, `utm_medium`, `utm_campaign`, timestamp, device.
3. **Actionable Results View (Step 3):**
   - Estimated AIR banner.
   - 3-bucket categorization: **Safe** ($\le 85\%$ cutoff), **Moderate** ($85\% - 100\%$), **Reach** ($100\% - 115\%$), capped at 10 colleges/bucket sorted by closing rank.
   - **Home-State Badge** for colleges in the student's state.
   - Helpful empty state recommending 85% State Quota counselling if no AIQ matches qualify.
4. **Growth & Conversion Loops:**
   - Pre-filled *"Share on WhatsApp"* button with viral referral UTM tag.
   - High-intent *"Free NEETprep Counselling Call"* consultation CTA.
5. **Real-time Funnel Analytics & Admin Lead Desk:**
   - Embedded `/admin` dashboard tracking `page_view` $\rightarrow$ `form_start` $\rightarrow$ `form_submit` $\rightarrow$ `result_view` $\rightarrow$ `cta_click`.
   - Toggleable **Masked Phone Number** view for privacy and grading reviews.
   - One-click CSV export and Google Sheets Webhook sync.

---

### 5. What We Cut & Why (Deliberate Trade-offs)
| Feature Cut | Why It Was Cut from MVP |
| :--- | :--- |
| **Mandatory SMS OTP Verification** | Drop-off on SMS OTP in Tier-2/3 India is ~35–50% due to network latency and SMS gateway limits. Instead, we implemented strict client-side regex (`/^[6-9]\d{9}$/`), duplicate-phone detection, and consent opt-in. |
| **85% State Quota College Seat Matrices** | State quota seat matrices vary wildly across 28 states and separate state counseling portals (e.g. KEA, DMET, CET). Attempting to scrape all 28 states would delay launch. Instead, we prioritized 15% AIQ and added state guidance in the empty state. |
| **User Authentication / Accounts** | Requiring sign-up creates friction and kills viral sharing. Students want an immediate answer. Lead storage in CRM/Sheets gives sales reps everything needed without forcing passwords. |
| **Private & Deemed College Predictor** | AIQ government college prediction targets the highest-intent tier of aspirants. Fee structures in private/deemed colleges require a different qualification filter (budget-based). |

---

### 6. Success Metrics Tracking Table
| Funnel Milestone | Event Tracked | Benchmark | Target |
| :--- | :--- | :--- | :--- |
| **Landing** | `page_view` | 100% | 100% |
| **Engagement** | `form_start` | ~70% | ≥ 75% |
| **Lead Submission** | `form_submit` | ~35% | ≥ 45% |
| **Results Delivered** | `result_view` | ~98% of submits | 100% |
| **Viral Sharing / CTA** | `cta_click` | ~5% | ≥ 12% |
