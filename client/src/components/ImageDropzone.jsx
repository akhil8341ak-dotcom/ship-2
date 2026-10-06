import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

export default function ImageDropzone({ onImageSelect, selectedFile, previewUrl, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    setError(null);
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file format. Please upload JPEG, PNG, or WebP images.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    onImageSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900/80 shadow-2xl group">
          <img 
            src={previewUrl} 
            alt="Crop diagnostic sample" 
            className="w-full h-64 object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 border border-slate-700 flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Change Image</span>
            </button>
            <button
              onClick={onClear}
              className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 border border-rose-500/40 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[240px] ${
            isDragging 
              ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]' 
              : 'border-slate-800 hover:border-emerald-500/40 bg-slate-900/50 hover:bg-slate-900/80'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 shadow-lg shadow-emerald-950/30">
            <Camera className="w-7 h-7" />
          </div>

          <h4 className="text-base font-bold text-slate-100 mb-1">
            Drag & drop plant photo or click to browse
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Upload leaf or plant images showing disease symptoms, rust, discoloration, or pest damage (Max 5MB - JPEG, PNG, WebP)
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
            <ImageIcon className="w-4 h-4" />
            <span>Select Image File</span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
        className="hidden"
      />

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
