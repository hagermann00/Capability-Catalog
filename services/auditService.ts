import { Capability, AuditConfig, AuditReport, TagGroupAnalysis, AuditRecommendation } from '../types';

export const generateAuditReport = (capabilities: Capability[], config: AuditConfig): AuditReport => {
  const active = capabilities.filter(c => c.status === 'active' || c.status === 'beta');
  const deprecated = capabilities.filter(c => c.status === 'deprecated');

  // 1. Group by tags
  const tagMap = new Map<string, Capability[]>();
  
  active.forEach(cap => {
    cap.tags.forEach(tag => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag)?.push(cap);
    });
  });

  const tagGroups: TagGroupAnalysis[] = [];

  tagMap.forEach((caps, tag) => {
    if (caps.length === 0) return;

    // Find best in class
    const cheapest = [...caps].sort((a, b) => a.performance.cost_per_1k_tokens_usd - b.performance.cost_per_1k_tokens_usd)[0];
    const fastest = [...caps].sort((a, b) => a.performance.avg_latency_ms - b.performance.avg_latency_ms)[0];
    const bestQuality = [...caps].sort((a, b) => b.performance.quality_score_0_to_1 - a.performance.quality_score_0_to_1)[0];

    const recommendations: AuditRecommendation[] = [];

    // Analyze each cap against cheapest
    caps.forEach(cap => {
      if (cap.id === cheapest.id) return;

      const costDiffRatio = (cap.performance.cost_per_1k_tokens_usd - cheapest.performance.cost_per_1k_tokens_usd) / cheapest.performance.cost_per_1k_tokens_usd;
      const qualityDiff = cheapest.performance.quality_score_0_to_1 - cap.performance.quality_score_0_to_1; // Positive if cheapest is better or similar

      // Logic: If cost is X% higher AND quality is not significantly better (or is worse)
      if (costDiffRatio >= config.audit.min_cost_saving_ratio_for_flag) {
        // Check if quality justifies the cost. If cheapest is within margin or better, flag it.
        // If the expensive one is WAY better (qualityDiff < -margin), we might ignore.
        // Here we flag if cheapest is "good enough" (quality within margin)
        
        // qualityDiff > -0.05 means cheapest is at most 0.05 worse, or better.
        if (qualityDiff > -config.audit.min_quality_difference_for_flag) {
           const monthlyVolume = cap.usage.estimated_monthly_calls || (config.default_monthly_calls_per_tag[tag] || 1000);
           // Assuming 1k tokens per call for rough calc
           const savingsPerCall = (cap.performance.cost_per_1k_tokens_usd - cheapest.performance.cost_per_1k_tokens_usd); // per 1k tokens
           const potentialSavings = savingsPerCall * monthlyVolume;

           recommendations.push({
             capabilityId: cap.id,
             betterAlternativeId: cheapest.id,
             reason: `Cost is ${(costDiffRatio * 100).toFixed(0)}% higher than ${cheapest.id} with similar quality.`,
             potentialSavings
           });
        }
      }
    });

    tagGroups.push({
      tag,
      cheapest,
      fastest,
      bestQuality,
      recommendations
    });
  });

  return {
    timestamp: new Date().toISOString(),
    totalCapabilities: capabilities.length,
    activeCount: active.length,
    deprecatedCount: deprecated.length,
    deprecatedItems: deprecated,
    tagGroups: tagGroups.sort((a, b) => b.recommendations.reduce((acc, r) => acc + r.potentialSavings, 0) - a.recommendations.reduce((acc, r) => acc + r.potentialSavings, 0))
  };
};