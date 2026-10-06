import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Settings, 
  Globe, 
  Languages, 
  User, 
  Check, 
  Sparkles, 
  Key, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';
import { api } from '../lib/api';
import { queryClient } from '../lib/queryClient';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsPage() {
  const { language, setLanguage, unitSystem, setUnitSystem } = useLanguage();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { data: userProfile } = useQuery({
    queryKey: ['userSettings'],
    queryFn: api.getUserSettings,
  });

  const [fullName, setFullName] = useState(userProfile?.full_name || 'Agronomist Akhil');

  const updateMutation = useMutation({
    mutationFn: api.updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    },
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      fullName,
      preferredLanguage: language,
      unitSystem
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8">
        <h1 className="text-xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-emerald-400" />
          <span>System & Language Preferences</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure multi-language generation, unit conversions, and API key parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* User Profile Info */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Agronomist Profile</span>
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Language & Unit System Settings */}
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Languages className="w-4 h-4 text-emerald-400" />
            <span>Regional Localization & Units</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Default Advisory Language</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { code: 'en', label: 'English (EN)' },
                  { code: 'es', label: 'Español (ES)' },
                  { code: 'hi', label: 'हिंदी (HI)' },
                  { code: 'sw', label: 'Kiswahili (SW)' },
                  { code: 'fr', label: 'Français (FR)' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      language === lang.code
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Measurement Unit System</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    unitSystem === 'metric'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-extrabold text-emerald-400 block">Metric System</span>
                  <span className="text-[10px] text-slate-400">Kilograms/Hectare (kg/ha), Celsius (°C), Millimeters (mm)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    unitSystem === 'imperial'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-extrabold text-emerald-400 block">Imperial System</span>
                  <span className="text-[10px] text-slate-400">Pounds/Acre (lbs/acre), Fahrenheit (°F), Inches</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini API Key Status */}
        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Google Gemini API Configuration</h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Active @google/genai SDK
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Advisory queries execute using <strong className="text-emerald-400">gemini-2.5-pro</strong> (structured outputs) and <strong className="text-cyan-400">gemini-2.5-flash</strong> (vision diagnostics). Configure <code className="text-amber-300 font-mono">GEMINI_API_KEY</code> in server <code className="text-amber-300 font-mono">.env</code> file.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : savedSuccess ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{savedSuccess ? 'Settings Saved!' : 'Save System Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
