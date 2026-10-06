import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  MapPin, 
  Sparkles, 
  Camera, 
  TrendingUp, 
  ShieldAlert, 
  Plus, 
  ArrowRight,
  Activity,
  Layers,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import FieldCard from '../components/FieldCard';
import WeatherWidget from '../components/WeatherWidget';

export default function Dashboard() {
  const { convertArea, t } = useLanguage();

  const { data: fields = [], isLoading: fieldsLoading } = useQuery({
    queryKey: ['fields'],
    queryFn: api.getFields,
  });

  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ['marketInsights'],
    queryFn: api.getMarketInsights,
  });

  const { data: diagnostics = [] } = useQuery({
    queryKey: ['diagnosticsHistory'],
    queryFn: api.getDiagnosticsHistory,
  });

  const primaryField = fields[0] || null;
  const weather = marketData?.fieldForecast ? {
    locationName: primaryField?.location_name || 'Sacramento Basin Region',
    current: { temperatureC: 26, humidityPct: 64, rainfall24hMm: 12, windSpeedKmH: 14, soilMoisturePct: 34 },
    riskProfile: marketData.weatherRisk || { droughtRisk: 'Low', floodRisk: 'Low' },
    forecast: marketData.fieldForecast
  } : null;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Gemini 2.5 Agricultural Intelligence Engine Active</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              Welcome back, <span className="gradient-text">Agronomist</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Real-time multi-factor analysis active for <strong className="text-emerald-400">{fields.length} registered field parcels</strong>. Monitor NPK soil parameters, disease risks, and market trends.
            </p>
          </div>

          {/* Action Quick Launch Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Link
              to="/advisor/new"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/50 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>New AI Advisory</span>
            </Link>

            <Link
              to="/diagnose"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs sm:text-sm transition-all"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Diagnose Crop</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Weather & Microclimate Overview */}
      <WeatherWidget weather={weather} />

      {/* Registered Fields Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Registered Field Parcels</span>
            </h2>
            <p className="text-xs text-slate-400">Soil NPK profiles and active cultivation status</p>
          </div>

          <Link
            to="/fields"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>View All ({fields.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {fieldsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800" />
            <div className="h-48 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800" />
          </div>
        ) : fields.length === 0 ? (
          <div className="glass-panel p-8 text-center space-y-3">
            <Sprout className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No field parcels registered yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Add your land coordinates and soil NPK test results to generate AI crop recommendations.
            </p>
            <Link
              to="/fields"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Field</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {fields.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        )}
      </div>

      {/* Market Prices Ticker Preview & Recent Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Commodity Market Ticker */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Commodity Market Trends</h3>
            </div>
            <Link to="/market" className="text-xs text-emerald-400 hover:underline">Full Market View &rarr;</Link>
          </div>

          <div className="space-y-2.5">
            {(marketData?.market?.commodityPrices || []).slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <div>
                  <span className="text-xs font-bold text-white block">{c.crop}</span>
                  <span className="text-[10px] text-slate-400">per {c.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-200 font-mono">${c.currentPriceUSD.toFixed(2)}</span>
                  <span className={`text-[10px] font-bold block ${c.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {c.changePct >= 0 ? `+${c.changePct}%` : `${c.changePct}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Disease Diagnostics Scans */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Recent Vision Diagnostics</h3>
            </div>
            <Link to="/diagnose" className="text-xs text-cyan-400 hover:underline">Scan Photo &rarr;</Link>
          </div>

          {diagnostics.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No diagnostic scans recorded yet. Upload a crop photo anytime.
            </div>
          ) : (
            <div className="space-y-2.5">
              {diagnostics.slice(0, 3).map((d) => (
                <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                  <img src={d.image_url} alt="Crop" className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{d.detected_condition}</h4>
                    <p className="text-[10px] text-slate-400">Severity: <strong className="text-amber-400">{d.severity_level}</strong> | Confidence: {(Number(d.confidence_score) * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
