import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  AlertTriangle, 
  CloudSun, 
  ShieldCheck, 
  DollarSign, 
  Globe, 
  BarChart3 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '../lib/api';

const MOCK_HISTORICAL_PRICES = [
  { month: 'May', Corn: 172, Tomatoes: 380, Soybeans: 510 },
  { month: 'Jun', Corn: 178, Tomatoes: 395, Soybeans: 515 },
  { month: 'Jul', Corn: 181, Tomatoes: 410, Soybeans: 522 },
  { month: 'Aug', Corn: 183, Tomatoes: 405, Soybeans: 528 },
  { month: 'Sep', Corn: 185.5, Tomatoes: 420, Soybeans: 530 },
];

export default function MarketPage() {
  const { data: insightsData, isLoading } = useQuery({
    queryKey: ['marketInsights'],
    queryFn: api.getMarketInsights,
  });

  const market = insightsData?.market || {};
  const prices = market.commodityPrices || [];
  const alerts = market.marketAlerts || [];
  const weatherRisk = insightsData?.weatherRisk || {};

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-emerald-400" />
              <span>Agricultural Market Insights & Risk Matrix</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Localized commodity pricing, futures projections, and microclimate risk warnings.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Last Market Sync</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Climate Risk Matrix Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Regional Drought Risk</span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-emerald-400">{weatherRisk.droughtRisk || 'Low Risk'}</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Flash Flood Alert</span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-cyan-400">{weatherRisk.floodRisk || 'Normal'}</span>
            <CloudSun className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Heat Stress Index</span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-amber-400">{weatherRisk.heatStressRisk || 'Moderate'}</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Commodity Price Trends Chart (Recharts) */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>5-Month Commodity Price Index ($/MT)</span>
          </h3>
          <span className="text-xs text-slate-400">Sacramento & Midwest Exchanges</span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_HISTORICAL_PRICES}>
              <defs>
                <linearGradient id="colorCorn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTomatoes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="Tomatoes" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTomatoes)" name="Roma Tomatoes" />
              <Area type="monotone" dataKey="Corn" stroke="#10b981" fillOpacity={1} fill="url(#colorCorn)" name="Sweet Corn" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Commodity Prices Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Current Commodity Price Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prices.map((item, idx) => (
            <div key={idx} className="glass-panel p-4 flex items-center justify-between hover:border-slate-700 transition-colors">
              <div>
                <h4 className="text-xs font-bold text-white">{item.crop}</h4>
                <p className="text-[10px] text-slate-400">Unit: {item.unit}</p>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-white font-mono">
                  ${item.currentPriceUSD.toFixed(2)}
                </span>
                <span className={`text-[10px] font-bold block ${item.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.changePct >= 0 ? `+${item.changePct}%` : `${item.changePct}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Alerts */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-amber-400" />
          <span>Regional Market & Supply Chain Bulletins</span>
        </h3>

        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <h4 className="text-xs font-bold text-amber-300">{alert.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
