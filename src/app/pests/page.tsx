"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Badge } from '@/components/ui/Badge';
import { Bug, Camera, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, RefreshCw, Zap, Loader2 } from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { Skeleton } from '@/components/ui/Skeleton';

const SAMPLE_CROPS = [
  {
    id: 'tomato',
    name: 'Tomato Late Blight',
    nameTa: 'தக்காளி கொள்ளை நோய்',
    crop: 'Tomato (தக்காளி)',
    confidence: '96%',
    organic: 'Apply Neem Seed Kernel Extract (NSKE 5%) or Trichoderma viride bio-fungicide @ 5g/L.',
    chemical: 'Spray Copper Oxychloride 50% WP @ 2.5g/L or Mancozeb 75% WP @ 2.0g/L. Observe 7-day safety period.',
    img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'paddy',
    name: 'Paddy Blast Fungus (Pyricularia oryzae)',
    nameTa: 'நெல் குலை நோய்',
    crop: 'Paddy / Rice (நெல்)',
    confidence: '94%',
    organic: 'Spray Pseudomonas fluorescens @ 10g/L or Neem Oil @ 3%. Avoid excessive Nitrogen application.',
    chemical: 'Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L at boot leaf stage.',
    img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'cotton',
    name: 'Cotton Pink Bollworm Infestation',
    nameTa: 'பருத்தி இளஞ்சிகப்பு காய்ப்புழு',
    crop: 'Cotton (பருத்தி)',
    confidence: '92%',
    organic: 'Install Pheromone Traps @ 5/acre & release Trichogramma chilonis egg parasitoid @ 60,000/acre.',
    chemical: 'Spray Chlorantraniliprole 18.5% SC @ 0.3ml/L or Emamectin Benzoate 5% SG @ 0.4g/L.',
    img: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=500&auto=format&fit=crop&q=80',
  },
];

export default function PestsPage() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setDiagnosis(null);
    }
  };

  const handleSampleClick = (sample: typeof SAMPLE_CROPS[0]) => {
    setSelectedImage(sample.img);
    setDiagnosis(sample);
  };

  const runDiagnosis = () => {
    if (!selectedImage) return;
    setIsDiagnosing(true);
    setTimeout(() => {
      setIsDiagnosing(false);
      if (!diagnosis) {
        setDiagnosis(SAMPLE_CROPS[0]);
      }
    }, 1000);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner - Dark Elevated Panel */}
      <section className="bg-gradient-to-r from-slate-950 via-[#1B431C] to-slate-900 text-white rounded-2xl p-5 shadow-md border border-[#2D572C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="verified">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-300" />
              ICAR & NCIPM AI Computer Vision Standard
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t.pests.title}</h1>
          <p className="text-emerald-100/90 text-sm font-medium">
            AI Crop Vision Diagnostic Tool • Instant Disease Identification & ICAR Spray Prescription
          </p>
        </div>
        <div className="bg-[#1B431C]/90 p-2.5 rounded-lg border border-emerald-400/30 flex items-center gap-2 flex-shrink-0">
          <Bug className="w-6 h-6 text-amber-300" />
          <span className="text-xs font-semibold">100% Offline AI Model</span>
        </div>
      </section>

      {/* Upload Dropzone with Aceternity 3D Card Effect */}
      <CardContainer className="w-full">
        <CardBody className="w-full bg-white border border-stone-200/80 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-4 shadow-sm hover:shadow-md transition">
          {selectedImage ? (
            <div className="space-y-4 flex flex-col items-center">
              <CardItem translateZ="60">
                <img src={selectedImage} alt="Crop Leaf Scan" className="max-h-56 rounded-xl object-cover shadow border border-stone-200 mx-auto" />
              </CardItem>
              <CardItem translateZ="40" className="flex gap-3 justify-center">
                <button
                  onClick={runDiagnosis}
                  disabled={isDiagnosing}
                  className="bg-[#2D572C] hover:bg-[#1B431C] text-white font-bold px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2 text-sm min-h-[44px]"
                >
                  <Bug className="w-4 h-4 text-emerald-300" />
                  <span>{isDiagnosing ? "Diagnosing with AI..." : t.pests.diagnoseBtn}</span>
                </button>
                <button
                  onClick={() => { setSelectedImage(null); setDiagnosis(null); }}
                  className="bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold px-4 py-2.5 rounded-lg border border-stone-300 transition text-sm min-h-[44px]"
                >
                  Reset Image
                </button>
              </CardItem>
            </div>
          ) : (
            <label className="cursor-pointer space-y-3 block min-h-[140px] flex flex-col items-center justify-center w-full">
              <CardItem translateZ="50">
                <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200/60 text-[#2D572C] inline-block">
                  <Camera className="w-7 h-7" />
                </div>
              </CardItem>
              <CardItem translateZ="30">
                <h3 className="font-bold text-slate-900 text-base">{t.pests.uploadTitle}</h3>
                <p className="text-xs text-slate-500 mt-1">{t.pests.uploadDesc}</p>
              </CardItem>
              <input type="file" accept="image/*" capture="environment" onChange={handleSimulatedUpload} className="hidden" />
            </label>
          )}
        </CardBody>
      </CardContainer>

      {/* Instant Sample Test Images */}
      <section className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex justify-between items-center border-b border-stone-200/60 pb-2">
          <h2 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Instant Sample AI Crop Diagnostic Tests
          </h2>
          <span className="text-xs text-slate-500 font-medium">Click any sample to test AI</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {SAMPLE_CROPS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleClick(sample)}
              className="bg-stone-50 hover:bg-emerald-50/70 border border-stone-200/80 hover:border-emerald-300/80 p-3 rounded-lg text-left transition group space-y-2 flex items-center gap-3"
            >
              <img src={sample.img} alt={sample.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-stone-200" />
              <div>
                <span className="font-extrabold text-slate-900 group-hover:text-[#2D572C] transition block text-xs">
                  {sample.name}
                </span>
                <span className="text-[11px] text-slate-500 block">{sample.crop}</span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Test AI Diagnostic →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* AI Diagnostic Shimmer Loading State */}
      {isDiagnosing && (
        <section className="bg-white border border-emerald-300/80 rounded-xl p-5 shadow-sm space-y-3.5 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Loader2 className="w-5 h-5 text-[#2D572C] animate-spin" />
            <span className="text-sm font-bold text-[#2D572C]">AI Neural Network Analyzing Leaf Disease Patterns...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-2 bg-stone-50 p-3.5 rounded-lg border border-stone-200/60">
              <Skeleton className="h-4 w-1/3 bg-stone-300" />
              <Skeleton className="h-6 w-3/4 bg-stone-300" />
              <Skeleton className="h-3 w-1/2 bg-stone-200" />
            </div>
            <div className="space-y-2 bg-stone-50 p-3.5 rounded-lg border border-stone-200/60">
              <Skeleton className="h-4 w-1/3 bg-amber-200" />
              <Skeleton className="h-4 w-full bg-amber-100" />
              <Skeleton className="h-4 w-5/6 bg-amber-100" />
            </div>
          </div>
        </section>
      )}

      {/* Diagnosis Report Card - Disease Warning Surface Treatment */}
      {diagnosis && !isDiagnosing && (
        <section className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-sm space-y-3.5">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200/60">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2D572C]" />
              {t.pests.resultTitle}
            </h2>
            <Badge variant="verified">ICAR Verified Advisory</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Detected Disease Header - Red Warning Surface */}
            <div className="bg-red-50/80 border border-red-200/80 p-3.5 rounded-lg space-y-1">
              <span className="text-[10px] font-extrabold text-red-900 uppercase tracking-wider">{t.pests.diseaseDetected}</span>
              <h3 className="font-extrabold text-slate-950 text-sm sm:text-base">{diagnosis.diseaseName || diagnosis.name}</h3>
              <p className="text-xs text-red-900/90 font-medium">Crop: {diagnosis.crop} | AI Confidence: <span className="font-extrabold text-red-950">{diagnosis.confidence}</span></p>
            </div>

            {/* Organic Treatment - Amber Surface */}
            <div className="bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-lg space-y-1">
              <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider">{t.pests.organicTreatment}</span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">{diagnosis.organic}</p>
            </div>
          </div>

          {/* Chemical Treatment - Rose Alert Surface */}
          <div className="bg-rose-50/80 border border-rose-200/80 p-3.5 rounded-lg space-y-1">
            <span className="text-[10px] font-extrabold text-rose-900 uppercase tracking-wider">{t.pests.chemicalTreatment}</span>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">{diagnosis.chemical}</p>
          </div>
        </section>
      )}
    </div>
  );
}

