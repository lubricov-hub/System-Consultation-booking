import { useState, useEffect } from "react";
import {
  CalendarDays,
  Clock3,
  UserCheck,
  BookOpen,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Bell,
} from "lucide-react";

/* ─── tiny hook for staggered mount animations ─── */
function useReveal(count = 1, delayMs = 80) {
  const [visible, setVisible] = useState(Array(count).fill(false));
  useEffect(() => {
    visible.forEach((_, i) => {
      setTimeout(() => {
        setVisible((v) => {
          const next = [...v];
          next[i] = true;
          return next;
        });
      }, i * delayMs + 120);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return visible;
}

/* ─── data ─── */
const STEPS = [
  {
    icon: CalendarDays,
    color: "text-blue-500",
    bg: "bg-blue-50",
    ring: "ring-blue-100",
    title: "Choose Your Date",
    desc: "Select from available dates on the calendar",
  },
  {
    icon: Clock3,
    color: "text-violet-500",
    bg: "bg-violet-50",
    ring: "ring-violet-100",
    title: "Pick a Time Slot",
    desc: "View available time slots and book instantly",
  },
  {
    icon: UserCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
    title: "Get Confirmation",
    desc: "Receive instant confirmation via email",
  },
];

const EXPECT = [
  "One-on-one consultation with your teacher",
  "15-minute or 30-minute sessions available",
  "In-person or virtual meeting options",
  "Discuss academic progress and get personalized guidance",
];

const TOPICS = [
  { icon: BookOpen, label: "Academic Progress Review" },
  { icon: ClipboardList, label: "Assignment Help & Guidance" },
  { icon: GraduationCap, label: "Course Selection & Planning" },
  { icon: HelpCircle, label: "General Questions & Support" },
];

/* ─── sub-components ─── */
function StepCard({ icon: Icon, color, bg, ring, title, desc, visible }) {
  return (
    <div
      className={`
        bg-white border border-slate-100 rounded-2xl p-7 shadow-sm
        ring-1 ${ring}
        transition-all duration-500 ease-out
        hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-100
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
    >
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-5`}>
        <Icon className={`w-6 h-6 ${color}`} strokeWidth={1.8} />
      </div>
      <h3 className="font-semibold text-slate-800 text-[0.97rem] mb-1.5">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TopicItem({ icon: Icon, label }) {
  return (
    <li className="flex items-center gap-3 text-slate-600 text-[0.91rem] group">
      <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
        <Icon className="w-3.5 h-3.5 text-blue-500" strokeWidth={2} />
      </span>
      {label}
    </li>
  );
}

/* ─── main component ─── */
export default function HomePage() {
  const stepVisible = useReveal(3, 100);
  const [heroVisible, setHeroVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 60);
    setTimeout(() => setInfoVisible(true), 520);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">EduBook</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
              My Appointments
            </button>
            <button className="relative p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-3xl mx-auto text-center px-6 pt-16 pb-12">
        {/* badge */}
        <div
          className={`inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-blue-100 transition-all duration-500 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Instant booking available
        </div>

        <h1
          className={`text-4xl sm:text-5xl lg:text-[3.4rem] font-black leading-[1.08] tracking-tight text-slate-900 mb-5 transition-all duration-600 delay-75 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Teacher{" "}
          <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            Consultation
          </span>{" "}
          Booking
        </h1>

        <p
          className={`text-slate-500 text-lg leading-relaxed max-w-xl mx-auto transition-all duration-600 delay-150 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          Schedule a consultation with your teachers. Book a time that works
          best for you to discuss academic progress, assignments, or any
          questions.
        </p>
      </section>

      {/* ── STEPS ── */}
      <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {STEPS.map((s, i) => (
          <StepCard key={s.title} {...s} visible={stepVisible[i]} />
        ))}
      </section>

      {/* ── CTA BUTTONS ── */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 px-6 transition-all duration-500 delay-300 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <button className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-[0.95rem] px-8 py-4 rounded-xl shadow-md shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
          Book a Teacher Consultation
          <ArrowRight className="w-4 h-4" />
        </button>
        <button className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[0.95rem] px-8 py-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95">
          View My Appointments
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* ── INFO CARDS ── */}
      <section
        className={`max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20 transition-all duration-600 ${infoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* What to Expect */}
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm ring-1 ring-slate-100">
          <h4 className="font-bold text-slate-800 text-base mb-6">What to Expect</h4>
          <ul className="space-y-4">
            {EXPECT.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-600 text-[0.91rem] leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Consultation Topics */}
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm ring-1 ring-slate-100">
          <h4 className="font-bold text-slate-800 text-base mb-6">Consultation Topics</h4>
          <ul className="space-y-4">
            {TOPICS.map((t) => (
              <TopicItem key={t.label} {...t} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}