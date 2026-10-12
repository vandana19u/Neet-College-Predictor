// Predictor logic for NEET 2025 AIQ MBBS College Predictor
import { scoreToRankPoints } from '../data/scoreToRank.js';
import { colleges } from '../data/colleges.js';

// Sorted anchor points descending by score
const anchorPoints = [...scoreToRankPoints].sort((a, b) => b.score - a.score);

/**
 * Linearly interpolate score to All India Rank (AIR)
 * Rule:
 * 1. Convert score to estimated AIR by linear interpolation between the two nearest anchor points in the score-to-rank file.
 * 2. If score >= top anchor (686), interpolate/extrapolate to rank 1.
 * 3. If score < bottom anchor (144), extrapolate gracefully down to 0 (approx 22 lakh total aspirants).
 */
export function estimateAir(score) {
  const numericScore = Math.max(0, Math.min(720, Math.round(Number(score) || 0)));

  // If score is above or equal to highest anchor (686)
  if (numericScore >= 686) {
    if (numericScore === 720) return 1;
    return 1;
  }

  // If score is below lowest anchor (144)
  if (numericScore <= 144) {
    // Extrapolate between 144 (AIR 1,236,000) and 0 (AIR 2,200,000)
    const p1 = { score: 144, air: 1236000 };
    const p0 = { score: 0, air: 2200000 };
    const air = p1.air + ((numericScore - p1.score) / (p0.score - p1.score)) * (p0.air - p1.air);
    return Math.round(air);
  }

  // Find the two nearest anchor points that bracket the score
  for (let i = 0; i < anchorPoints.length - 1; i++) {
    const higher = anchorPoints[i];     // e.g. score 625, air 450
    const lower = anchorPoints[i + 1];  // e.g. score 600, air 1300

    if (numericScore <= higher.score && numericScore >= lower.score) {
      if (higher.score === lower.score) return higher.air;
      const ratio = (numericScore - higher.score) / (lower.score - higher.score);
      const interpolatedAir = higher.air + ratio * (lower.air - higher.air);
      return Math.round(interpolatedAir);
    }
  }

  return 1236000;
}

/**
 * Predict colleges for a given score, category, and home state
 * Bucketing logic:
 * - Safe: estimated AIR <= 85% of closing rank (AIR <= 0.85 * closing_rank)
 * - Moderate: between 85% and 100% of closing rank (0.85 * closing_rank < AIR <= 1.0 * closing_rank)
 * - Reach: between 100% and 115% of closing rank (1.0 * closing_rank < AIR <= 1.15 * closing_rank)
 * - Above 115%: not shown
 *
 * Rules:
 * - Max 10 colleges per bucket
 * - Sorted by closing rank (ascending: hardest/top rank first)
 * - Badge colleges matching student's home state
 */
export function predictColleges(score, category, homeState) {
  const estimatedAir = estimateAir(score);

  // Map category to data key: General -> UR, UR -> UR, etc.
  const catKey = category === 'General' || category === 'UR' ? 'UR' : category;

  const safe = [];
  const moderate = [];
  const reach = [];

  colleges.forEach((col) => {
    const closingRank = col.closing_rank_2025[catKey];
    if (!closingRank) return;

    const ratio = estimatedAir / closingRank;
    const isHomeState = homeState && col.state.trim().toLowerCase() === homeState.trim().toLowerCase();

    const collegeWithMeta = {
      ...col,
      closingRank,
      categoryUsed: catKey,
      isHomeState,
      ratio,
      // Margin: positive means AIR is better (lower number) than cutoff
      margin: closingRank - estimatedAir,
      // Percentage margin buffer: e.g. +23% safe or -8% reach
      marginPercent: Math.round(((closingRank - estimatedAir) / closingRank) * 100),
    };

    // Safe: estimated AIR at or below 85% of closing rank
    if (ratio <= 0.85) {
      safe.push(collegeWithMeta);
    }
    // Moderate: between 85% and 100% of closing rank
    else if (ratio > 0.85 && ratio <= 1.0) {
      moderate.push(collegeWithMeta);
    }
    // Reach: between 100% and 115% of closing rank
    else if (ratio > 1.0 && ratio <= 1.15) {
      reach.push(collegeWithMeta);
    }
    // Above 115%: not shown
  });

  // Sort each bucket by closing rank (ascending: top closing rank first)
  safe.sort((a, b) => a.closingRank - b.closingRank);
  moderate.sort((a, b) => a.closingRank - b.closingRank);
  reach.sort((a, b) => a.closingRank - b.closingRank);

  return {
    estimatedAir,
    score: Number(score),
    category: catKey,
    homeState,
    safe: safe.slice(0, 10),
    moderate: moderate.slice(0, 10),
    reach: reach.slice(0, 10),
    totalSafeMatches: safe.length,
    totalModerateMatches: moderate.length,
    totalReachMatches: reach.length,
  };
}
