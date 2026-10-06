import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, MapPin, X, Sprout, Loader2, Sparkles, SlidersHorizontal } from 'lucide-react';
import { api } from '../lib/api';
import { queryClient } from '../lib/queryClient';
import FieldCard from '../components/FieldCard';
import SoilMetricGauge from '../components/SoilMetricGauge';

export default function FieldsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [soilFilter, setSoilFilter] = useState('All');

  const { data: fields = [], isLoading } = useQuery({
    queryKey: ['fields'],
    queryFn: api.getFields,
  });

  const [formData, setFormData] = useState({
    name: '',
    locationName: '',
    latitude: 38.5816,
    longitude: -121.4944,
    areaHectares: 3.5,
    soilType: 'Loamy',
    nitrogenPpm: 120,
    phosphorusPpm: 40,
    potassiumPpm: 160,
    phLevel: 6.5,
    organicMatterPct: 2.8,
    irrigationType: 'Drip'
  });

  const createMutation = useMutation({
    mutationFn: api.createField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      setShowModal(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.updateField(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      setShowModal(false);
      setEditingField(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      locationName: '',
      latitude: 38.5816,
      longitude: -121.4944,
      areaHectares: 3.5,
      soilType: 'Loamy',
      nitrogenPpm: 120,
      phosphorusPpm: 40,
      potassiumPpm: 160,
      phLevel: 6.5,
      organicMatterPct: 2.8,
      irrigationType: 'Drip'
    });
  };

  const handleEditClick = (field) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      locationName: field.location_name,
      latitude: Number(field.latitude) || 38.5816,
      longitude: Number(field.longitude) || -121.4944,
      areaHectares: Number(field.area_hectares),
      soilType: field.soil_type,
      nitrogenPpm: Number(field.nitrogen_ppm),
      phosphorusPpm: Number(field.phosphorus_ppm),
      potassiumPpm: Number(field.potassium_ppm),
      phLevel: Number(field.ph_level),
      organicMatterPct: Number(field.organic_matter_pct) || 2.5,
      irrigationType: field.irrigation_type
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingField) {
      updateMutation.mutate({ id: editingField.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredFields = soilFilter === 'All' 
    ? fields 
    : fields.filter(f => f.soil_type === soilFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" />
            <span>Field Management & Soil Profiler</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Register land parcels, manage NPK baseline parameters, and track soil fertility levels.
          </p>
        </div>

        <button
          onClick={() => { setEditingField(null); resetForm(); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/40 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Field</span>
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Soil Type:
        </span>
        {['All', 'Sandy', 'Loamy', 'Clay', 'Silt', 'Peat', 'Chalky'].map((type) => (
          <button
            key={type}
            onClick={() => setSoilFilter(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              soilFilter === type
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Fields Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="h-64 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800" />
          <div className="h-64 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800" />
          <div className="h-64 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800" />
        </div>
      ) : filteredFields.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <Sprout className="w-12 h-12 text-emerald-400 mx-auto opacity-80" />
          <h3 className="text-base font-bold text-white">No field parcels matching "{soilFilter}"</h3>
          <p className="text-xs text-slate-400">Click "Add New Field" to register a parcel with NPK metrics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFields.map((field) => (
            <FieldCard 
              key={field.id} 
              field={field} 
              onEdit={handleEditClick}
              onDelete={(id) => {
                if (window.confirm('Are you sure you want to delete this field profile?')) {
                  deleteMutation.mutate(id);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* ADD / EDIT FIELD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 space-y-6 relative border border-slate-800 my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingField ? 'Edit Field Profile' : 'Register New Land Parcel'}
                </h3>
                <p className="text-xs text-slate-400">Input location and soil laboratory metrics</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Field Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Green Valley Block A"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Location / Region *</label>
                  <input
                    type="text"
                    required
                    value={formData.locationName}
                    onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                    placeholder="e.g. Sacramento Basin, CA"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Area (Hectares) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formData.areaHectares}
                    onChange={(e) => setFormData({ ...formData, areaHectares: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Soil Texture Class *</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Loamy">Loamy</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Clay">Clay</option>
                    <option value="Silt">Silt</option>
                    <option value="Peat">Peat</option>
                    <option value="Chalky">Chalky</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Irrigation System *</label>
                  <select
                    value={formData.irrigationType}
                    onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Flood">Flood Irrigation</option>
                    <option value="Rainfed">Rainfed</option>
                    <option value="Pivot">Center Pivot</option>
                  </select>
                </div>
              </div>

              {/* NPK Test Values */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">
                  Soil Laboratory Test Results
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Nitrogen (PPM)</label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={formData.nitrogenPpm}
                      onChange={(e) => setFormData({ ...formData, nitrogenPpm: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Phosphorus (PPM)</label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={formData.phosphorusPpm}
                      onChange={(e) => setFormData({ ...formData, phosphorusPpm: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-blue-400 font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Potassium (PPM)</label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={formData.potassiumPpm}
                      onChange={(e) => setFormData({ ...formData, potassiumPpm: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-purple-400 font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">pH Level (3-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="3.0"
                      max="10.0"
                      value={formData.phLevel}
                      onChange={(e) => setFormData({ ...formData, phLevel: parseFloat(e.target.value) || 7.0 })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 font-bold text-xs"
                    />
                  </div>
                </div>

                <SoilMetricGauge 
                  nitrogenPpm={formData.nitrogenPpm} 
                  phosphorusPpm={formData.phosphorusPpm} 
                  potassiumPpm={formData.potassiumPpm} 
                  phLevel={formData.phLevel} 
                  organicMatterPct={formData.organicMatterPct} 
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>{editingField ? 'Save Changes' : 'Create Field Profile'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
