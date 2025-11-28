import { Capability, AuditConfig } from './types';

export const MOCK_CONFIG: AuditConfig = {
  default_monthly_calls_per_tag: {
    summarization: 50000,
    embeddings: 100000,
  },
  currency: 'USD',
  audit: {
    min_quality_difference_for_flag: 0.05,
    min_cost_saving_ratio_for_flag: 0.2,
  },
};

export const MOCK_CAPABILITIES: Capability[] = [
  {
    id: 'text-summarizer-gpt4o',
    name: 'GPT-4o Summarizer',
    type: 'model',
    provider: 'openai',
    description: 'General-purpose text summarization via GPT-4o.',
    tags: ['summarization', 'text', 'general'],
    status: 'active',
    version: '1.0.0',
    owner: 'platform-team',
    interfaces: {
      input: [{ text: 'string' }],
      output: [{ summary: 'string' }],
    },
    performance: {
      cost_per_1k_tokens_usd: 0.005,
      avg_latency_ms: 1200,
      quality_score_0_to_1: 0.9,
    },
    usage: {
      estimated_monthly_calls: 50000,
      used_by_services: ['customer-support-api', 'internal-reporting-tool'],
    },
    links: {
      docs_url: 'https://internal-wiki/summarizer-gpt4o',
      repo_url: 'https://github.com/org/service-repo',
      runbook_url: null,
    },
    alternatives: ['text-summarizer-claude3-sonnet'],
    notes: 'Primary choice for high-fidelity summaries.',
  },
  {
    id: 'text-summarizer-claude3-sonnet',
    name: 'Claude 3 Sonnet Summarizer',
    type: 'model',
    provider: 'anthropic',
    description: 'Balanced text summarization using Claude 3 Sonnet.',
    tags: ['summarization', 'text'],
    status: 'active',
    version: '1.2.0',
    owner: 'platform-team',
    interfaces: {
      input: [{ text: 'string' }],
      output: [{ summary: 'string' }],
    },
    performance: {
      cost_per_1k_tokens_usd: 0.003,
      avg_latency_ms: 1400,
      quality_score_0_to_1: 0.92,
    },
    usage: {
      estimated_monthly_calls: 10000,
      used_by_services: ['experimental-bot'],
    },
    links: {
      docs_url: 'https://internal-wiki/summarizer-claude',
      repo_url: null,
      runbook_url: null,
    },
    alternatives: ['text-summarizer-gpt4o'],
    notes: 'Cheaper alternative, very strong performance.',
  },
  {
    id: 'text-summarizer-legacy-gpt3',
    name: 'Legacy GPT-3 Summarizer',
    type: 'model',
    provider: 'openai',
    description: 'Old summarizer pipeline.',
    tags: ['summarization', 'text'],
    status: 'deprecated',
    version: '0.9.0',
    owner: 'legacy-team',
    interfaces: {
      input: [{ text: 'string' }],
      output: [{ summary: 'string' }],
    },
    performance: {
      cost_per_1k_tokens_usd: 0.02,
      avg_latency_ms: 800,
      quality_score_0_to_1: 0.75,
    },
    usage: {
      estimated_monthly_calls: 5000,
      used_by_services: ['legacy-reporting-tool'],
    },
    links: {
      docs_url: null,
      repo_url: null,
      runbook_url: null,
    },
    alternatives: ['text-summarizer-gpt4o'],
    notes: 'Do not use for new projects.',
  },
  {
    id: 'embeddings-generator-xyz',
    name: 'XYZ Cloud Embeddings',
    type: 'model',
    provider: 'xyzcloud',
    description: 'Fast embeddings for RAG.',
    tags: ['embeddings', 'vector'],
    status: 'active',
    version: '2.0.0',
    owner: 'search-team',
    interfaces: {
      input: [{ text: 'string' }],
      output: [{ vector: 'float[]' }],
    },
    performance: {
      cost_per_1k_tokens_usd: 0.001,
      avg_latency_ms: 200,
      quality_score_0_to_1: 0.85,
    },
    usage: {
      estimated_monthly_calls: 100000,
      used_by_services: ['search-api', 'recommendation-engine'],
    },
    links: {
      docs_url: 'https://internal-wiki/embeddings',
      repo_url: null,
      runbook_url: null,
    },
    alternatives: [],
    notes: 'Extremely fast, good enough for keyword search.',
  },
  {
    id: 'embeddings-generator-openai-small',
    name: 'OpenAI Embeddings Small',
    type: 'model',
    provider: 'openai',
    description: 'Standard OpenAI embeddings.',
    tags: ['embeddings', 'vector'],
    status: 'active',
    version: '3.0.0',
    owner: 'search-team',
    interfaces: {
      input: [{ text: 'string' }],
      output: [{ vector: 'float[]' }],
    },
    performance: {
      cost_per_1k_tokens_usd: 0.0005,
      avg_latency_ms: 300,
      quality_score_0_to_1: 0.88,
    },
    usage: {
      estimated_monthly_calls: 20000,
      used_by_services: ['knowledge-base'],
    },
    links: {
      docs_url: null,
      repo_url: null,
      runbook_url: null,
    },
    alternatives: ['embeddings-generator-xyz'],
    notes: 'Very cheap.',
  }
];