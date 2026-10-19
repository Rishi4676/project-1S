"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { useLocation } from '@/components/LocationContext';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Sprout,
  Bot,
  User,
  AlertCircle,
  Minimize2,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isError?: boolean;
}

export const AgriChatbot: React.FC = () => {
  const { language, t } = useLanguage();
  const { location } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize greeting on mount or language switch if empty
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = language === 'ta'
        ? `வணக்கம்! நான் கிசான் மித்ரா வேளாண் AI உதவியாளர். பயிர் சாகுபடி, உரம் (NPK), பூச்சி மேலாண்மை, நேரலை வானிலை மற்றும் அரசு மானியங்கள் குறித்த உங்கள் கேள்விகளுக்கு பதிலளிக்க தயாராக உள்ளேன். எதைப் பற்றி அறிய விரும்புகிறீர்கள்?`
        : `Hello! I am Kisan Mitra Agri AI Assistant. I can help you with crop management, fertilizers (NPK), pest control, real-time weather advisory, and government subsidies. What would you like to know today?`;

      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [language]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Handle message sending
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsgId = 'u-' + Date.now();
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: userTimestamp,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language,
          location: {
            name: location.name,
            district: location.district,
            lat: location.lat,
            lng: location.lng,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const botReply = data.reply || (language === 'ta'
        ? 'மன்னிக்கவும், தகவலைப் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
        : 'Sorry, I could not retrieve the information. Please try again.');

      setMessages((prev) => [
        ...prev,
        {
          id: 'b-' + Date.now(),
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      const isTimeout = err?.name === 'AbortError';
      const errMsg = isTimeout
        ? (language === 'ta' ? 'இணைப்பு நேரம் முடிந்தது. மீண்டும் முயற்சிக்கவும்.' : 'Request timed out. Please check your internet connection and try again.')
        : (language === 'ta' ? 'சேவையகத்தை தொடர்பு கொள்ள முடியவில்லை. சிறிது நேரம் கழித்து முயற்சிக்கவும்.' : 'Could not reach the advisory server. Please try again in a moment.');

      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'bot',
          text: errMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    const greeting = language === 'ta'
      ? `வணக்கம்! புதிய விவாதம் தொடங்கப்பட்டுள்ளது. பயிர், உரம், பூச்சி அல்லது வானிலை ஆலோசனை பற்றி கேட்கலாம்.`
      : `Hello! Conversation reset. Feel free to ask about crops, fertilizers, pest control, or weather advisory.`;

    setMessages([
      {
        id: 'reset-' + Date.now(),
        sender: 'bot',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Quick suggestion chips
  const suggestionChips = language === 'ta'
    ? [
        'நெல் குலை நோய் தடுப்பது எப்படி?',
        'கரும்புக்கான NPK உரம் அட்டவணை',
        'இன்று மருந்து தெளிக்கலாமா?',
        'PM-KISAN மானியம் விவரம்',
      ]
    : [
        'How to treat paddy blast?',
        'NPK dosage for sugarcane',
        'Is it safe to spray pesticide today?',
        'PM-KISAN subsidy details',
      ];

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Agriculture AI Chatbot"
          className="fixed z-40 bottom-20 md:bottom-6 right-4 md:right-6 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white p-3.5 sm:p-4 rounded-full shadow-2xl border-2 border-emerald-300/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2.5 group"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-emerald-100 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white" />
          </div>
          <span className="hidden sm:inline font-bold text-sm tracking-wide text-white pr-1">
            {language === 'ta' ? 'வேளாண் AI சாட்' : 'Agri AI Chat'}
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Kisan Mitra Agricultural AI Chatbot"
          className="fixed z-50 bottom-16 md:bottom-6 right-2 md:right-6 w-[calc(100vw-1rem)] sm:w-[420px] max-w-[95vw] h-[580px] max-h-[82vh] bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-[#1B431C] px-4 py-3 border-b border-emerald-600/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-400/30">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {language === 'ta' ? 'கிசான் வேளாண் AI' : 'Kisan Agri AI'}
                  </h3>
                  <span className="text-[10px] bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-300 inline" />
                    ICAR Verified
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 font-medium">
                  {location.name} • {language === 'ta' ? 'விவசாய ஆலோசனை' : 'Farming Advisory'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title={language === 'ta' ? 'புதிய உரையாடல்' : 'Reset chat'}
                className="p-1.5 text-emerald-200/80 hover:text-white hover:bg-emerald-700/50 rounded-lg transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title={language === 'ta' ? 'மூடு' : 'Close chat'}
                className="p-1.5 text-emerald-200/80 hover:text-white hover:bg-emerald-700/50 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick suggestions header bar */}
          <div className="bg-slate-800/80 px-3 py-2 border-b border-slate-700/60 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="text-[11px] text-slate-400 shrink-0 font-medium mr-1">
              {language === 'ta' ? 'பரிந்துரைகள்:' : 'Suggestions:'}
            </span>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSendMessage(chip)}
                className="shrink-0 bg-slate-700/80 hover:bg-emerald-900/60 hover:text-emerald-200 hover:border-emerald-500/50 text-slate-300 text-[11px] px-2.5 py-1 rounded-full border border-slate-600/60 transition disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-700/60 border border-emerald-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-emerald-200" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-[13px] leading-relaxed break-words whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : msg.isError
                      ? 'bg-red-950/80 border border-red-500/50 text-red-200 rounded-tl-xs'
                      : 'bg-slate-800/90 border border-slate-700/70 text-slate-100 rounded-tl-xs'
                  }`}
                >
                  {msg.isError && (
                    <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'பிழை' : 'Notice'}</span>
                    </div>
                  )}
                  <div>{msg.text}</div>
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-700/60 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-emerald-200 animate-pulse" />
                </div>
                <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="ml-1 text-[11px] text-emerald-300 font-medium">
                    {language === 'ta' ? 'பரிசீலிக்கிறது...' : 'Analyzing farm advisory...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Bar */}
          <div className="p-3 bg-slate-800/95 border-t border-slate-700/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={
                  language === 'ta'
                    ? 'பயிர், பூச்சி, உரம் அல்லது வானிலை பற்றிக் கேளுங்கள்...'
                    : 'Ask about crops, pests, fertilizers, weather...'
                }
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 outline-none transition focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white disabled:text-slate-500 p-2.5 rounded-xl shadow transition duration-150 flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex justify-between items-center mt-1.5 px-1 text-[10px] text-slate-400">
              <span>{language === 'ta' ? 'ICAR & TNAU விவசாய வழிகாட்டுதல்' : 'ICAR & TNAU Scientific Advisory'}</span>
              <span>{language === 'ta' ? 'தமிழ் & ஆங்கிலம்' : 'Tamil & English'}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
