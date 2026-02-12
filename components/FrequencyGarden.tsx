
import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Leaf, 
  Heart, 
  Sparkles, 
  Sprout, 
  CloudRain, 
  Info, 
  Send, 
  Target, 
  Eye, 
  Users, 
  ArrowRight,
  MessageSquarePlus,
  Rocket,
  ArrowLeft
} from 'lucide-react';
import { AppView } from '../types';

const FrequencyGarden: React.FC = () => {
  const [breathing, setBreathing] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [visionInput, setVisionInput] = useState("");
  
  useEffect(() => {
    if (!breathing) return;
    const phases: ('Inhale' | 'Hold' | 'Exhale' | 'Pause')[] = ['Inhale', 'Hold', 'Exhale', 'Pause'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % 4;
      setPhase(phases[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, [breathing]);

  const navigateTo = (view: AppView) => {
    window.dispatchEvent(new CustomEvent('nav-view', { detail: view }));
  };

  const ideaCards = [
    {
      title: "Healing the Healers Program",
      focus: "Reconciling Western Medicine with Holistic Alchemy",
      description: "A specialized frequency protocol designed to support medical professionals in high-stress environments.",
      icon: <Heart className="text-red-400" size={24} />,
      circle: "Guides"
    },
    {
      title: "Global Sound Bath Network",
      focus: "Mass Collective Coherence Events",
      description: "Coordinating 432Hz events across timezones to shift planetary resonance.",
      icon: <Users className="text-teal-400" size={24} />,
      circle: "Innovators"
    },
    {
      title: "Neuro-Acoustic Architecture",
      focus: "Alchemical Living Spaces",
      description: "Integrating constant low-level healing frequencies into community housing projects.",
      icon: <Rocket className="text-purple-400" size={24} />,
      circle: "Builders"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-16 animate-in fade-in duration-1000">
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
        <Leaf size={40} className="text-teal-400 mx-auto" />
        <h1 className="text-4xl font-serif text-white uppercase tracking-widest">Frequency Garden</h1>
        <p className="text-white/50 max-w-2xl mx-auto italic border-b border-white/5 pb-4">Let's set our Intention. Attune your vessel to feel the resonance of life.</p>
      </header>

      {/* Idea Forum Section */}
      <section className="space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
           <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-teal-400">Visionary Idea Forum</h2>
           <p className="text-[10px] text-white/30 uppercase tracking-widest">Collective seeds seeking resonance. Connect with circles to manifest these visions.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
           {ideaCards.map((card, idx) => (
             <div key={idx} className="glass rounded-[2rem] p-8 border border-white/5 flex flex-col space-y-4 hover:border-teal-500/20 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                   {card.icon}
                </div>
                <div className="p-3 rounded-2xl bg-white/5 w-fit">
                   {card.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif italic text-white leading-tight">{card.title}</h3>
                  <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">{card.focus}</p>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed italic">{card.description}</p>
                <button 
                  onClick={() => navigateTo(AppView.ResonanceCircles)}
                  className="mt-auto pt-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 group-hover:text-teal-400 transition-colors"
                >
                  Join {card.circle} Circle <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
           ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Breathing Space */}
        <section className="glass rounded-[3rem] p-10 flex flex-col items-center justify-center text-center space-y-8 min-h-[550px] border border-teal-500/10 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-20"><Info size={20} /></div>
           <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-teal-400">Clearing & Breathwork</h3>
           
           <div className={`relative w-72 h-72 rounded-full border-2 border-teal-500/20 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${breathing && phase==='Inhale' ? 'scale-125 bg-teal-500/5' : breathing && phase==='Exhale' ? 'scale-90 bg-black/40' : 'scale-100'}`}>
              <div className="absolute inset-0 bg-teal-500/5 blur-[80px] animate-pulse"></div>
              <div className="relative z-10 flex flex-col items-center space-y-2">
                 <Wind size={48} className={`text-teal-400 ${breathing ? 'animate-bounce' : ''}`} />
                 <span className="text-3xl font-serif text-white italic tracking-widest">{breathing ? phase : 'Ready?'}</span>
              </div>
           </div>

           <div className="space-y-6 relative z-10">
             <div className="space-y-2">
               <p className="text-xs text-white/60 font-medium uppercase tracking-widest">Square Breathing Protocol</p>
               <p className="text-[10px] text-white/30 max-w-xs leading-relaxed">Attune your body. Feel the subtle expansion. 4 seconds for each phase.</p>
             </div>
             <button 
               onClick={() => setBreathing(!breathing)} 
               className={`px-12 py-4 rounded-full font-bold uppercase tracking-[0.3em] text-xs transition-all shadow-lg ${breathing ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-teal-500/20 border border-teal-500/50 text-teal-400 hover:bg-teal-500/30'}`}
             >
               {breathing ? 'End Practice' : 'Begin Clearing'}
             </button>
           </div>
        </section>

        {/* Collaborative Thinkery */}
        <section className="glass rounded-[3rem] p-10 space-y-8 flex flex-col h-full border border-purple-500/10 shadow-xl relative overflow-hidden">
           <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full"></div>
           <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-purple-400 flex items-center gap-2">
             <Sprout size={18} /> Collaborative Thinkery
           </h3>
           <div className="space-y-2">
             <h4 className="text-lg font-serif italic text-white">Planting Seeds for the Future</h4>
             <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">Share your Topics, Trends, and Visions with the collective garden.</p>
           </div>
           
           <div className="flex-1 space-y-6 pt-4">
              <div className="space-y-2">
                 <span className="text-[10px] text-purple-400/60 uppercase font-bold tracking-widest flex items-center gap-2"><Target size={12} /> The Vision</span>
                 <input 
                   type="text" 
                   placeholder="e.g. Decentralized Healing Hubs" 
                   className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder:text-white/20 transition-all" 
                 />
              </div>
              <div className="space-y-2">
                 <span className="text-[10px] text-purple-400/60 uppercase font-bold tracking-widest flex items-center gap-2"><Eye size={12} /> The Manifestation</span>
                 <textarea 
                   placeholder="Describe how this trend elevates our collective vibration..." 
                   className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none text-white placeholder:text-white/20 transition-all"
                   value={visionInput}
                   onChange={e => setVisionInput(e.target.value)}
                 ></textarea>
              </div>
           </div>

           <div className="space-y-4">
             <button className="w-full py-5 bg-purple-500 text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-purple-400 hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl shadow-purple-900/20 active:scale-95">
               <Sparkles size={16} /> Plant Vision Seed
             </button>

             {/* Moved Feedback Button */}
             <button className="w-full py-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-teal-500/20 transition-all">
               <MessageSquarePlus size={16} /> Alchemist Feedback & Suggestions
             </button>
           </div>

           <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-2 group hover:bg-white/10 transition-colors">
                 <Heart size={16} className="text-red-400 group-hover:scale-125 transition-transform" />
                 <span className="text-[9px] uppercase tracking-widest font-bold opacity-60">Attune Body</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-2 group hover:bg-white/10 transition-colors">
                 <CloudRain size={16} className="text-blue-400 group-hover:scale-125 transition-transform" />
                 <span className="text-[9px] uppercase tracking-widest font-bold opacity-60">Nourish Souls</span>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default FrequencyGarden;
