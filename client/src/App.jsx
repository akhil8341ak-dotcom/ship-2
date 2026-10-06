import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import FieldsPage from './pages/FieldsPage';
import AdvisoryWizard from './pages/AdvisoryWizard';
import AdvisoryDetail from './pages/AdvisoryDetail';
import DiagnosticPage from './pages/DiagnosticPage';
import MarketPage from './pages/MarketPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fields" element={<FieldsPage />} />
            <Route path="/advisor/new" element={<AdvisoryWizard />} />
            <Route path="/advisor/:id" element={<AdvisoryDetail />} />
            <Route path="/diagnose" element={<DiagnosticPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
          <p>© 2026 AgriWise • AI-Powered Precision Agriculture Crop Advisory Assistant</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
