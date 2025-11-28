import React from 'react';
import { Capability } from '../types';

interface CapabilityDetailsProps {
  capability: Capability;
  onClose: () => void;
}

export const CapabilityDetails: React.FC<CapabilityDetailsProps> = ({ capability, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-[slideIn_0.3s_ease-out]">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wider
                  ${capability.status === 'active' ? 'bg-green-100 text-green-700' : 
                    capability.status === 'beta' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'}`}>
                  {capability.status}
                </span>
                <span className="text-slate-500 text-sm font-mono">{capability.type}</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">{capability.name}</h2>
              <p className="font-mono text-sm text-slate-500 mt-1">{capability.id}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Overview</h3>
              <p className="text-slate-700 leading-relaxed">{capability.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {capability.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Provider</h3>
                <p className="font-semibold text-slate-800">{capability.provider}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Owner</h3>
                <p className="font-semibold text-slate-800">{capability.owner}</p>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Performance Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">Cost (1k tokens)</div>
                  <div className="text-xl font-mono font-bold text-slate-900">${capability.performance.cost_per_1k_tokens_usd}</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">Latency (avg)</div>
                  <div className="text-xl font-mono font-bold text-slate-900">{capability.performance.avg_latency_ms}ms</div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">Quality Score</div>
                  <div className="text-xl font-mono font-bold text-slate-900">{capability.performance.quality_score_0_to_1}</div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Usage & Integration</h3>
              <div className="bg-slate-900 text-slate-300 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="mb-2">
                  <span className="text-purple-400">estimated_monthly_calls:</span> {capability.usage.estimated_monthly_calls}
                </div>
                <div>
                  <span className="text-purple-400">used_by_services:</span>
                  <ul className="pl-4 mt-1 list-disc list-inside text-slate-400">
                    {capability.usage.used_by_services.map(svc => <li key={svc}>{svc}</li>)}
                  </ul>
                </div>
              </div>
            </section>
            
            {capability.notes && (
               <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Engineer Notes</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800 italic">
                  {capability.notes}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Raw Configuration</h3>
              <pre className="bg-slate-50 text-slate-500 text-xs p-4 rounded border border-slate-200 overflow-x-auto whitespace-pre-wrap font-mono">
{`id: ${capability.id}
type: ${capability.type}
version: ${capability.version}
provider: ${capability.provider}
alternatives: [${capability.alternatives.join(', ')}]`}
              </pre>
            </section>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};