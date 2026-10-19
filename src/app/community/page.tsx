"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { useLocation } from '@/components/LocationContext';
import { Badge } from '@/components/ui/Badge';
import { ThumbsUp, MessageSquare, PlusCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

export default function CommunityPage() {
  const { t } = useLanguage();
  const { location } = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Ramanathan",
      location: "Thanjavur, TN",
      crop: "Paddy / Rice (நெல்)",
      category: "Pest & Disease",
      title: "Best organic remedy for leaf folder pest in 3-acre paddy field?",
      content: "Noticed leaf folding in 3-acre paddy field after recent rains. What is the recommended Neem oil concentration and application timing?",
      upvotes: 18,
      avatarBg: "bg-emerald-100 text-[#2D572C]",
      time: "2 hours ago",
      comments: [
        { id: 101, author: "Dr. K. Swaminathan", role: "KVK Agri Expert", content: "Spray 5% Neem Seed Kernel Extract (NSKE) @ 50 ml/L or release Trichogramma chilonis egg parasitoids @ 5 cards/ha in early morning.", isExpert: true }
      ]
    },
    {
      id: 2,
      author: "Suresh Kumar",
      location: "Madurai, TN",
      crop: "Cotton (பருத்தி)",
      category: "Govt Schemes",
      title: "PM-KISAN 18th installment credit status check process?",
      content: "Has anyone received the 18th installment credit SMS? How to verify Aadhaar e-KYC status on official portal?",
      upvotes: 14,
      avatarBg: "bg-amber-100 text-amber-900",
      time: "5 hours ago",
      comments: [
        { id: 102, author: "Pravin Agri Officer", role: "TNAU Extension Officer", content: "Check status on pmkisan.gov.in under 'Know Your Status' tab using your registration number & registered Aadhaar phone.", isExpert: true }
      ]
    },
    {
      id: 3,
      author: "Muthusamy",
      location: "Pollachi, TN",
      crop: "Coconut (தேங்காய்)",
      category: "Fertilizer & Soil",
      title: "Recommended fertilizer dosage for 5-year-old coconut palms?",
      content: "What is the exact Urea, Super Phosphate, and Potash dosage per tree during South-West Monsoon season?",
      upvotes: 11,
      avatarBg: "bg-teal-100 text-teal-900",
      time: "1 day ago",
      comments: [
        { id: 103, author: "Dr. S. Vasanthi", role: "ICAR Coconut Specialist", content: "Apply 1.3 kg Urea + 2.0 kg Super Phosphate + 2.0 kg MOP per palm per year in two split doses (June & December).", isExpert: true }
      ]
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCrop, setNewCrop] = useState('Paddy / Rice (நெல்)');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    const newPost = {
      id: Date.now(),
      author: "You (Farmer)",
      location: `${location.name}, TN`,
      crop: newCrop,
      category: "General Query",
      title: newTitle,
      content: newContent,
      upvotes: 1,
      avatarBg: "bg-[#2D572C] text-white",
      time: "Just now",
      comments: []
    };
    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowForm(false);
  };

  const CATEGORIES = ["All", "Pest & Disease", "Fertilizer & Soil", "Irrigation", "Govt Schemes"];

  const filteredPosts = posts.filter(p => activeCategory === 'All' || p.category === activeCategory);

  return (
    <div className="space-y-5">
      {/* Header Banner - Dark Elevated Panel */}
      <section className="bg-gradient-to-r from-slate-950 via-[#1B431C] to-slate-900 text-white rounded-2xl p-5 shadow-md border border-[#2D572C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="verified">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-300" />
              Peer-to-Peer Farmer Field Network
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t.community.title}</h1>
          <p className="text-emerald-100/90 text-sm font-medium">
            Ask questions, share field experiences, and get verified answers from KVK Agri Experts & TNAU Scientists.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 text-sm min-h-[44px] flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>{t.community.askBtn}</span>
        </button>
      </section>

      {/* Interactive Question Creation Form */}
      {showForm && (
        <form onSubmit={handleCreatePost} className="bg-white border border-[#2D572C]/50 rounded-xl p-5 shadow-md space-y-3.5 animate-in fade-in duration-200">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-stone-200/60 pb-2">
            <PlusCircle className="w-4 h-4 text-[#2D572C]" />
            Ask Community Question / கேள்வி கேட்க
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Crop Type</label>
              <select
                value={newCrop}
                onChange={(e) => setNewCrop(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#2D572C] bg-stone-50 text-slate-900 font-medium min-h-[40px]"
              >
                <option value="Paddy / Rice (நெல்)">Paddy / Rice (நெல்)</option>
                <option value="Tomato (தக்காளி)">Tomato (தக்காளி)</option>
                <option value="Cotton (பருத்தி)">Cotton (பருத்தி)</option>
                <option value="Coconut (தேங்காய்)">Coconut (தேங்காய்)</option>
                <option value="General Farming">General Farming</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Question Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Best fertilizer schedule for paddy?"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#2D572C] bg-stone-50 text-slate-900 font-medium min-h-[40px]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Describe symptoms, field area, or specific question..."
              rows={3}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#2D572C] bg-stone-50 text-slate-900 font-medium"
              required
            />
          </div>

          <div className="flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-stone-100 text-slate-700 font-bold rounded-lg border border-stone-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2D572C] text-white font-bold rounded-lg transition shadow-sm"
            >
              Post Question
            </button>
          </div>
        </form>
      )}

      {/* Marquee Ticker: Aceternity Infinite Moving Cards */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Trending Farmer Queries Marquee
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Live Feed</span>
        </div>
        <InfiniteMovingCards
          items={posts}
          direction="left"
          speed="normal"
          pauseOnHover={true}
          renderItem={(post) => (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold text-[#2D572C] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  {post.crop}
                </span>
                <span className="text-[11px] text-[#2D572C] font-extrabold flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3 inline" /> {post.upvotes}
                </span>
              </div>
              <h3 className="font-bold text-xs text-slate-900 line-clamp-2 mt-1 leading-snug">
                {post.title}
              </h3>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-bold text-slate-700">{post.author}</span>
                <span className="font-semibold text-emerald-800">{post.comments.length} Expert Answers</span>
              </div>
            </div>
          )}
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs bg-slate-900 border border-stone-800 rounded-xl p-3 shadow-sm text-white">
        <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider mr-1">Categories:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg border transition font-bold text-xs ${
              activeCategory === cat
                ? 'bg-[#2D572C] text-white border-emerald-400 shadow-sm'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Detailed Social Discussion Feed */}
      <div className="space-y-3.5">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white border border-stone-200/80 rounded-xl p-4 sm:p-5 shadow-sm space-y-3 hover:border-slate-300 transition">
            {/* Header: Author Avatar & Metadata */}
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0 ${post.avatarBg}`}>
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{post.author}</h3>
                    <span className="text-[11px] font-medium text-slate-500">({post.location})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium block">{post.time}</span>
                </div>
              </div>

              <span className="text-[10px] font-extrabold text-[#2D572C] bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded">
                {post.crop}
              </span>
            </div>

            {/* Question Title & Content */}
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-slate-950 tracking-tight leading-snug">{post.title}</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{post.content}</p>
            </div>

            {/* Action Bar: Upvote & Comment Counter */}
            <div className="flex items-center gap-3 pt-2 border-t border-stone-100 text-xs font-semibold text-slate-600">
              <button
                onClick={() => {
                  setPosts(posts.map(p => p.id === post.id ? { ...p, upvotes: p.upvotes + 1 } : p));
                }}
                className="flex items-center gap-1.5 hover:text-[#2D572C] bg-stone-50 hover:bg-emerald-50/60 px-3 py-1.5 rounded-lg border border-stone-200/80 transition text-xs font-bold"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-[#2D572C]" />
                <span>{t.community.upvote} ({post.upvotes})</span>
              </button>

              <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.comments.length} Answers</span>
              </span>
            </div>

            {/* Verified KVK Expert Answers Container */}
            {post.comments.length > 0 && (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-3.5 space-y-2">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-emerald-950">{comment.author}</span>
                      {comment.isExpert && (
                        <Badge variant="verified">
                          <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-300" />
                          {comment.role}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
