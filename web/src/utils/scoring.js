export function calculateAccessibilityScore(location) {
  const featureScore = Math.min((location.features?.length || 0) * 12, 60);
  const ratingScore = Math.round((Number(location.rating || 0) / 5) * 30);
  const verifiedScore = location.verified ? 10 : 0;
  return Math.min(featureScore + ratingScore + verifiedScore, 100);
}
