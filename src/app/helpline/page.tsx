"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Badge } from '@/components/ui/Badge';
import { Phone, MessageSquare, MapPin, ShieldCheck, UserCheck, ExternalLink } from 'lucide-react';

interface KVKDistrict {
  id: string;
  nameEn: string;
  nameTa: string;
  kvkName: string;
  officer: string;
  phone: string;
  address: string;
}

const TN_DISTRICT_KVK_LIST: KVKDistrict[] = [
  {
    id: 'coimbatore',
    nameEn: 'Coimbatore (கோயம்புத்தூர்)',
    nameTa: 'கோயம்புத்தூர்',
    kvkName: 'ICAR-KVK MYRADA, Gobichettipalayam / TNAU Coimbatore',
    officer: 'Dr. P. Alagesan (Senior Scientist & Head)',
    phone: '04285-241626 / 0422-6611200',
    address: 'KVK MYRADA, Kanthaliyanur, Gobichettipalayam, Erode / TNAU, Lawley Road, Coimbatore - 641003',
  },
  {
    id: 'madurai',
    nameEn: 'Madurai (மதுரை)',
    nameTa: 'மதுரை',
    kvkName: 'ICAR-KVK Agricultural College & Research Institute, Madurai',
    officer: 'Dr. C. Swaminathan (Program Coordinator)',
    phone: '0452-2422956',
    address: 'KVK AC&RI, Oonjampatti / Y.Othakadai, Madurai - 625104',
  },
  {
    id: 'thanjavur',
    nameEn: 'Thanjavur (தஞ்சாவூர்)',
    nameTa: 'தஞ்சாவூர்',
    kvkName: 'ICAR-KVK Needamangalam / Sakkottai, Thanjavur',
    officer: 'Dr. V. Radhakrishnan (Principal Scientist)',
    phone: '04367-260666',
    address: 'KVK Needamangalam / Sakkottai, Kumbakonam Road, Thanjavur - 612001',
  },
  {
    id: 'salem',
    nameEn: 'Salem (சேலம்)',
    nameTa: 'சேலம்',
    kvkName: 'ICAR-KVK Sandhiyur, Salem',
    officer: 'Dr. M. A. Vennila (Senior Scientist)',
    phone: '0427-2422269',
    address: 'KVK Sandhiyur, Mallur, Salem District - 636203',
  },
  {
    id: 'trichy',
    nameEn: 'Tiruchirappalli (திருச்சிராப்பள்ளி)',
    nameTa: 'திருச்சிராப்பள்ளி',
    kvkName: 'ICAR-KVK Sirugamani, Trichy',
    officer: 'Dr. R. Marimuthu (Programme Coordinator)',
    phone: '0431-2614217',
    address: 'KVK Sirugamani, Pettavaithalai Via, Tiruchirappalli - 639115',
  },
  {
    id: 'tirunelveli',
    nameEn: 'Tirunelveli (திருநெல்வேலி)',
    nameTa: 'திருநெல்வேலி',
    kvkName: 'ICAR-KVK Rice Research Station, Ambasamudram',
    officer: 'Dr. K. Rajappan (Principal Scientist)',
    phone: '04634-250215',
    address: 'KVK RRS, Ambasamudram, Tirunelveli District - 627401',
  },
  {
    id: 'erode',
    nameEn: 'Erode (ஈரோடு)',
    nameTa: 'ஈரோடு',
    kvkName: 'ICAR-KVK MYRADA Erode Center',
    officer: 'Dr. P. Saravanan (Senior Scientist)',
    phone: '04285-241626',
    address: 'MYRADA KVK, Gobichettipalayam, Erode - 638453',
  },
  {
    id: 'dindigul',
    nameEn: 'Dindigul (திண்டுக்கல்)',
    nameTa: 'திண்டுக்கல்',
    kvkName: 'ICAR-KVK Gandhigram Rural Institute, Dindigul',
    officer: 'Dr. S. Usha (Program Coordinator)',
    phone: '0451-2452371',
    address: 'KVK Gandhigram Rural Institute, Dindigul District - 624302',
  },
];

export default function HelplinePage() {
  const { language, t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('coimbatore');

  const currentKVK = TN_DISTRICT_KVK_LIST.find((k) => k.id === selectedDistrict) || TN_DISTRICT_KVK_LIST[0];

  const whatsappMessage = encodeURIComponent(
    language === 'ta'
      ? 'வணக்கம் வேளாண் அதிகாரி, எனக்கு பயிர் பாதுகாப்பு மற்றும் மானியங்கள் பற்றிய உதவி தேவை.'
      : 'Hello Agri Expert, I need official advisory for crop protection and government subsidies.'
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="verified">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                Official Govt & TNAU Directory
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{t.helpline.title}</h1>
            <p className="text-emerald-100 text-sm mt-1">{t.helpline.subtitle}</p>
          </div>
          <div className="bg-emerald-700/50 p-3 rounded-xl border border-emerald-500/30 flex items-center gap-3">
            <Phone className="w-8 h-8 text-amber-300 animate-pulse" />
            <span className="text-xs font-semibold">24/7 Helpline Support</span>
          </div>
        </div>
      </section>

      {/* Emergency Hotlines Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kisan Call Center */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Government Official</span>
            <h3 className="font-bold text-slate-900 text-base">{t.helpline.govtHelpline}</h3>
            <p className="text-xs text-slate-500">24/7 Free Call in Tamil & English</p>
          </div>
          <a
            href="tel:18001801551"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
          >
            <Phone className="w-4 h-4" />
            <span>Call 1800-180-1551</span>
          </a>
        </div>

        {/* TNAU Helpline */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">University Experts</span>
            <h3 className="font-bold text-slate-900 text-base">{t.helpline.tnauHelpline}</h3>
            <p className="text-xs text-slate-500">TNAU Agritech Portal Support</p>
          </div>
          <a
            href="tel:04226611200"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
          >
            <Phone className="w-4 h-4" />
            <span>Call 0422-6611200</span>
          </a>
        </div>

        {/* WhatsApp Expert Chat */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Direct Chat</span>
            <h3 className="font-bold text-slate-900 text-base">{t.helpline.whatsappBtn}</h3>
            <p className="text-xs text-slate-500">Instant photo & message guidance</p>
          </div>
          <a
            href={`https://wa.me/9118001801551?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
          >
            <MessageSquare className="w-4 h-4 text-emerald-200" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* District KVK Locator */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3 flex-wrap gap-2">
          <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            {t.helpline.kvkDetails}
          </h2>
          <Badge variant="verified">Tamil Nadu KVK Directory</Badge>
        </div>

        {/* District Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">{t.helpline.selectDistrict}</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 bg-stone-50 font-medium"
          >
            {TN_DISTRICT_KVK_LIST.map((d) => (
              <option key={d.id} value={d.id}>
                {language === 'ta' ? d.nameTa : d.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Selected KVK Card */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-emerald-950 text-base md:text-lg flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-700" />
            {currentKVK.kvkName}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
            <div>
              <strong className="block text-slate-900 mb-0.5">{t.helpline.contactPerson}:</strong>
              <span>{currentKVK.officer}</span>
            </div>

            <div>
              <strong className="block text-slate-900 mb-0.5">{t.helpline.phone}:</strong>
              <a href={`tel:${currentKVK.phone}`} className="text-emerald-700 font-bold hover:underline">
                {currentKVK.phone}
              </a>
            </div>

            <div className="md:col-span-2">
              <strong className="block text-slate-900 mb-0.5">{t.helpline.address}:</strong>
              <span>{currentKVK.address}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 flex justify-end">
            <a
              href={`tel:${currentKVK.phone}`}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'அதிகாரியை அழைக்க' : 'Call KVK Officer'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
