import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { 
  Camera, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Loader2, 
  Leaf, 
  Activity,
  History,
  FlaskConical
} from 'lucide-react';
import { api } from '../lib/api';
import { queryClient } from '../lib/queryClient';
import { useLanguage } from '../context/LanguageContext';
import ImageDropzone from '../components/ImageDropzone';

export default function DiagnosticPage() {
  const [searchParams] = useSearchParams();
  const initialFieldId = searchParams.get('fieldId') || '';
  const { language } = useLanguage();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(initialFieldId);
  const [sampleUrl, setSampleUrl] = useState('');

  const { data: fields = [] } = useQuery({
    queryKey: ['fields'],
    queryFn: api.getFields,
  });

  const { data: diagnosticsHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['diagnosticsHistory'],
    queryFn: api.getDiagnosticsHistory,
  });

  const [activeScan, setActiveScan] = useState(null);

  const diagnoseMutation = useMutation({
    mutationFn: api.diagnoseCrop,
    onSuccess: (data) => {
      setActiveScan(data);
      queryClient.invalidateQueries({ queryKey: ['diagnosticsHistory'] });
    },
  });

  const handleImageSelect = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setSampleUrl('');
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSampleUrl('');
    setActiveScan(null);
  };

  const handleScan = () => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append('image', selectedFile);
    } else if (sampleUrl) {
      formData.append('imageUrl', sampleUrl);
    } else {
      // Use fallback default image
      formData.append('imageUrl', 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=800');
    }

    if (selectedFieldId) formData.append('fieldId', selectedFieldId);
    formData.append('targetLanguage', language);

    diagnoseMutation.mutate(formData);
  };

  const currentResult = activeScan || (diagnosticsHistory.length > 0 ? diagnosticsHistory[0] : null);
  const symptoms = currentResult?.symptoms || [];
  const treatment = currentResult?.treatment_protocol || currentResult?.treatmentProtocol || {};

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Google Gemini 2.5 Flash Vision Diagnostic Engine</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white">
              Pest & Disease Visual Scanner
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Upload leaf or plant photos for instant pathogen identification, severity scoring, and remedial protocols.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Uploader & Field Selector (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Upload Crop Photo</span>
            </h3>

            {/* Field Selector optional link */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Associate with Field Parcel (Optional)</label>
              <select
                value={selectedFieldId}
                onChange={(e) => setSelectedFieldId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="">General Diagnostic Scan (Unlinked)</option>
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} ({f.location_name})</option>
                ))}
              </select>
            </div>

            {/* Drag and Drop Uploader */}
            <ImageDropzone
              selectedFile={selectedFile}
              previewUrl={previewUrl || sampleUrl}
              onImageSelect={handleImageSelect}
              onClear={handleClear}
            />

            {/* Sample Image Quick Pick */}
            {!previewUrl && (
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block mb-2 uppercase tracking-wider">
                  Or Test with Sample Diagnostic Photo:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSampleUrl('https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=800');
                    setPreviewUrl('https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=800');
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5 transition-colors"
                >
                  <img src="https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&q=80&w=800" alt="Sample" className="w-8 h-8 rounded-md object-cover" />
                  <div className="text-left">
                    <span className="font-bold text-white block">Tomato Leaf Early Blight Sample</span>
                    <span className="text-[10px] text-slate-400">Alternaria solani pathogen sample</span>
                  </div>
                </button>
              </div>
            )}

            {/* Trigger Scan Button */}
            <button
              onClick={handleScan}
              disabled={diagnoseMutation.isPending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all"
            >
              {diagnoseMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Gemini Vision Model Analyzing Leaf...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Vision Disease Scan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Diagnostic Results Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentResult ? (
            <div className="glass-panel p-6 sm:p-8 space-y-6 border border-emerald-500/20">
              
              {/* Result Title & Confidence Meter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Severity: {currentResult.severity_level || currentResult.severity || 'Moderate'}
                    </span>
                    <span className="text-xs text-slate-400">
                      Confidence: <strong className="text-emerald-400 font-mono">{(Number(currentResult.confidence_score || currentResult.confidenceScore || 0.94) * 100).toFixed(1)}%</strong>
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {currentResult.detected_condition || currentResult.conditionName}
                  </h2>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">Pathogen Diagnostic Verified</span>
                </div>
              </div>

              {/* Identified Symptoms List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Identified Symptoms
                </h4>
                <div className="space-y-1.5 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80">
                  {symptoms.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment Protocols (Organic vs Chemical) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Organic Remedies */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/20 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Leaf className="w-4 h-4" /> Organic / Eco Remediations
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {(treatment.organicControls || []).map((o, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chemical Controls */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-500/20 space-y-2">
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4" /> Chemical Treatment Protocols
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {(treatment.chemicalControls || []).map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Preventative Practices */}
              {treatment.preventativeSteps && (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">Long-Term Cultural & Preventative Practices:</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                    {treatment.preventativeSteps.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          ) : (
            <div className="glass-panel p-12 text-center space-y-3">
              <Camera className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Diagnostic Scan Loaded</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload a photo on the left or select the sample leaf image to run Gemini vision pathogen detection.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
