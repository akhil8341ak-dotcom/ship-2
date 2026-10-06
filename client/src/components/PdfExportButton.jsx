import React, { useState } from 'react';
import { Download, FileText, Loader2, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PdfExportButton({ targetRef, filename = 'AgriWise_Advisory_Report.pdf' }) {
  const [exporting, setExporting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleExportPdf = async () => {
    if (!targetRef?.current) return;
    setExporting(true);
    setCompleted(false);

    try {
      const element = targetRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#020617' // slate-950 background
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
      setCompleted(true);
      setTimeout(() => setCompleted(false), 3000);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExportPdf}
      disabled={exporting}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
        completed
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-emerald-950/20'
          : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-emerald-950/40 hover:scale-[1.02]'
      }`}
    >
      {exporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Generating PDF Report...</span>
        </>
      ) : completed ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span>PDF Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Export PDF Report</span>
        </>
      )}
    </button>
  );
}
