
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Heart, 
  BookOpen, 
  Activity,
  Info,
  AlertTriangle,
  Feather,
  Users,
  Lock,
  Key,
  ExternalLink,
  CheckCircle2,
  Stars,
  Sparkles,
  ChevronRight,
  FlaskConical,
  Disc,
  Waves,
  Fingerprint,
  Target,
  MessageSquarePlus,
  Send,
  Mail
} from 'lucide-react';
import { StellarSignature, AppView, GlobalSeedPreferences } from '../types';

interface SyncEnergyProps {
  isLoggedIn: boolean;
  onLoginChange: (loggedIn: boolean) => void;
  signature: StellarSignature | null;
  useStellarSettings: boolean;
  onToggleStellarSettings: () => void;
  globalSeedPreferences: GlobalSeedPreferences;
  onGlobalSeedPreferencesChange: (prefs: GlobalSeedPreferences) => void;
}

const SyncEnergy: React.FC<SyncEnergyProps> = ({ 
  isLoggedIn, 
  onLoginChange,
  signature,
  useStellarSettings,
  onToggleStellarSettings,
  globalSeedPreferences,
  onGlobalSeedPreferencesChange
}) => {
  const [prefs, setPrefs] = useState({
    freq432: true,
    lyria: true,
    privateEcho: true,
    coCreation: false,
    timbralSoften: true,
    binauralMap: false,
    resonanceSaturation: true
  });
  const [hasPrivateKey, setHasPrivateKey] = useState(false);
  
  // Feedback Form State
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasPrivateKey(has);
      }
    };
    checkKey();
  }, []);

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasPrivateKey(true);
    }
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.message.trim()) return;

    setIsSubmitting(true);
    
    // Construct the mailto link as requested to immersiveaudioapp@immersivepeace.org
    const subject = encodeURIComponent(`Alchemist Feedback: ${feedback.name || 'Anonymous'}`);
    const body = encodeURIComponent(`Transmission from: ${feedback.name || 'Anonymous'}\nFrequency: ${feedback.email || 'Not provided'}\n\nMessage:\n${feedback.message}`);
    const mailtoUrl = `mailto:immersiveaudioapp@immersivepeace.org?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoUrl;

    // Simulate UI success
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFeedback({ name: '', email: '', message: '' });
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="text-center space-y-6">
        <div className="relative inline-block">
          <ShieldCheck size={44} className="text-[#14B8A6] mx-auto animate-breath" />
          <div className="absolute inset-0 bg-[#14B8A6]/20 blur-2xl rounded-full"></div>
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-serif text-white uppercase tracking-[0.2em] glow-text">Vibe Guidance</h1>
          <p className="text-white/40 max-xl mx-auto italic font-light">
            "Define the boundaries of your field and the depth of your integration."
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-12">
          {/* Manual of Resonance */}
          <section className="p-10 glass rounded-[3rem] border-white/5 bg-white/5 space-y-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-white/80 flex items-center gap-3">
                   <BookOpen size={18} /> Manual of Resonance
                </h3>
              </div>
              
              <div className="space-y-6">
                 {[
                   { icon: <Zap size={16} />, label: "432Hz Alignment", desc: "Forced coherence for all seeds.", active: prefs.freq432, key: 'freq432' },
                   { icon: <Activity size={16} />, label: "AI Guide Mirroring", desc: "Persona-aware reflections.", active: prefs.lyria, key: 'lyria' },
                   { icon: <Lock size={16} />, label: "Private Echoes", desc: "No data leaves your local field.", active: prefs.privateEcho, key: 'privateEcho' },
                   { icon: <Users size={16} />, label: "Co-Creation Mode", desc: "Enable shared circle sync.", active: prefs.coCreation, key: 'coCreation' },
                 ].map((item) => (
                   <div key={item.key} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-2xl transition-colors ${item.active ? 'bg-[#14B8A6]/10 text-[#14B8A6]' : 'bg-white/5 text-white/20'}`}>
                            {item.icon}
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{item.label}</p>
                            <p className="text-[9px] text-white/30 uppercase tracking-tighter">{item.desc}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => togglePref(item.key as any)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors relative border ${item.active ? 'bg-[#14B8A6]/20 border-[#14B8A6]/40' : 'bg-white/5 border-white/10'}`}
                      >
                         <div className={`w-4 h-4 rounded-full transition-all duration-300 absolute top-1 ${item.active ? 'right-1 bg-[#14B8A6]' : 'left-1 bg-white/20'}`}></div>
                      </button>
                   </div>
                 ))}
              </div>
          </section>

          {/* Seed Settings */}
          <section className="p-10 glass rounded-[3rem] border-[#8B008B]/20 bg-[#8B008B]/5 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-4 -right-4 p-8 opacity-5">
                 <FlaskConical size={100} className="text-[#8B008B]" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-[#8B008B] flex items-center gap-3">
                     <Disc size={18} /> Seed Settings
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest">{globalSeedPreferences.enabled ? "Selections Active" : "Selections Disabled"}</span>
                    <button 
                      onClick={() => onGlobalSeedPreferencesChange({...globalSeedPreferences, enabled: !globalSeedPreferences.enabled})}
                      className={`w-12 h-6 rounded-full p-1 transition-colors relative border ${globalSeedPreferences.enabled ? 'bg-[#14B8A6]/20 border-[#14B8A6]/40' : 'bg-white/5 border-white/10'}`}
                    >
                       <div className={`w-4 h-4 rounded-full transition-all duration-300 absolute top-1 ${globalSeedPreferences.enabled ? 'right-1 bg-[#14B8A6]' : 'left-1 bg-white/20'}`}></div>
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-white/30 uppercase tracking-widest">Alchemists Selections & Global Seed Processing</p>
                  <p className="text-[8px] text-[#8B008B]/60 uppercase tracking-[0.2em] italic font-bold">Optional: Defaults applied if disabled.</p>
                </div>
              </div>

              {globalSeedPreferences.enabled && (
                <div className="space-y-6 pt-4 animate-in slide-in-from-top-4 duration-500">
                   <div className="space-y-6 p-8 bg-[#05070a]/40 rounded-[2rem] border border-[#8B008B]/20 relative">
                      <div className="absolute top-6 right-6 opacity-20">
                         <Fingerprint size={24} className="text-[#8B008B]" />
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[9px] text-[#8B008B] uppercase font-bold tracking-widest">Primary Genre</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Ambient, Lo-Fi, Neoclassical..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-[#8B008B] outline-none placeholder:text-white/10"
                            value={globalSeedPreferences.genre}
                            onChange={e => onGlobalSeedPreferencesChange({...globalSeedPreferences, genre: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] text-[#8B008B] uppercase font-bold tracking-widest">Top 3-10 Favorite Songs and Artists</label>
                          <textarea 
                            placeholder="e.g. Brian Eno - An Ending (Ascent)... The more unique the better."
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-[#8B008B] outline-none placeholder:text-white/10 resize-none no-scrollbar"
                            value={globalSeedPreferences.songsAndArtists}
                            onChange={e => onGlobalSeedPreferencesChange({...globalSeedPreferences, songsAndArtists: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 text-[8px] text-[#14B8A6] uppercase tracking-[0.2em] font-bold">
                         <Target size={12} /> Selections will guide all future journeys (Optional)
                      </div>
                   </div>
                </div>
              )}

              <div className="space-y-6 pt-6 border-t border-white/5">
                 {[
                   { icon: <Sparkles size={16} />, label: "Timbral Softening", desc: "Remove abrasive frequencies from source audio.", active: prefs.timbralSoften, key: 'timbralSoften' },
                   { icon: <Waves size={16} />, label: "Binaural Mapping", desc: "Spatially re-position seeds for brain sync.", active: prefs.binauralMap, key: 'binauralMap' },
                   { icon: <Activity size={16} />, label: "Resonance Saturation", desc: "Enhance harmonic overtones in low-end seeds.", active: prefs.resonanceSaturation, key: 'resonanceSaturation' },
                 ].map((item) => (
                   <div key={item.key} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-2xl transition-colors ${item.active ? 'bg-[#8B008B]/10 text-[#8B008B]' : 'bg-white/5 text-white/20'}`}>
                            {item.icon}
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{item.label}</p>
                            <p className="text-[9px] text-white/30 uppercase tracking-tighter">{item.desc}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => togglePref(item.key as any)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors relative border ${item.active ? 'bg-[#8B008B]/20 border-[#8B008B]/40' : 'bg-white/5 border-white/10'}`}
                      >
                         <div className={`w-4 h-4 rounded-full transition-all duration-300 absolute top-1 ${item.active ? 'right-1 bg-[#8B008B]' : 'left-1 bg-white/20'}`}></div>
                      </button>
                   </div>
                 ))}
                 <p className="text-center text-[7px] text-white/10 uppercase tracking-[0.4em] pt-2">All Seed Processing is optional.</p>
              </div>
          </section>
        </div>

        <div className="space-y-8">
           {/* Feedback Form */}
           <section className="p-10 glass rounded-[3rem] border-[#14B8A6]/20 bg-white/5 space-y-6 shadow-2xl animate-in slide-in-from-right-4 duration-1000">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-[#14B8A6] flex items-center gap-3">
                   <MessageSquarePlus size={18} /> Alchemist Feedback
                </h3>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed italic font-light">
                 Transmit your observations, trends, or suggested retunings to the collective field weaver.
              </p>

              <form onSubmit={handleSendFeedback} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[8px] text-white/30 uppercase font-bold tracking-widest ml-4">Name</label>
                       <input 
                          type="text" 
                          placeholder="Your Identifier"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 text-xs text-white focus:ring-1 focus:ring-[#14B8A6] outline-none placeholder:text-white/10"
                          value={feedback.name}
                          onChange={e => setFeedback({...feedback, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[8px] text-white/30 uppercase font-bold tracking-widest ml-4">Frequency (Email)</label>
                       <input 
                          type="email" 
                          placeholder="Reachback Address"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 text-xs text-white focus:ring-1 focus:ring-[#14B8A6] outline-none placeholder:text-white/10"
                          value={feedback.email}
                          onChange={e => setFeedback({...feedback, email: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[8px] text-white/30 uppercase font-bold tracking-widest ml-4">Transmission</label>
                    <textarea 
                       required
                       placeholder="Speak your observations into the field..."
                       className="w-full h-24 bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white focus:ring-1 focus:ring-[#14B8A6] outline-none placeholder:text-white/10 resize-none no-scrollbar"
                       value={feedback.message}
                       onChange={e => setFeedback({...feedback, message: e.target.value})}
                    />
                 </div>
                 
                 <button 
                    type="submit"
                    disabled={isSubmitting || !feedback.message.trim()}
                    className="w-full py-4 bg-[#14B8A6]/20 border border-[#14B8A6]/40 text-white rounded-full font-bold uppercase tracking-[0.4em] text-[9px] hover:bg-[#14B8A6]/40 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-20"
                 >
                    {isSubmitting ? <Activity size={14} className="animate-spin" /> : <Send size={14} />}
                    {isSubmitting ? "Transmitting..." : "Send Transmission"}
                 </button>

                 {showSuccess && (
                    <div className="flex items-center justify-center gap-2 text-[9px] text-[#14B8A6] uppercase tracking-widest font-bold animate-in fade-in zoom-in-95 duration-500">
                       <CheckCircle2 size={12} /> Opening Neural Uplink (Email Client)
                    </div>
                 )}
              </form>
           </section>

           <section className="p-10 glass rounded-[3rem] border-white/5 bg-white/5 space-y-6 shadow-2xl">
              <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-[#14B8A6] flex items-center gap-3">
                 <Info size={18} /> The Portal Philosophy
              </h3>
              <p className="text-[11px] text-white/60 leading-relaxed italic font-light">
                 Immersive Audio is a sovereign sound-healing environment. By retuning modern music to 432Hz—the "Heartbeat of the Earth"—we provide a digital sanctuary for nervous system regulation.
              </p>
           </section>

           {/* API Key Selection - Moved after The Portal Philosophy */}
           <section className="p-10 glass rounded-[3rem] border-[#14B8A6]/20 bg-[#14B8A6]/5 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-[#14B8A6] flex items-center gap-3">
                   <Key size={18} /> Field Sovereignty
                </h3>
                {hasPrivateKey && <CheckCircle2 size={16} className="text-[#14B8A6]" />}
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed italic font-light">
                The shared resonance field may experience quota limitations. Anchor your own private API key for uninterrupted access.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={handleSelectKey}
                  className="w-full py-5 bg-[#14B8A6] text-black rounded-full font-bold uppercase tracking-[0.4em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  <Key size={16} /> {hasPrivateKey ? "Update Private Key" : "Anchor Private Key"}
                </button>
              </div>
           </section>

           <section className="p-10 glass rounded-[3rem] border-[#8B008B]/20 bg-[#8B008B]/5 space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Feather size={64} className="text-[#8B008B]" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-[#8B008B] flex items-center gap-3">
                 <Feather size={18} /> Message from the Weaver
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-serif italic">
                 "This space was born from a desire to find silence within noise. In a world of increasing digital density, it is my hope that these frequencies serve as a bridge—back to the body, back to the breath, and back to your own inner silence."
              </p>
           </section>
        </div>
      </div>
    </div>
  );
};

export default SyncEnergy;
