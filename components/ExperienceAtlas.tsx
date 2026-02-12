
import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Compass, 
  Zap, 
  FlaskConical, 
  Telescope, 
  Library, 
  History, 
  Users, 
  ShieldCheck,
  Target,
  HeartPulse
} from 'lucide-react';
import { AppView } from '../types';

interface WidgetInfo {
  name: string;
  ritual: string;
}

interface PageGuide {
  id: AppView;
  label: string;
  icon: React.ReactNode;
  purpose: string;
  widgets: WidgetInfo[];
}

const ATLAS_DATA: PageGuide[] = [
  {
    id: AppView.PortalGate,
    label: "The Gate",
    icon: <Compass size={16} />,
    purpose: "The Threshold of the experience. A space for non-action and orientation. Features the primary entry points for both visitors and returning alchemists.",
    widgets: [
      { name: "Resonance Entrance", ritual: "Direct entry to the Experience Portal hub." },
      { name: "Sovereign Link", ritual: "Quick access to the Vibe Guidance for identity anchoring." }
    ]
  },
  {
    id: AppView.Portal,
    label: "Experience Portal",
    icon: <Compass size={16} />,
    purpose: "The Alchemical Hub. A centralized space to access core experiences based on your current field status.",
    widgets: [
      { name: "Experience Cards", ritual: "Navigation to Stellar Harmonix, Inner Echo, and Alchemy Lab." },
      { name: "Sovereign Indicator", ritual: "Real-time feedback on your field synchronization status." }
    ]
  },
  {
    id: AppView.InnerEcho,
    label: "Inner Echo",
    icon: <HeartPulse size={16} />,
    purpose: "Notice your moment. A private place to notice where you are right now, reflect, and perform somatic mapping.",
    widgets: [
      { name: "Somatic Mapper", ritual: "Relates physical pressure/tension to metaphysical insights and custom rituals." },
      { name: "Neural Ledger", ritual: "Visualizes your vibration history to identify patterns in your expansion." }
    ]
  },
  {
    id: AppView.AlchemyLab,
    label: "Alchemy Lab",
    icon: <FlaskConical size={16} />,
    purpose: "Shape support through music. Where your context and music preferences are woven together into a retuned journey arc.",
    widgets: [
      { name: "Transmutation Queue", ritual: "Holds your uploaded or linked tracks while they await 432Hz pitch-shifting." },
      { name: "Path Signature", ritual: "Determines the alchemical 'flavor' based on your moment and energy." }
    ]
  },
  {
    id: AppView.ImmersiveResonance,
    label: "Alchemy Resonance",
    icon: <Zap size={16} />,
    purpose: "Listen and explore. The heart of the listening experience where you engage with retuned seeds and guided phases.",
    widgets: [
      { name: "Orbital Player", ritual: "The center-point of focus, displaying current retuned seeds." },
      { name: "Journey Phases", ritual: "A 3-step alchemical process (Clearing, Resonance, Integration)." }
    ]
  },
  {
    id: AppView.AlchemyVault,
    label: "Alchemy Vault",
    icon: <Library size={16} />,
    purpose: "Hold what matters. A private space to hold what you choose to keep—journeys, reflections, and retuned seeds.",
    widgets: [
      { name: "Full Echoes", ritual: "Revisitable sessions containing your specific mix of seeds and reflections." },
      { name: "Resonant Seeds", ritual: "A library of all unique tracks you have ever retuned in the lab." }
    ]
  },
  {
    id: AppView.ResonanceCircles,
    label: "Resonance Circles",
    icon: <Users size={16} />,
    purpose: "Share and connect. Shared spaces for connection where you can join or create Circles to listen or reflect with others.",
    widgets: [
      { name: "Circle Search", ritual: "Find groups aligned with your current vibration or interest." }
    ]
  },
  {
    id: AppView.FrequencyGarden,
    label: "Frequency Garden",
    icon: <Target size={16} />,
    purpose: "Learn and Practice. A learning space offering gentle explanations and somatic tools for grounding.",
    widgets: [
      { name: "Square Breathwork", ritual: "A visual tool to synchronize your body with a rhythmic breathing pattern." }
    ]
  },
  {
    id: AppView.GuidedJourneys,
    label: "Guided Journeys",
    icon: <History size={16} />,
    purpose: "Structured support. Original audio experiences combining music and expert guidance.",
    widgets: [
      { name: "Protocol Library", ritual: "Access to specific somatic journeys like 'Body Tuning' or 'Inner Child Meeting'." }
    ]
  },
  {
    id: AppView.EnergyGuide,
    label: "Vibe Guidance",
    icon: <ShieldCheck size={16} />,
    purpose: "Account and Sovereignty. Manage your field synchronization and explore the portal's philosophy.",
    widgets: [
      { name: "Energy Alignment", ritual: "Anchor your field memory via the guide interface." },
      { name: "Creator Message", ritual: "A personal note from the developer regarding the portal's intention." }
    ]
  }
];

const ExperienceAtlas: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedPage, setExpandedPage] = useState<AppView | null>(null);

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-black/60 border border-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center text-[#14B8A6] hover:text-white hover:border-[#14B8A6]/40 hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(20,184,166,0.2)] group"
      >
        <BookOpen size={24} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#14B8A6] rounded-full animate-breath"></div>
      </button>

      {/* Atlas Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[160] flex justify-end p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative w-full max-w-md h-full portal-field overflow-hidden flex flex-col border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in slide-in-from-right-8 duration-700">
            <header className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#05070a]/80 backdrop-blur-xl z-20">
              <div className="flex items-center gap-4">
                <Compass size={24} className="text-[#14B8A6]" />
                <div>
                  <h2 className="text-xl font-serif text-white italic">Experience Atlas</h2>
                  <p className="text-[9px] text-[#14B8A6] uppercase font-bold tracking-[0.4em]">Manual of Resonance</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-white/20 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <div className="p-6 bg-[#14B8A6]/5 border border-[#14B8A6]/10 rounded-3xl mb-4">
                <p className="text-[11px] text-white/50 leading-relaxed italic">
                  "This atlas describes the alchemical structure of Immersive Audio. Expand a section to understand the rituals within."
                </p>
              </div>

              {ATLAS_DATA.map((page) => (
                <div key={page.id} className="space-y-2">
                  <button 
                    onClick={() => setExpandedPage(expandedPage === page.id ? null : page.id)}
                    className={`w-full p-6 rounded-3xl border transition-all flex items-center justify-between group ${expandedPage === page.id ? 'bg-white/5 border-[#14B8A6]/30 shadow-lg' : 'bg-white/2 border-transparent hover:bg-white/5 hover:border-white/10'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl transition-colors ${expandedPage === page.id ? 'text-[#14B8A6] bg-[#14B8A6]/10' : 'text-white/20 group-hover:text-white/60'}`}>
                        {page.icon}
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${expandedPage === page.id ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
                        {page.label}
                      </span>
                    </div>
                    {expandedPage === page.id ? <ChevronUp size={16} className="text-[#14B8A6]" /> : <ChevronDown size={16} className="text-white/10" />}
                  </button>

                  {expandedPage === page.id && (
                    <div className="px-4 py-2 space-y-4 animate-in slide-in-from-top-2 duration-500">
                      <div className="p-6 bg-white/2 rounded-[2rem] border border-white/5 space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] text-[#8B008B] uppercase font-bold tracking-widest">Purpose</span>
                          <p className="text-[11px] text-white/60 leading-relaxed italic">{page.purpose}</p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5">
                          <span className="text-[9px] text-[#14B8A6] uppercase font-bold tracking-widest">Ritual Widgets</span>
                          <div className="space-y-3">
                            {page.widgets.map((w, idx) => (
                              <div key={idx} className="space-y-1 pl-4 border-l border-white/10">
                                <h5 className="text-[10px] text-white/80 font-bold uppercase tracking-tighter">{w.name}</h5>
                                <p className="text-[9px] text-white/30 leading-relaxed italic">{w.ritual}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <footer className="p-8 border-t border-white/5 text-center">
              <p className="text-[9px] text-white/20 uppercase tracking-[0.6em]">Guided by Immersive Peace</p>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default ExperienceAtlas;
