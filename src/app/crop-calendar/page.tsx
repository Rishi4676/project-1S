"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ShieldCheck,
  TestTube,
  Droplets,
  Bug,
  TrendingUp,
  FileText,
  Printer,
  ChevronRight,
  Filter,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

interface TaskItem {
  id: string;
  dayOffset: number; // Days after sowing
  stageEn: string;
  stageTa: string;
  category: 'PREP' | 'SOWING' | 'FERTILIZER' | 'WEEDING' | 'SPRAY' | 'IRRIGATION' | 'HARVEST';
  titleEn: string;
  titleTa: string;
  descEn: string;
  descTa: string;
  toolLink?: string;
  toolLinkLabelEn?: string;
  toolLinkLabelTa?: string;
}

interface CropCalendar {
  id: string;
  nameEn: string;
  nameTa: string;
  durationDays: number;
  seasonEn: string;
  seasonTa: string;
  tasks: TaskItem[];
}

const CROP_CALENDARS: CropCalendar[] = [
  {
    id: 'paddy-samba',
    nameEn: 'Paddy / Rice (Samba - CR 1009)',
    nameTa: 'சம்பா நெல் (CR 1009)',
    durationDays: 135,
    seasonEn: 'Kharif / Monsoon (June - Oct)',
    seasonTa: 'ஆடிப் பட்டம் (ஜூன் - அக்டோபர்)',
    tasks: [
      {
        id: 'p1',
        dayOffset: 1,
        stageEn: 'Land Preparation',
        stageTa: 'நிலத் தயாரிப்பு',
        category: 'PREP',
        titleEn: 'Field Plowing & Basal Bio-Organic Application',
        titleTa: 'நிலம் உழுதல் & இயற்கை அடி உரம் இடுதல்',
        descEn: 'Plough field twice. Apply 5 tonnes FYM or Farm Yard Manure + 100 kg Neem Cake per acre to enrich soil organic carbon.',
        descTa: 'நிலத்தை இரண்டு முறை உழவும். ஏக்கருக்கு 5 டன் தொழுஉரம் + 100 கி.கி வேப்பம் பிண்ணாக்கு இட்டு சமன் செய்யவும்.',
        toolLink: '/soil-calculator',
        toolLinkLabelEn: 'Calculate Basal NPK',
        toolLinkLabelTa: 'அடி உரம் கணக்கிடு'
      },
      {
        id: 'p2',
        dayOffset: 7,
        stageEn: 'Nursery & Sowing',
        stageTa: 'நாற்றங்கால் & விதைப்பு',
        category: 'SOWING',
        titleEn: 'Seed Bio-Treatment & Nursery Sowing',
        titleTa: 'விதை நேர்த்தி & நாற்றங்கால் விதைப்பு',
        descEn: 'Treat 20 kg seeds with Pseudomonas fluorescens @ 10g/kg. Sow in nursery bed with shallow water management.',
        descTa: '20 கி.கி விதையை சூடோமோனாஸ் 10கிராம்/கி.கி கொண்டு விதை நேர்த்தி செய்து நாற்றங்காலில் விதைக்கவும்.'
      },
      {
        id: 'p3',
        dayOffset: 25,
        stageEn: 'Transplanting',
        stageTa: 'நட்டல் / நடவு',
        category: 'SOWING',
        titleEn: 'Main Field Transplanting (Single Seedling SRI)',
        titleTa: 'பிரதான வயலில் நாற்று நடுதல் (செம்மை நெல் நடவு)',
        descEn: 'Transplant 25-day-old healthy seedlings with 20x20 cm spacing. Maintain 2-3 cm standing water in field.',
        descTa: '25 நாள் வயதுடைய நாற்றுகளை 20x20 செ.மீ இடைவெளியில் நடவு செய்யவும். 2-3 செ.மீ நீர் நிறுத்தவும்.'
      },
      {
        id: 'p4',
        dayOffset: 40,
        stageEn: 'Tillering & Top Dressing',
        stageTa: 'தூர்கட்டுதல் & முதல் மேல் உரம்',
        category: 'FERTILIZER',
        titleEn: 'First Top Dressing — Urea & Potash Schedule',
        titleTa: 'முதல் மேல் உரம் — யூரியா & பொட்டாஷ்',
        descEn: 'Apply 35 kg Urea + 15 kg MOP (Potash) per acre. Perform cono-weeder operation to aerate root zone.',
        descTa: 'ஏக்கருக்கு 35 கி.கி யூரியா + 15 கி.கி பொட்டாஷ் இடவும். கோனோ வீடர் மூலம் களை எடுத்து வேருக்கு காற்றோட்டம் அளிக்கவும்.',
        toolLink: '/soil-calculator',
        toolLinkLabelEn: 'Check N-P-K Dosage',
        toolLinkLabelTa: 'உர அளவு பார்க்க'
      },
      {
        id: 'p5',
        dayOffset: 60,
        stageEn: 'Panicle Initiation',
        stageTa: 'கதிர் உருவாக்கம்',
        category: 'SPRAY',
        titleEn: 'Blast Fungus & Leaf Folder Preventative Spray',
        titleTa: 'குலை நோய் & இலை சுருட்டுப் புழு பாதுகாப்பு',
        descEn: 'Inspect leaf tips for diamond lesions. Spray Pseudomonas @ 10g/L or Tricyclazole 75% WP @ 0.6g/L if rain expected.',
        descTa: 'இலைகளில் குலை நோய் புள்ளிகள் இருந்தால் சூடோமோனாஸ் அல்லது டிரைசைக்ளசோல் தெளிக்கவும்.',
        toolLink: '/pests',
        toolLinkLabelEn: 'Scan Leaf for Disease',
        toolLinkLabelTa: 'இலை நோய் கண்டறி'
      },
      {
        id: 'p6',
        dayOffset: 85,
        stageEn: 'Flowering & Grain Formation',
        stageTa: 'பூக்கும் & பால் பிடிக்கும் பருவம்',
        category: 'IRRIGATION',
        titleEn: 'Second Top Dressing & Alternate Wetting-Drying Irrigation',
        titleTa: 'இரண்டாம் மேல் உரம் & காய்ச்சலும் பாய்ச்சலும் பாசனம்',
        descEn: 'Apply final 20 kg Urea per acre. Practice Alternate Wetting and Drying (AWD) to strengthen tillers.',
        descTa: 'இறுதி கட்டமாக 20 கி.கி யூரியா இடவும். நிலத்தில் நீர் காய்ந்த பின் மீண்டும் பாசனம் செய்யவும்.',
        toolLink: '/irrigation',
        toolLinkLabelEn: 'Check Drip & Water Guide',
        toolLinkLabelTa: 'பாசன நேரம் கணக்கிடு'
      },
      {
        id: 'p7',
        dayOffset: 120,
        stageEn: 'Ripening',
        stageTa: 'முதிர்ச்சிப் பருவம்',
        category: 'IRRIGATION',
        titleEn: 'Pre-Harvest Field Drainage',
        titleTa: 'அறுவடைக்கு முன் தண்ணீரை வடித்தல்',
        descEn: 'Drain all standing water from the paddy field 10-14 days prior to combine harvester entry.',
        descTa: 'அறுவடைக்கு 10-14 நாட்களுக்கு முன்பாக வயலில் உள்ள அனைத்து நீரையும் முழுமையாக வடித்துவிடவும்.'
      },
      {
        id: 'p8',
        dayOffset: 135,
        stageEn: 'Harvest & Marketing',
        stageTa: 'அறுவடை & விற்பனை',
        category: 'HARVEST',
        titleEn: 'Combine Harvester Operations & Mandi Selling',
        titleTa: 'இயந்திர அறுவடை & அரசு கொள்முதல் நிலைய விற்பனை',
        descEn: 'Harvest at 18-20% grain moisture. Transport directly to local APMC Mandi or DPC (Direct Purchase Center) for Govt MSP.',
        descTa: '18-20% ஈரப்பதத்தில் அறுவடை செய்து அரசு நேரடி நெல் கொள்முதல் நிலையத்தில் குறைந்தபட்ச ஆதரவு விலைக்கு விற்கவும்.',
        toolLink: '/schemes',
        toolLinkLabelEn: 'Check Mandi Prices & MSP',
        toolLinkLabelTa: 'கொள்முதல் விலை பார்க்க'
      }
    ]
  },
  {
    id: 'hybrid-cotton',
    nameEn: 'Hybrid Cotton (Bt Cotton - DCH 32)',
    nameTa: 'வீரிய ஒட்டு பருத்தி (DCH 32)',
    durationDays: 160,
    seasonEn: 'Kharif / Winter (Aug - Jan)',
    seasonTa: 'காரப் பட்டம் (ஆகஸ்ட் - ஜனவரி)',
    tasks: [
      {
        id: 'c1',
        dayOffset: 1,
        stageEn: 'Sowing',
        stageTa: 'விதைப்பு',
        category: 'SOWING',
        titleEn: 'Ridge Sowing & Basal Fertilizer',
        titleTa: 'பார் அமைத்து விதைப்பு & அடி உரம்',
        descEn: 'Sow 1.5 kg Bt seeds per acre on ridges with 90x60 cm spacing. Apply 45 kg DAP + 100 kg Neem Cake basal.',
        descTa: '90x60 செ.மீ இடைவெளியில் பார்களில் விதைக்கவும். 45 கி.கி DAP + 100 கி.கி வேப்பம் பிண்ணாக்கு அடி உரமாக இடவும்.',
        toolLink: '/soil-calculator',
        toolLinkLabelEn: 'Calculate RDF Fertilizer',
        toolLinkLabelTa: 'அடி உரம் கணக்கிடு'
      },
      {
        id: 'c2',
        dayOffset: 25,
        stageEn: 'Vegetative Growth',
        stageTa: 'வளர்ச்சிப் பருவம்',
        category: 'WEEDING',
        titleEn: 'Thinning, Hand Weeding & Micro-Irrigation',
        titleTa: 'நாற்றுக்களைக் களைதல் & சொட்டுநீர் பாசனம்',
        descEn: 'Retain one healthy seedling per hill. Run drip irrigation for 1.5 hours daily depending on rain forecast.',
        descTa: 'குழிக்கு ஒரு ஆரோக்கியமான செடியை மட்டும் விட்டு மற்றவற்றை நீக்கவும். தினசரி 1.5 மணி நேரம் சொட்டுநீர் பாய்ச்சவும்.',
        toolLink: '/irrigation',
        toolLinkLabelEn: 'Check Drip Timer',
        toolLinkLabelTa: 'சொட்டுநீர் நேரம் பார்க்க'
      },
      {
        id: 'c3',
        dayOffset: 50,
        stageEn: 'Square Formation',
        stageTa: 'மொட்டு உருவாக்கம்',
        category: 'SPRAY',
        titleEn: 'Sucking Pest Protection (Jassids & Thrips)',
        titleTa: 'சாறு உறிஞ்சும் பூச்சி பாதுகாப்பு (பச்சை தத்துப்பூச்சி)',
        descEn: 'Set yellow sticky traps @ 10/acre. Spray Neem Oil 3% or Imidacloprid 17.8% SL @ 0.3ml/L if leaf curling occurs.',
        descTa: 'ஏக்கருக்கு 10 மஞ்சள் ஒட்டுப் பொறிகளை வைக்கவும். இலை சுருட்டல் இருந்தால் வேப்ப எண்ணெய் 3% தெளிக்கவும்.',
        toolLink: '/pests',
        toolLinkLabelEn: 'Pest AI Scan',
        toolLinkLabelTa: 'பூச்சி கண்டறி'
      },
      {
        id: 'c4',
        dayOffset: 90,
        stageEn: 'Boll Development',
        stageTa: 'காய் பிடிக்கும் பருவம்',
        category: 'SPRAY',
        titleEn: 'Pink Bollworm Pheromone Trap Installation',
        titleTa: 'இளஞ்சிகப்பு காய்ப்புழு மோகவலைப் பொறி',
        descEn: 'Install Pink Bollworm pheromone traps @ 5/acre. Spray Chlorantraniliprole 18.5% SC @ 0.3ml/L if moth counts > 8/trap.',
        descTa: 'ஏக்கருக்கு 5 இனக்கவர்ச்சி பொறிகளை வைக்கவும். புழு தாக்குதல் அதிகம் இருந்தால் குளோராண்ட்ரானிலிப்ரோல் தெளிக்கவும்.'
      },
      {
        id: 'c5',
        dayOffset: 130,
        stageEn: 'Boll Bursting & Picking',
        stageTa: 'வெடிப்பு & பருத்தி எடுப்பு',
        category: 'HARVEST',
        titleEn: 'First Picking & Shade Drying',
        titleTa: 'முதல் அறுவடை & நிழலில் உலர்த்துதல்',
        descEn: 'Pick fully burst clean bolls in morning after dew dries. Store in dry shade away from dust and moisture.',
        descTa: 'பனி காய்ந்த பின் நன்கு வெடித்த பருத்தியை மட்டும் பறித்து தூசியில்லாமல் உலர வைக்கவும்.'
      }
    ]
  },
  {
    id: 'hybrid-tomato',
    nameEn: 'Hybrid Tomato (Shivam / Abhinav)',
    nameTa: 'வீரிய ஒட்டு தக்காளி (சிவம)',
    durationDays: 95,
    seasonEn: 'Year-Round / Summer-Kharif',
    seasonTa: 'ஆண்டு முழுவதும் (சித்திரை & ஆடி)',
    tasks: [
      {
        id: 't1',
        dayOffset: 1,
        stageEn: 'Nursery Sowing',
        stageTa: 'நாற்றங்கால் விதைப்பு',
        category: 'SOWING',
        titleEn: 'Pro-Tray Seedling Raising',
        titleTa: 'ப்ரோ-ட்ரே நாற்று வளர்ப்பு',
        descEn: 'Sow 60g hybrid seeds in 98-hole pro-trays filled with sterilized coco-peat mixed with Trichoderma viride.',
        descTa: '98-துளை ப்ரோ-ட்ரேக்களில் டிரைக்கோடெர்மா கலந்த கோகோபீட் நிரப்பி விதைகளை விதைக்கவும்.'
      },
      {
        id: 't2',
        dayOffset: 25,
        stageEn: 'Transplanting',
        stageTa: 'நடவு பருவம்',
        category: 'SOWING',
        titleEn: 'Raised Bed Drip & Mulching Sheet Transplanting',
        titleTa: 'உயர் பாத்தி சொட்டுநீர் & பிளாஸ்டிக் மூடாக்கு நடவு',
        descEn: 'Transplant on 60 cm wide raised beds with silver-black plastic mulch. Apply Fertigation dose of 19-19-19.',
        descTa: '60 செ.மீ அகல பாத்திகளில் பிளாஸ்டிக் மூடாக்கு விரித்து நடவு செய்யவும். 19-19-19 நீர் கரையும் உரம் பாய்ச்சவும்.',
        toolLink: '/soil-calculator',
        toolLinkLabelEn: 'Fertigation Calculator',
        toolLinkLabelTa: 'சொட்டுநீர் உரம் பார்க்க'
      },
      {
        id: 't3',
        dayOffset: 45,
        stageEn: 'Staking & Flowering',
        stageTa: 'குச்சி கட்டுதல் & பூக்கும் பருவம்',
        category: 'PREP',
        titleEn: 'Bamboo Staking & String Tying',
        titleTa: 'மூங்கில் குச்சி கட்டுதல் & கயிறு கட்டுதல்',
        descEn: 'Tie plants to 5ft bamboo stakes using jute twine to support heavy fruit load and prevent soil contact diseases.',
        descTa: 'அதிக காய் பாரத்தைத் தாங்க 5 அடி மூங்கில் குச்சிகளை நட்டு சணல் கயிற்றால் செடிகளைக் கட்டவும்.'
      },
      {
        id: 't4',
        dayOffset: 60,
        stageEn: 'Fruit Formation',
        stageTa: 'காய் பிடிக்கும் பருவம்',
        category: 'SPRAY',
        titleEn: 'Late Blight & Fruit Borer Protection',
        titleTa: 'கொள்ளை நோய் & காய்ப்புழு தடுப்பு மருந்து',
        descEn: 'Inspect for dark leaf spots. Spray Mancozeb 75% WP @ 2g/L or Copper Oxychloride 50% WP @ 2.5g/L.',
        descTa: 'இலைகளில் கரும்புள்ளிகள் இருந்தால் மேன்கோசெப் அல்லது காப்பர் ஆக்சிகுளோரைடு தெளிக்கவும்.',
        toolLink: '/pests',
        toolLinkLabelEn: 'Scan Leaf Photo',
        toolLinkLabelTa: 'இலை நோய் படம் எடு'
      },
      {
        id: 't5',
        dayOffset: 80,
        stageEn: 'Harvest Phase 1',
        stageTa: 'முதல் அறுவடை',
        category: 'HARVEST',
        titleEn: 'Breaker Stage Picking & Sorting',
        titleTa: 'அறுவடை & தரம்பிரித்தல்',
        descEn: 'Pick tomatoes at breaker/pink stage for long-distance transport. Sort by size and crate package.',
        descTa: 'தொலைதூர விற்பனைக்கு லேசான சிவப்பு நிறம் வரும் நிலையில் காய்களைப் பறித்து பிளாஸ்டிக் பெட்டிகளில் பேக் செய்யவும்.'
      }
    ]
  }
];

export default function CropCalendarPage() {
  const { language, t } = useLanguage();
  const isTa = language === 'ta';

  // Crop & Sowing Date States
  const [selectedCropId, setSelectedCropId] = useState<string>('paddy-samba');
  const [sowingDate, setSowingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 25); // Default to 25 days ago for realistic active preview
    return d.toISOString().split('T')[0];
  });
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  // Selected Calendar object
  const activeCrop = useMemo(() => {
    return CROP_CALENDARS.find((c) => c.id === selectedCropId) || CROP_CALENDARS[0];
  }, [selectedCropId]);

  // Load completed tasks from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`kisan_crop_tasks_${selectedCropId}`);
      if (saved) {
        try {
          setCompletedTaskIds(JSON.parse(saved));
        } catch (e) {
          setCompletedTaskIds([]);
        }
      } else {
        setCompletedTaskIds([]);
      }
    }
  }, [selectedCropId]);

  // Save task toggles to localStorage
  const toggleTask = (taskId: string) => {
    const updated = completedTaskIds.includes(taskId)
      ? completedTaskIds.filter((id) => id !== taskId)
      : [...completedTaskIds, taskId];
    
    setCompletedTaskIds(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`kisan_crop_tasks_${selectedCropId}`, JSON.stringify(updated));
    }
  };

  const resetAllTasks = () => {
    setCompletedTaskIds([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`kisan_crop_tasks_${selectedCropId}`);
    }
  };

  // Days elapsed calculation
  const daysElapsed = useMemo(() => {
    if (!sowingDate) return 0;
    const sow = new Date(sowingDate).getTime();
    const today = new Date().getTime();
    const diffDays = Math.floor((today - sow) / (1000 * 3600 * 24));
    return Math.max(0, Math.min(activeCrop.durationDays, diffDays));
  }, [sowingDate, activeCrop]);

  // Completion Stats
  const completionPercentage = useMemo(() => {
    if (activeCrop.tasks.length === 0) return 0;
    const completedCount = activeCrop.tasks.filter((t) => completedTaskIds.includes(t.id)).length;
    return Math.round((completedCount / activeCrop.tasks.length) * 100);
  }, [activeCrop, completedTaskIds]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return activeCrop.tasks.filter((task) => {
      if (filterCategory === 'ALL') return true;
      if (filterCategory === 'COMPLETED') return completedTaskIds.includes(task.id);
      if (filterCategory === 'UPCOMING') return !completedTaskIds.includes(task.id);
      return task.category === filterCategory;
    });
  }, [activeCrop, filterCategory, completedTaskIds]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <section className="bg-slate-900 border border-stone-800 text-white rounded-2xl p-5 sm:p-7 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="verified">
            <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-300" />
            {isTa ? 'ICAR & TNAU விவசாய நாள்காட்டி' : 'ICAR & TNAU Day-by-Day Crop Schedule'}
          </Badge>
          <span className="text-xs font-semibold text-emerald-300 bg-[#1B431C]/90 px-2.5 py-1 rounded-full border border-emerald-500/30">
            {isTa ? '2026-27 நேரலை பணி அட்டவணை' : '2026-27 Live Task Schedule'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {isTa
            ? '📅 பயிர் நாட்காட்டி & பணி வழிகாட்டி'
            : '📅 Interactive Crop Calendar & Task Reminder'}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-medium max-w-3xl leading-relaxed">
          {isTa
            ? 'உங்கள் விதைப்பு தேதியைத் தேர்ந்தெடுத்து விதைப்பு முதல் அறுவடை வரையிலான அனைத்து பணிகளையும் நாள் வாரியாகத் தெரிந்துகொள்ளுங்கள்.'
            : 'Select your crop and sowing date to get a customized, day-by-day task checklist from land preparation to harvest.'}
        </p>
      </section>

      {/* 2. Crop Selection & Sowing Date Input Panel */}
      <section className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <CalendarIcon className="w-4 h-4" />
            <span>{isTa ? 'பயிர் & விதைப்பு தேதித் தேர்வு' : 'Crop & Sowing Profile'}</span>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30 transition flex items-center gap-1.5 print:hidden"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isTa ? 'அச்சிடு / PDF சேமி' : 'Print / Save PDF'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Crop Dropdown */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              {isTa ? 'பயிரைத் தேர்ந்தெடுக்கவும்' : 'Select Your Crop'}
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full bg-slate-950 border border-stone-700 rounded-xl px-3 py-2.5 text-white text-xs font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              {CROP_CALENDARS.map((c) => (
                <option key={c.id} value={c.id}>
                  {isTa ? c.nameTa : c.nameEn} ({c.durationDays} Days)
                </option>
              ))}
            </select>
          </div>

          {/* Sowing Date Picker */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              {isTa ? 'விதைப்பு / நடவு தேதி' : 'Sowing or Planting Date'}
            </label>
            <input
              type="date"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
              className="w-full bg-slate-950 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          {/* Season Indicator */}
          <div className="space-y-1.5 col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="text-slate-300 font-semibold block">
              {isTa ? 'பயிரிடும் பருவம் & காலம்' : 'Cropping Season & Duration'}
            </label>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-stone-800 flex justify-between items-center text-xs">
              <span className="text-amber-400 font-bold">
                {isTa ? activeCrop.seasonTa : activeCrop.seasonEn}
              </span>
              <span className="text-emerald-400 font-extrabold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                {activeCrop.durationDays} Days
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress & Current Day Status Bar */}
        <div className="bg-slate-950 p-4 rounded-xl border border-stone-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-white font-extrabold text-sm">
                {isTa ? `விதைத்த நாள் முதல்: Day ${daysElapsed} / ${activeCrop.durationDays}` : `Current Crop Age: Day ${daysElapsed} of ${activeCrop.durationDays}`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-xs font-medium">
                {completedTaskIds.length} of {activeCrop.tasks.length} {isTa ? 'பணிகள் முடிந்தது' : 'Tasks Completed'} ({completionPercentage}%)
              </span>
              {completedTaskIds.length > 0 && (
                <button
                  onClick={resetAllTasks}
                  className="text-[11px] text-red-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isTa ? 'மீட்டமை' : 'Reset'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Graphical Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-stone-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, (daysElapsed / activeCrop.durationDays) * 100)}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* 3. Task Category Filter Bar */}
      <section className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 p-3 rounded-xl border border-stone-800 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-4 h-4 text-emerald-400 ml-1" />
          <span className="font-bold text-slate-400 text-[11px] uppercase mr-1">{isTa ? 'வடிகட்டுக:' : 'Filter Tasks:'}</span>
          
          {[
            { id: 'ALL', labelEn: 'All Tasks', labelTa: 'அனைத்து பணிகள்' },
            { id: 'UPCOMING', labelEn: 'Pending', labelTa: 'நிலுவையில் உள்ளவை' },
            { id: 'COMPLETED', labelEn: 'Completed', labelTa: 'முடிந்தவை' },
            { id: 'FERTILIZER', labelEn: 'Fertilizer', labelTa: 'உரமிடல்' },
            { id: 'SPRAY', labelEn: 'Spraying', labelTa: 'மருந்து தெளிப்பு' },
            { id: 'IRRIGATION', labelEn: 'Irrigation', labelTa: 'பாசனம்' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterCategory(f.id)}
              className={`px-3 py-1.5 rounded-lg border font-bold text-xs transition ${
                filterCategory === f.id
                  ? 'bg-[#2D572C] text-white border-emerald-400 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {isTa ? f.labelTa : f.labelEn}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          {filteredTasks.length} {isTa ? 'பணிகள் காட்டப்படுகின்றன' : 'tasks shown'}
        </span>
      </section>

      {/* 4. Sequential Day-by-Day Task Timeline List */}
      <div className="space-y-4">
        {filteredTasks.map((task, index) => {
          const isDone = completedTaskIds.includes(task.id);
          const isCurrentActiveStage = daysElapsed >= task.dayOffset && (index === filteredTasks.length - 1 || daysElapsed < (filteredTasks[index + 1]?.dayOffset || activeCrop.durationDays));

          // Estimated Target Date calculation
          const targetDateObj = new Date(sowingDate);
          targetDateObj.setDate(targetDateObj.getDate() + task.dayOffset);
          const formattedTargetDate = targetDateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

          return (
            <div
              key={task.id}
              className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 shadow-md space-y-3 transition-all duration-200 relative ${
                isDone
                  ? 'border-stone-800 opacity-75 bg-slate-950/70'
                  : isCurrentActiveStage
                  ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-slate-900'
                  : 'border-stone-800 hover:border-slate-700'
              }`}
            >
              {/* Active Stage Floating Badge */}
              {isCurrentActiveStage && !isDone && (
                <div className="absolute -top-3 right-4 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow border border-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{isTa ? 'தற்போதைய செயல் பருவம்' : 'CURRENT ACTIVE STAGE'}</span>
                </div>
              )}

              {/* Task Header Row */}
              <div className="flex items-start gap-3">
                {/* Toggle Checkbox Button */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 flex-shrink-0 text-emerald-400 hover:scale-110 transition focus:outline-none"
                  title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-500 hover:text-emerald-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/30">
                        Day {task.dayOffset} ({formattedTargetDate})
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {isTa ? task.stageTa : task.stageEn}
                      </span>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                      task.category === 'FERTILIZER' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30' :
                      task.category === 'SPRAY' ? 'bg-amber-950 text-amber-300 border-amber-500/30' :
                      task.category === 'IRRIGATION' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/30' :
                      task.category === 'HARVEST' ? 'bg-purple-950 text-purple-300 border-purple-500/30' :
                      'bg-slate-950 text-slate-300 border-stone-800'
                    }`}>
                      {task.category}
                    </span>
                  </div>

                  <h3 className={`text-base font-extrabold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                    {isTa ? task.titleTa : task.titleEn}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium pt-1">
                    {isTa ? task.descTa : task.descEn}
                  </p>

                  {/* Tool Link Shortcut Button if available */}
                  {task.toolLink && (
                    <div className="pt-2">
                      <Link
                        href={task.toolLink}
                        className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30 transition shadow-sm"
                      >
                        <span>{isTa ? task.toolLinkLabelTa : task.toolLinkLabelEn}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
