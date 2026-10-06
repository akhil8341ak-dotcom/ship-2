import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, History, Loader2, MapPin } from 'lucide-react';
import { api } from '../lib/api';
import AdvisoryReportView from '../components/AdvisoryReportView';

export default function AdvisoryDetail() {
  const { id } = useParams();

  const { data: advisory, isLoading, isError } = useQuery({
    queryKey: ['advisory', id],
    queryFn: () => api.getAdvisoryById(id),
  });

  const { data: history = [] } = useQuery({
    queryKey: ['advisoryHistory', advisory?.field_id],
    queryFn: () => api.getAdvisoryHistory(advisory.field_id),
    enabled: !!advisory?.field_id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
        <p className="text-xs text-slate-400 font-medium">Loading Advisory Report & Historical Insights...</p>
      </div>
    );
  }

  if (isError || !advisory) {
    return (
      <div className="glass-panel p-8 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Advisory Report Not Found</h3>
        <p className="text-xs text-slate-400">The requested report ID may be invalid or deleted.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const field = {
    name: advisory.field_name,
    location_name: advisory.location_name,
    area_hectares: advisory.area_hectares,
    soil_type: advisory.soil_type,
    ph_level: advisory.ph_level,
    nitrogen_ppm: advisory.nitrogen_ppm,
    phosphorus_ppm: advisory.phosphorus_ppm,
    potassium_ppm: advisory.potassium_ppm
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/fields"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Field List</span>
        </Link>

        {history.length > 1 && (
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400 font-medium">
              Past Advisories: <strong className="text-emerald-400">{history.length} Reports</strong>
            </span>
          </div>
        )}
      </div>

      {/* Main Interactive Advisory Component */}
      <AdvisoryReportView advisory={advisory} field={field} />
    </div>
  );
}
