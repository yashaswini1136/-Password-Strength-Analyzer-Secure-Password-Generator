import { useState } from 'react';
import { Header, type NavTab } from './components/Header';
import { Footer } from './components/Footer';
import { AnalyzerPage } from './pages/Analyzer';
import { GeneratorPage } from './pages/Generator';
import { SecurityGuidePage } from './pages/SecurityGuide';
import { AboutPage } from './pages/About';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('analyzer');
  const [testPasswordInAnalyzer, setTestPasswordInAnalyzer] = useState<string>('');

  const handleSendToAnalyzer = (password: string) => {
    setTestPasswordInAnalyzer(password);
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToGenerator = () => {
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans cyber-grid selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Cybersecurity Top Glow Accent */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-32 bg-emerald-500/10 blur-[120px] pointer-events-none -z-10" />

      {/* Persistent Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'analyzer' && (
          <AnalyzerPage
            key={testPasswordInAnalyzer} // ensure re-render if updated from generator
            initialPassword={testPasswordInAnalyzer}
            onNavigateToGenerator={handleNavigateToGenerator}
          />
        )}

        {activeTab === 'generator' && (
          <GeneratorPage onSendToAnalyzer={handleSendToAnalyzer} />
        )}

        {activeTab === 'guide' && <SecurityGuidePage />}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Persistent Footer with Zero-Knowledge Privacy Mandate */}
      <Footer onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
