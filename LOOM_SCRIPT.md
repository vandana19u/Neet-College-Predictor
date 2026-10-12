# 3-Minute Loom Demo Script: NEET College Predictor

**Target Duration:** 3 minutes (180 seconds)  
**Presenter:** Candidate (Associate, CEO's Office)  
**Goal:** Deliver a sharp, structured product walkthrough showcasing technical execution, strategic product intuition, and commercial intent.

---

### [0:00 – 0:35] Part 1: Product Demo & User Journey
* **On Screen:** Mobile responsive view in Chrome DevTools (or on a mobile device).
* **Script:**
  > *"Hi Gurkirat and the NEETprep team! Today I'm excited to walk you through our live NEET 2025 College Predictor.
  > 
  > Every year after NEET results, 22+ lakh students are stressed asking: 'Which medical college can I get with my marks?' They know their score and category, but seat allotments happen by All India Rank.
  > 
  > Here's our solution: Designed strictly mobile-first for a student or parent on a mid-range phone. 
  > 
  > I'll enter a score—say 600—select 'UR' category, and 'Maharashtra' as my home state. Notice the instant feedback: our interpolation engine estimates their rank at ~1,300 AIR in real time.
  > 
  > When they tap 'Predict My Colleges', we trigger a high-intent, low-friction lead capture modal. We ask for their name and 10-digit mobile number with immediate validation and clear privacy consent.
  > 
  > Once submitted, boom—the results unlock instantly! They see their predicted AIR (1,300), their safety summary (10 Safe, 1 Moderate, 1 Reach), and clear college cards sorted by closing rank. Look at KEM Mumbai—it automatically gets a 'Home State' badge because the student is from Maharashtra! And at the bottom, we provide a 1-tap WhatsApp share button with tagged UTM parameters, plus a direct CTA to book a free 1-on-1 NEETprep counselling mentorship session."*

---

### [0:35 – 1:20] Part 2: Funnel Tracking & Admin Dashboard
* **On Screen:** Click *"Leads & Analytics"* in the header.
* **Script:**
  > *"Now let's switch hats to the CEO's office. A lead capture tool is only as good as its attribution and conversion funnel.
  > 
  > Clicking 'Leads & Analytics' opens our real-time admin dashboard.
  > 
  > Here, we track every stage of the user journey: Page Views, Form Starts, Form Submissions, and Result Views. You can see our end-to-end conversion rate right at the top.
  > 
  > Below that, we break down leads by acquisition channel—WhatsApp groups, Instagram stories, LinkedIn, or direct links. We even provide pre-tagged UTM links right here so the marketing team can distribute them immediately.
  > 
  > And look at our Leads Table: for privacy and public review links, we built a 1-click **Phone Masking toggle** so reviewer teams can audit the data without exposing personal phone numbers. Evaluators can also filter out test leads or export all leads to CSV in one click."*

---

### [1:20 – 2:05] Part 3: One Decision I Am Proud Of
* **Script:**
  > *"The decision I am most proud of is **the progressive disclosure lead-capture flow**.
  > 
  > Many competitors either put the phone number upfront on landing (which causes ~60% immediate drop-off before the user sees any value) or show all results for free without capturing a number (which generates zero commercial leads).
  > 
  > Instead, we let students enter their score and category first, give them an instant teaser of their estimated rank (~1,300 AIR), and only gate the specific college breakdown behind the mobile number. By the time students hit the submit button, their psychological investment and intent are already at their peak, drastically increasing form conversion while securing qualified phone numbers for NEETprep's counselling team."*

---

### [2:05 – 2:35] Part 4: One Thing That Did Not Work (And How I Solved It)
* **Script:**
  > *"One thing that did not work in our initial prototype was handling the long-tail edge cases in linear rank interpolation.
  > 
  > For scores above 686 (like 710 or 720), or scores below 144 (where students don't qualify under AIQ), a naive linear interpolation would either crash or predict negative ranks.
  > 
  > To solve this, I hardened the interpolation engine to clamp top scores to AIR 1 and gracefully extrapolate lower scores across the 22-lakh aspirant baseline. More importantly, for students whose scores don't qualify for top 50 AIQ colleges, instead of showing an empty blank screen, we built a dedicated guidance state explaining why, and directing them to their state's 85% quota counselling with a free callback CTA. That turned what would have been a high-churn dead-end into another qualified counselling lead."*

---

### [2:35 – 3:00] Part 5: What I Would Build in Week 2
* **Script:**
  > *"If given a second week, I would build three high-impact additions:
  > 1. **State Quota (85%) Seat Matrices for Top 5 States** (Maharashtra, UP, Rajasthan, Bihar, Kerala) to capture the 80% of students who fall just outside AIQ cutoffs.
  > 2. **Instant WhatsApp Bot Delivery:** Use the WhatsApp Cloud API to automatically deliver their personalized PDF college shortlist directly to their phone, establishing an instant 2-way conversation channel for sales reps.
  > 3. **Smart Round-Wise Preference Choice Filler:** A drag-and-drop tool allowing students to export their customized MCC Round 1 Choice Filling list.
  > 
  > Thank you for reviewing the project, and I look forward to discussing how we can scale this at NEETprep!"*
