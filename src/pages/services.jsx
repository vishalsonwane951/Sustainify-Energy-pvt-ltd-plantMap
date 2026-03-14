import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSolarPanel,
  FaTools,
  FaChartLine,
  FaCalculator,
  FaUserTie,
  FaRecycle,
  FaHeadset,
} from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";
import {
  WrenchScrewdriverIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  CpuChipIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";

// const MAIN_SERVICES = [
//   {
//     id: 1,
//     icon: <MdCleaningServices style={{ fontSize: 28 }} />,
//     title: "Panel Cleaning",
//     desc: "Professional cleaning services that restore panel efficiency by removing dust, bird droppings, and debris.",
//     bullets: ["Dry & Wet Cleaning", "Robotic Cleaning Options", "Pre/Post Yield Report", "Scheduled Plans"],
//     boost: "+15–25% Output",
//     accent: "#34d399",
//     accentBg: "rgba(52,211,153,0.10)",
//     accentBorder: "rgba(52,211,153,0.30)",
//     accentBorderHover: "rgba(52,211,153,0.85)",
//     gradFrom: "#10b981", gradTo: "#0891b2",
//   },
//   {
//     id: 2,
//     icon: <FaTools style={{ fontSize: 24 }} />,
//     title: "O&M Services",
//     desc: "Complete operations and maintenance solutions including preventive care, system monitoring, and rapid troubleshooting.",
//     bullets: ["24/7 Remote Monitoring", "Preventive Maintenance", "Rapid Fault Dispatch", "Monthly Reports"],
//     boost: "99.2% Uptime SLA",
//     accent: "#38bdf8",
//     accentBg: "rgba(56,189,248,0.10)",
//     accentBorder: "rgba(56,189,248,0.30)",
//     accentBorderHover: "rgba(56,189,248,0.85)",
//     gradFrom: "#0ea5e9", gradTo: "#2563eb",
//   },
//   {
//     id: 3,
//     icon: <FaChartLine style={{ fontSize: 24 }} />,
//     title: "Performance Testing",
//     desc: "Advanced diagnostics with thermal imaging, IV curve testing, and efficiency analysis to identify issues early.",
//     bullets: ["IV Curve Tracing", "Thermal Imaging (IR)", "AC & DC Side Testing", "Performance Guarantee Test"],
//     boost: "IEC Certified",
//     accent: "#fbbf24",
//     accentBg: "rgba(251,191,36,0.10)",
//     accentBorder: "rgba(251,191,36,0.30)",
//     accentBorderHover: "rgba(251,191,36,0.85)",
//     gradFrom: "#f59e0b", gradTo: "#ea580c",
//   },
//   {
//     id: 4,
//     icon: <FaSolarPanel style={{ fontSize: 24 }} />,
//     title: "System Upgrades",
//     desc: "Modernize aging systems with new inverters, monitoring tech, and optimization solutions to extend system life.",
//     bullets: ["Inverter Upgrades", "SCADA Upgrades", "Full & Partial Repower", "PPA Re-alignment"],
//     boost: "Extend ROI 10+ yrs",
//     accent: "#a78bfa",
//     accentBg: "rgba(167,139,250,0.10)",
//     accentBorder: "rgba(167,139,250,0.30)",
//     accentBorderHover: "rgba(167,139,250,0.85)",
//     gradFrom: "#7c3aed", gradTo: "#6d28d9",
//   },
// ];

const ASSET_SERVICES = [
  {
    id: 5, icon: <CpuChipIcon style={{ width: 22, height: 22 }} />, label: "Asset Management",
    title: "Predictive Maintenance",
    desc: "AI-driven fault prediction using IoT sensors and real-time weather analytics to prevent unplanned downtime.",
    bullets: ["IoT Sensor Integration", "AI Degradation Forecasting", "Automated Early Alerts", "Trend Analysis Reports"],
    accent: "#34d399", accentBg: "rgba(52,211,153,0.10)", accentBorder: "rgba(52,211,153,0.28)", accentBorderHover: "rgba(52,211,153,0.8)",
  },
  {
    id: 6, icon: <ChartBarIcon style={{ width: 22, height: 22 }} />, label: "Asset Management",
    title: "Performance Monitoring",
    desc: "SCADA-integrated dashboards tracking PR, yield, availability, and irradiation with automated reports.",
    bullets: ["Real-time SCADA Dashboards", "PR & Yield Benchmarking", "Irradiation vs Output", "Automated Alarm System"],
    accent: "#fbbf24", accentBg: "rgba(251,191,36,0.10)", accentBorder: "rgba(251,191,36,0.28)", accentBorderHover: "rgba(251,191,36,0.8)",
  },
  {
    id: 7, icon: <BoltIcon style={{ width: 22, height: 22 }} />, label: "Asset Management",
    title: "Power Demand Monitoring",
    desc: "Smart grid-ready analytics to track consumption patterns, compare baselines, and optimise load profiles.",
    bullets: ["Smart Meter Integration", "Baseline vs Actual Analysis", "Load Profile Optimisation", "Demand Response Alerts"],
    accent: "#38bdf8", accentBg: "rgba(56,189,248,0.10)", accentBorder: "rgba(56,189,248,0.28)", accentBorderHover: "rgba(56,189,248,0.8)",
  },
  {
    id: 8, icon: <SignalIcon style={{ width: 22, height: 22 }} />, label: "Asset Management",
    title: "Forecasting",
    desc: "AI-powered generation forecasting using real-time weather data for grid dispatch optimisation.",
    bullets: ["Day-ahead & Intraday Forecasts", "AI + Weather Data Models", "Grid Dispatch Optimisation", "PPA Compliance Reporting"],
    accent: "#a78bfa", accentBg: "rgba(167,139,250,0.10)", accentBorder: "rgba(167,139,250,0.28)", accentBorderHover: "rgba(167,139,250,0.8)",
  },
  {
    id: 9, icon: <ArrowTrendingUpIcon style={{ width: 22, height: 22 }} />, label: "Lifecycle",
    title: "Repowering",
    desc: "Refurbish or replace ageing solar systems to extend plant lifespan, boost output, and meet updated PPA terms.",
    bullets: ["Full & Partial Repower", "Inverter Replacement", "PPA Re-alignment Support", "New Permit Assistance"],
    accent: "#4ade80", accentBg: "rgba(74,222,128,0.10)", accentBorder: "rgba(74,222,128,0.28)", accentBorderHover: "rgba(74,222,128,0.8)",
  },
  {
    id: 10, icon: <WrenchScrewdriverIcon style={{ width: 22, height: 22 }} />, label: "Lifecycle",
    title: "Decommissioning",
    desc: "Structured end-of-life deconstruction with full regulatory compliance, land restoration, and documentation.",
    bullets: ["Safe Dismantling Plan", "Regulatory Compliance Docs", "Land Restoration", "Insurance Claim Support"],
    accent: "#fb923c", accentBg: "rgba(251,146,60,0.10)", accentBorder: "rgba(251,146,60,0.28)", accentBorderHover: "rgba(251,146,60,0.8)",
  },
  {
    id: 11, icon: <FaRecycle style={{ fontSize: 18 }} />, label: "Lifecycle",
    title: "Disposal & Recycling",
    desc: "WEEE-compliant PV panel waste management coordinated with certified recycling partners.",
    bullets: ["WEEE Directive Compliance", "Certified Recycling Partners", "Environmental Impact Report", "Regulatory Documentation"],
    accent: "#2dd4bf", accentBg: "rgba(45,212,191,0.10)", accentBorder: "rgba(45,212,191,0.28)", accentBorderHover: "rgba(45,212,191,0.8)",
  },
  {
    id: 12, icon: <FaHeadset style={{ fontSize: 18 }} />, label: "Support",
    title: "Customer Support",
    desc: "24/7 pan-India support for inverters, PV modules, BOS components, data loggers, and complete plant reviews.",
    bullets: ["24/7 Helpdesk", "Inverter & Module Support", "BOS & Data Logger Checks", "Full Plant Performance Review"],
    accent: "#60a5fa", accentBg: "rgba(96,165,250,0.10)", accentBorder: "rgba(96,165,250,0.28)", accentBorderHover: "rgba(96,165,250,0.8)",
  },
];

const STATS = [
  { value: "10+", label: "MW Under Management", color: "#fde047" },
  { value: "200+", label: "Plants Monitored", color: "#4ade80" },
  { value: "99.2%", label: "Uptime SLA", color: "#60a5fa" },
  { value: "24/7", label: "Remote Operations", color: "#c084fc" },
  { value: "12+", label: "Services Offered", color: "#fbbf24" },
  { value: "50+", label: "Certified Engineers", color: "#34d399" },
];

const WHY_US = [
  { icon: <TrophyIcon style={{ width: 30, height: 30 }} />, title: "Certified Experts", desc: "Industry-certified technicians with 10+ years of solar experience.", accent: "#60a5fa", accentBg: "rgba(96,165,250,0.10)", accentBorder: "rgba(96,165,250,0.30)" },
  { icon: <ShieldCheckIcon style={{ width: 30, height: 30 }} />, title: "Guaranteed Results", desc: "Performance guarantees on all services with comprehensive warranties.", accent: "#a78bfa", accentBg: "rgba(167,139,250,0.10)", accentBorder: "rgba(167,139,250,0.30)" },
  { icon: <UserGroupIcon style={{ width: 30, height: 30 }} />, title: "200+ Happy Clients", desc: "Trusted by residential and commercial solar owners across India.", accent: "#34d399", accentBg: "rgba(52,211,153,0.10)", accentBorder: "rgba(52,211,153,0.30)" },
  { icon: <ClockIcon style={{ width: 30, height: 30 }} />, title: "24/7 Support", desc: "Round-the-clock monitoring and emergency response services.", accent: "#fb923c", accentBg: "rgba(251,146,60,0.10)", accentBorder: "rgba(251,146,60,0.30)" },
];

const TABS = [
  { key: "all", label: "All Services" },
  { key: "monitoring", label: "Monitoring & Testing", ids: [5, 6, 7, 8] },
  { key: "lifecycle", label: "Lifecycle Management", ids: [9, 10, 11, 12] },
];

//  Counter
function Counter({ value, active }) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!active) return;
    const match = value.match(/[\d.]+/);
    if (!match) { setDisplay(value); return; }
    const target = parseFloat(match[0]);
    const suffix = value.replace(match[0], "");
    let step = 0; const steps = 50;
    const iv = setInterval(() => {
      step++;
      const cur = Math.min((target / steps) * step, target);
      setDisplay((Number.isInteger(target) ? Math.round(cur) : cur.toFixed(1)) + suffix);
      if (step >= steps) clearInterval(iv);
    }, 1400 / steps);
    return () => clearInterval(iv);
  }, [active, value]);
  return <>{display}</>;
}

// Hero Button
function HeroButton({ gradient, hoverGrad, shadow, icon, label, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className={`relative overflow-hidden flex items-center gap-3 px-4.5 py-3.75 rounded-full text-white text-[16px] font-semibold cursor-pointer transition-all duration-300 ease-in-out
      ${h ? "scale-105" : "scale-100"}
      ${h ? "shadow-[0_12px_32px_var(--shadow)]" : "shadow-[0_4px_16px_rgba(0,0,0,0.3)]"}
      `}
      style={{
        background: h ? hoverGrad : gradient,
        "--shadow": shadow,
      }}
    >
      <div
        className={`absolute inset-0 pointer-events-none 
        bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.18)_50%,transparent_70%)]
        bg-size-[200%_100%]
        transition-[background-position] duration-700
        ${h ? "bg-position-[150%_0]" : "bg-[-50%_0]"}`}
      />
      {icon}
      <span className={`transition-[letter-spacing] duration-200 ${h ? "tracking-[0.04em]" : "tracking-normal"}`}>
        {label}
      </span>
    </button>
  );
}

// Tab Button
function TabButton({ tab, active, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className={`px-5.5 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-200
    ${active
          ? "bg-linear-to-r from-yellow-300 to-green-400 text-[#0d1117] border border-transparent shadow-[0_4px_16px_rgba(253,224,71,0.25)]"
          : h
            ? "text-yellow-300 border border-[rgba(253,224,71,0.5)]"
            : "text-slate-400 border border-slate-700"
        }
  `}
    >
      {tab.label}
    </button>
  );
}

// Main Service Card 
// function MainServiceCard({ s, index }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 28 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.5, delay: index * 0.1 }}
//       className="group relative flex flex-col overflow-hidden cursor-default
//   rounded-2xl px-6 py-7 border border-slate-700
//   bg-slate-900/60 shadow-lg
//   transition-all duration-300 ease-in-out
//   hover:-translate-y-1.5 hover:scale-[1.02] hover:bg-slate-900 hover:shadow-2xl"
//     >
//       <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-yellow-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//       <div className="absolute inset-0 pointer-events-none
//   bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.04)_50%,transparent_60%)]
//   bg-size-[200%_100%]
//   bg-[-50%_0] group-hover:bg-position-[150%_0]
//   transition-all duration-700"/>
//       <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/40 rounded-full px-3 py-1 mb-5 self-start">
//         <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
//         {s.boost}
//       </div>
//       <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-5 border border-yellow-400/40 bg-yellow-400/10 text-yellow-400">
//         {s.icon}
//       </div>
//       <h3 className="text-[18px] font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">
//         {s.title}
//       </h3>
//       <p className="text-[14px] leading-[1.7] text-slate-400">{s.desc}</p>
//       <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-50 group-hover:opacity-100 transition-all duration-300">
//         <div className="border-t border-slate-700 pt-3.5 mt-4 flex flex-col gap-2.5">
//           {s.bullets.map((b, i) => (
//             <div key={i} className="flex items-center gap-2.5">
//               <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
//               <span className="text-[13px] text-slate-400">{b}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// Asset Card 
 function AssetCard({ s, index }) {
  const [h, setH] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className={`relative flex flex-col overflow-hidden cursor-default
        rounded-[14px] px-5 py-5.5 border
        transition-all duration-300 ease-in-out
        ${h ? "-translate-y-1.25 scale-[1.02] shadow-[0_12px_32px_rgba(0,0,0,0.45)] bg-slate-900/90"
          : "translate-y-0 scale-100 shadow-[0_2px_12px_rgba(0,0,0,0.25)] bg-slate-900/60"}`}
      style={{ borderColor: h ? s.accentBorderHover : s.accentBorder }}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300 ${h ? "opacity-100" : "opacity-0"}`}
        style={{ background: `linear-gradient(90deg,${s.accent},transparent)` }}
      />
      <div className="flex items-center gap-3.5 mb-3.5">
        <div
          className="w-11.5 h-11.5 rounded-xl flex items-center justify-center border shrink-0"
          style={{ background: s.accentBg, borderColor: s.accentBorder, color: s.accent }}
        >
          {s.icon}
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-0.75" style={{ color: s.accent }}>
            {s.label}
          </div>
          <h3 className="text-[13px] font-bold transition-colors" style={{ color: h ? s.accent : "#fff" }}>
            {s.title}
          </h3>
        </div>
      </div>
      <p className="text-[13px] leading-[1.68] text-slate-400">{s.desc}</p>
      <div className={`overflow-hidden transition-all duration-300 ${h ? "max-h-37.5 opacity-100 mt-3.5" : "max-h-0 opacity-0 mt-0"}`}>
        <div className="border-t border-slate-700 pt-3 flex flex-col gap-1.75">
          {s.bullets.map((b, i) => (
            <div key={i} className="flex items-center gap-2.25">
              <div className="w-1 h-1 rounded-full shrink-0" style={{ background: s.accent }} />
              <span className="text-[12px] text-slate-400">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

//Why Card 
function WhyCard({ item, index }) {
  const [h, setH] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className={`flex flex-col items-center text-center rounded-2xl px-5 py-6
      bg-slate-900/60 border transition-all duration-300
        ${h ? "-translate-y-1.25 scale-[1.02] shadow-[0_12px_32px_rgba(0,0,0,0.4)]" : "translate-y-0 scale-100"}`}
      style={{ borderColor: h ? item.accentBorder : "rgba(51,65,85,0.6)" }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border"
        style={{ background: item.accentBg, borderColor: item.accentBorder, color: item.accent }}
      >
        {item.icon}
      </div>
      <h3 className="text-[16px] font-semibold text-white mb-2">{item.title}</h3>
      <p className="text-[13px] text-slate-400 leading-[1.7]">{item.desc}</p>
    </motion.div>
  );
}

// Stories Data 
const STORIES = [
  {
    tag: "Case Study", tagColor: "#22c55e",
    title: "5 MWp Ground-Mount Revival — Rajasthan", subtitle: "From 71% PR to 84% in 90 Days",
    desc: "An IPP plant suffering from chronic underperformance was handed over to PvPROTECT. Within 3 months, systematic fault identification, cable retermination, and a soiling-control schedule recovered ₹38L in annual generation value.",
    stats: [{ val: "+13%", label: "PR Improvement" }, { val: "₹38L", label: "Annual Value Recovered" }, { val: "90 days", label: "Turnaround Time" }],
    img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
    location: "Jodhpur, Rajasthan", capacity: "5 MWp", type: "Ground Mount",
  },
  {
    tag: "Success Story", tagColor: "#f59e0b",
    title: "500 kWp C&I Rooftop — Pune", subtitle: "Zero Downtime for 18 Consecutive Months",
    desc: "A large manufacturing client required 99.5%+ availability for their 500 kWp rooftop. PvPROTECT's predictive maintenance model and dedicated NOC support delivered 18 months with zero generation loss due to maintenance.",
    stats: [{ val: "99.8%", label: "Plant Availability" }, { val: "0 hrs", label: "Unplanned Downtime" }, { val: "18 mo", label: "Streak" }],
    img: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&q=80",
    location: "Pune, Maharashtra", capacity: "500 kWp", type: "Rooftop C&I",
  },
  {
    tag: "Warranty Win", tagColor: "#a78bfa",
    title: "End-of-Warranty Claim — Gujarat", subtitle: "₹1.2 Cr Module Replacement Secured",
    desc: "PvPROTECT's end-of-warranty inspection on a 2 MWp plant — using EL imaging and IV curve testing — identified 142 defective modules. The documented evidence secured a full manufacturer replacement claim worth ₹1.2 Cr.",
    stats: [{ val: "142", label: "Modules Replaced" }, { val: "₹1.2 Cr", label: "Claim Value" }, { val: "100%", label: "Claim Accepted" }],
    img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80",
    location: "Ahmedabad, Gujarat", capacity: "2 MWp", type: "Ground Mount",
  },
  {
    tag: "Portfolio O&M", tagColor: "#3b82f6",
    title: "12-Site Portfolio — Pan India", subtitle: "Single NOC, Unified Reporting",
    desc: "A renewable energy fund with 12 distributed plants across 5 states consolidated O&M with PvPROTECT. A unified NOC, single monthly report, and standardised SLAs reduced their internal coordination overhead by 60%.",
    stats: [{ val: "12 sites", label: "Under Management" }, { val: "5 states", label: "Coverage" }, { val: "60%", label: "Overhead Reduced" }],
    img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&q=80",
    location: "Pan India", capacity: "28 MWp", type: "Portfolio",
  },
];

// Stories Carousel 
function StoriesCarousel() {
  const [active, setActive] = useState(0);
  const story = STORIES[active];
  return (
    <div>
      <div className="flex flex-wrap gap-2.5 mb-9">
        {STORIES.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="px-4.5 py-2 rounded-full text-[12px] font-bold cursor-pointer transition-all border"
            style={{
              borderColor: active === i ? s.tagColor : "rgba(255,255,255,0.12)",
              background: active === i ? `${s.tagColor}1a` : "transparent",
              color: active === i ? s.tagColor : "rgba(255,255,255,0.5)",
            }}
          >
            {s.tag}
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-[1.1fr_1fr] rounded-[20px] overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
      >
        <div className="relative h-120 overflow-hidden">
          <img src={story.img} alt={story.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#0d1e30]/95" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0d1e30]/80 via-transparent to-transparent" />
          <div
            className="absolute top-6 left-6 text-[10px] font-extrabold px-3 py-1 rounded-full tracking-widest text-white"
            style={{ background: story.tagColor }}
          >
            {story.tag.toUpperCase()}
          </div>
          <div className="absolute bottom-6 left-6 flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.75 bg-black/50 backdrop-blur border border-white/15 rounded-lg px-3 py-1.5 text-[12px] text-white/80 font-semibold">
              📍 {story.location}
            </div>
            <div className="flex gap-2">
              <div className="bg-black/50 backdrop-blur border border-white/15 rounded-lg px-2.75 py-1.25 text-[11px] text-white/70 font-semibold">
                ⚡ {story.capacity}
              </div>
              <div className="bg-black/50 backdrop-blur border border-white/15 rounded-lg px-2.75 py-1.25 text-[11px] text-white/70 font-semibold">
                🏗️ {story.type}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/95 px-11 py-10 flex flex-col justify-center">
          <h3 className="text-[26px] font-extrabold leading-[1.2] mb-2 text-white">{story.title}</h3>
          <div className="text-[14px] font-bold mb-5" style={{ color: story.tagColor }}>{story.subtitle}</div>
          <p className="text-[14px] leading-[1.8] text-white/60 mb-7.5">{story.desc}</p>
          <div className="grid grid-cols-3 gap-3.5 mb-8">
            {story.stats.map((st, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-700 rounded-xl py-3.5 px-3 text-center">
                <div className="text-[22px] font-black leading-none" style={{ color: story.tagColor }}>{st.val}</div>
                <div className="text-[10px] text-slate-400 mt-1.25 leading-[1.4]">{st.label}</div>
              </div>
            ))}
          </div>
          <HeroButton
            gradient="linear-gradient(to right,#22c55e,#16a34a)"
            hoverGrad="linear-gradient(to right,#16a34a,#15803d)"
            shadow="rgba(34,197,94,0.4)"
            icon={<span>📞</span>}
            label="Discuss a Similar Project →"
            onClick={() => window.location.href = "tel:+919975929989"}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {STORIES.map((s, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className="rounded-[14px] overflow-hidden relative h-32.5 cursor-pointer transition-all"
            style={{
              border: `2px solid ${active === i ? s.tagColor : "rgba(255,255,255,0.08)"}`,
              opacity: active === i ? 1 : 0.65,
            }}
          >
            <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-2.5 left-3 right-3">
              <div className="text-[9px] font-extrabold uppercase tracking-[0.08em] mb-0.75" style={{ color: s.tagColor }}>{s.tag}</div>
              <div className="text-[11px] font-bold text-white leading-[1.3]">{s.capacity} · {s.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  { name: "Rajesh Mehta", title: "Head of Projects", company: "Aditya Renewables Pvt Ltd", location: "Pune, Maharashtra", avatar: "RM", avatarBg: "linear-gradient(135deg,#22c55e,#16a34a)", rating: 5, quote: "PvPROTECT's O&M team transformed how we think about plant performance. Their predictive diagnostics caught a string fault that would have cost us 3 weeks of lost generation if we had discovered it during our routine visit. The client portal gives us full visibility — our finance team loves the automated monthly reports.", },
  { name: "Sunita Krishnamurthy", title: "VP – Asset Management", company: "Greenpeak Energy Fund", location: "Bengaluru, Karnataka", avatar: "SK", avatarBg: "linear-gradient(135deg,#3b82f6,#1d4ed8)", rating: 5, quote: "Managing 12 plants across 5 states was a nightmare before PvPROTECT. Now we have one NOC, one report, one point of contact. Their SLA adherence has been exceptional — P1 faults resolved in under 6 hours every single time.", },
  { name: "Amitabh Saxena", title: "Director – Operations", company: "Sterling Agro Industries", location: "Nashik, Maharashtra", avatar: "AS", avatarBg: "linear-gradient(135deg,#f59e0b,#d97706)", quote: "We had major concerns about our 10-year-old plant before the warranty expired. PvPROTECT conducted a thorough end-of-warranty inspection and the evidence they compiled — EL images, IV curves, thermal data — helped us successfully claim replacement for 38 degraded modules.", },
  { name: "Priya Nair", title: "CFO", company: "Horizon Hospitality Group", location: "Hyderabad, Telangana", avatar: "PN", avatarBg: "linear-gradient(135deg,#8b5cf6,#6d28d9)", rating: 5, quote: "What impressed me most was the soiling loss calculator PvPROTECT used during the audit — it showed exactly how much revenue we were leaving on the table with quarterly cleaning. Switching to monthly cleaning paid back in 40 days.", },
  { name: "Vikram Desai", title: "Technical Director", company: "NovaSun EPC", location: "Ahmedabad, Gujarat", avatar: "VD", avatarBg: "linear-gradient(135deg,#ef4444,#b91c1c)", rating: 5, quote: "As an EPC contractor, we hand over plants to PvPROTECT's O&M team after commissioning. The handover process is seamless — they already know the plant's SLD, equipment specs, and commission baseline from the reports we share.", },
];

// Testimonials Carousel
function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;
  const visible = [TESTIMONIALS[current % total], TESTIMONIALS[(current + 1) % total], TESTIMONIALS[(current + 2) % total]];
  return (
    <div>
      <div className="flex justify-end gap-2.5 mb-8">
        <button
          onClick={() => setCurrent((current - 1 + total) % total)}
          className="w-10.5 h-10.5 rounded-full bg-white/5 border border-white/10 text-white text-[16px] cursor-pointer flex items-center justify-center transition-all"
        >←</button>
        <button
          onClick={() => setCurrent((current + 1) % total)}
          className="w-10.5 h-10.5 rounded-full bg-white/5 border border-white/10 text-white text-[16px] cursor-pointer flex items-center justify-center transition-all"
        >→</button>
      </div>

      <div className="grid grid-cols-3 gap-5.5 mb-8">
        {visible.map((t, i) => (
          <motion.div
            key={`${current}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-slate-900/60 border border-slate-700 rounded-[18px] p-7 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-4 right-5 text-[72px] leading-none text-green-500/10 font-serif pointer-events-none">"</div>
            <div className="flex gap-0.75 mb-4">
              {Array(t.rating).fill(0).map((_, j) => (
                <span key={j} className="text-amber-500 text-[14px]">★</span>
              ))}
            </div>
            <p className="text-[13px] leading-[1.8] text-white/70 mb-6 flex-1 italic">"{t.quote}"</p>
            {/* <div className="bg-slate-900/80 border border-slate-700 rounded-[10px] px-3.5 py-2.5 mb-5 flex items-center gap-3"> */}
            {/* <div className="text-[20px] font-black text-yellow-300 leading-none">{t.metric.val}</div> */}
            {/* <div className="text-[11px] text-slate-400 leading-[1.4]">{t.metric.label}</div> */}
            {/* </div> */}
            {/* <div className="flex items-center gap-1.5 mb-4.5 px-2.5 py-1.5 bg-slate-900/60 border border-slate-700 rounded-lg">
              <span className="text-[13px]">⚡</span>
              <span className="text-[11px] text-white/45 font-semibold">{t.plant}</span>
            </div> */}
            <div className="flex items-center gap-3 border-t border-white/10 pt-4.5">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-extrabold text-white shrink-0 tracking-[0.05em]"
                style={{ background: t.avatarBg }}
              >{t.avatar}</div>
              <div>
                <div className="text-[14px] font-bold text-white">{t.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{t.title}</div>
                <div className="text-[11px] text-green-500 font-semibold mt-px">{t.company}</div>
              </div>
              <div className="ml-auto text-[10px] text-white/35 text-right leading-normal">📍 {t.location}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-2 rounded-sm border-none cursor-pointer transition-all"
            style={{ width: i === current ? 24 : 8, background: i === current ? "#22c55e" : "rgba(255,255,255,0.18)" }}
          />
        ))}
      </div>
    </div>
  );
}

// Contact Form 
function ContactForm() {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", capacity: "", location: "", service: "Comprehensive AMC" });
  const [submitted, setSubmitted] = useState(false);

  const inp = "w-full box-border bg-white/5 border border-white/10 rounded-[10px] px-[14px] py-[11px] text-[14px] text-white outline-none transition-colors";
  const lbl = "text-[12px] font-semibold text-slate-400 block mb-[6px] tracking-[0.04em]";

  if (submitted)
    return (
      <div className="bg-slate-900/80 border border-lime-400/25 rounded-[20px] px-7.5 py-12 text-center">
        <div className="text-[52px] mb-4.5">✅</div>
        <h4 className="text-[22px] font-extrabold text-lime-400 mb-2.5">Request Received!</h4>
        <p className="text-[14px] text-slate-400 leading-[1.7]">Our team will respond within 24 hours.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 px-7 py-2.5 cursor-pointer bg-transparent border border-white/20 rounded-[10px] text-white text-[14px]"
        >Submit Another</button>
      </div>
    );

  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-[20px] px-7 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
      <h4 className="text-[20px] font-extrabold bg-linear-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-1.5">Get Your O&amp;M Quote</h4>
      <p className="text-[13px] text-slate-500 mb-6">Fill in your details — our team responds within 24 hours.</p>

      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <div>
          <label className={lbl}>Your Name</label>
          <input className={inp} placeholder="Enter Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className={lbl}>Company</label>
          <input className={inp} placeholder="Company Name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </div>
      </div>

      <div className="mb-3.5">
        <label className={lbl}>Email Address</label>
        <input type="email" className={inp} placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>

      <div className="mb-3.5">
        <label className={lbl}>Phone Number</label>
        <input type="tel" className={inp} placeholder="Mobile Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <div>
          <label className={lbl}>Plant Capacity</label>
          <input className={inp} placeholder="e.g. 500 kW" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        </div>
        <div>
          <label className={lbl}>Plant Location</label>
          <input className={inp} placeholder="Plant Locat" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
      </div>

      <div className="mb-6">
        <label className={lbl}>Service Required</label>
        <select
          className="w-full bg-slate-900 border border-white/10 rounded-[10px] px-3.5 py-2.75 text-[14px] text-white cursor-pointer"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        >
          {["Comprehensive AMC", "Non-Comprehensive AMC", "Module Cleaning", "Fault Diagnosis / Emergency", "End-of-Warranty Inspection", "Custom Portfolio O&M"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => { if (form.name && form.email) setSubmitted(true); }}
        className="w-full group relative overflow-hidden bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-2xl text-base sm:text-lg shadow-xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        Submit Request →
        {/* text-[12px] font-semibold text-slate-400 block mb-[6px] tracking-[0.04em] */}
      </button>
    </div>
  );
}

// Main Page
export default function ServicesPage() {
  const statsRef = useRef(null);
  const [statsOn, setStatsOn] = useState(false);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsOn(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const filtered =
    tab === "all"
      ? ASSET_SERVICES
      : ASSET_SERVICES.filter((s) => TABS.find((t) => t.key === tab)?.ids?.includes(s.id));

  const handleWhatsApp = () => {
    const phone = "919975929989";
    const message = "Hello, I want to request a Free Solar Plant Health Audit.";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleCall = () => { window.location.href = "tel:+919975929989"; };
  const handleEmail = () => { window.location.href = "mailto:info@pvprotech.com"; };


  return (
    <div className="min-h-screen text-white bg-linear-to-b from-[#1e3a5f] via-black to-[#14532d]">

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black">
        <img src="/Home-bg.jpg" alt="Solar Background" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(100,200,150,0.2)_1px,transparent_1px)] bg-size-[26px_26px]" />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/70 to-black/80" />

        <div className="relative z-1 text-center py-4 px-6 max-w-225 mx-auto">
          {/* <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-yellow-300/10 border border-yellow-300/25 rounded-full px-4.5 py-1.5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse"></span>
            <span className="text-[11px] font-bold text-yellow-300 tracking-[0.12em] uppercase">Comprehensive Solar Services</span>
          </motion.div> */}

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight bg-linear-to-r from-yellow-300 via-green-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in"
          >
            Our Solar Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[clamp(1rem,2vw,1.25rem)] text-blue-200 w-140 max-w-175 mx-auto mb-10 leading-[1.8]"
          >
            Comprehensive solutions to maximize your solar investment throughout its entire lifecycle — from installation to decommissioning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <HeroButton
              gradient="linear-gradient(to right,#8b5cf6,#7c3aed,#4f46e5)"
              hoverGrad="linear-gradient(to right,#7c3aed,#6d28d9,#4338ca)"
              shadow="rgba(139,92,246,0.5)"
              icon={<FaCalculator className="text-[18px]" />}
              label="Request Site Audit"
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
            <HeroButton
              gradient="linear-gradient(to right,#22c55e,#10b981)"
              hoverGrad="linear-gradient(to right,#16a34a,#059669)"
              shadow="rgba(34,197,94,0.5)"
              icon={<FaUserTie className="text-[18px]" />}
              label="Talk to an Expert"
              onClick={handleCall}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-6 justify-center flex-wrap mt-9"
          >
            {["Pan-India Coverage", "24/7 Operations"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="#4ade80" strokeWidth="1.5" />
                  <path d="M4.5 7l2 2 3-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[13px] text-[#93c5fd]">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <div ref={statsRef} className="bg-[rgba(15,23,42,0.85)] border-t border-b border-[rgba(51,65,85,0.6)] px-6 py-8">
        <div className="max-w-7xl mx-auto grid gap-4 grid-cols-[repeat(auto-fit,minmax(130px,1fr))]">
          {STATS.map((stat, i) => (
            <div key={stat.label} className={`text-center px-3 ${i < STATS.length - 1 ? "border-r border-[rgba(51,65,85,0.5)]" : ""}`}>
              <div className="text-[28px] font-extrabold leading-none mb-1.5" style={{ color: stat.color }}>
                <Counter value={stat.value} active={statsOn} />
              </div>
              <div className="text-[11px] text-[#64748b] uppercase tracking-[0.08em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ASSET MANAGEMENT */}
      <section className="py-15 px-6 bg-linear-to-b from-[#0f172a] via-black to-[#020617]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            {/* <div className="text-[11px] font-bold text-[#fbbf24] tracking-[0.14em] uppercase mb-3.5">Full Lifecycle Coverage</div> */}
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-linear-to-r from-yellow-300 to-emerald-400 bg-clip-text text-transparent">Asset Management Services</h2>
            <p className="text-[#cbd5e1] text-[15px] w-100 max-w-140 mx-auto leading-[1.8]">
              Every service your solar PV plant needs — from predictive monitoring to end-of-life disposal.
            </p>
          </motion.div>

          <div className="flex gap-2.5 justify-center flex-wrap mb-10">
            {TABS.map(t => (
              <TabButton key={t.key} tab={t} active={tab === t.key} onClick={() => setTab(t.key)} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4.5 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]"
            >
              {filtered.map((s, i) => <AssetCard key={s.id} s={s} index={i} />)}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-5 px-6 bg-linear-to-b from-[#020617] via-black to-[#0f172a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-13"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-linear-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Why Choose Our Services</h2>
            <p className="text-[#94a3b8] text-[15px] max-w-140 w-100 mx-auto leading-[1.75]">
              Trusted by solar asset owners across India for transparent, data-driven O&M excellence.
            </p>
          </motion.div>

          <div className="grid gap-5 mb-7 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {WHY_US.map((item, i) => <WhyCard key={item.title} item={item} index={i} />)}
          </div>

          <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
            {[
              { value: "25+", label: "Years Lifespan", desc: "Quality solar panels last 25–30 years with minimal degradation.", color: "#38bdf8" },
              { value: "80%", label: "CO₂ Reduction", desc: "Average household reduces carbon emissions by up to 80%.", color: "#34d399" },
              { value: "15%", label: "Annual Growth", desc: "Solar energy adoption is growing at 15% per year globally.", color: "#a78bfa" },
            ].map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[rgba(15,23,42,0.60)] border border-[rgba(51,65,85,0.6)] rounded-2xl py-6 px-5 text-center"
              >
                <div className="text-[36px] font-bold mb-2" style={{ color: fact.color }}>{fact.value}</div>
                <div className="text-[13px] font-semibold text-slate-100 mb-1.5">{fact.label}</div>
                <div className="text-[12px] text-[#94a3b8]">{fact.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="bg-linear-to-b from-slate-900 via-black to-slate-950 py-15 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            {/* <div className="text-[11px] font-bold text-emerald-400 tracking-[0.14em] uppercase mb-3">Client Portal — New Feature</div> */}
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-linear-to-r from-yellow-300 to-emerald-400 bg-clip-text text-transparent">
              Your Plant. Your Dashboard. Your Control.
            </h2>
            <p className="text-slate-300 text-[15px] max-w-160 mx-auto leading-[1.8]">
              <span className="bg-linear-to-r from-amber-400 to-amber-600 font-bold bg-clip-text text-transparent">PvPROTECT</span > O&M Powered by <span className="bg-linear-to-r from-amber-400 to-amber-600 font-bold bg-clip-text text-transparent">Sustaiify Energy</span> clients get a secure, role-based portal — real-time plant KPIs, maintenance ticket tracking, and all inspection reports in one place. Available on pvprotech.com.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-[20px] overflow-hidden"
          >
            <div className="bg-white/10 px-5.5 py-3.25 border-b border-white/10 flex items-center gap-2">
              {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
              <span className="text-[13px] font-semibold text-white/50 ml-2.5">
                PvPROTECT Client Portal — Plant Dashboard — Pune Rooftop 500kWp
              </span>
              <div className="ml-auto bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-[10px]">
                🟢 LIVE DATA
              </div>
            </div>

            <div className="p-6 grid grid-cols-3 gap-3.5">
              {[
                { label: "TODAY'S GENERATION", val: "2,184", unit: "kWh", trend: "▲ +3.2% vs yesterday", trendColor: "text-emerald-500" },
                { label: "PERFORMANCE RATIO", val: "81.4", unit: "%", trend: "▲ Target: 78%", trendColor: "text-emerald-500" },
                { label: "PLANT AVAILABILITY", val: "99.2", unit: "%", trend: "▲ This month", trendColor: "text-emerald-500" },
                // { label: "ACTIVE TICKETS", val: "2", unit: "open", trend: "1 in progress", trendColor: "text-amber-500" },
              ].map((k, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
                  <div className="text-[10px] text-slate-400 font-bold tracking-[0.08em] mb-2">{k.label}</div>
                  <div className="text-[26px] font-extrabold text-white leading-none">
                    {k.val}<span className="text-[12px] text-slate-400 font-normal ml-1">{k.unit}</span>
                  </div>
                  <div className={`text-[11px] mt-1.5 ${k.trendColor}`}>{k.trend}</div>
                </div>
              ))}

              <div className="col-span-2 bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
                <div className="text-[12px] font-bold text-white/60 mb-4">⚡ GENERATION THIS WEEK — Actual vs. Forecast (kWh)</div>
                <div className="flex items-end gap-0.75 h-20">
                  {[70, 68, 80, 82, 60, 55, 85, 88, 90, 87, 75, 78, 88, 91].map((h, i) => (
                    <div key={i} className={`flex-1 rounded-t-[3px] ${i % 2 === 0 ? "bg-emerald-500/30" : "bg-emerald-500"}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex gap-4 mt-2.5 text-[10px] text-slate-400">
                  <span>■ <span className="text-emerald-400/60">Forecast</span></span>
                  <span>■ <span className="text-emerald-500">Actual</span></span>
                  <span className="ml-auto">Mon — Sun</span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
                <div className="text-[12px] font-bold text-white/60 mb-4">🔔 RECENT ALARMS</div>
                {[
                  { color: "#ef4444", text: "INV-02: String fault MPPT-3", time: "2h ago" },
                  { color: "#f59e0b", text: "PR below threshold (76%)", time: "Yesterday" },
                  { color: "#3b82f6", text: "Module cleaning due (60 days)", time: "3 days ago" },
                  { color: "#22c55e", text: "INV-01: Fault resolved ✓", time: "4 days ago" },
                ].map((a, i, arr) => (
                  <div key={i} className={`flex items-center gap-2 text-[12px] ${i < arr.length - 1 ? "pb-2.5 mb-2.5 border-b border-white/5" : ""}`}>
                    <div className="w-1.75 h-1.75 rounded-full shrink-0" style={{ background: a.color }} />
                    <div className="flex-1 text-white/70">{a.text}</div>
                    <div className="text-[10px] text-slate-400">{a.time}</div>
                  </div>
                ))}
              </div>

              {/* <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
                <div className="text-[12px] font-bold text-white/60 mb-4">🎫 MAINTENANCE TICKETS</div>
                {[
                  { id: "#TKT-041", desc: "INV-02 string fault MPPT-3", status: "P1 Open", bg: "bg-red-500/20", color: "text-red-400" },
                  { id: "#TKT-040", desc: "Module cleaning — Block A", status: "In Progress", bg: "bg-amber-500/20", color: "text-amber-400" },
                  { id: "#TKT-039", desc: "Quarterly PM — June 2025", status: "Closed ✓", bg: "bg-emerald-500/20", color: "text-emerald-400" },
                  { id: "#TKT-038", desc: "Earth resistance test", status: "Closed ✓", bg: "bg-emerald-500/20", color: "text-emerald-400" },
                ].map((t, i, arr) => (
                  <div key={i} className={`flex items-center gap-2 text-[12px] ${i < arr.length - 1 ? "pb-2.5 mb-2.5 border-b border-white/5" : ""}`}>
                    <span className="text-emerald-500 font-mono text-[11px] w-14.5 shrink-0">{t.id}</span>
                    <span className="flex-1 text-white/70">{t.desc}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[10px] ${t.bg} ${t.color}`}>{t.status}</span>
                  </div>
                ))}
              </div> */}
            </div>
          </motion.div>
        </div>
      </section>

      {/* MAINTENANCE SCHEDULE */}
      <section className="bg-linear-to-b from-slate-950 via-black to-slate-900 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12.5"
          >
            {/* <div className="text-[11px] font-bold text-amber-400 tracking-[0.14em] uppercase mb-3.5">Preventive Maintenance — CMMS</div> */}
            <h2 className="text-[clamp(1.875rem,3vw,2.25rem)] font-bold mb-4 text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400">
              Structured Maintenance Schedules & Work Orders
            </h2>
            <p className="text-slate-300 text-[15px] max-w-180 mx-auto leading-[1.8]">
              <span className="bg-linear-to-r from-amber-400 to-amber-600 font-bold bg-clip-text text-transparent">PvPROTECT</span > O&M Powered by <span className="bg-linear-to-r from-amber-400 to-amber-600 font-bold bg-clip-text text-transparent">Sustainify Energy</span> driven scheduler auto-generates work orders, assigns field engineers, and tracks every activity with geo-tagged timestamps.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8.5">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {[
                { title: "Auto-Generated Work Orders", desc: "Schedule-triggered or alarm-triggered work orders are created automatically in the PvPROTECT CMMS, assigned to the nearest available engineer." },
                { title: "Engineer Mobile App Dispatch", desc: "Field engineers receive job details, plant SLD, access instructions, and a digital checklist on their mobile — with full offline capability for remote sites." },
                { title: "Digital Checklist & Photo Capture", desc: "Engineers complete structured checklists with photo evidence per step — IV tracer data, thermal images, torque readings — all geo-tagged." },
                { title: "Client e-Sign & Auto-Report", desc: "Client digitally approves completed work. Report auto-attaches to the plant record on pvprotech.com and emails to the client within 2 hours." },
              ].map((s, i, arr) => (
                <div key={i} className="flex gap-4.5 mb-7 relative">
                  {i < arr.length - 1 && (
                    <div className="absolute left-4.75 top-10.5 -bottom-2 w-0.5 bg-linear-to-b from-emerald-500/40 to-transparent" />
                  )}
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-[15px] font-extrabold text-emerald-500 shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-[15px] font-bold mb-1.25 text-white">{s.title}</div>
                    <div className="text-[13px] text-white/50 leading-[1.65]">{s.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-[18px] overflow-hidden"
            >
              <div className="bg-white/10 px-5 py-4 border-b border-white/10 flex justify-between items-center">
                <div className="text-[14px] font-bold text-white">📅 PM Schedule — 500kWp Plant</div>
                <div className="text-[11px] text-emerald-500 font-semibold">June 2025</div>
              </div>
              <div className="p-4.5">
                {[
                  { freq: "Monthly", fc: "#22c55e", task: "Visual inspection — modules, mounting, cables, JBs", status: "Due Jul 5", sb: "bg-amber-500/20", sc: "text-amber-400" },
                  { freq: "Monthly", fc: "#22c55e", task: "Inverter parameter check & log extraction", status: "Done ✓", sb: "bg-emerald-500/20", sc: "text-emerald-400" },
                  { freq: "Monthly", fc: "#22c55e", task: "Module cleaning (DM water, soiling check)", status: "Done ✓", sb: "bg-emerald-500/20", sc: "text-emerald-400" },
                  { freq: "Quarterly", fc: "#f59e0b", task: "Earth resistance & insulation resistance test", status: "Sep 2025", sb: "bg-blue-500/20", sc: "text-blue-400" },
                  { freq: "Quarterly", fc: "#f59e0b", task: "Torque check — module clamps & mounting", status: "Sep 2025", sb: "bg-blue-500/20", sc: "text-blue-400" },
                  { freq: "Bi-Annual", fc: "#3b82f6", task: "IV Curve string testing — full array", status: "Dec 2025", sb: "bg-blue-500/20", sc: "text-blue-400" },
                  { freq: "Bi-Annual", fc: "#3b82f6", task: "Thermal imaging — handheld", status: "Dec 2025", sb: "bg-blue-500/20", sc: "text-blue-400" },
                  { freq: "Annual", fc: "#8b5cf6", task: "EL imaging — module defect survey", status: "Mar 2026", sb: "bg-blue-500/20", sc: "text-blue-400" },
                  { freq: "Annual", fc: "#8b5cf6", task: "Performance Guarantee Test (IEC 61724)", status: "Mar 2026", sb: "bg-blue-500/20", sc: "text-blue-400" },
                ].map((r, i, arr) => (
                  <div key={i} className={`flex items-center gap-3 ${i < arr.length - 1 ? "pb-2.75 mb-2.75 border-b border-white/5" : ""}`}>
                    <div className="w-19 text-[10px] font-extrabold tracking-[0.07em] uppercase shrink-0" style={{ color: r.fc }}>{r.freq}</div>
                    <div className="flex-1 text-[13px] text-white/75">{r.task}</div>
                    <div className={`text-[10px] font-bold px-2.5 py-0.5 rounded-[10px] shrink-0 ${r.sb} ${r.sc}`}>{r.status}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section className="relative overflow-hidden py-10 px-6 bg-linear-to-b from-[#0f172a] via-black to-[#020617]">
        <div className="absolute -right-52 -bottom-52 w-150 h-150 pointer-events-none bg-[radial-gradient(circle,rgba(100,200,150,0.06),transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            {/* <div className="text-[11px] font-bold text-[#34d399] uppercase tracking-widest mb-3">
              Our Stories
            </div> */}
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-linear-to-r from-yellow-300 to-emerald-400 bg-clip-text text-transparent">
              Real Plants. Real Results. Real Impact.
            </h2>
            <p className="text-[#cbd5e1] text-sm max-w-140 mx-auto leading-relaxed">
              Proven outcomes from solar assets across India — from C&I rooftops to utility-scale ground mounts.
            </p>
          </motion.div>
          <StoriesCarousel />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative overflow-hidden bg-linear-to-b from-slate-950 via-black to-slate-900 py-10 px-6">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(100,200,150,0.04)_1px,transparent_1px)] bg-size-[28px_28px]" />
        <div className="max-w-7xl mx-auto relative z-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            {/* <div className="bg-linear-to-r from-amber-400 to-amber-600 font-bold bg-clip-text uppercase text-transparent">Client Testimonials</div> */}
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-linear-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Trusted by Plant Owners Across India</h2>
            <p className="text-slate-400 text-[15px] max-w-130 mx-auto leading-[1.7]">
              From C&amp;I rooftops to utility-scale ground mounts — here's what our clients say about<span className="bg-linear-to-r from-amber-400 to-amber-600 font-bold bg-clip-text text-transparent"> PvPROTECT</span > O&M Powered by <span className="bg-linear-to-r from-amber-400 to-amber-600 font-bold bg-clip-text text-transparent">Sustainify Energy</span> services.
            </p>
          </motion.div>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-linear-to-b from-slate-900 via-black to-slate-950 py-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-15 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-7"
          >
            <div>
              <div className="text-[11px] font-bold text-lime-500 tracking-[0.14em] uppercase mb-3.5">Get In Touch</div>
              <h2 className="text-3xl md:text-4xl font-bold text-left mb-10 w-120 bg-linear-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Protect Your Investment <span className="text-lime-500">-</span> Maximise Your Yield.</h2>
              <p className="text-[15px] text-slate-400 leading-[1.75]">n
                Talk to <span className="bg-linear-to-r from-amber-400 to-amber-600 font-bold bg-clip-text text-transparent">PvPROTECT</span > O&M Powered by <span className="bg-linear-to-r from-amber-400 to-amber-600 font-bold bg-clip-text text-transparent">Sustainify Energy</span> experts today. Get a tailored AMC quote, schedule a plant health check, or book an immediate site visit for urgent fault diagnosis.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {[
                // { val: "4 hrs", label: "P1 Response SLA", icon: "⚡" },
                { val: "200+", label: "Plants Under O&M", icon: "🏭" },
                // { val: "98.7%", label: "SLA Adherence", icon: "📊" },
                { val: "₹12 Cr+", label: "Warranty Claims Secured", icon: "🛡️" },
              ].map((s, i) => (
                <div key={i} className="bg-[rgba(15,23,42,0.60)] border border-[rgba(51,65,85,0.6)] rounded-[14px] px-4 py-4.5 flex items-center gap-3.5">
                  <div className="text-[22px]">{s.icon}</div>
                  <div>
                    <div className="text-[20px] font-extrabold bg-linear-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent leading-none">{s.val}</div>
                    <div className="text-[11px] text-slate-500 mt-1 uppercase tracking-[0.06em]">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {["Pan-India Coverage", "MNRE Compliant O&M"].map((b, i) => (
                <div key={i} className="flex items-center gap-1.75 bg-[rgba(15,23,42,0.60)] border border-[rgba(51,65,85,0.6)] rounded-full px-3.5 py-1.75 text-[12px] text-slate-400">
                  <span className="text-lime-500">✓</span> {b}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3.5">
              <HeroButton
                gradient="linear-gradient(to right,#22c55e,#16a34a)"
                hoverGrad="linear-gradient(to right,#16a34a,#15803d)"
                shadow="rgba(34,197,94,0.4)"
                icon={<span>📞</span>}
                label="+91 99759 29989"
                onClick={handleCall}
              />
              <HeroButton
                gradient="linear-gradient(to right,#8b5cf6,#7c3aed,#4f46e5)"
                hoverGrad="linear-gradient(to right,#7c3aed,#6d28d9,#4338ca)"
                shadow="rgba(139,92,246,0.5)"
                icon={<span>💬</span>}
                label="WhatsApp"
                onClick={handleWhatsApp}
              />
            </div>
          </motion.div>

          <motion.div
            id="contact"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* WhatsApp */}
      <a
        href="https://wa.me/919975929989"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-7 right-7 w-14 h-14 bg-[#25d366] rounded-full flex items-center justify-center text-[26px] shadow-[0_4px_22px_rgba(37,211,102,0.45)] cursor-pointer z-999 no-underline"
      >
        💬
      </a>

       {/* CTA  */}
      <section className="relative py-15 px-6 text-center bg-black overflow-hidden">
        {/* Background image */}
        <img
          src="/Home-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(100,200,150,0.2)_1px,transparent_1px)] bg-size-[26px_26px]" />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/70 to-black/80" />

        {/* Content */}
        <div className="relative z-10 max-w-215 mx-auto">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-4 py-0 mb-5 rounded-full bg-green-400/8 border border-green-400/25"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] font-bold text-green-400 uppercase tracking-[0.12em]">
              Free Plant Health Audit
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-yellow-300 via-green-400 to-blue-400 bg-clip-text text-transparent"
          >
            Ready to Optimise Your Solar Investment?
          </motion.h2>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[17px] text-sky-200 max-w-165 mx-auto mb-12 leading-relaxed"
          >
            Get a free plant health audit from our certified engineers. We'll identify performance gaps, maintenance risks, and opportunities to maximise your ROI — at no cost.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <HeroButton
              gradient="linear-gradient(to right,#facc15,#fb923c,#ef4444)"
              hoverGrad="linear-gradient(to right,#eab308,#f97316,#dc2626)"
              shadow="rgba(251,146,60,0.5)"
              icon={<FaSolarPanel className="text-lg" />}
              label="Request Free Audit"
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
            <HeroButton
              gradient="linear-gradient(to right,#06b6d4,#3b82f6,#6366f1)"
              hoverGrad="linear-gradient(to right,#0891b2,#2563eb,#4f46e5)"
              shadow="rgba(59,130,246,0.5)"
              icon={<FaHeadset className="text-lg" />}
              label="Schedule a Call →"
              onClick={handleCall}
            />
          </motion.div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-8 text-[13px] text-slate-400">
            <div onClick={handleCall} className="flex items-center gap-2.5 cursor-pointer">
              <span>📞</span><span>+91 9975929989</span>
            </div>
            <div onClick={handleEmail} className="flex items-center gap-2.5 cursor-pointer">
              <span>✉️</span><span>info@pvprotech.com</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span>📍</span><span>Pan-India Operations</span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pvpulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}