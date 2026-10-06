import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Languages, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2,
  Sprout,
  Activity
} from 'lucide-react';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import SoilMetricGauge from '../components/SoilMetricGauge';

export default function AdvisoryWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFieldId = searchParams.get('fieldId') || '';
  const { language: currentLang } = useLanguage();

  const [step, setStep] = useState(1);
  const [selectedFieldId, setSelectedFieldId] = useState(initialFieldId);
  const [season, setSeason] = useState('Summer');
  const [targetLanguage, setTargetLanguage] = useState(currentLang);

  const { data: fields = [], isLoading: fieldsLoading } = useQuery({
    queryKey: ['fields'],
    queryFn: api.getFields,
  });

  // Set default selected field if not set
  useEffect(() => {
    if (!selectedFieldId && fields.length > 0) {
      setSelectedFieldId(fields[0].id);
    }
  }, [fields, selectedFieldId]);

  const selectedField = fields.find((f) => f.id === selectedFieldId) || fields[0] || null;

  const generateMutation = useMutation({
    mutationFn: api.generateAdvisory,
    onSuccess: (data) => {
      navigate(`/advisor/${data.id}`);
    },
  });

  const handleGenerate = () => {
    if (!selectedFieldId) return;
    generateMutation.mutate({
      fieldId: selectedFieldId,
      season,
      targetLanguage
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step {step} of 3 • AI Advisory Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Generate AI Precision Crop Advisory
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Google Gemini 2.5 Pro processes field soil chemistry, NPK metrics, and seasonal microclimate patterns.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between max-w-xs mx-auto text-xs font-bold">
        <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-emerald-400' : 'text-slate-600'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>1</div>
          <span>Select Field</span>
        </div>
        <div className={`h-0.5 flex-1 mx-2 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
        <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>2</div>
          <span>Season & Lang</span>
        </div>
        <div className={`h-0.5 flex-1 mx-2 ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
        <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-emerald-400' : 'text-slate-600'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>3</div>
          <span>Review & AI</span>
        </div>
      </div>

      {/* STEP 1: SELECT FIELD */}
      {step === 1 && (
        <div className="glass-panel p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>1. Choose Land Parcel / Field Profile</span>
            </h3>
          </div>

          {fieldsLoading ? (
            <div className="h-32 rounded-xl bg-slate-900 animate-pulse" />
          ) : fields.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No fields registered yet. Please create a field first.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {fields.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFieldId(f.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    selectedFieldId === f.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-950/30'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedFieldId === f.id ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{f.name}</h4>
                      <p className="text-xs text-slate-400">{f.location_name} • {f.soil_type} Soil</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400">{f.area_hectares} Ha</span>
                    <span className="text-[10px] text-slate-500 block">pH {f.ph_level}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedFieldId}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2"
            >
              <span>Next: Season & Language</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CULTIVATION SEASON & LANGUAGE */}
      {step === 2 && (
        <div className="glass-panel p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>2. Select Cultivation Season & Target Language</span>
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Target Cultivation Season *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Spring', 'Summer', 'Autumn', 'Winter', 'Monsoon', 'Dry Season'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeason(s)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      season === s
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Output Language *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { code: 'en', name: 'English' },
                  { code: 'es', name: 'Español (Spanish)' },
                  { code: 'hi', name: 'हिंदी (Hindi)' },
                  { code: 'sw', name: 'Kiswahili' },
                  { code: 'fr', name: 'Français (French)' }
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setTargetLanguage(l.code)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      targetLanguage === l.code
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2"
            >
              <span>Next: Review & Run AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & GENERATE */}
      {step === 3 && (
        <div className="glass-panel p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>3. Confirm Field Parameters & Trigger AI</span>
            </h3>
          </div>

          {selectedField && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedField.name}</h4>
                  <p className="text-xs text-slate-400">{selectedField.location_name} • Season: {season}</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Target Language: {targetLanguage.toUpperCase()}
                </span>
              </div>

              <SoilMetricGauge 
                nitrogenPpm={selectedField.nitrogen_ppm} 
                phosphorusPpm={selectedField.phosphorus_ppm} 
                potassiumPpm={selectedField.potassium_ppm} 
                phLevel={selectedField.ph_level} 
                organicMatterPct={selectedField.organic_matter_pct} 
              />
            </div>
          )}

          {generateMutation.isPending ? (
            <div className="p-8 text-center space-y-4 bg-emerald-950/20 rounded-2xl border border-emerald-500/30">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Google Gemini 2.5 Pro standardizing advisory...</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Running multi-factor crop suitability scoring, NPK supplementation modeling, and microclimate risk matrix calculation.
              </p>
            </div>
          ) : (
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleGenerate}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-sm font-extrabold shadow-xl shadow-emerald-950/50 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>Generate Precision Advisory Now</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
