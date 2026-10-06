import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  LayoutDashboard, 
  MapPin, 
  Sparkles, 
  Camera, 
  TrendingUp, 
  Settings, 
  Languages, 
  Globe, 
  Menu, 
  X 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const location = useLocation();
  const { language, setLanguage, unitSystem, setUnitSystem, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('navDashboard'), icon: LayoutDashboard },
    { path: '/fields', label: t('navFields'), icon: MapPin },
    { path: '/advisor/new', label: t('navWizard'), icon: Sparkles },
    { path: '/diagnose', label: t('navDiagnose'), icon: Camera },
    { path: '/market', label: t('navMarket'), icon: TrendingUp },
    { path: '/settings', label: t('navSettings'), icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 rounded-none bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-400 p-0.5 shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Agri<span className="text-emerald-400">Wise</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI 2.5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Precision Agriculture Assistant
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-950/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Language & Unit System Selectors */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Unit System Toggle */}
            <button
              onClick={() => setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title="Toggle Unit System"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="uppercase text-emerald-400 font-bold">{unitSystem}</span>
            </button>

            {/* Language Dropdown */}
            <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="en" className="bg-slate-900 text-white">English (EN)</option>
                <option value="es" className="bg-slate-900 text-white">Español (ES)</option>
                <option value="hi" className="bg-slate-900 text-white">हिंदी (HI)</option>
                <option value="sw" className="bg-slate-900 text-white">Kiswahili (SW)</option>
                <option value="fr" className="bg-slate-900 text-white">Français (FR)</option>
              </select>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
          
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Language / Units</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric')}
                className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-emerald-400 font-bold uppercase"
              >
                {unitSystem}
              </button>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded px-2 py-1"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="hi">HI</option>
                <option value="sw">SW</option>
                <option value="fr">FR</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
