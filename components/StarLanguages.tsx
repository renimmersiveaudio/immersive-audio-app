
import React, { useState } from 'react';
import { Star, Play, Save, Check, ArrowLeft, Volume2, Info, Compass, Target } from 'lucide-react';
import { AppView } from '../types';

interface StarLanguageEntry {
  id: string;
  name: string;
  description: string;
  association?: string;
  bodyNote?: string;
  practice?: string;
}

const STAR_LANGUAGES: StarLanguageEntry[] = [
  {
    id: 'sl-1',
    name: "Luminous Drift",
    description: "This resonance often presents as a sweeping movement through the crown and shoulders, inviting a sense of spacious clarity.",
    association: "Commonly referenced within the Anuhazi harmonic lineage.",
    bodyNote: "You may notice a subtle lifting sensation in the upper field.",
    practice: "Allow the breath to follow the upward sweep of the tone."
  },
  {
    id: 'sl-2',
    name: "Amber Pulse",
    description: "A steady, resonant tone that many notice as a warm presence in the lower belly or root.",
    association: "Often associated with Sirian harmonic descriptors.",
    bodyNote: "Observe any rooting sensations in the base of the spine.",
    practice: "Rest your attention on the earth during the silence between pulses."
  },
  {
    id: 'sl-3',
    name: "Crystalline Current",
    description: "This tonal expression may feel like a rhythmic pulse within the chest, often associated with a soft, expansive emotional quality.",
    association: "Frequently associated with Pleiadian harmonic families.",
    bodyNote: "Notice the rhythmic expansion of the heart space.",
    practice: "Imagine the sound washing over the chest like a gentle wave."
  }
];

const StarLanguages: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const navigateTo = (view: AppView) => {
    window.dispatchEvent(new CustomEvent('nav-view', { detail: view }));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-1000">
      <header className="text-center space-y-6">
        <Star size={44} className="text-[#14B8A6] mx-auto animate-breath" />
        <h1 className="text-5xl font-serif text-white uppercase tracking-[0.2em] glow-text">Star Languages</h1>
        <p className="text-white/40 max-w-xl mx-auto italic font-light leading-relaxed">
          Observe tonal resonance beyond words. Listen with the body and notice where each frequency lands.
        </p>
      </header>

      <div className="space-y-6">
        {STAR_LANGUAGES.map((entry) => (
          <div key={entry.id} className="portal-field p-8 flex flex-col gap-8 group hover:bg-white/5 transition-all">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setPlayingId(playingId === entry.id ? null : entry.id)}
                className={`w-20 h-20 rounded-full flex items-center justify-center border transition-all ${playingId === entry.id ? 'bg-[#14B8A6]/20 border-[#14B8A6]' : 'bg-white/5 border-white/10'}`}
              >
                {playingId === entry.id ? <Volume2 size={32} className="text-[#14B8A6]" /> : <Play size={32} className="text-white/40" />}
              </button>
              <div className="flex-1">
                <h3 className="text-xl font-serif text-white italic">{entry.name}</h3>
                <p className="text-sm text-white/50 leading-relaxed italic mt-2">{entry.description}</p>
                {entry.association && <p className="text-[10px] text-[#14B8A6] uppercase font-bold mt-4 flex items-center gap-2"><Compass size={12}/> {entry.association}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigateTo(AppView.Portal)} className="mx-auto flex items-center gap-3 px-10 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase text-white/40 hover:text-white transition-all">
        <ArrowLeft size={14} /> Back to Portal
      </button>
    </div>
  );
};

export default StarLanguages;
