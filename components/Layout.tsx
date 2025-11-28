import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'audit' | 'search';
  onTabChange: (tab: 'dashboard' | 'audit' | 'search') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-tight">CapCatalog<span className="text-blue-400">.git</span></h1>
          <p className="text-xs text-slate-400 mt-1">v0.1.0-mvp</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Capabilities
            </div>
          </button>
          
          <button
            onClick={() => onTabChange('search')}
            className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
              activeTab === 'search' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
             <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search
            </div>
          </button>

          <button
            onClick={() => onTabChange('audit')}
            className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
              activeTab === 'audit' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Audit Report
            </div>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-2 py-2 text-sm text-slate-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            System Operational
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto max-h-screen">
        <header className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-10">
          <h2 className="text-2xl font-semibold text-slate-800 capitalize">{activeTab === 'dashboard' ? 'Capability List' : activeTab}</h2>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};