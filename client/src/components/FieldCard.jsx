import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sprout, Droplet, Sparkles, Camera, ArrowRight, Trash2, Edit3, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FieldCard({ field, onDelete, onEdit }) {
  const { convertArea, t } = useLanguage();

  return (
    <div className="glass-panel-interactive p-5 relative group flex flex-col justify-between overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sprout className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {field.name}
              </h3>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              {field.location_name}
            </p>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button 
                onClick={() => onEdit(field)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Edit Field"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(field.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Delete Field"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Area</span>
            <span className="text-sm font-extrabold text-slate-200">{convertArea(field.area_hectares)}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Soil Profile</span>
            <span className="text-sm font-extrabold text-emerald-400">{field.soil_type}</span>
          </div>
        </div>

        {/* NPK & pH Micro Bar */}
        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60 mb-4">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-400 font-medium">NPK (PPM):</span>
            <span className="font-mono font-bold text-slate-200">
              <span className="text-emerald-400">{field.nitrogen_ppm}</span> - 
              <span className="text-blue-400"> {field.phosphorus_ppm}</span> - 
              <span className="text-purple-400"> {field.potassium_ppm}</span>
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">pH Level:</span>
            <span className="font-semibold text-amber-400">{field.ph_level} ({field.irrigation_type} Irrigation)</span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
        <Link
          to={`/advisor/new?fieldId=${field.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Advisory</span>
        </Link>

        <Link
          to={`/diagnose?fieldId=${field.id}`}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors"
          title="Scan Plant Health"
        >
          <Camera className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
