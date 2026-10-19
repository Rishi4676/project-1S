"use client";

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Badge } from '@/components/ui/Badge';
import { TestTube, Sparkles, CheckCircle2, ShieldCheck, Leaf, AlertCircle, Scale } from 'lucide-react';

interface CropData {
  id: string;
  nameEn: string;
  nameTa: string;
  nReq: number; // kg/ha RDF
  pReq: number;
  kReq: number;
  avgYield: number;
}

const CROP_DATABASE: CropData[] = [
  { id: 'rice', nameEn: 'Paddy / Rice (நெல்)', nameTa: 'நெல்', nReq: 120, pReq: 40, kReq: 40, avgYield: 25 },
  { id: 'sugarcane', nameEn: 'Sugarcane (கரும்பு)', nameTa: 'கரும்பு', nReq: 275, pReq: 60, kReq: 110, avgYield: 450 },
  { id: 'cotton', nameEn: 'Cotton (பருத்தி)', nameTa: 'பருத்தி', nReq: 90, pReq: 45, kReq: 45, avgYield: 15 },
  { id: 'tomato', nameEn: 'Tomato (தக்காளி)', nameTa: 'தக்காளி', nReq: 150, pReq: 100, kReq: 100, avgYield: 120 },
  { id: 'maize', nameEn: 'Maize / Corn (மக்காச்சோளம்)', nameTa: 'மக்காச்சோளம்', nReq: 135, pReq: 62.5, kReq: 50, avgYield: 30 },
  { id: 'coconut', nameEn: 'Coconut (தேங்காய்)', nameTa: 'தேங்காய்', nReq: 560, pReq: 320, kReq: 1200, avgYield: 80 },
];

const SOIL_TYPES = [
  { id: 'red', nameEn: 'Red Soil (செம்மண்)', nameTa: 'செம்மண்', nFactor: 1.1, pFactor: 1.2, kFactor: 1.0 },
  { id: 'black', nameEn: 'Black Cotton Soil (கரிசல் மண்)', nameTa: 'கரிசல் மண்', nFactor: 1.0, pFactor: 1.0, kFactor: 0.9 },
  { id: 'alluvial', nameEn: 'Alluvial Soil (வண்டல் மண்)', nameTa: 'வண்டல் மண்', nFactor: 0.9, pFactor: 0.9, kFactor: 0.9 },
  { id: 'clay', nameEn: 'Clay Soil (களிமண்)', nameTa: 'களிமண்', nFactor: 1.0, pFactor: 1.1, kFactor: 1.0 },
  { id: 'sandy', nameEn: 'Sandy Loam (மணல் சார்ந்த மண்)', nameTa: 'மணல் சார்ந்த மண்', nFactor: 1.25, pFactor: 1.15, kFactor: 1.2 },
];

export default function SoilCalculatorPage() {
  const { language, t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<string>('rice');
  const [selectedSoil, setSelectedSoil] = useState<string>('red');
  const [acres, setAcres] = useState<number>(1);
  const [labN, setLabN] = useState<number>(240); // kg/ha
  const [labP, setLabP] = useState<number>(18);
  const [labK, setLabK] = useState<number>(160);

  // Calculation Logic using TNAU/ICAR RDF
  const calculation = useMemo(() => {
    const crop = CROP_DATABASE.find((c) => c.id === selectedCrop) || CROP_DATABASE[0];
    const soil = SOIL_TYPES.find((s) => s.id === selectedSoil) || SOIL_TYPES[0];

    // Net Nutrient Deficit Factor
    const nDeficit = Math.max(0.5, (crop.nReq / 280) * (300 / Math.max(100, labN))) * soil.nFactor;
    const pDeficit = Math.max(0.5, (crop.pReq / 20) * (25 / Math.max(8, labP))) * soil.pFactor;
    const kDeficit = Math.max(0.5, (crop.kReq / 150) * (200 / Math.max(80, labK))) * soil.kFactor;

    // Convert to Fertilizers per Acre
    // DAP contains 18% N and 46% P2O5
    // Urea contains 46% N
    // MOP contains 60% K2O
    const dapPerAcre = Math.round(crop.pReq * pDeficit * 0.88 * acres);
    const nFromDap = dapPerAcre * 0.18;
    const netNReq = Math.max(0, crop.nReq * nDeficit * 0.4 - nFromDap);
    const ureaPerAcre = Math.round((netNReq / 0.46) * acres);
    const mopPerAcre = Math.round((crop.kReq * kDeficit * 0.4 / 0.6) * acres);
    const neemCakePerAcre = Math.round(100 * acres);

    return {
      dap: dapPerAcre,
      urea: ureaPerAcre,
      mop: mopPerAcre,
      neemCake: neemCakePerAcre,
      vermicompost: Math.round(500 * acres),
      basal: {
        dap: Math.round(dapPerAcre),
        urea: Math.round(ureaPerAcre * 0.4),
        mop: Math.round(mopPerAcre * 0.5),
        neemCake: neemCakePerAcre,
      },
      top1: {
        urea: Math.round(ureaPerAcre * 0.3),
        mop: Math.round(mopPerAcre * 0.25),
      },
      top2: {
        urea: Math.round(ureaPerAcre * 0.3),
        mop: Math.round(mopPerAcre * 0.25),
      },
    };
  }, [selectedCrop, selectedSoil, acres, labN, labP, labK]);

  return (
    <div className="space-y-6">
      {/* Header Banner - Dark Elevated Panel */}
      <section className="bg-gradient-to-r from-[#1B431C] to-[#2D572C] text-white rounded-2xl p-5 shadow-md border border-[#2D572C]">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="verified">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-300" />
                ICAR & TNAU Certified Standards
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t.soil.title}</h1>
            <p className="text-emerald-100/90 text-sm mt-1 font-medium">{t.soil.subtitle}</p>
          </div>
          <div className="bg-[#1B431C]/80 p-2.5 rounded-lg border border-emerald-400/30 flex items-center gap-2.5">
            <TestTube className="w-6 h-6 text-amber-300" />
            <span className="text-xs font-semibold text-white">Precision Nutrient Calculator</span>
          </div>
        </div>
      </section>

      {/* Input Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Crop & Land Details */}
        <div className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-sm space-y-3.5">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-stone-200/60 pb-2">
            <Scale className="w-4 h-4 text-[#2D572C]" />
            1. Crop & Field Parameters
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.soil.selectCrop}</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D572C] bg-stone-50 text-slate-900 font-medium min-h-[42px]"
            >
              {CROP_DATABASE.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'ta' ? c.nameTa : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.soil.selectSoil}</label>
            <select
              value={selectedSoil}
              onChange={(e) => setSelectedSoil(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D572C] bg-stone-50 text-slate-900 font-medium min-h-[42px]"
            >
              {SOIL_TYPES.map((s) => (
                <option key={s.id} value={s.id}>
                  {language === 'ta' ? s.nameTa : s.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.soil.enterLand}: <span className="text-[#2D572C] font-extrabold text-sm">{acres} Acre(s)</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={acres}
              onChange={(e) => setAcres(parseFloat(e.target.value))}
              className="w-full accent-[#2D572C] cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: Lab N-P-K Values */}
        <div className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-sm space-y-3.5">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-stone-200/60 pb-2">
            <TestTube className="w-4 h-4 text-amber-600" />
            2. {t.soil.npkTitle}
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>{t.soil.nitrogen}</span>
                <span className="text-[#2D572C] font-extrabold">{labN} kg/ha</span>
              </div>
              <input
                type="range"
                min="100"
                max="500"
                value={labN}
                onChange={(e) => setLabN(parseInt(e.target.value))}
                className="w-full accent-[#2D572C] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>{t.soil.phosphorus}</span>
                <span className="text-[#2D572C] font-extrabold">{labP} kg/ha</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={labP}
                onChange={(e) => setLabP(parseInt(e.target.value))}
                className="w-full accent-[#2D572C] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>{t.soil.potassium}</span>
                <span className="text-[#2D572C] font-extrabold">{labK} kg/ha</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                value={labK}
                onChange={(e) => setLabK(parseInt(e.target.value))}
                className="w-full accent-[#2D572C] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Schedule */}
      <section className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-stone-200/60 pb-3 flex-wrap gap-2">
          <h2 className="font-bold text-base md:text-lg text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {t.soil.resultsTitle} ({acres} Acre)
          </h2>
          <Badge variant="verified">ICAR RDF Formula</Badge>
        </div>

        {/* Schedule Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Basal Dose */}
          <div className="bg-stone-50/80 border border-stone-200/80 rounded-lg p-3.5 space-y-2">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">Stage 1</span>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{t.soil.basalDose}</h3>
            <ul className="text-xs space-y-1 text-slate-700 font-medium">
              <li>• <strong>DAP:</strong> <span className="text-slate-950 font-extrabold">{calculation.basal.dap} kg</span></li>
              <li>• <strong>Urea:</strong> <span className="text-slate-950 font-extrabold">{calculation.basal.urea} kg</span></li>
              <li>• <strong>MOP (Potash):</strong> <span className="text-slate-950 font-extrabold">{calculation.basal.mop} kg</span></li>
              <li>• <strong>Neem Cake:</strong> <span className="text-slate-950 font-extrabold">{calculation.basal.neemCake} kg</span></li>
            </ul>
          </div>

          {/* Top Dressing 1 */}
          <div className="bg-stone-50/80 border border-stone-200/80 rounded-lg p-3.5 space-y-2">
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">Stage 2</span>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{t.soil.topDose1}</h3>
            <ul className="text-xs space-y-1 text-slate-700 font-medium">
              <li>• <strong>Urea:</strong> <span className="text-slate-950 font-extrabold">{calculation.top1.urea} kg</span></li>
              <li>• <strong>MOP (Potash):</strong> <span className="text-slate-950 font-extrabold">{calculation.top1.mop} kg</span></li>
              <li>• <strong>Micronutrient Mix:</strong> <span className="text-slate-950 font-extrabold">5 kg</span></li>
            </ul>
          </div>

          {/* Top Dressing 2 */}
          <div className="bg-stone-50/80 border border-stone-200/80 rounded-lg p-3.5 space-y-2">
            <span className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">Stage 3</span>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{t.soil.topDose2}</h3>
            <ul className="text-xs space-y-1 text-slate-700 font-medium">
              <li>• <strong>Urea:</strong> <span className="text-slate-950 font-extrabold">{calculation.top2.urea} kg</span></li>
              <li>• <strong>MOP (Potash):</strong> <span className="text-slate-950 font-extrabold">{calculation.top2.mop} kg</span></li>
            </ul>
          </div>
        </div>

        {/* Organic Alternatives */}
        <div className="bg-emerald-50/80 border border-emerald-300/80 rounded-lg p-3.5 flex items-start gap-3">
          <Leaf className="w-5 h-5 text-[#2D572C] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950">
            <strong className="font-bold text-sm block mb-0.5">{t.soil.organicAlt}</strong>
            For organic farming, replace chemical fertilizers with <strong>{calculation.vermicompost} kg Vermicompost</strong> + <strong>{calculation.neemCake} kg Neem Cake</strong> + Bio-fertilizers (Azospirillum & Phosphobacteria @ 2 kg/acre).
          </div>
        </div>
      </section>

      {/* Visual Leaf Deficiency Guide */}
      <section className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-sm space-y-3.5">
        <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-stone-200/60 pb-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          {t.soil.deficiencyTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="border border-amber-200/70 p-3 rounded-lg space-y-1 bg-amber-50/60">
            <h3 className="font-bold text-amber-900 text-xs sm:text-sm">🟡 Nitrogen (N) Deficiency</h3>
            <p className="text-slate-700 leading-relaxed font-medium">Old leaves turn pale yellow starting from leaf tips moving inwards.</p>
            <span className="font-bold text-[#2D572C] block mt-1">Remedy: Apply 1% Urea Spray or Neem Cake.</span>
          </div>

          <div className="border border-purple-200/70 p-3 rounded-lg space-y-1 bg-purple-50/60">
            <h3 className="font-bold text-purple-900 text-xs sm:text-sm">🟣 Phosphorus (P) Deficiency</h3>
            <p className="text-slate-700 leading-relaxed font-medium">Leaves turn dark purple/reddish green with delayed root development.</p>
            <span className="font-bold text-[#2D572C] block mt-1">Remedy: Apply Single Super Phosphate (SSP) / DAP.</span>
          </div>

          <div className="border border-red-200/70 p-3 rounded-lg space-y-1 bg-red-50/60">
            <h3 className="font-bold text-red-900 text-xs sm:text-sm">🟤 Potassium (K) Deficiency</h3>
            <p className="text-slate-700 leading-relaxed font-medium">Leaf margins burn and turn rusty brown with weak stems.</p>
            <span className="font-bold text-[#2D572C] block mt-1">Remedy: Apply Muriate of Potash (MOP) or Wood Ash.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
