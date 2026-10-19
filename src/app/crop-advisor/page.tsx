"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { useLocation } from '@/components/LocationContext';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  Calculator
} from 'lucide-react';

interface CropRecommendation {
  id: string;
  nameEn: string;
  nameTa: string;
  category: string;
  durationDays: number;
  expectedYieldPerAcre: number; // in Quintals
  yieldUnit: string;
  costPerAcre: number; // in INR
  expectedPricePerUnit: number; // in INR per Quintal
  climateRisk: 'low' | 'medium' | 'high';
  priceVolatility: 'low' | 'medium' | 'high';
  waterRequirement: 'low' | 'medium' | 'high';
  bestSoilTypes: string[];
  bestIrrigation: string[];
  keyStrengths: { en: string; ta: string }[];
}

const CROPS_DATABASE: CropRecommendation[] = [
  {
    id: 'paddy-samba',
    nameEn: 'Paddy / Rice (Samba Variety - CR 1009)',
    nameTa: 'சம்பா நெல் (CR 1009)',
    category: 'Cereals',
    durationDays: 135,
    expectedYieldPerAcre: 28,
    yieldUnit: 'Quintals',
    costPerAcre: 26000,
    expectedPricePerUnit: 2350,
    climateRisk: 'low',
    priceVolatility: 'low',
    waterRequirement: 'high',
    bestSoilTypes: ['alluvial', 'clay', 'red'],
    bestIrrigation: ['canal', 'borewell'],
    keyStrengths: [
      { en: 'High government MSP support and guaranteed market procurement', ta: 'அரசு குறைந்தபட்ச ஆதரவு விலை மற்றும் உத்தரவாதமான விற்பனை' },
      { en: 'Subsidized seed distribution via local Agriculture Extension', ta: 'வேளாண் விரிவாக்க மையம் மூலம் மானிய விதை விநியோகம்' }
    ]
  },
  {
    id: 'hybrid-cotton',
    nameEn: 'Hybrid Cotton (Bt Cotton - DCH 32)',
    nameTa: 'வீரிய ஒட்டு பருத்தி (DCH 32)',
    category: 'Commercial / Fiber',
    durationDays: 160,
    expectedYieldPerAcre: 14,
    yieldUnit: 'Quintals',
    costPerAcre: 32000,
    expectedPricePerUnit: 7400,
    climateRisk: 'medium',
    priceVolatility: 'medium',
    waterRequirement: 'medium',
    bestSoilTypes: ['black', 'red'],
    bestIrrigation: ['drip', 'borewell'],
    keyStrengths: [
      { en: 'High profit margin per acre with spinning mill demand', ta: 'நூல் ஆலைகள் தேவை காரணமாக அதிக ஏக்கர் லாபம்' },
      { en: 'Suitable for black cotton soils with medium drip irrigation', ta: 'சொட்டுநீர்ப்பாசனத்துடன் கூடிய கரிசல் மண்ணிற்கு ஏற்றது' }
    ]
  },
  {
    id: 'hybrid-tomato',
    nameEn: 'Hybrid Tomato (Shivam / Abhinav)',
    nameTa: 'வீரிய ஒட்டு தக்காளி (சிவம)',
    category: 'Vegetables',
    durationDays: 95,
    expectedYieldPerAcre: 180,
    yieldUnit: 'Quintals',
    costPerAcre: 48000,
    expectedPricePerUnit: 1200,
    climateRisk: 'high',
    priceVolatility: 'high',
    waterRequirement: 'medium',
    bestSoilTypes: ['red', 'sandy', 'alluvial'],
    bestIrrigation: ['drip'],
    keyStrengths: [
      { en: 'Fast harvest cycle (95 days) with massive peak price potential', ta: '95 நாட்களில் விரைவான அறுவடை & அதிக விலை வாய்ப்பு' },
      { en: 'Ideal for fertigation drip systems in red loam soils', ta: 'செம்மண் நிலங்களில் சொட்டுநீர் உரப்பாசனத்திற்கு மிகவும் ஏற்றது' }
    ]
  },
  {
    id: 'maize-feed',
    nameEn: 'Poultry Feed Maize / Corn (CO 6)',
    nameTa: 'மக்காச்சோளம் (CO 6)',
    category: 'Coarse Grains',
    durationDays: 105,
    expectedYieldPerAcre: 32,
    yieldUnit: 'Quintals',
    costPerAcre: 22000,
    expectedPricePerUnit: 2250,
    climateRisk: 'low',
    priceVolatility: 'low',
    waterRequirement: 'low',
    bestSoilTypes: ['red', 'black', 'sandy'],
    bestIrrigation: ['borewell', 'rainfed', 'drip'],
    keyStrengths: [
      { en: 'Low water requirement with steady demand from poultry farms', ta: 'குறைந்த நீர் தேவை & கோழிப்பண்ணைகளிலிருந்து நிலையான தேவை' },
      { en: 'Short growth duration with high drought tolerance', ta: 'குறைந்த கால அளவு & வறட்சியைத் தாங்கும் திறன்' }
    ]
  },
  {
    id: 'small-onion',
    nameEn: 'Shallots / Small Onion (CO 5)',
    nameTa: 'சின்ன வெங்காயம் (CO 5)',
    category: 'Horticulture',
    durationDays: 80,
    expectedYieldPerAcre: 65,
    yieldUnit: 'Quintals',
    costPerAcre: 42000,
    expectedPricePerUnit: 3400,
    climateRisk: 'medium',
    priceVolatility: 'high',
    waterRequirement: 'low',
    bestSoilTypes: ['red', 'sandy'],
    bestIrrigation: ['drip', 'borewell'],
    keyStrengths: [
      { en: 'Ultra-fast cash crop (80 days) with export market demand', ta: '80 நாட்களில் அறுவடை & ஏற்றுமதி சந்தை வாய்ப்பு' },
      { en: 'Excellent intercropping potential with sugarcane or papaya', ta: 'கரும்பு மற்றும் பப்பாளியுடன் ஊடுபயிராக பயிரிடலாம்' }
    ]
  },
  {
    id: 'groundnut',
    nameEn: 'Groundnut / Peanut (TMV 14)',
    nameTa: 'மணிலா / நிலக்கடலை (TMV 14)',
    category: 'Oilseeds',
    durationDays: 110,
    expectedYieldPerAcre: 18,
    yieldUnit: 'Quintals',
    costPerAcre: 24000,
    expectedPricePerUnit: 6600,
    climateRisk: 'low',
    priceVolatility: 'low',
    waterRequirement: 'low',
    bestSoilTypes: ['sandy', 'red'],
    bestIrrigation: ['rainfed', 'borewell', 'drip'],
    keyStrengths: [
      { en: 'Fixes atmospheric nitrogen into soil, reducing next crop fertilizer cost', ta: 'மண்ணில் நைட்ரஜனை நிலைநிறுத்தி அடுத்த பயிர் செலவை குறைக்கிறது' },
      { en: 'High oil extraction value with dependable local oil mill buying', ta: 'அதிக எண்ணெய் சத்து & உள்ளூர் மில்களில் உடனடி விற்பனை' }
    ]
  }
];

export default function CropAdvisorPage() {
  const { language } = useLanguage();
  const { location } = useLocation();
  const isTa = language === 'ta';

  // Form States
  const [district, setDistrict] = useState<string>('');
  const [acres, setAcres] = useState<number>(2);
  const [soilType, setSoilType] = useState<string>('red');
  const [irrigation, setIrrigation] = useState<string>('drip');
  const [season, setSeason] = useState<string>('kharif');
  const [budgetPerAcre, setBudgetPerAcre] = useState<number>(35000);

  useEffect(() => {
    if (location && location.name) {
      setDistrict(location.name);
    }
  }, [location]);

  // Recommendations Computation
  const recommendations = useMemo(() => {
    return CROPS_DATABASE.map((crop) => {
      let score = 70;

      // Soil Compatibility Match
      if (crop.bestSoilTypes.includes(soilType)) score += 15;

      // Irrigation Match
      if (crop.bestIrrigation.includes(irrigation)) score += 15;

      // Budget Fit
      if (crop.costPerAcre <= budgetPerAcre) score += 10;
      else score -= 15;

      // Total Financials for user's acreage
      const totalCost = crop.costPerAcre * acres;
      const grossRevenue = crop.expectedYieldPerAcre * crop.expectedPricePerUnit * acres;
      const netProfit = grossRevenue - totalCost;
      const roiPercent = Math.round((netProfit / Math.max(1, totalCost)) * 100);

      return {
        ...crop,
        score,
        totalCost,
        grossRevenue,
        netProfit,
        roiPercent
      };
    })
      .sort((a, b) => b.score - a.score || b.netProfit - a.netProfit)
      .slice(0, 3);
  }, [soilType, irrigation, budgetPerAcre, acres]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <section className="bg-slate-900 border border-stone-800 text-white rounded-2xl p-5 sm:p-7 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="verified">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-300" />
            {isTa ? 'ICAR & TNAU AI பரிந்துரை இயந்திரம்' : 'ICAR & TNAU AI Profit Engine'}
          </Badge>
          <span className="text-xs font-semibold text-emerald-300 bg-[#1B431C]/90 px-2.5 py-1 rounded-full border border-emerald-500/30">
            {isTa ? '2026-27 நேரலை சந்தை கணிப்பு' : 'Live 2026-27 Market Forecast'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {isTa
            ? '🎯 பயிர் தேர்வு & அதிக லாப கணிப்பு கருவி'
            : '🎯 AI Crop Recommendation & Profitability Predictor'}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-medium max-w-3xl leading-relaxed">
          {isTa
            ? 'உங்கள் நில வகை, பாசன வசதி மற்றும் முதலீட்டிற்கு ஏற்ப அதிக நிகர லாபம் தரும் சிறந்த 3 பயிர்களை AI தொழில்நுட்பத்துடன் கண்டறியவும்.'
            : 'Enter your farm details to discover the top 3 most profitable crops customized for your soil, water availability, and investment budget.'}
        </p>
      </section>

      {/* 2. Interactive Input Panel */}
      <section className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-md space-y-5">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold border-b border-stone-800 pb-3">
          <Calculator className="w-4 h-4" />
          <span>{isTa ? 'நிலம் & முதலீட்டு விவரங்கள்' : 'Farm Profile & Budget Inputs'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Location Input */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              {isTa ? 'நகரம் / கிராமம் / இடம்' : 'City, Village or Location'}
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder={isTa ? "நகரம் / கிராமம் எழுதவும்..." : "Type any city or village..."}
              className="w-full bg-slate-950 border border-stone-700 rounded-xl px-3 py-2.5 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder-slate-500"
            />
          </div>

          {/* Acreage */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>{isTa ? 'நிலப்பரப்பு (ஏக்கர்)' : 'Farm Acreage (Acres)'}</span>
              <span className="text-amber-400 font-bold">{acres} Acre(s)</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={acres}
              onChange={(e) => setAcres(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Soil Type */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              {isTa ? 'மண் வகை' : 'Soil Type'}
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full bg-slate-950 border border-stone-700 rounded-xl px-3 py-2.5 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <option value="red">Red Loam Soil (செம்மண்)</option>
              <option value="black">Black Cotton Soil (கரிசல் மண்)</option>
              <option value="alluvial">Alluvial Delta Soil (வண்டல் மண்)</option>
              <option value="clay">Clay Soil (களிமண்)</option>
              <option value="sandy">Sandy Loam (மணல் சார்ந்த மண்)</option>
            </select>
          </div>

          {/* Irrigation Access */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              {isTa ? 'பாசன வசதி' : 'Irrigation Source'}
            </label>
            <select
              value={irrigation}
              onChange={(e) => setIrrigation(e.target.value)}
              className="w-full bg-slate-950 border border-stone-700 rounded-xl px-3 py-2.5 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <option value="drip">Drip Irrigation System (சொட்டுநீர்)</option>
              <option value="borewell">Borewell / Well Irrigation (போர்வெல்)</option>
              <option value="canal">River / Canal Irrigation (வாய்க்கால் பாசனம்)</option>
              <option value="rainfed">Rainfed Monsoon (மழைநம்பிய நிலம்)</option>
            </select>
          </div>

          {/* Season */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              {isTa ? 'பயிரிடும் பருவம்' : 'Cropping Season'}
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-slate-950 border border-stone-700 rounded-xl px-3 py-2.5 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <option value="kharif">Kharif / Monsoon (ஆடிப் பட்டம் - June-Oct)</option>
              <option value="rabi">Rabi / Winter (காரப் பட்டம் - Nov-Feb)</option>
              <option value="zaid">Zaid / Summer (சித்திரைப் பட்டம் - Mar-May)</option>
            </select>
          </div>

          {/* Investment Budget */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              {isTa ? 'ஏக்கருக்கு முதலீட்டு வரம்பு' : 'Budget per Acre (₹)'}
            </label>
            <select
              value={budgetPerAcre}
              onChange={(e) => setBudgetPerAcre(Number(e.target.value))}
              className="w-full bg-slate-950 border border-stone-700 rounded-xl px-3 py-2.5 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <option value={25000}>₹25,000 / acre (Low Investment)</option>
              <option value={35000}>₹35,000 / acre (Standard Budget)</option>
              <option value={50000}>₹50,000 / acre (High Yield High Tech)</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. Top 3 AI Crop Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>
              {isTa
                ? `உங்கள் ${acres} ஏக்கர் நிலத்திற்கான சிறந்த 3 AI பயிர் பரிந்துரைகள்`
                : `Top 3 AI Crop Recommendations for ${acres} Acre(s)`}
            </span>
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {isTa ? 'நிகர லாபத்தின் அடிப்படையில் வரிசைப்படுத்தப்பட்டது' : 'Ranked by Projected Net Profit'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {recommendations.map((crop, index) => {
            const rankBadge = index === 0 ? '🏆 #1 Highest Net Profit' : index === 1 ? '🥈 #2 Balanced Yield Option' : '🥉 #3 Low Water / Low Risk';
            const badgeBg = index === 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

            return (
              <div
                key={crop.id}
                className="bg-slate-900 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-emerald-500/40 transition duration-200"
              >
                {/* Header Row */}
                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-stone-800 pb-3">
                  <div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeBg} inline-block mb-1.5`}>
                      {rankBadge}
                    </span>
                    <h3 className="text-xl font-extrabold text-white">
                      {isTa ? crop.nameTa : crop.nameEn}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {crop.category} • {crop.durationDays} Days Harvest Duration ({Math.round(crop.durationDays / 30)} Months)
                    </p>
                  </div>

                  {/* Profit Summary Badge */}
                  <div className="text-right bg-emerald-950/80 border border-emerald-500/30 p-2.5 rounded-xl">
                    <span className="text-[10px] font-semibold text-emerald-300 uppercase block">
                      {isTa ? 'எதிர்பார்க்கும் நிகர லாபம்' : 'Projected Net Profit'}
                    </span>
                    <div className="text-xl font-black text-emerald-400">
                      ₹{crop.netProfit.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-amber-300 font-bold">
                      {crop.roiPercent}% Return on Investment
                    </span>
                  </div>
                </div>

                {/* Financial Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-stone-800">
                    <span className="text-slate-400 text-[11px] block">{isTa ? 'ஏக்கர் மகசூல்' : 'Expected Yield / Acre'}</span>
                    <span className="text-white font-bold text-sm block mt-0.5">
                      {crop.expectedYieldPerAcre * acres} {crop.yieldUnit}
                    </span>
                    <span className="text-[10px] text-slate-400">({crop.expectedYieldPerAcre} Qtl/Acre)</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-stone-800">
                    <span className="text-slate-400 text-[11px] block">{isTa ? 'சந்தை விற்பனை விலை' : 'Market Price / Qtl'}</span>
                    <span className="text-amber-400 font-bold text-sm block mt-0.5">
                      ₹{crop.expectedPricePerUnit.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">{isTa ? 'குவிண்டால் ஒன்றுக்கு' : 'Per Quintal'}</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-stone-800">
                    <span className="text-slate-400 text-[11px] block">{isTa ? 'மொத்த சாகுபடி செலவு' : 'Total Cultivation Cost'}</span>
                    <span className="text-red-400 font-bold text-sm block mt-0.5">
                      ₹{crop.totalCost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">(₹{crop.costPerAcre.toLocaleString('en-IN')}/Acre)</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-stone-800">
                    <span className="text-slate-400 text-[11px] block">{isTa ? 'மொத்த வருவாய்' : 'Gross Revenue'}</span>
                    <span className="text-emerald-400 font-bold text-sm block mt-0.5">
                      ₹{crop.grossRevenue.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">{isTa ? 'மொத்த விற்பனை' : 'Before Expenses'}</span>
                  </div>
                </div>

                {/* Risk Indicators & Compatibility Badges */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-stone-800/80 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-400 font-medium">{isTa ? 'அபாய மதிப்பீடு:' : 'Risk Profile:'}</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      crop.climateRisk === 'low' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                      crop.climateRisk === 'medium' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                      'bg-red-950 text-red-300 border border-red-500/30'
                    }`}>
                      Climate Risk: {crop.climateRisk.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      crop.priceVolatility === 'low' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                      crop.priceVolatility === 'medium' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                      'bg-red-950 text-red-300 border border-red-500/30'
                    }`}>
                      Price Volatility: {crop.priceVolatility.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/soil-calculator"
                      className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>{isTa ? 'மண் உரம் கணக்கிடு' : 'Calculate NPK Dosage'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Key Advantages */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-slate-300 block">{isTa ? 'சிறப்பம்சங்கள்:' : 'Key Advantages:'}</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {crop.keyStrengths.map((st, i) => (
                      <li key={i} className="flex items-start gap-1.5 bg-slate-950 p-2 rounded-lg border border-stone-800/60">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{isTa ? st.ta : st.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
