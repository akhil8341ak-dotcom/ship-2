import React from 'react';
import { Activity, Thermometer, Droplets, Sparkles } from 'lucide-react';

export default function SoilMetricGauge({ nitrogenPpm, phosphorusPpm, potassiumPpm, phLevel, organicMatterPct }) {
  // Normalize NPK levels (Target benchmarks: N: 150 PPM, P: 50 PPM, K: 200 PPM)
  const n = Number(nitrogenPpm || 0);
  const p = Number(phosphorusPpm || 0);
  const k = Number(potassiumPpm || 0);
  const ph = Number(phLevel || 6.5);
  const om = Number(organicMatterPct || 2.5);

  const nPct = Math.min(100, Math.round((n / 200) * 100));
  const pPct = Math.min(100, Math.round((p / 80) * 100));
  const kPct = Math.min(100, Math.round((k / 250) * 100));

  // Determine pH Status & color
  let phStatus = "Neutral (Ideal)";
  let phColor = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  if (ph < 6.0) {
    phStatus = "Acidic Soil";
    phColor = "text-amber-400 border-amber-500/30 bg-amber-500/10";
  } else if (ph > 7.5) {
    phStatus = "Alkaline Soil";
    phColor = "text-blue-400 border-blue-500/30 bg-blue-500/10";
  }

  // Calculate gauge marker for pH (scale 3.0 to 10.0 => 0% to 100%)
  const phGaugePct = Math.min(100, Math.max(0, Math.round(((ph - 3) / 7) * 100)));

  return (
    <div className="space-y-6">
      {/* NPK Health Bars */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> Primary Soil NPK Balance (PPM)
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Lab Test Metrics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Nitrogen Gauge */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-300">Nitrogen (N)</span>
              <span className="text-sm font-extrabold text-emerald-400">{n} <span className="text-[10px] font-normal text-slate-500">PPM</span></span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                style={{ width: `${nPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-400">
              <span>Status: {n < 80 ? 'Low' : n > 160 ? 'High' : 'Optimal'}</span>
              <span>Target: 140 PPM</span>
            </div>
          </div>

          {/* Phosphorus Gauge */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-300">Phosphorus (P)</span>
              <span className="text-sm font-extrabold text-blue-400">{p} <span className="text-[10px] font-normal text-slate-500">PPM</span></span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${pPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-400">
              <span>Status: {p < 25 ? 'Low' : p > 60 ? 'High' : 'Optimal'}</span>
              <span>Target: 45 PPM</span>
            </div>
          </div>

          {/* Potassium Gauge */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/30 transition-all">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-300">Potassium (K)</span>
              <span className="text-sm font-extrabold text-purple-400">{k} <span className="text-[10px] font-normal text-slate-500">PPM</span></span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-400 rounded-full transition-all duration-1000"
                style={{ width: `${kPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-400">
              <span>Status: {k < 120 ? 'Low' : k > 240 ? 'High' : 'Optimal'}</span>
              <span>Target: 180 PPM</span>
            </div>
          </div>

        </div>
      </div>

      {/* pH Balance Visual Scale (3.0 - 10.0) */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">Soil pH Scale</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${phColor}`}>
              {phStatus} ({ph.toFixed(1)})
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Organic Matter: <strong className="text-emerald-400 font-bold">{om}%</strong></span>
        </div>

        {/* Dynamic Spectrum Bar */}
        <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-teal-400 to-indigo-600 my-3">
          {/* Indicator pin */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-5 bg-white rounded-md shadow-lg border-2 border-slate-900 transition-all duration-500 flex items-center justify-center"
            style={{ left: `${phGaugePct}%` }}
          >
            <div className="w-1 h-2 bg-slate-900 rounded-full" />
          </div>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>3.0 (Acidic)</span>
          <span>6.0</span>
          <span>7.0 (Neutral)</span>
          <span>8.0</span>
          <span>10.0 (Alkaline)</span>
        </div>
      </div>
    </div>
  );
}
