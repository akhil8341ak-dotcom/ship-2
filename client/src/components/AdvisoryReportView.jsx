import React, { useState, useRef } from 'react';
import { 
  Sprout, 
  FlaskConical, 
  Droplets, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  Award,
  Sparkles,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PdfExportButton from './PdfExportButton';
import SoilMetricGauge from './SoilMetricGauge';

export default function AdvisoryReportView({ advisory, field }) {
  const { convertYield, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('crops');
  const reportRef = useRef(null);

  if (!advisory) return null;

  const crops = advisory.recommended_crops || advisory.recommendedCrops || [];
  const fertilizers = advisory.fertilizer_schedule || advisory.fertilizerSchedule || [];
  const irrigation = advisory.irrigation_plan || advisory.irrigationPlan || {};
  const risks = advisory.risk_assessment || advisory.riskAssessment || {};

  return (
    <div className="space-y-6">
      {/* Action Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('crops')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'crops'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Recommended Crops</span>
          </button>

          <button
            onClick={() => setActiveTab('fertilizer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'fertilizer'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm shadow-blue-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Fertilizer Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('irrigation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'irrigation'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Irrigation Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('risks')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'risks'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Risk Matrix</span>
          </button>
        </div>

        {/* PDF Export Button */}
        <PdfExportButton 
          targetRef={reportRef} 
          filename={`AgriWise_Advisory_${field?.name || 'Field'}.pdf`}
        />
      </div>

      {/* Main Printable Printable Report Area */}
      <div ref={reportRef} className="glass-panel p-6 sm:p-8 space-y-8 bg-slate-950 border border-slate-800">
        
        {/* Printable Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">AI Precision Crop Advisory Report</h2>
            </div>
            <p className="text-xs text-slate-400">
              Field: <strong className="text-slate-200">{field?.name || advisory.field_name}</strong> | Season: <strong className="text-emerald-400">{advisory.season}</strong> | Generated: {new Date(advisory.created_at || Date.now()).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Soil Type</span>
              <span className="font-bold text-white">{field?.soil_type || 'Loamy'}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px]">NPK Baseline</span>
              <span className="font-bold text-emerald-400">{field?.nitrogen_ppm || 140}-{field?.phosphorus_ppm || 45}-{field?.potassium_ppm || 190}</span>
            </div>
          </div>
        </div>

        {/* TAB 1: RECOMMENDED CROPS */}
        {(activeTab === 'crops' || activeTab === 'all') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">1. Multi-Factor AI Recommended Crops</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {crops.map((crop, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-500/20">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-white">{crop.cropName}</h4>
                        <span className="text-xs text-emerald-400 font-medium">
                          Projected Yield: {convertYield(crop.projectedYieldPerHectareKg)}
                        </span>
                      </div>
                    </div>

                    {/* Suitability Gauge Pill */}
                    <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400">Suitability:</span>
                      <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" 
                          style={{ width: `${crop.suitabilityScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-emerald-400">{crop.suitabilityScore}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                    <strong className="text-slate-200">Agronomic Reasoning: </strong> {crop.reasoning}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                    <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Economic Viability: {crop.economicViability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FERTILIZER SCHEDULE */}
        {(activeTab === 'fertilizer' || activeTab === 'all') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">2. Precision Fertilization & Supplementation Schedule</h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Growth Stage</th>
                    <th className="p-3.5 text-center text-emerald-400">Nitrogen (N)</th>
                    <th className="p-3.5 text-center text-blue-400">Phosphorus (P)</th>
                    <th className="p-3.5 text-center text-purple-400">Potassium (K)</th>
                    <th className="p-3.5">Application Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                  {fertilizers.map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">{f.growthStage}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-emerald-400">{f.nitrogenKgHa} kg/ha</td>
                      <td className="p-3.5 text-center font-mono font-bold text-blue-400">{f.phosphorusKgHa} kg/ha</td>
                      <td className="p-3.5 text-center font-mono font-bold text-purple-400">{f.potassiumKgHa} kg/ha</td>
                      <td className="p-3.5 text-slate-300">{f.applicationMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SMART IRRIGATION PLAN */}
        {(activeTab === 'irrigation' || activeTab === 'all') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">3. Smart Irrigation & Water Management Plan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Weekly Water Requirement</span>
                  <span className="text-sm font-extrabold text-cyan-400 font-mono">
                    {(irrigation.weeklyWaterRequirementLitersPerHa || 32000).toLocaleString()} Liters/Ha
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                  <span className="text-xs text-slate-400">Watering Frequency</span>
                  <span className="text-sm font-bold text-white">
                    Every {irrigation.wateringFrequencyDays || 3} Days
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 block">Drought Mitigation Strategy</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {irrigation.droughtMitigationTip || "Apply organic mulch to retain soil moisture and reduce evapotranspiration."}
                </p>
              </div>
            </div>

            {irrigation.criticalGrowthStages && (
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                <span className="text-xs font-bold text-slate-200 block mb-2">Critical Moisture Growth Stages:</span>
                <div className="flex flex-wrap gap-2">
                  {irrigation.criticalGrowthStages.map((stage, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 text-xs border border-cyan-500/20 font-medium">
                      💧 {stage}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RISK ASSESSMENT */}
        {(activeTab === 'risks' || activeTab === 'all') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">4. Comprehensive Pest, Disease & Climate Risk Matrix</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> High Priority Disease Risks
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {(risks.diseaseRisks || ["Fungal Blight", "Leaf Spot"]).map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Potential Pest Infestations
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {(risks.pestRisks || ["Corn Earworm", "Aphids"]).map((p, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <span className="text-xs font-bold text-emerald-400 block">Agronomic Mitigation Strategy:</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {risks.mitigationStrategy || "Deploy integrated pest management (IPM) practices and maintain proper field spacing."}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
