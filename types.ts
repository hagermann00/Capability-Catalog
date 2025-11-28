export type CapabilityType = 'model' | 'tool' | 'pipeline' | 'service';
export type CapabilityStatus = 'active' | 'beta' | 'deprecated';

export interface CapabilityPerformance {
  cost_per_1k_tokens_usd: number;
  avg_latency_ms: number;
  quality_score_0_to_1: number;
}

export interface CapabilityUsage {
  estimated_monthly_calls: number;
  used_by_services: string[];
}

export interface CapabilityLinks {
  docs_url: string | null;
  repo_url: string | null;
  runbook_url: string | null;
}

export interface CapabilityInterfaces {
  input: Record<string, string>[];
  output: Record<string, string>[];
}

export interface Capability {
  id: string;
  name: string;
  type: CapabilityType;
  provider: string;
  description: string;
  tags: string[];
  status: CapabilityStatus;
  version: string;
  owner: string;
  interfaces: CapabilityInterfaces;
  performance: CapabilityPerformance;
  usage: CapabilityUsage;
  links: CapabilityLinks;
  alternatives: string[];
  notes: string;
}

export interface AuditConfig {
  default_monthly_calls_per_tag: Record<string, number>;
  currency: string;
  audit: {
    min_quality_difference_for_flag: number;
    min_cost_saving_ratio_for_flag: number;
  };
}

export interface TagGroupAnalysis {
  tag: string;
  cheapest: Capability;
  fastest: Capability;
  bestQuality: Capability;
  recommendations: AuditRecommendation[];
}

export interface AuditRecommendation {
  capabilityId: string;
  reason: string;
  potentialSavings: number;
  betterAlternativeId: string;
}

export interface AuditReport {
  timestamp: string;
  totalCapabilities: number;
  activeCount: number;
  deprecatedCount: number;
  deprecatedItems: Capability[];
  tagGroups: TagGroupAnalysis[];
}