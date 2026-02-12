
import React, { useRef } from 'react';
import { 
  Sparkles, 
  FlaskConical, 
  Lock, 
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  UserCheck,
  LogOut,
  ShieldCheck,
  History,
  Leaf,
  Users,
  Star,
  Library,
  HeartPulse,
  ScanFace,
  Grid
} from 'lucide-react';
import { AppView, StellarSignature } from '../types';

interface PortalProps {
  isLoggedIn: boolean;
  onLoginChange: (loggedIn: boolean) => void;
  onViewChange: (view: AppView) => void;
  signature?: StellarSignature | null;
  onTriggerSignature: () => void;
}

const Portal: React.FC<PortalProps> = ({ isLoggedIn, onLoginChange, onViewChange, signature, onTriggerSignature }) => {
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const experiences = [
    {
      id: AppView.AlchemyLab,
      title: "Alchemy Lab",
      desc: "The forge of music transformation. Transmute your personal seeds into 432Hz journeys designed for your unique timeline.",
      icon: <FlaskConical className="text-[#14B8A6]" size={32} />,
      view: AppView.AlchemyLab,
      locked: false,
      buttonText: "Enter Alchemy Lab"
    },
    {
      id: AppView.AlchemyVault,
      title: "Alchemy Vault",
      desc: isLoggedIn
        ? "Revisit the threads you have woven into the field. Access your private repository of resonance and captured echoes."
        : "A private repository of your personal resonance, retuned seeds, and alchemical history.",
      icon: <Library className="text-[#14B8A6]" size={32} />,
      view: AppView.AlchemyVault,
      locked: !isLoggedIn,
      buttonText: "Open Vault"
    },
    {
      id: AppView.InnerEcho,
      title: "Inner Echo",
      desc: isLoggedIn
        ? "A sanctuary for regulation and grounding. Reflect on your current state and let the mirror of sound lead you back to center."
        : "Up for some fine tuning? Access the sanctuary to add in your signature and fine tune your energy.",
      icon: <HeartPulse className="text-[#8B008B]" size={32} />,
      view: AppView.InnerEcho,
      locked: !isLoggedIn,
      buttonText: "Enter Inner Echo"
    },
    {
      id: 'signature', 
      title: "Stellar Harmonix",
      desc: isLoggedIn 
        ? "A reflective profile layer that mirrors your natural rhythms, personalizing every frequency you meet within the portal."
        : "Align your identity with cosmic patterns to personalize and fine tune your resonance portal.",
      icon: <Sparkles className="text-[#14B8A6]" size={32} />,
      locked: !isLoggedIn,
      buttonText: isLoggedIn 
        ? (signature ? "View Harmonix" : "Find Your Harmonix Keys") 
        : "Explore Harmonix"
    },
    {
      id: AppView.GuidedJourneys,
      title: "Journeys",
      desc: isLoggedIn
        ? "Structured somatic explorations through voice and sacred tones. Revisit time-tested alchemical protocols."
        : "Vocal and tonal guidance for deep somatic regulation.",
      icon: <History className="text-[#8B008B]" size={32} />,
      view: AppView.GuidedJourneys,
      locked: !isLoggedIn,
      buttonText: "Explore Journeys"
    },
    {
      id: AppView.FrequencyGarden,
      title: "Garden",
      desc: isLoggedIn
        ? "Plant your visionary seeds and engage in communal breathing rituals. A space for intention and growth."
        : "The collective garden of intentions and practices.",
      icon: <Leaf className="text-[#14B8A6]" size={32} />,
      view: AppView.FrequencyGarden,
      locked: !isLoggedIn,
      buttonText: "Visit Garden"
    },
    {
      id: AppView.ResonanceCircles,
      title: "Circles",
      desc: isLoggedIn
        ? "Find your tribe based on vibration. Join circles of alchemists aligned with your current energetic frequency."
        : "Collective spaces for shared resonance and connection.",
      icon: <Users className="text-[#8B008B]" size={32} />,
      view: AppView.ResonanceCircles,
      locked: !isLoggedIn,
      buttonText: "Join Circles"
    },
    {
      id: AppView.StarLanguages,
      title: "Stars",
      desc: isLoggedIn
        ? "Listen to tonal expressions beyond language. Observe how celestial frequencies land within your field."
        : "Pure tonal transmissions from harmonic lineages.",
      icon: <Star className="text-[#14B8A6]" size={32} />,
      view: AppView.StarLanguages,
      locked: !isLoggedIn,
      buttonText: "Observe Stars"
    }
  ];

  const handleAction = (experience: any) => {
    if (experience.locked) {
      scrollToTop();
      return;
    }

    if (experience.id === 'signature') {
      onTriggerSignature();
      return;
    }

    onViewChange(experience.view);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-1000">
      <header className="text-center space-y-6" ref={topRef}>
        <h1 className="text-5xl font-serif text-white uppercase tracking-tighter glow-text">
          Experience Portal
        </h1>
        <p className="text-white/40 max-w-xl mx-auto italic font-light leading-relaxed">
          The hub of alchemical exploration. Gather your threads and retune your field.
        </p>
      </header>

      {/* Identity Alignment Card (Login) */}
      <section className="p-10 glass rounded-[4rem] border-white/5 bg-white/5 space-y-10 animate-in slide-in-from-top-4 duration-1000 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <ShieldCheck size={160} />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex items-center gap-6 text-left">
            <div className={`p-5 rounded-3xl ${isLoggedIn ? 'bg-[#14B8A6]/10 text-[#14B8A6]' : 'bg-white/5 text-white/20'}`}>
              <ShieldCheck size={36} className={isLoggedIn ? 'animate-breath' : ''} />
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-[0.4em] text-white leading-tight">
                {isLoggedIn ? 'Identity Anchored' : 'Sign In to Fine-Tune My Experience'}
              </h3>
              <p className="text-[11px] text-white/30 uppercase tracking-widest font-medium">
                {isLoggedIn ? 'Your field is currently synced.' : 'Secure access via Face, PIN or Social Sync'}
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-2xl w-full">
            {isLoggedIn ? (
              <div className="flex items-center justify-end gap-6">
                <div className="hidden sm:flex items-center gap-2 text-[10px] text-[#14B8A6] font-bold uppercase tracking-widest bg-[#14B8A6]/5 px-6 py-3 rounded-full border border-[#14B8A6]/20 shadow-inner">
                  <UserCheck size={16} /> Quantum Sync Active
                </div>
                <button 
                  onClick={() => onLoginChange(false)} 
                  className="px-8 py-4 bg-[#8B008B]/20 rounded-full text-[10px] text-[#8B008B] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#8B008B]/30 border border-[#8B008B]/30 transition-all shadow-lg active:scale-95"
                >
                  <LogOut size={16} /> Dissolve Alignment
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-end gap-8">
                {/* Compact Bio Icons */}
                <div className="flex flex-col items-center gap-3">
                   <div className="flex gap-4">
                      <button 
                        onClick={() => onLoginChange(true)}
                        className="w-14 h-14 bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] rounded-full flex items-center justify-center hover:bg-[#14B8A6]/20 hover:shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all active:scale-90"
                        title="Face Alignment"
                      >
                        <ScanFace size={24} />
                      </button>
                      <button 
                        onClick={() => onLoginChange(true)}
                        className="w-14 h-14 bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] rounded-full flex items-center justify-center hover:bg-[#14B8A6]/20 hover:shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all active:scale-90"
                        title="PIN Pad Alignment"
                      >
                        <Grid size={24} />
                      </button>
                   </div>
                   <span className="text-[9px] text-[#14B8A6] uppercase font-bold tracking-[0.3em] opacity-40">Face / PIN</span>
                </div>

                {/* Social Alignment Options */}
                <div className="h-10 w-[1px] bg-white/5 hidden md:block"></div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button 
                    onClick={() => onLoginChange(true)} 
                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all group"
                    title="Anchor with Instagram"
                  >
                    <Instagram size={18} className="group-hover:text-[#8B008B] transition-colors" />
                  </button>
                  <button 
                    onClick={() => onLoginChange(true)} 
                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all group"
                    title="Anchor with Facebook"
                  >
                    <Facebook size={18} className="group-hover:text-blue-500 transition-colors" />
                  </button>
                  {/* Google/Gmail 'G' Button */}
                  <button 
                    onClick={() => onLoginChange(true)}
                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all group overflow-hidden"
                    title="Anchor with Gmail"
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-[18px] h-[18px] fill-current group-hover:text-red-500 transition-colors" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" className="group-hover:fill-current"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" className="group-hover:fill-current"/>
                      <path d="M5.84 14.11c-.22-.67-.35-1.39-.35-2.11s.13-1.44.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05" className="group-hover:fill-current"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335" className="group-hover:fill-current"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => onLoginChange(true)}
                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all group"
                    title="Anchor with Email"
                  >
                    <Mail size={18} className="group-hover:text-[#14B8A6] transition-colors" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiences.map((exp) => (
          <button 
            key={exp.id || exp.title} 
            onClick={() => handleAction(exp)}
            className={`portal-field p-10 flex flex-col items-center text-center space-y-8 group transition-all duration-700 relative overflow-hidden ${exp.locked ? 'opacity-60 grayscale-[0.5]' : 'hover:scale-105 hover:bg-white/5'}`}
          >
            {exp.locked && (
              <div className="absolute top-6 right-6">
                <Lock size={16} className="text-white/20" />
              </div>
            )}
            
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 ${exp.locked ? 'bg-white/5' : 'bg-[#14B8A6]/5 group-hover:bg-[#14B8A6]/10'}`}>
              {exp.icon}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif text-white italic group-hover:text-[#14B8A6] transition-colors">{exp.title}</h3>
              <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-tighter">
                {exp.desc}
              </p>
            </div>

            <div className={`mt-auto flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${exp.locked ? 'text-white/20' : 'text-[#14B8A6] group-hover:gap-5'}`}>
              {exp.locked ? "Align Identity to Enter" : exp.buttonText}
              {!exp.locked && <ArrowRight size={14} />}
            </div>
          </button>
        ))}
      </div>

      <footer className="text-center pt-8">
        <p className="text-[9px] text-white/10 uppercase tracking-[0.8em] animate-breath">
          Take what resonates, leave the rest.
        </p>
      </footer>
    </div>
  );
};

export default Portal;
