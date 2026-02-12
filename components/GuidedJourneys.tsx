
import React, { useState } from 'react';
import { History, Play, Move, Zap, Heart, Sparkles, HelpCircle, Wind, UserCheck, BookOpen, ArrowLeft } from 'lucide-react';
import { AppView } from '../types';

interface GuidedJourneysProps {
  mood?: string;
}

const GuidedJourneys: React.FC<GuidedJourneysProps> = ({ mood }) => {
  const [showInfo, setShowInfo] = useState(false);

  const navigateTo = (view: AppView) => {
    window.dispatchEvent(new CustomEvent('nav-view', { detail: view }));
  };

  const journeys = [
    { title: 'Body Tuning Guided Meditation', icon: <Zap size={24} />, duration: '12m', tag: 'Meditation', desc: 'Sync your physical structure with Earth resonance.' },
    { title: 'Body Movement Clearings', icon: <Move size={24} />, duration: '15m', tag: 'Somatic', desc: 'Shake off stagnant energy and trapped emotions.' },
    { title: 'Meeting with my Inner Child', icon: <Heart size={24} />, duration: '20m', tag: 'Healing', desc: 'A gentle path back to your core innocence.' },
    { title: 'What would it look like if?', icon: <HelpCircle size={24} />, duration: '10m', tag: 'Visionary', desc: 'The alchemy of possibility and positive projection.' },
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
        <History size={40} className="text-purple-400 mx-auto" />
        <h1 className="text-4xl font-serif text-white uppercase tracking-widest">Guided Journeys</h1>
        <p className="text-white/50 max-w-xl mx-auto italic leading-relaxed">Deeper explorations through voice, sacred tones, and guided movement.</p>
        
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="mx-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-purple-400 hover:text-white transition-colors mt-2"
        >
          <BookOpen size={14} /> Journey Architecture
        </button>

        {showInfo && (
          <div className="max-w-2xl mx-auto p-8 glass rounded-[2.5rem] border-purple-500/20 bg-purple-500/5 text-left space-y-6 animate-in slide-in-from-top-4 duration-700">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white border-b border-white/10 pb-4">Standard vs Personal Alchemy</h4>
            <div className="space-y-4 text-xs text-white/60 leading-relaxed italic">
              <p>
                Unlike the **Alchemy Lab**—which constructs a unique portal from your personal music seeds—**Guided Journeys** are time-tested, pre-composed protocols.
              </p>
              <p>
                These sessions integrate vocal guidance with specific alchemical tones (like 528Hz for DNA repair or 396Hz for fear release). Use these when you require a structured, hands-off somatic experience.
              </p>
            </div>
          </div>
        )}
      </header>

      <div className="grid sm:grid-cols-2 gap-8">
        {journeys.map((j, i) => (
          <div key={i} className="glass rounded-[2rem] p-8 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer border border-white/5 shadow-xl">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/10 transition-all shadow-inner">
                {j.icon}
              </div>
              <div className="space-y-2 max-w-[200px]">
                <span className="text-[10px] uppercase font-bold text-purple-400 tracking-[0.3em] block">{j.tag}</span>
                <h3 className="text-lg font-serif text-white leading-tight">{j.title}</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium italic">{j.duration} session</p>
                <p className="text-[9px] text-white/20 leading-relaxed group-hover:text-white/40 transition-colors">{j.desc}</p>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-purple-600 group-hover:border-purple-600 transition-all group-active:scale-90 shadow-lg">
              <Play size={24} fill="currentColor" className="translate-x-0.5" />
            </div>
          </div>
        ))}
      </div>

      <section className="glass rounded-[3rem] p-12 bg-gradient-to-br from-purple-500/5 via-transparent to-teal-500/5 border border-white/5 text-center space-y-8 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-teal-500 to-purple-500 opacity-20"></div>
         <Sparkles className="text-purple-400 mx-auto animate-pulse" size={36} />
         <div className="space-y-4 relative z-10">
           <h3 className="text-3xl font-serif text-white italic">"Where Frequency Determines Your Path"</h3>
           <p className="text-sm text-white/40 max-w-2xl mx-auto leading-relaxed italic">
             "Your current vibration ({mood}) is the starting key. Our guided content adapts to your energetic signature, 
             offering clearing, activation, or rest when they are most alchemically aligned with your journey."
           </p>
         </div>
         <div className="flex justify-center gap-8 pt-4">
            <div className="flex flex-col items-center gap-2">
               <UserCheck size={20} className="text-teal-400" />
               <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest">Self Attunement</span>
            </div>
            <div className="flex flex-col items-center gap-2">
               <Wind size={20} className="text-purple-400" />
               <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest">Neural Balance</span>
            </div>
         </div>
      </section>
    </div>
  );
};

export default GuidedJourneys;
