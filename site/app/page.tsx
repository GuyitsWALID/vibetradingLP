'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Sun, Moon, TrendingUp, Calendar, Users, ArrowUpRight, ArrowDownRight,
 Activity, Shield, Zap, Globe, ArrowRight, ChevronUp,
 ChevronDown as ChevronDownIcon, Award, Target, Flame,
 Eye, BookOpen, Trophy, Layers, Network, Landmark, BarChart3, Play,
 Send, Youtube, Twitter, Music2, ExternalLink
} from 'lucide-react';

import SvgComponent from './components/SVGcomp';


interface PriceData { pair: string; price: string; change: number; time: string; }
interface CalendarEvent { date?: string; time: string; country: string; event: string; impact: string; forecast: string; previous: string; }
interface CalendarApiResponse { events: CalendarEvent[]; isLive: boolean; }
interface NewsBrief { id: number | string; topic: string; source: string; impact: string; time: string; note: string; url?: string | null; }
interface FAQ { q: string; a: string; }

const toDateKey = (date: Date) => {
 const year = date.getUTCFullYear();
 const month = String(date.getUTCMonth() + 1).padStart(2, '0');
 const day = String(date.getUTCDate()).padStart(2, '0');
 return `${year}-${month}-${day}`;
};

const formatDateLabel = (dateKey: string) => {
 const date = new Date(`${dateKey}T00:00:00Z`);
 if (Number.isNaN(date.getTime())) return dateKey;
 return date.toLocaleDateString('en-GB', {
   weekday: 'short',
   day: '2-digit',
   month: 'short',
   year: 'numeric',
   timeZone: 'UTC',
 });
};

const FALLBACK_PRICES: PriceData[] = [
 { pair: 'EUR/USD', price: '1.08742', change: 0.12, time: 'Live' },
 { pair: 'GBP/USD', price: '1.27385', change: -0.08, time: 'Live' },
 { pair: 'USD/JPY', price: '149.420', change: 0.34, time: 'Live' },
 { pair: 'XAU/USD', price: '2,248.60', change: 0.56, time: 'Live' },
 { pair: 'AUD/USD', price: '0.65432', change: -0.15, time: 'Live' },
 { pair: 'USD/CAD', price: '1.36102', change: 0.04, time: 'Live' },
 { pair: 'NZD/USD', price: '0.60870', change: -0.22, time: 'Live' },
 { pair: 'DXY', price: '98.040', change: -0.18, time: 'Live' },
];
const FALLBACK_CALENDAR: CalendarEvent[] = [
 { time: '13:30', country: 'US', event: 'NFP Non-Farm Payrolls', impact: 'high', forecast: '180K', previous: '205K' },
 { time: '15:00', country: 'EU', event: 'ECB Rate Decision', impact: 'high', forecast: '4.50%', previous: '4.50%' },
 { time: '10:00', country: 'UK', event: 'GDP QoQ', impact: 'medium', forecast: '0.1%', previous: '-0.1%' },
 { time: '08:30', country: 'CA', event: 'Trade Balance', impact: 'low', forecast: '2.1B', previous: '1.8B' },
];
const FALLBACK_NEWS: NewsBrief[] = [
 { id: 9, topic: 'ECB Dovish Surprise', source: 'Macro Desk', impact: 'high', time: '14:22', note: 'ECB cut rates by 25bps. Market is repricing the June meeting path.' },
 { id: 8, topic: 'BOE Holds at 5.25%', source: 'Rate Watch', impact: 'medium', time: '12:05', note: 'BOE statement stayed cautious, keeping the growth-inflation balance in focus.' },
 { id: 7, topic: 'Real Yields Slip', source: 'Bond Monitor', impact: 'high', time: '09:15', note: 'US real yields moved lower into session, supporting gold and risk sentiment.' },
];
const FAQS: FAQ[] = [
 { q: 'What is Vibe Trading?', a: 'Vibe Trading is a fundamentals-first forex and macro trading community. We focus on central bank policy, interest rate differentials, economic data (NFP, CPI, GDP), and intermarket correlations —not just chart patterns.' },
 { q: 'What are the gamification features?', a: 'Earn "Macro Coins" for correctly predicting high-impact events. Build streaks, climb the Macro Ladder with XP, and unlock badges like "Institutional Analyst" and "Yield Curve Whisperer".' },
 { q: 'Do I need trading experience?', a: 'No. We educate from basics to advanced macro concepts. Structured learning paths take you from understanding central banks to reading yield curves.' },
 { q: 'How does real-time data work?', a: 'TwelveData for live price feeds, Forex Factory for economic calendar, Financial Juice for squawk. Updates every 1-3 seconds.' },
];
const GAMIFICATION = [
 { icon: Flame, title: 'Streak Engine', desc: 'Build daily analysis streaks by reviewing economic releases. Longer streaks = more Macro Coins.', detail: '30-day streak unlocks badge' },
 { icon: Award, title: 'Macro Leaderboards', desc: 'Compete globally on prediction accuracy, thesis quality, and community contributions.', detail: 'Top 10 featured weekly' },
 { icon: Trophy, title: 'Achievement Badges', desc: 'Unlock badges like Data Master, Yield Curve Whisperer, Central Bank Decoder.', detail: '20+ unique badges' },
 { icon: Target, title: 'Prediction Challenges', desc: 'Predict economic outcomes before releases. Make your call and earn XP for accuracy.', detail: 'Monthly tournaments' },
 { icon: Zap, title: 'Level Progression', desc: 'Analyst-in-Training to Research Associate to Senior Analyst to Chief Strategist.', detail: 'Unlock tools and content' },
 { icon: Network, title: 'Social Trading', desc: 'Follow top analysts, share market views, earn reputation when others follow your thesis.', detail: 'Build macro rep score' },
];
// Logo SVG from your design


export default function LandingPage() {
 const [dark, setDark] = useState(true);
 const [openFaq, setOpenFaq] = useState(0);
 const [prices, setPrices] = useState(FALLBACK_PRICES);
 const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
 const [calendarIsLive, setCalendarIsLive] = useState(true);
 const [newsBriefs, setNewsBriefs] = useState(FALLBACK_NEWS);
 const [calendarUpdatedAt, setCalendarUpdatedAt] = useState<string | null>(null);
 const [newsUpdatedAt, setNewsUpdatedAt] = useState<string | null>(null);
 const [selectedCalendarDate, setSelectedCalendarDate] = useState(() => toDateKey(new Date()));
 const accent = dark ? "text-cyan" : "text-teal-700";
 const bgBase = dark ? "bg-black" : "bg-white";
 const bgSurface = dark ? "bg-surface" : "bg-gray-50";
 const textPrimary = dark ? "text-white" : "text-black";
 const textSecondary = dark ? "text-secondary" : "text-gray-600";
 const borderCol = dark ? "border-border" : "border-gray-200";
 const hoverBorder = dark ? "hover:border-cyan/30" : "hover:border-teal-700/30";
 useEffect(() => {
   const fetchPrices = async () => {
     try {
       const res = await fetch("/api/prices");
       if (res.ok) {
         const data = await res.json();
         if (data.length > 0) setPrices(data);
       }
     } catch (err) { /* fallback */ }
   };
   fetchPrices();
   const iv = setInterval(fetchPrices, 10000);
   return () => clearInterval(iv);
 }, []);

 useEffect(() => {
   const fetchCalendar = async () => {
     try {
       const res = await fetch(`/api/calendar?date=${encodeURIComponent(selectedCalendarDate)}`);
       if (!res.ok) {
         setCalendarEvents(FALLBACK_CALENDAR);
         setCalendarIsLive(false);
         setCalendarUpdatedAt(new Date().toISOString());
         return;
       }

       const data = await res.json();
       if (Array.isArray(data)) {
         setCalendarEvents(data);
         setCalendarIsLive(true);
         setCalendarUpdatedAt(new Date().toISOString());
         return;
       }

       const payload = data as Partial<CalendarApiResponse>;
       if (Array.isArray(payload.events)) {
         setCalendarEvents(payload.events);
         setCalendarIsLive(Boolean(payload.isLive));
         setCalendarUpdatedAt(new Date().toISOString());
       }
     } catch {
       // Keep fallback data when provider is unavailable.
       setCalendarEvents(FALLBACK_CALENDAR);
       setCalendarIsLive(false);
       setCalendarUpdatedAt(new Date().toISOString());
     }
   };

   fetchCalendar();
   const iv = setInterval(fetchCalendar, 60000);
   return () => clearInterval(iv);
 }, [selectedCalendarDate]);

 useEffect(() => {
   const source = new EventSource('/api/news/stream');

   const onNews = (event: MessageEvent<string>) => {
     try {
       const payload = JSON.parse(event.data) as { news?: NewsBrief[]; updatedAt?: string };
       if (Array.isArray(payload.news) && payload.news.length > 0) {
         setNewsBriefs(payload.news);
       }
       if (payload.updatedAt) {
         setNewsUpdatedAt(payload.updatedAt);
       }
     } catch {
       // Keep current data if payload parsing fails.
     }
   };

   source.addEventListener('news', onNews as EventListener);

   return () => {
     source.removeEventListener('news', onNews as EventListener);
     source.close();
   };
 }, []);

 const formatLastUpdated = (iso: string | null) => {
   if (!iso) return 'Not synced yet';
   const date = new Date(iso);
   if (Number.isNaN(date.getTime())) return 'Not synced yet';
   return date.toLocaleTimeString('en-GB', {
     hour: '2-digit',
     minute: '2-digit',
     hour12: false,
     timeZone: 'UTC',
   }) + ' UTC';
 };
 return (
   <div className={`min-h-screen ${bgBase} text-white transition-colors duration-300`}>
     {/* NAVBAR */}
     <nav className={`sticky top-0 z-50 ${dark ? "bg-navy/95" : "bg-white/95"} backdrop-blur-sm border-b ${borderCol}`}>
       <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
           <SvgComponent className="h-10 w-10" aria-label="Vibe Trading logo" />
           <div>
             <span className={`text-xl font-bold tracking-[0.08em] ${dark ? "text-white" : "text-navy"}`}>VIBE</span>
             <span className={`text-xl font-bold tracking-[0.08em] ml-1 ${accent}`}>TRADING</span>
           </div>
         </div>
         <div className="hidden md:flex items-center gap-6">
           {["Mission", "Dashboard", "Calendar", "Community"].map(link => (
             <a key={link} href={`#${link.toLowerCase()}`} className={`text-sm font-medium transition-colors ${dark ? "text-secondary hover:text-cyan" : "text-gray-600 hover:text-teal-700"}`}>{link}</a>
           ))}
         </div>
         <div className="flex items-center gap-3">
           <button onClick={() => setDark(!dark)} className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${dark ? "bg-surface border-border text-secondary hover:text-cyan" : "bg-gray-100 border-gray-200 text-gray-600 hover:text-teal-700"}`}>
             {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
           </button>
           <a href="#join" className={`rounded-sm px-5 py-2 text-sm font-semibold transition-all ${dark ? "bg-cyan text-black" : "bg-teal-700 text-white"}`}>Join Free</a>
         </div>
       </div>
     </nav>
     {/* TICKER */}
     <div className={`w-full overflow-hidden ${dark ? "bg-black border-border" : "bg-white border-gray-200"} border-b py-2`}>
       <div className="ticker-track">
         {[...prices, ...prices, ...prices].map((item, i) => (
           <span key={i} className="flex items-center gap-2 whitespace-nowrap text-[13px]">
             <span className={`font-sans font-medium ${dark ? "text-secondary" : "text-gray-600"}`}>{item.pair}</span>
             <span className={`font-mono font-medium tabular-nums ${dark ? "text-white" : "text-black"}`}>{item.price}</span>
             <span className={`font-mono tabular-nums text-[11px] flex items-center gap-1 ${item.change >= 0 ? "text-bullish" : "text-bearish"}`}>
               {item.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
               {item.change >= 0 ? "+" : ""}{item.change}%
             </span>
           </span>
         ))}
       </div>
     </div>
     {/* HERO */}
     <section className="relative overflow-hidden">
       <div className="absolute inset-0 pointer-events-none">
         <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] ${dark ? "bg-cyan/[0.08]" : "bg-teal-400/[0.06]"}`} />
       </div>
       <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center relative z-10">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
           <div className={`inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border ${dark ? "border-cyan/20 bg-cyan/5" : "border-teal-700/20 bg-teal-50"}`}>
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
             </span>
             <span className={`text-xs font-mono uppercase tracking-wider ${dark ? "text-cyan" : "text-teal-800"}`}>Live Market Data Active</span>
           </div>
           <h1 className={`text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight ${textPrimary}`}>
             <span className={`inline-flex items-center px-6 py-1.5 rounded-full text-lg sm:text-xl md:text-2xl font-bold mb-4 ${dark ? "bg-cyan text-black" : "bg-teal-700 text-white"}`}>
               #1 Trading Community in Ethiopia
             </span>
             <br />
             Master Fundamental Analysis
             <br />
             <span className={accent}>&amp; Trade Smarter</span>
           </h1>
           <p className={`mt-6 max-w-2xl mx-auto text-lg sm:text-xl ${textSecondary}`}>
             Join Ethiopia&apos;s fastest-growing trading community. Learn to analyze markets like a pro with real-time data, interactive lessons, and expert guidance.
           </p>
           <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
             <a href="#join" className={`group inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold transition-all ${dark ? "bg-cyan text-black" : "bg-teal-700 text-white"}`}>
               Start Free
               <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
             </a>
             <a href="#dashboard" className={`rounded-full px-8 py-3 text-sm font-semibold border transition-all ${dark ? "border-cyan/30 text-cyan hover:border-cyan hover:bg-cyan/5" : "border-teal-700 text-teal-700 hover:border-teal-700 hover:bg-teal-50"}`}>
               Explore Dashboard
             </a>
           </div>
           <p className={`mt-4 text-xs font-mono ${dark ? "text-secondary/50" : "text-gray-500"}`}>10,000+ traders &middot; Central bank analysis &middot; Event-driven execution</p>
         </motion.div>
       </div>
     </section>
     {/* MISSION */}
     <section id="mission" className="max-w-7xl mx-auto px-6 py-20">
       <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
         <div className={`inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border ${dark ? "bg-cyan/5 border-cyan/20" : "bg-teal-50 border-teal-200"}`}>
           <Landmark className={`h-4 w-4 ${accent}`} />
           <span className={`text-xs font-mono ${accent} uppercase tracking-wider`}>Our Philosophy</span>
         </div>
         <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${textPrimary}`}>
           Trading is Macro <span className={accent}>Research</span>. Not Pattern Chasing.
         </h2>
         <div className={`max-w-3xl mx-auto text-base sm:text-lg leading-relaxed space-y-4 ${textSecondary}`}>
           <p>The market isn't driven by lines on a chart. It's driven by <span className={`font-semibold ${textPrimary}`}>central bank policy</span>, <span className={`font-semibold ${textPrimary}`}>interest rate differentials</span>, and the flow of <span className={`font-semibold ${textPrimary}`}>economic data</span>.</p>
           <p>Vibe Trading was founded on a simple principle: <strong className={accent}>understand the central bank playbook before it plays out.</strong> We replace lagging indicators with forward-looking macro analysis.</p>
         </div>
       </motion.div>
       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { icon: Landmark, title: "Central Bank Policy", desc: "Fed, ECB, BOE, BOJ —track every decision and forward guidance." },
           { icon: BarChart3, title: "Economic Data", desc: "NFP, CPI, GDP, PMI —consensus vs actual and trade impact." },
           { icon: Layers, title: "Intermarket Analysis", desc: "Yield curves, commodity drivers, dollar cycles and correlations." },
           { icon: Shield, title: "Risk Management", desc: "Event-based position sizing, volatility-adjusted stops, invalidation rules." },
         ].map((pillar, i) => (
           <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 * i }}
             className={`rounded-none p-6 border ${bgSurface} ${borderCol} transition-colors ${hoverBorder}`}>
             <div className={`h-10 w-10 flex items-center justify-center rounded ${dark ? "bg-cyan/10" : "bg-teal-50"}`}>
               <pillar.icon className={`h-5 w-5 ${accent}`} />
             </div>
             <h3 className={`text-lg font-semibold mb-2 mt-4 ${textPrimary}`}>{pillar.title}</h3>
             <p className={`text-sm leading-relaxed ${textSecondary}`}>{pillar.desc}</p>
           </motion.div>
         ))}
       </div>
     </section>
    {/* COMMAND CENTER - TradingView Chart + News */}
     <section id="dashboard" className="max-w-7xl mx-auto px-6 pb-20">
       <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
         <div className={`inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border ${dark ? "bg-cyan/5 border-cyan/20" : "bg-teal-50 border-teal-200"}`}>
           <Activity className={`h-4 w-4 ${accent}`} />
           <span className={`text-xs font-mono ${accent} uppercase tracking-wider`}>Live Command Center</span>
         </div>
         <h2 className={`text-3xl sm:text-4xl font-bold ${textPrimary}`}>Your Trading <span className={accent}>Command Center</span></h2>
         <p className={`mt-2 ${textSecondary}`}>Real-time charts, calendar, and macro news flow.</p>
       </motion.div>
       {/* TradingView Widget */}
       <div id="tradingview-widget" className="mb-12">
         <div className={`tradingview-widget-container rounded-none border ${borderCol} overflow-hidden`} style={{ height: 500 }}>
           <iframe
             src={`https://www.tradingview.com/widgetembed/?symbol=OANDA%3AEURUSD&interval=60&theme=${dark ? "dark" : "light"}&style=1&timezone=Etc%2FUTC&withdateranges=1&hide_side_toolbar=0&allow_symbol_change=1&save_image=0`}
             style={{ width: "100%", height: "100%", border: "none" }}
             title="TradingView Chart"
           />
         </div>
       </div>
      {/* Calendar + News */}
       <div className="grid md:grid-cols-2 gap-6">
         <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
           className="">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-semibold flex items-center gap-2"><Calendar className={`h-5 w-5 ${accent}`} /> Economic Calendar</h3>
             <div className="flex items-center gap-3">
               <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold border ${calendarIsLive ? (dark ? 'border-emerald-500/60 text-emerald-300' : 'border-emerald-600/40 text-emerald-700') : (dark ? 'border-red-500/60 text-red-300' : 'border-red-600/40 text-red-700')}`}>
                 <span className={`h-1.5 w-1.5 rounded-full ${calendarIsLive ? 'bg-emerald-400' : 'bg-red-500'}`} />
                 {calendarIsLive ? 'LIVE' : 'NOT LIVE DATA'}
               </span>
               <span className={`text-xs font-medium ${accent}`}>Updated {formatLastUpdated(calendarUpdatedAt)}</span>
             </div>
           </div>
           <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
             <div className={`text-xs font-medium ${textSecondary}`}>
               Showing: <span className={`${textPrimary} font-semibold`}>{formatDateLabel(selectedCalendarDate)} (UTC)</span>
             </div>
             <div className="flex items-center gap-2">
               <button
                 onClick={() => setSelectedCalendarDate(toDateKey(new Date()))}
                 className={`px-3 py-1.5 text-xs font-semibold border ${dark ? 'border-cyan/40 text-cyan hover:bg-cyan/10' : 'border-teal-700/40 text-teal-700 hover:bg-teal-50'}`}
               >
                 Today
               </button>
               <input
                 type="date"
                 value={selectedCalendarDate}
                 onChange={(event) => setSelectedCalendarDate(event.target.value)}
                 className={`px-2.5 py-1.5 text-xs border outline-none ${dark ? 'border-zinc-700 bg-zinc-900 text-zinc-100' : 'border-gray-300 bg-white text-gray-900'}`}
               />
             </div>
           </div>
           <div className="space-y-4">
            {calendarEvents.length === 0 ? (
              <div className={`rounded-none p-5 border ${bgSurface} ${borderCol}`}>
                <p className={`text-sm ${textSecondary}`}>
                  No scheduled Forex Factory events for {formatDateLabel(selectedCalendarDate)}.
                </p>
              </div>
            ) : calendarEvents.map((evt, i) => (
              <motion.div key={`${evt.time}-${evt.country}-${evt.event}-${i}`} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.12 * (i + 1) }}
                className={`rounded-none p-5 border ${bgSurface} ${borderCol} transition-colors ${hoverBorder}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wider ${evt.impact === "high" ? "bg-bearish text-white" : evt.impact === "medium" ? "bg-impact-middle text-black" : "bg-impact-low text-black"}`}>{evt.impact.toUpperCase()}</span>
                    <span className={`font-semibold ${textPrimary}`}>{evt.event}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold border ${calendarIsLive ? (dark ? 'border-emerald-500/60 text-emerald-300' : 'border-emerald-600/40 text-emerald-700') : (dark ? 'border-red-500/60 text-red-300' : 'border-red-600/40 text-red-700')}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${calendarIsLive ? 'bg-emerald-400' : 'bg-red-500'}`} />
                    {calendarIsLive ? 'LIVE' : 'NOT LIVE DATA'}
                  </span>
                </div>

                <p className={`text-sm font-medium ${textPrimary}`}>Time: <span className="font-mono">{evt.time}</span> <span className={`ml-2 px-2 py-0.5 text-xs border ${dark ? 'border-zinc-700 bg-zinc-900' : 'border-gray-300 bg-gray-100'}`}>{evt.country}</span></p>
                <p className={`text-sm mt-1 ${textSecondary}`}>Forecast: {evt.forecast} | Previous: {evt.previous}</p>

                <div className={`mt-3 flex items-center gap-4 text-xs ${textSecondary}`}>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />Economic Feed</span>
                  <span>{evt.time}</span>
                </div>
              </motion.div>
            ))}
           </div>
         </motion.div>
         <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-4">
           <div className="flex items-center justify-between">
             <h3 className="text-lg font-semibold flex items-center gap-2"><TrendingUp className={`h-5 w-5 ${accent}`} /> Live Macro Feed</h3>
             <span className={`text-xs font-medium ${accent}`}>Updated {formatLastUpdated(newsUpdatedAt)}</span>
           </div>
           {newsBriefs.map((item, i) => (
             <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.15 * (i + 1) }}
               className={`rounded-none p-5 border ${bgSurface} ${borderCol} transition-colors ${hoverBorder}`}>
               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-3">
                   <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wider ${item.impact === "high" ? "bg-bearish text-white" : item.impact === "medium" ? "bg-impact-middle text-black" : "bg-impact-low text-black"}`}>{item.impact.toUpperCase()}</span>
                   {item.url ? (
                     <a href={item.url} target="_blank" rel="noopener noreferrer" className={`font-semibold inline-flex items-center gap-1 hover:underline ${textPrimary}`}>
                       {item.topic}
                       <ExternalLink className="h-3.5 w-3.5" />
                     </a>
                   ) : (
                     <span className={`font-semibold ${textPrimary}`}>{item.topic}</span>
                   )}
                 </div>
                 <span className={`px-2 py-0.5 text-[10px] font-semibold border border-cyan text-cyan`}>
                   LIVE
                 </span>
               </div>
               <p className={`text-sm font-medium ${textPrimary}`}>Source: <span className={`px-2 py-0.5 text-xs border ${dark ? 'border-zinc-700 bg-zinc-900' : 'border-gray-300 bg-gray-100'}`}>{item.source}</span></p>
               <p className={`text-sm mt-1 ${textSecondary}`}>{item.note}</p>
               <div className={`mt-3 flex items-center gap-4 text-xs ${textSecondary}`}>
                 <span className="flex items-center gap-1"><Users className="h-3 w-3" />Terminal Feed</span>
                 <span>{item.time}</span>
               </div>
             </motion.div>
           ))}
         </motion.div>
       </div>
     </section>
     {/* GAMIFIED FEATURES */}
     <section className={`py-20 border-y ${dark ? "bg-surface/50 border-border" : "bg-gray-50 border-gray-200"}`}>
       <div className="max-w-7xl mx-auto px-6">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
           <div className={`inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border ${dark ? "bg-cyan/5 border-cyan/20" : "bg-teal-50 border-teal-200"}`}>
             <Zap className={`h-4 w-4 ${accent}`} />
             <span className={`text-xs font-mono ${accent} uppercase tracking-wider`}>Gamified Learning</span>
           </div>
           <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${textPrimary}`}>
             Learn Macro Trading. <span className={accent}>Like a Game.</span>
           </h2>
           <p className={`max-w-2xl mx-auto text-lg ${textSecondary}`}>
             Earn XP, build streaks, climb leaderboards. Every analysis you do makes you sharper.
           </p>
         </motion.div>
         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {GAMIFICATION.map((feat, i) => (
             <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 * i }}
               className={`rounded-none p-6 border transition-colors ${dark ? "bg-black/50 border-border hover:border-cyan/30" : "bg-white border-gray-200 hover:border-teal-700/30"}`}>
               <feat.icon className={`h-8 w-8 mb-4 ${accent}`} />
               <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>{feat.title}</h3>
               <p className={`text-sm leading-relaxed mb-3 ${textSecondary}`}>{feat.desc}</p>
               <span className={`inline-flex items-center text-xs font-mono px-2 py-1 rounded ${dark ? "bg-cyan/10 text-cyan" : "bg-teal-50 text-teal-700"}`}>{feat.detail}</span>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
     {/* COMMUNITY */}
     <section id="community" className="max-w-7xl mx-auto px-6 py-20">
       <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
         <div className={`inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border ${dark ? "bg-cyan/5 border-cyan/20" : "bg-teal-50 border-teal-200"}`}>
           <Globe className={`h-4 w-4 ${accent}`} />
           <span className={`text-xs font-mono ${accent} uppercase tracking-wider`}>Ecosystem</span>
         </div>
         <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${textPrimary}`}>Your <span className={accent}>Macro Network</span></h2>
         <p className={`max-w-2xl mx-auto text-lg ${textSecondary}`}>From real-time alerts to deep-dive education.</p>
       </motion.div>
       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { icon: Send, title: "Telegram", desc: "Real-time command center with pre-event briefs and macro context.", color: "text-sky-500" },
           { icon: Youtube, title: "YouTube", desc: "Deep-dive education: policy cycles, indicator breakdowns, weekly reviews.", color: "text-red-500" },
           { icon: Music2, title: "TikTok", desc: "Rapid macro education in 30-60s clips.", color: "text-pink-500" },
           { icon: Globe, title: "Web Dashboard", desc: "Central hub with live data, charts, calendar, and community tools.", color: accent },
         ].map((p, i) => (
           <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 * i }}
             className={`rounded-none p-6 border ${bgSurface} ${borderCol} transition-colors ${hoverBorder}`}>
             <p.icon className={`h-8 w-8 mb-4 ${p.color}`} />
             <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>{p.title}</h3>
             <p className={`text-sm leading-relaxed ${textSecondary}`}>{p.desc}</p>
           </motion.div>
         ))}
       </div>
       {/* Level Progression */}
       <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
         className={`mt-16 rounded-none p-8 border ${dark ? "bg-black/50 border-border" : "bg-white border-gray-200"}`}>
         <h3 className={`text-2xl font-bold text-center mb-8 ${textPrimary}`}>Macro <span className={accent}>Level Progression</span></h3>
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
           {[
             { level: "Level 1", title: "Analyst-in-Training", desc: "Basic education, watchlist", color: accent },
             { level: "Level 2", title: "Research Associate", desc: "Full news feed, chat access", color: dark ? "text-blue-400" : "text-blue-700" },
             { level: "Level 3", title: "Senior Analyst", desc: "Squawk, custom alerts", color: dark ? "text-yellow-400" : "text-amber-600" },
             { level: "Level 4", title: "Chief Strategist", desc: "API access, 1-on-1s", color: dark ? "text-purple-400" : "text-purple-700" },
           ].map((lvl, i) => (
             <div key={i} className={`text-center p-4 rounded-none border ${dark ? "border-border bg-surface/30" : "border-gray-200 bg-gray-50"}`}>
               <span className={`text-xs font-mono font-semibold ${lvl.color} uppercase`}>{lvl.level}</span>
               <h4 className={`font-semibold mt-1 ${textPrimary}`}>{lvl.title}</h4>
               <p className={`text-xs mt-1 ${textSecondary}`}>{lvl.desc}</p>
             </div>
           ))}
         </div>
       </motion.div>
     </section>
     {/* HOW IT WORKS */}
     <section className={`py-20 ${dark ? "bg-surface/50" : "bg-gray-50"}`}>
       <div className="max-w-5xl mx-auto px-6">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
           <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${textPrimary}`}>How <span className={accent}>Vibe</span> Works</h2>
           <p className={textSecondary}>From zero to macro-ready in 3 steps.</p>
         </motion.div>
         {[
           { step: "01", title: "Join Free & Build Watchlist", desc: "Create account, add your pairs, set alerts. Get immediate access to live tickers and calendar." },
           { step: "02", title: "Study Pre-Event Briefs", desc: "Before every NFP, CPI, or rate decision our analysts publish consensus, deviation scenarios, and reaction paths." },
           { step: "03", title: "Build a Macro Plan", desc: "Every brief includes fundamental reasoning, risk context, and a clear event playbook." },
         ].map((item, i) => (
           <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 * i }} className="flex items-start gap-6 mb-8">
             <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center">
               <span className={`text-sm font-mono font-bold ${accent}`}>{item.step}</span>
             </div>
             <div>
               <h3 className={`text-lg font-semibold ${textPrimary}`}>{item.title}</h3>
               <p className={`text-sm mt-1 ${textSecondary}`}>{item.desc}</p>
             </div>
           </motion.div>
         ))}
       </div>
     </section>
     {/* STATS */}
     <section className={`py-16 border-y ${bgSurface} ${borderCol}`}>
       <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
         {[
           { value: "10,000+", label: "Active Members" },
           { value: "12,400", label: "Macro Briefs Published" },
           { value: "96%", label: "Calendar Coverage" },
           { value: "24/5", label: "Market Coverage" },
         ].map((stat, i) => (
           <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 * i }}>
             <div className={`font-mono text-3xl sm:text-4xl font-semibold ${accent}`}>{stat.value}</div>
             <div className={`text-sm mt-1 font-medium ${textPrimary}`}>{stat.label}</div>
           </motion.div>
         ))}
       </div>
     </section>
     {/* FAQ */}
     <section className="max-w-3xl mx-auto px-6 py-20">
       <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-8 ${textPrimary}`}>Frequently Asked Questions</h2>
       <div className="space-y-2">
         {FAQS.map((faq, i) => (
           <div key={i} className={`rounded-none border ${borderCol} overflow-hidden`}>
             <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className={`w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium transition-colors ${textPrimary} ${dark ? "hover:bg-surface" : "hover:bg-gray-50"}`}>
               {faq.q}
               {openFaq === i ? <ChevronUp className={`h-4 w-4 ${accent} flex-shrink-0`} /> : <ChevronDownIcon className={`h-4 w-4 ${dark ? "text-secondary" : "text-gray-400"} flex-shrink-0`} />}
             </button>
             <AnimatePresence>
               {openFaq === i && (
                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                   <p className={`px-5 pb-4 text-sm leading-relaxed ${textSecondary}`}>{faq.a}</p>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
         ))}
       </div>
     </section>
     {/* CTA */}
     <section className={`py-20 ${dark ? "bg-surface border-y border-border" : "bg-gray-50 border-y border-gray-200"}`}>
       <div className="max-w-3xl mx-auto px-6 text-center">
         <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SvgComponent className="h-12 w-12 mx-auto" aria-label="Vibe Trading logo" />
           <h2 className={`text-3xl sm:text-4xl font-bold mb-4 mt-4 ${textPrimary}`}>Ready to trade with <span className={accent}>purpose</span>?</h2>
           <p className={`text-lg mb-8 ${textSecondary}`}>Join 10,000+ traders who understand the WHY, not just the WHAT.</p>
           <a href="#join" className={`inline-flex items-center gap-2 rounded-sm px-8 py-3 text-sm font-semibold transition-all ${dark ? "bg-cyan text-black" : "bg-teal-700 text-white"}`}>
             Join Free Now <ArrowRight className="h-4 w-4" />
           </a>
         </motion.div>
       </div>
     </section>
     {/* FOOTER */}
     <footer className={`py-8 border-t ${borderCol}`}>
       <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-2">
            <SvgComponent className="h-8 w-8" aria-label="Vibe Trading logo" />
           <span className={`text-xs ${textSecondary}`}>&copy; 2026 Vibe Trading.</span>
         </div>
         <div className="flex items-center gap-5">
           <a href="https://t.me/" className={`${textSecondary} ${dark ? "hover:text-cyan" : "hover:text-teal-700"} transition-colors`}><Send className="w-5 h-5" /></a>
           <a href="https://youtube.com/" className={`${textSecondary} ${dark ? "hover:text-cyan" : "hover:text-teal-700"} transition-colors`}><Youtube className="w-5 h-5" /></a>
           <a href="https://tiktok.com/" className={`${textSecondary} ${dark ? "hover:text-cyan" : "hover:text-teal-700"} transition-colors`}><Music2 className="w-5 h-5" /></a>
           <a href="https://x.com/" className={`${textSecondary} ${dark ? "hover:text-cyan" : "hover:text-teal-700"} transition-colors`}><Twitter className="w-5 h-5" /></a>
         </div>
       </div>
     </footer>
   </div>
 );
}
