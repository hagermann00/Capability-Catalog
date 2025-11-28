import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { CapabilityDetails } from './components/CapabilityDetails';
import { generateAuditReport } from './services/auditService';
import { MOCK_CAPABILITIES, MOCK_CONFIG } from './data';
import { Capability } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'audit' | 'search'>('dashboard');
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  // Derived Data
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    MOCK_CAPABILITIES.forEach(c => c.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, []);

  const filteredCapabilities = useMemo(() => {
    return MOCK_CAPABILITIES.filter(cap => {
      const matchesSearch = 
        cap.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cap.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cap.provider.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = activeTagFilter ? cap.tags.includes(activeTagFilter) : true;
      
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, activeTagFilter]);

  const auditReport = useMemo(() => generateAuditReport(MOCK_CAPABILITIES, MOCK_CONFIG), []);
  const selectedCapability = useMemo(() => MOCK_CAPABILITIES.find(c => c.id === selectedCapabilityId), [selectedCapabilityId]);

  // View Components

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex-1 min-w-[200px]">
          <div className="text-slate-500 text-sm font-medium mb-1">Total Capabilities</div>
          <div className="text-3xl font-bold text-slate-900">{MOCK_CAPABILITIES.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex-1 min-w-[200px]">
          <div className="text-slate-500 text-sm font-medium mb-1">Active</div>
          <div className="text-3xl font-bold text-green-600">{MOCK_CAPABILITIES.filter(c => c.status === 'active').length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex-1 min-w-[200px]">
           <div className="text-slate-500 text-sm font-medium mb-1">Deprecated</div>
          <div className="text-3xl font-bold text-red-500">{MOCK_CAPABILITIES.filter(c => c.status === 'deprecated').length}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-semibold text-slate-700">All Capabilities</h3>
          <div className="text-xs text-slate-500 font-mono">Sources: local/yaml</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">ID / Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Cost ($/1k)</th>
                <th className="px-6 py-3">Latency</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CAPABILITIES.map((cap) => (
                <tr key={cap.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{cap.name}</div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">{cap.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {cap.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${cap.status === 'active' ? 'bg-green-50 text-green-700' : 
                        cap.status === 'beta' ? 'bg-yellow-50 text-yellow-700' : 
                        'bg-red-50 text-red-700'}`}>
                      {cap.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">
                    ${cap.performance.cost_per_1k_tokens_usd}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">
                    {cap.performance.avg_latency_ms}ms
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedCapabilityId(cap.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline"
                    >
                      View YAML
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SearchView = () => (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by ID, Name, or Provider..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
           onClick={() => setActiveTagFilter(null)}
           className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
             activeTagFilter === null ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
           }`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTagFilter(tag === activeTagFilter ? null : tag)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTagFilter === tag ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCapabilities.map(cap => (
          <div key={cap.id} className="bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedCapabilityId(cap.id)}>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">{cap.type}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  cap.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cap.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{cap.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 h-10">{cap.description}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400 mb-1">Cost</div>
                  <div className="font-mono font-medium">${cap.performance.cost_per_1k_tokens_usd}</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Quality</div>
                  <div className="font-mono font-medium">{cap.performance.quality_score_0_to_1}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCapabilities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No capabilities found matching your criteria.</p>
        </div>
      )}
    </div>
  );

  const AuditView = () => (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Capability Audit Report</h1>
        <p className="text-slate-500 font-mono mb-6">{new Date(auditReport.timestamp).toLocaleDateString()} • Automated Analysis</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
             <div className="text-2xl font-bold text-slate-800">{auditReport.totalCapabilities}</div>
             <div className="text-xs text-slate-500 uppercase tracking-wide">Total</div>
           </div>
           <div className="p-4 bg-red-50 rounded border border-red-100 text-center">
             <div className="text-2xl font-bold text-red-600">{auditReport.deprecatedCount}</div>
             <div className="text-xs text-red-400 uppercase tracking-wide">Deprecated</div>
           </div>
           <div className="p-4 bg-yellow-50 rounded border border-yellow-100 text-center">
             <div className="text-2xl font-bold text-yellow-600">
                {auditReport.tagGroups.reduce((acc, g) => acc + g.recommendations.length, 0)}
             </div>
             <div className="text-xs text-yellow-600 uppercase tracking-wide">Flags</div>
           </div>
           <div className="p-4 bg-green-50 rounded border border-green-100 text-center">
             <div className="text-2xl font-bold text-green-600">
               ${auditReport.tagGroups.reduce((acc, g) => acc + g.recommendations.reduce((s, r) => s + r.potentialSavings, 0), 0).toFixed(2)}
             </div>
             <div className="text-xs text-green-600 uppercase tracking-wide">Potential Savings</div>
           </div>
        </div>

        {/* Deprecated Section */}
        {auditReport.deprecatedItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Deprecated Capabilities
            </h2>
            <div className="bg-red-50 rounded-lg border border-red-100 overflow-hidden">
               {auditReport.deprecatedItems.map(item => (
                 <div key={item.id} className="p-4 border-b border-red-100 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-red-900 font-mono text-sm">{item.id}</div>
                        <div className="text-red-700 text-sm mt-1">Used by: <span className="font-mono">{item.usage.used_by_services.join(', ') || 'None'}</span></div>
                      </div>
                      <button onClick={() => setSelectedCapabilityId(item.id)} className="text-xs bg-white border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-50">Details</button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Tag Analysis Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Optimization Opportunities</h2>
          {auditReport.tagGroups.map(group => (
            <div key={group.tag} className="mb-8 last:mb-0">
              <h3 className="text-md font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Tag: {group.tag}
              </h3>
              
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                {/* Benchmark Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="block text-slate-400 mb-1">Cheapest</span>
                    <span className="font-mono font-bold text-green-600">{group.cheapest.id}</span>
                    <span className="block text-slate-400 font-mono">${group.cheapest.performance.cost_per_1k_tokens_usd}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 mb-1">Fastest</span>
                    <span className="font-mono font-bold text-blue-600">{group.fastest.id}</span>
                    <span className="block text-slate-400 font-mono">{group.fastest.performance.avg_latency_ms}ms</span>
                  </div>
                   <div className="col-span-2">
                    <span className="block text-slate-400 mb-1">Highest Quality</span>
                    <span className="font-mono font-bold text-purple-600">{group.bestQuality.id}</span>
                    <span className="block text-slate-400 font-mono">{group.bestQuality.performance.quality_score_0_to_1} score</span>
                  </div>
                </div>

                {/* Recommendations */}
                {group.recommendations.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {group.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="font-bold text-slate-800 font-mono text-sm">{rec.capabilityId}</span>
                               <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                               <span className="font-bold text-green-600 font-mono text-sm">{rec.betterAlternativeId}</span>
                            </div>
                            <p className="text-sm text-slate-600">{rec.reason}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-slate-400 uppercase">Est. Monthly Savings</div>
                            <div className="text-lg font-bold text-green-600">${rec.potentialSavings.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-400 italic">
                    No obvious cost inefficiencies detected in this group.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} onTabChange={(t) => {
      setActiveTab(t);
      if (t !== 'search') {
        setSearchQuery('');
        setActiveTagFilter(null);
      }
    }}>
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'search' && <SearchView />}
      {activeTab === 'audit' && <AuditView />}
      
      {selectedCapability && (
        <CapabilityDetails 
          capability={selectedCapability} 
          onClose={() => setSelectedCapabilityId(null)} 
        />
      )}
    </Layout>
  );
}

export default App;