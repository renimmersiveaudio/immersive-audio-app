
import React from 'react';
import { Users, Infinity, Moon, Zap, Target, Rocket, Briefcase, Gift, Compass, Palette, ShieldCheck, Globe, ArrowLeft } from 'lucide-react';
import { AppView } from '../types';

interface ResonanceCirclesProps {
  mood?: string;
}

const ResonanceCircles: React.FC<ResonanceCirclesProps> = ({ mood }) => {
  const navigateTo = (view: AppView) => {
    window.dispatchEvent(new CustomEvent('nav-view', { detail: view }));
  };

  const categories = [
    { id: 'chakra', label: 'Chakra Based', icon: <Zap size={24} className="text-orange-400" />, desc: 'Energy centers alignment' },
    { id: 'numerology', label: 'Numerology Based', icon: <Infinity size={24} className="text-blue-400" />, desc: 'Sacred number resonances' },
    { id: 'astrology', label: 'Astrology Based', icon: <Moon size={24} className="text-purple-400" />, desc: 'Celestial body influences' },
  ];

  const circles = [
    { id: 'innovators', label: 'Innovators', icon: <Rocket size={20} />, color: 'bg-teal-500/20 text-teal-400' },
    { id: 'builders', label: 'Builders', icon: <Briefcase size={20} />, color: 'bg-amber-500/20 text-amber-400' },
    { id: 'creators', label: 'Creators', icon: <Palette size={20} />, color: 'bg-purple-500/20 text-purple-400' },
    { id: 'givers', label: 'Givers', icon: <Gift size={20} />, color: 'bg-rose-500/20 text-rose-400' },
    { id: 'guides', label: 'Guides', icon: <Compass size={20} />, color: 'bg-indigo-500/20 text-indigo-400' },
    { id: 'protectors', label: 'Protectors', icon: <ShieldCheck size={20} />, color: 'bg-blue-500/20 text-blue-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-1000">
      <div className="flex justify-start mb-8">
        <button 
          onClick={() => navigateTo(AppView.Portal)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-[#14B8A6] transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </button>
      </div>

      <header className="text-center space-y-4">
        <Users size={40} className="text-teal-400 mx-auto" />
        <h1 className="text-4xl font-serif text-white uppercase tracking-widest">Resonance Circles</h1>
        <p className="text-white/50 max-w-2xl mx-auto">Choose your experience. Share your feelings. Connect with like-vibration souls.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map(c => (
          <div key={c.id} className="glass rounded-3xl p-8 hover:border-teal-500/30 transition-all group cursor-pointer border border-white/5">
            <div className="mb-4">{c.icon}</div>
            <h3 className="text-lg font-serif italic text-white mb-2">{c.label}</h3>
            <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <section className="glass rounded-3xl p-10 space-y-8 border border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/80">Active High-Vibe Circles</h3>
          <div className="flex items-center gap-2 text-[9px] px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 font-bold uppercase">
             <Globe size={10} className="animate-spin-slow" /> 6 Alchemists Online
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {circles.map(circle => (
            <button key={circle.id} className={`p-8 rounded-3xl border border-transparent hover:border-white/20 transition-all flex flex-col items-center gap-4 text-center group ${circle.color}`}>
              <div className="p-4 rounded-full bg-black/20 group-hover:scale-110 transition-transform">
                {circle.icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{circle.label}</span>
              <p className="text-[9px] opacity-60 leading-relaxed uppercase tracking-tighter">Enter the collective space of resonant builders</p>
            </button>
          ))}
        </div>
      </section>

      <footer className="glass rounded-3xl p-12 text-center space-y-6 border border-white/5">
        <Target size={48} className="text-white/10 mx-auto" />
        <div className="space-y-2">
          <h4 className="text-2xl font-serif italic text-white">Experience Visionary Alignment</h4>
          <p className="text-xs text-white/40 max-w-lg mx-auto leading-relaxed italic">
            "Discuss work, habits, hobbies, and life gifts through the lens of pure frequency. 
            Connect with others who share your visionary path."
          </p>
        </div>
        <button className="px-10 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white/10 transition-all">
          Explore Shared Manifests
        </button>
      </footer>
    </div>
  );
};

export default ResonanceCircles;
