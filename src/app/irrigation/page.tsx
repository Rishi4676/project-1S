"use client";

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Badge } from '@/components/ui/Badge';
import { Droplets, Sun, CloudRain, AlertTriangle, CheckCircle2, ShieldCheck, Clock, Zap } from 'lucide-react';

interface CropWaterParam {
  id: string;
  nameEn: string;
  nameTa: string;
  kcInitial: number;
  kcVeg: number;
  kcFlower: number;
  kcMaturity: number;
  baseLitersPerAcre: number;
}

const CROP_WATER_DB: CropWaterParam[] = [
  { id: 'rice', nameEn: 'Paddy / Rice (நெல்)', nameTa: 'நெல்', kcInitial: 1.05, kcVeg: 1.2, kcFlower: 1.35, kcMaturity: 0.9, baseLitersPerAcre: 15000 },
  { id: 'sugarcane', nameEn: 'Sugarcane (கரும்பு)', nameTa: 'கரும்பு', kcInitial: 0.4, kcVeg: 1.0, kcFlower: 1.25, kcMaturity: 0.75, baseLitersPerAcre: 18000 },
  { id: 'tomato', nameEn: 'Tomato (தக்காளி)', nameTa: 'தக்காளி', kcInitial: 0.6, kcVeg: 0.9, kcFlower: 1.15, kcMaturity: 0.8, baseLitersPerAcre: 8500 },
  { id: 'cotton', nameEn: 'Cotton (பருத்தி)', nameTa: 'பருத்தி', kcInitial: 0.45, kcVeg: 0.8, kcFlower: 1.2, kcMaturity: 0.6, baseLitersPerAcre: 10000 },
  { id: 'coconut', nameEn: 'Coconut Tree (தேங்காய்)', nameTa: 'தேங்காய்', kcInitial: 0.8, kcVeg: 0.9, kcFlower: 1.0, kcMaturity: 0.95, baseLitersPerAcre: 12000 },
  { id: 'maize', nameEn: 'Maize / Corn (மக்காச்சோளம்)', nameTa: 'மக்காச்சோளம்', kcInitial: 0.4, kcVeg: 0.8, kcFlower: 1.15, kcMaturity: 0.5, baseLitersPerAcre: 9000 },
];

export default function IrrigationPage() {
  const { language, t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<string>('tomato');
  const [stage, setStage] = useState<'initial' | 'veg' | 'flower' | 'maturity'>('flower');
  const [acres, setAcres] = useState<number>(1);
  const [flowRate, setFlowRate] = useState<number>(4); // Liters per hour per dripper
  const [temp, setTemp] = useState<number>(32); // Celsius
  const [humidity, setHumidity] = useState<number>(65); // %
  const [rainProb, setRainProb] = useState<number>(15); // %

  const calculation = useMemo(() => {
    const crop = CROP_WATER_DB.find((c) => c.id === selectedCrop) || CROP_WATER_DB[0];

    let kc = crop.kcFlower;
    if (stage === 'initial') kc = crop.kcInitial;
    if (stage === 'veg') kc = crop.kcVeg;
    if (stage === 'maturity') kc = crop.kcMaturity;

    // ET0 Evapotranspiration Factor based on Temp & Humidity
    const etFactor = 1 + (temp - 28) * 0.03 - (humidity - 50) * 0.005;

    // Daily Liters needed per acre
    const dailyLiters = Math.round(crop.baseLitersPerAcre * kc * Math.max(0.6, etFactor) * acres);

    // Assuming 4,000 drippers per acre standard
    const drippersCount = 4000 * acres;
    const totalDischargePerHour = drippersCount * flowRate;
    const runTimeHours = dailyLiters / totalDischargePerHour;

    const hours = Math.floor(runTimeHours);
    const minutes = Math.round((runTimeHours - hours) * 60);

    const isRainWarning = rainProb >= 40;

    return {
      dailyLiters,
      hours,
      minutes,
      isRainWarning,
      kc,
    };
  }, [selectedCrop, stage, acres, flowRate, temp, humidity, rainProb]);

  return (
    <div className="space-y-6">
      {/* Header Banner - Dark Elevated Panel */}
      <section className="bg-gradient-to-r from-cyan-900 to-[#1B431C] text-white rounded-2xl p-5 shadow-md border border-cyan-800/40">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="verified">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-300" />
                FAO-56 Evapotranspiration Standard
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t.irrigation.title}</h1>
            <p className="text-cyan-100/90 text-sm mt-1 font-medium">{t.irrigation.subtitle}</p>
          </div>
          <div className="bg-cyan-950/80 p-2.5 rounded-lg border border-cyan-400/30 flex items-center gap-2.5">
            <Droplets className="w-6 h-6 text-cyan-300" />
            <span className="text-xs font-semibold text-white">Smart Water Management</span>
          </div>
        </div>
      </section>

      {/* Smart Weather Rain Warning Banner */}
      {calculation.isRainWarning ? (
        <div className="bg-amber-50/80 border border-amber-300/80 rounded-xl p-4 shadow-sm flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-amber-950 text-sm md:text-base">{t.irrigation.rainWarning}</h3>
            <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
              High chance of rain ({rainProb}%). Pausing irrigation for the next 24-48 hours will prevent root rot and save electricity costs.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/80 border border-emerald-300/80 rounded-xl p-3.5 shadow-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-xs text-emerald-950 font-medium">
            <strong className="font-bold">{t.irrigation.safeToIrrigate}:</strong> Low rain probability ({rainProb}%). Proceed with the recommended drip schedule below.
          </div>
        </div>
      )}

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Field & Crop Setup */}
        <div className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-sm space-y-3.5">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-stone-200/60 pb-2">
            <Droplets className="w-4 h-4 text-cyan-600" />
            1. Crop & Growth Stage
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.soil.selectCrop}</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 bg-stone-50 text-slate-900 font-medium min-h-[42px]"
            >
              {CROP_WATER_DB.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'ta' ? c.nameTa : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.irrigation.selectStage}</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as any)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 bg-stone-50 text-slate-900 font-medium min-h-[42px]"
            >
              <option value="initial">🌱 Initial / Sowing Stage (முளைக்கும் பருவம்)</option>
              <option value="veg">🌿 Vegetative Stage (வளர்ச்சிப் பருவம்)</option>
              <option value="flower">🌸 Flowering & Fruiting Stage (பூக்கும்/காய்க்கும் பருவம்)</option>
              <option value="maturity">🌾 Ripening / Maturity (முதிர்ச்சிப் பருவம்)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Field Size: <span className="text-cyan-800 font-extrabold text-sm">{acres} Acre(s)</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={acres}
              onChange={(e) => setAcres(parseFloat(e.target.value))}
              className="w-full accent-cyan-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Drip System & Weather Parameters */}
        <div className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-sm space-y-3.5">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-stone-200/60 pb-2">
            <Sun className="w-4 h-4 text-amber-500" />
            2. Drip System & Weather
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.irrigation.dripFlowRate}</label>
            <select
              value={flowRate}
              onChange={(e) => setFlowRate(parseInt(e.target.value))}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 bg-stone-50 text-slate-900 font-medium min-h-[42px]"
            >
              <option value={2}>2 Liters/Hour (Standard Drip Emitter)</option>
              <option value={4}>4 Liters/Hour (High Discharge Emitter)</option>
              <option value={8}>8 Liters/Hour (Button Dripper)</option>
            </select>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Temperature</span>
                <span className="text-cyan-800 font-extrabold">{temp}°C</span>
              </div>
              <input
                type="range"
                min="20"
                max="45"
                value={temp}
                onChange={(e) => setTemp(parseInt(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Rain Probability</span>
                <span className={rainProb >= 40 ? 'text-amber-700 font-extrabold' : 'text-[#2D572C] font-extrabold'}>{rainProb}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={rainProb}
                onChange={(e) => setRainProb(parseInt(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Box */}
      <section className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="font-bold text-base md:text-lg text-slate-900 flex items-center gap-2 border-b border-stone-200/60 pb-3">
          <Clock className="w-5 h-5 text-cyan-600" />
          {t.irrigation.dripRunTime}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="bg-cyan-50/80 border border-cyan-200/80 rounded-lg p-4 flex items-center gap-3.5">
            <Droplets className="w-8 h-8 text-cyan-600 flex-shrink-0" />
            <div>
              <span className="text-[10px] font-extrabold text-cyan-800 uppercase tracking-wider">{t.irrigation.waterRequirement}</span>
              <h3 className="font-extrabold text-xl md:text-2xl text-cyan-950 mt-0.5">
                {calculation.dailyLiters.toLocaleString()} <span className="text-xs font-normal text-cyan-800">Liters/Day</span>
              </h3>
            </div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-lg p-4 flex items-center gap-3.5">
            <Zap className="w-8 h-8 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">{t.irrigation.dripRunTime}</span>
              <h3 className="font-extrabold text-xl md:text-2xl text-emerald-950 mt-0.5">
                {calculation.hours} <span className="text-xs font-normal text-emerald-800">hr</span> {calculation.minutes}{' '}
                <span className="text-xs font-normal text-emerald-800">mins/day</span>
              </h3>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-700 bg-stone-50/80 p-3 rounded-lg border border-stone-200/60 font-medium">
          💡 <strong>Best Practice Tip:</strong> Split the drip run time into 2 equal sessions (Morning 6:00 - 8:00 AM & Evening 5:00 - 7:00 PM) for maximum soil water absorption and minimal evaporation loss.
        </div>
      </section>
    </div>
  );
}
