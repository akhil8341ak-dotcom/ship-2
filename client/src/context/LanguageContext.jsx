import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  en: {
    appTitle: "AgriWise",
    appSubtitle: "AI-Powered Agriculture Crop Advisory Assistant",
    navDashboard: "Dashboard",
    navFields: "Field Management",
    navWizard: "New AI Advisory",
    navDiagnose: "Disease Diagnostic",
    navMarket: "Market & Risks",
    navSettings: "Settings",
    fieldOverview: "Field Parcel Overview",
    registeredFields: "Registered Fields",
    addField: "Add New Field",
    generateAdvisory: "Generate AI Advisory",
    soilMetrics: "Soil Metrics & Health",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    phBalance: "pH Balance",
    organicMatter: "Organic Matter",
    irrigation: "Irrigation System",
    area: "Cultivation Area",
    weatherOverview: "Microclimate & Risk Indicators",
    marketTrends: "Commodity Market Trends",
    diagnosticScanner: "Pest & Disease Visual Scanner",
    exportPdf: "Export PDF Advisory Report",
    recommendedCrops: "Top AI Recommended Crops",
    fertilizerPlan: "Precision Fertilization Schedule",
    irrigationSchedule: "Smart Irrigation Schedule",
    riskMatrix: "Disease & Microclimate Risk Matrix",
    suitabilityScore: "Suitability",
    projectedYield: "Projected Yield",
    growthStage: "Growth Stage",
    applicationMethod: "Application Method",
    organicControls: "Organic Remediations",
    chemicalControls: "Chemical Protocols",
    preventativeSteps: "Preventative Practices"
  },
  es: {
    appTitle: "AgriWise",
    appSubtitle: "Asistente Agrícola Impulsado por IA",
    navDashboard: "Panel General",
    navFields: "Gestión de Campos",
    navWizard: "Nuevo Asesoramiento IA",
    navDiagnose: "Diagnóstico de Enfermedades",
    navMarket: "Mercado y Riesgos",
    navSettings: "Configuración",
    fieldOverview: "Visión General de Parcelas",
    registeredFields: "Campos Registrados",
    addField: "Agregar Nuevo Campo",
    generateAdvisory: "Generar Asesoramiento IA",
    soilMetrics: "Métricas y Salud del Suelo",
    nitrogen: "Nitrógeno (N)",
    phosphorus: "Fósforo (P)",
    potassium: "Potasio (K)",
    phBalance: "Nivel de pH",
    organicMatter: "Materia Orgánica",
    irrigation: "Sistema de Riego",
    area: "Área de Cultivo",
    weatherOverview: "Microclima e Indicadores de Riesgo",
    marketTrends: "Tendencias del Mercado de Granos",
    diagnosticScanner: "Escáner de Plagas y Enfermedades",
    exportPdf: "Exportar Informe en PDF",
    recommendedCrops: "Principales Cultivos Recomendados",
    fertilizerPlan: "Programa de Fertilización de Precisión",
    irrigationSchedule: "Programa de Riego Inteligente",
    riskMatrix: "Matriz de Riesgo Climático y Plagas",
    suitabilityScore: "Idoneidad",
    projectedYield: "Rendimiento Proyectado",
    growthStage: "Etapa de Crecimiento",
    applicationMethod: "Método de Aplicación",
    organicControls: "Remedios Orgánicos",
    chemicalControls: "Protocolos Químicos",
    preventativeSteps: "Prácticas Preventivas"
  },
  hi: {
    appTitle: "AgriWise",
    appSubtitle: "एआई-संचालित कृषि फसल सलाहकार सहायक",
    navDashboard: "डैशबोर्ड",
    navFields: "खेत प्रबंधन",
    navWizard: "नई एआई सलाह",
    navDiagnose: "रोग निदान स्कैन",
    navMarket: "बाजार और जोखिम",
    navSettings: "सेटिंग्स",
    fieldOverview: "खेत अवलोकन",
    registeredFields: "पंजीकृत खेत",
    addField: "नया खेत जोड़ें",
    generateAdvisory: "एआई सलाह लें",
    soilMetrics: "मिट्टी परीक्षण और स्वास्थ्य",
    nitrogen: "नाइट्रोजन (N)",
    phosphorus: "फास्फोरस (P)",
    potassium: "पोटेशियम (K)",
    phBalance: "pH संतुलन",
    organicMatter: "जैविक पदार्थ",
    irrigation: "सिंचाई प्रणाली",
    area: "खेती का क्षेत्रफल",
    weatherOverview: "मौसम और जलवायु जोखिम",
    marketTrends: "फसल बाजार भाव",
    diagnosticScanner: "कीट एवं रोग स्कैनर",
    exportPdf: "PDF रिपोर्ट डाउनलोड करें",
    recommendedCrops: "सर्वश्रेष्ठ अनुशंसित फसलें",
    fertilizerPlan: "उर्वरक प्रबंधन अनुसूची",
    irrigationSchedule: "स्मार्ट सिंचाई योजना",
    riskMatrix: "रोग और जलवायु जोखिम विश्लेषण",
    suitabilityScore: "उपयुक्तता",
    projectedYield: "अनुमानित उपज",
    growthStage: "वृद्धि चरण",
    applicationMethod: "उर्वरक प्रयोग विधि",
    organicControls: "जैविक उपचार",
    chemicalControls: "रासायनिक नियंत्रण",
    preventativeSteps: "रोकथाम के उपाय"
  },
  sw: {
    appTitle: "AgriWise",
    appSubtitle: "Mshauri wa Kilimo wa Akili Bandia",
    navDashboard: "Dashibodi",
    navFields: "Usimamizi wa Mashamba",
    navWizard: "Ushauri Mpya wa AI",
    navDiagnose: "Utambuzi wa Magonjwa",
    navMarket: "Soko na Hatari",
    navSettings: "Mipangilio",
    fieldOverview: "Muhtasari wa Shamba",
    registeredFields: "Mashamba Yaliyosajiliwa",
    addField: "Ongeza Shamba Jipya",
    generateAdvisory: "Tengeneza Ushauri wa AI",
    soilMetrics: "Afya ya Udongo",
    nitrogen: "Naitrojeni (N)",
    phosphorus: "Fosforasi (P)",
    potassium: "Potasiamu (K)",
    phBalance: "Kiwango cha pH",
    organicMatter: "Mbolea ya Asili",
    irrigation: "Mfumo wa Umwagiliaji",
    area: "Eneo la Kilimo",
    weatherOverview: "Hali ya Hewa na Hatari",
    marketTrends: "Bei za Soko",
    diagnosticScanner: "Kichanganuzi cha Magonjwa",
    exportPdf: "Pakua Ripoti ya PDF",
    recommendedCrops: "Mazao Yaliyopendekezwa",
    fertilizerPlan: "Ratiba ya Mbolea",
    irrigationSchedule: "Ratiba ya Umwagiliaji",
    riskMatrix: "Tathmini ya Hatari",
    suitabilityScore: "Ufaafu",
    projectedYield: "Mavuno Tarajiwa",
    growthStage: "Hatua ya Ukuaji",
    applicationMethod: "Njia ya Utumiaji",
    organicControls: "Dawa za Asili",
    chemicalControls: "Dawa za Kemikali",
    preventativeSteps: "Hatua za Kinga"
  },
  fr: {
    appTitle: "AgriWise",
    appSubtitle: "Assistant Agricole Alimenté par l'IA",
    navDashboard: "Tableau de Bord",
    navFields: "Gestion des Parcelles",
    navWizard: "Conseil IA",
    navDiagnose: "Diagnostic Maladies",
    navMarket: "Marché & Risques",
    navSettings: "Paramètres",
    fieldOverview: "Aperçu des Parcelles",
    registeredFields: "Parcelles Enregistrées",
    addField: "Ajouter une Parcelle",
    generateAdvisory: "Générer Conseil IA",
    soilMetrics: "Santé & Métriques du Sol",
    nitrogen: "Azote (N)",
    phosphorus: "Phosphore (P)",
    potassium: "Potassium (K)",
    phBalance: "Niveau de pH",
    organicMatter: "Matière Organique",
    irrigation: "Système d'Irrigation",
    area: "Surface de Culture",
    weatherOverview: "Microclimat & Risques",
    marketTrends: "Cours des Marchés",
    diagnosticScanner: "Scanner de Maladies",
    exportPdf: "Exporter Rapport PDF",
    recommendedCrops: "Cultures Recommandées",
    fertilizerPlan: "Plan de Fertilisation de Précision",
    irrigationSchedule: "Programme d'Irrigation",
    riskMatrix: "Matrice de Risques",
    suitabilityScore: "Pertinence",
    projectedYield: "Rendement Projeté",
    growthStage: "Stade de Croissance",
    applicationMethod: "Méthode d'Application",
    organicControls: "Contrôles Biologiques",
    chemicalControls: "Traitements Chimiques",
    preventativeSteps: "Mesures Préventives"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('agriwise_lang') || 'en');
  const [unitSystem, setUnitSystem] = useState(() => localStorage.getItem('agriwise_unit') || 'metric');

  useEffect(() => {
    localStorage.setItem('agriwise_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('agriwise_unit', unitSystem);
  }, [unitSystem]);

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const convertArea = (ha) => {
    if (!ha) return '0 Ha';
    const num = Number(ha);
    if (unitSystem === 'imperial') {
      const acres = (num * 2.47105).toFixed(1);
      return `${acres} Acres`;
    }
    return `${num.toFixed(1)} Ha`;
  };

  const convertTemp = (tempC) => {
    if (tempC === undefined || tempC === null) return '';
    if (unitSystem === 'imperial') {
      const tempF = Math.round((tempC * 9) / 5 + 32);
      return `${tempF}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  const convertYield = (kgHa) => {
    if (!kgHa) return '';
    if (unitSystem === 'imperial') {
      const lbsAcre = Math.round(kgHa * 0.892179);
      return `${lbsAcre.toLocaleString()} lbs/acre`;
    }
    return `${Math.round(kgHa).toLocaleString()} kg/ha`;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      unitSystem,
      setUnitSystem,
      t,
      convertArea,
      convertTemp,
      convertYield
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
