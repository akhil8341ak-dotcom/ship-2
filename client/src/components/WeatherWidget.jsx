import React from 'react';
import { CloudSun, Sun, CloudRain, Wind, Droplets, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WeatherWidget({ weather }) {
  const { convertTemp } = useLanguage();
  if (!weather) return null;

  const current = weather.current || {};
  const risk = weather.riskProfile || {};
  const forecast = weather.forecast || [];

  const getWeatherIcon = (cond) => {
    switch (cond?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'light rain':
      case 'showers':
        return <CloudRain className="w-5 h-5 text-cyan-400" />;
      default:
        return <CloudSun className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="glass-panel p-5 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Microclimate Weather</h3>
            <p className="text-[11px] text-slate-400">{weather.locationName || 'Sacramento Valley Region'}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold text-white font-mono">
            {convertTemp(current.temperatureC)}
          </div>
          <p className="text-[10px] text-slate-400">Current Field Temp</p>
        </div>
      </div>

      {/* Weather Highlights Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-2.5">
          <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">Humidity</span>
            <span className="text-xs font-bold text-slate-200">{current.humidityPct || 62}%</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-2.5">
          <CloudRain className="w-4 h-4 text-blue-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">Rainfall (24h)</span>
            <span className="text-xs font-bold text-slate-200">{current.rainfall24hMm || 12} mm</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-2.5">
          <Wind className="w-4 h-4 text-teal-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">Wind Speed</span>
            <span className="text-xs font-bold text-slate-200">{current.windSpeedKmH || 14} km/h</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-2.5">
          <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">Soil Moisture</span>
            <span className="text-xs font-bold text-emerald-400">{current.soilMoisturePct || 34}%</span>
          </div>
        </div>
      </div>

      {/* Climate Anomaly & Risk Warning */}
      {risk.climateAnomaly && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <div>
            <span className="font-bold">Climate Indicator: </span>
            <span>{risk.climateAnomaly} (Drought Risk: {risk.droughtRisk}, Flood Risk: {risk.floodRisk})</span>
          </div>
        </div>
      )}

      {/* 7-Day Forecast Micro Strips */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">7-Day Microclimate Outlook</span>
        <div className="grid grid-cols-7 gap-1.5 overflow-x-auto">
          {forecast.map((day, idx) => (
            <div key={idx} className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/50 text-center flex flex-col items-center justify-between hover:border-slate-700 transition-colors">
              <span className="text-[10px] font-bold text-slate-400">{day.day}</span>
              <div className="my-1.5">{getWeatherIcon(day.condition)}</div>
              <span className="text-xs font-extrabold text-slate-200">{convertTemp(day.tempMax)}</span>
              <span className="text-[9px] text-cyan-400 font-semibold">{day.rainProb}% rain</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
