
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Music, 
  Save,
  Check,
  Waves,
  Zap,
  Activity,
  Infinity,
  Sparkles,
  Clock,
  Volume2,
  BookOpen,
  Headphones,
  Info,
  ArrowRight,
  HeartPulse
} from 'lucide-react';
import { JourneySession, JourneyPhase } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";

interface ImmersiveResonanceProps {
  session: JourneySession;
  intro: string;
  onSave: () => void;
  isSaved: boolean;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (i: number) => void;
  isLoggedIn: boolean;
  onFineTuneClick: () => void;
}

const ImmersiveResonance: React.FC<ImmersiveResonanceProps> = ({ 
  session, 
  intro, 
  onSave, 
  isSaved,
  isPlaying,
  setIsPlaying,
  currentTrackIndex,
  setCurrentTrackIndex,
  isLoggedIn,
  onFineTuneClick
}) => {
  const [selectedPhase, setSelectedPhase] = useState<JourneyPhase | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLogic, setShowLogic] = useState(false);
  
  const currentTrack = session.tracks[currentTrackIndex];

  const playPhaseGuidance = async (phase: JourneyPhase) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Speak in a calm, soothing, feminine voice: ${phase.label}. ${phase.desc}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const arrayBuffer = base64ToUint8Array(base64Audio).buffer;
        const dataInt16 = new Int16Array(arrayBuffer);
        const audioBuffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error("TTS failed", e);
      setIsSpeaking(false);
    }
  };

  function base64ToUint8Array(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-16 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-16">
          <header className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#14B8A6] flex items-center gap-3">
                <Waves size={16} className="animate-breath" /> Alchemy Resonance
              </span>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogic(!showLogic)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white/20 hover:text-white transition-all"
                  title="Resonance Logic"
                >
                  <Info size={16} />
                </button>
                <button 
                  onClick={onSave} 
                  disabled={isSaved} 
                  className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] border transition-all duration-700 ${isSaved ? 'bg-[#14B8A6]/20 border-[#14B8A6]/50 text-[#14B8A6]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'}`}
                >
                  {isSaved ? <Check size={14} className="inline mr-2"/> : <Save size={14} className="inline mr-2"/>}
                  {isSaved ? 'Echo Captured' : 'Capture Echo'}
                </button>
              </div>
            </div>

            {showLogic && (
               <div className="p-8 glass rounded-[2.5rem] border-[#14B8A6]/20 bg-[#14B8A6]/5 text-left space-y-4 animate-in slide-in-from-top-4 duration-700 mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white">The Resonance Portal Logic</h4>
                  <div className="space-y-3 text-[11px] text-white/60 leading-relaxed italic">
                    <p>1. **Retuning**: Every track in this session has been pitch-shifted to A=432Hz. This alignment resonates with the Earth's natural harmonics.</p>
                    <p>2. **Structure**: Each journey follows an alchemical arc: **Clearing** (Release), **Resonance** (Alignment), and **Integration** (Sealing).</p>
                    <p>3. **TTN Guidance**: Clicking on the Journey Phases triggers a Neural-Sync Voice that explains the purpose of the current alchemical state.</p>
                  </div>
               </div>
            )}

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.8em] text-white/20 block font-bold">Active Protocol</span>
              <h2 className="text-5xl md:text-7xl font-serif leading-tight text-white italic glow-text tracking-tighter">{session.protocol}</h2>
            </div>
            <p className="text-white/40 text-sm max-w-xl italic border-l border-white/10 pl-8 py-2 font-light leading-relaxed">{intro}</p>
          </header>

          {/* Starlight Mantra Display */}
          {session.recipe && (
            <div className="p-8 glass rounded-[3rem] border-[#14B8A6]/20 bg-[#14B8A6]/5 text-center space-y-3 animate-in fade-in duration-1000">
               <span className="text-[9px] text-[#14B8A6] uppercase font-bold tracking-[0.6em]">Starlight Mantra</span>
               <p className="text-xl font-serif text-white italic leading-relaxed">"{session.recipe.mantra}"</p>
            </div>
          )}

          {/* Orbital Player Core */}
          <div className="relative group flex items-center justify-center py-20">
             <div className="absolute inset-0 bg-[#14B8A6]/5 rounded-full blur-[120px] animate-breath"></div>
             
             {/* Decorative Orbital Rings */}
             <div className="absolute w-[450px] h-[450px] rounded-full border border-white/5 animate-[spin_30s_linear_infinite]"></div>
             <div className="absolute w-[520px] h-[520px] rounded-full border border-white/5 animate-[spin_40s_linear_infinite_reverse]"></div>
             
             <div className="relative z-10 w-80 h-80 portal-field rounded-full flex flex-col items-center justify-center p-12 text-center border-white/10 shadow-[0_0_100px_rgba(20,184,166,0.1)] group-hover:shadow-[0_0_120px_rgba(20,184,166,0.15)] transition-all duration-1000">
                <div className="absolute inset-4 rounded-full border border-white/5 opacity-50"></div>
                <Music size={40} className="text-white/10 mb-6 group-hover:text-[#14B8A6]/40 transition-colors duration-1000" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-white italic group-hover:glow-text transition-all duration-1000">{currentTrack?.title || "Harmonizing..."}</h3>
                  <p className="text-[#14B8A6] text-[10px] font-bold uppercase tracking-[0.5em] opacity-60">{currentTrack?.artist}</p>
                </div>
                <div className="mt-8 px-6 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-[0.4em]">
                  432Hz Aligned
                </div>
             </div>
          </div>

          <div className="flex items-center justify-center gap-16 relative z-10">
            <button 
              onClick={() => setCurrentTrackIndex(Math.max(0, currentTrackIndex - 1))}
              className="text-white/20 hover:text-white transition-all transform hover:scale-125 duration-500"
            >
              <SkipBack size={32} />
            </button>
            <button 
              onClick={()=>setIsPlaying(!isPlaying)} 
              className="w-28 h-28 rounded-full glass-button flex items-center justify-center shadow-[0_0_80px_rgba(255,255,255,0.05)] hover:scale-110 active:scale-95 transition-all duration-700"
            >
              {isPlaying ? <Pause size={40} fill="white" className="text-white" /> : <Play size={40} fill="white" className="ml-2 text-white" />}
            </button>
            <button 
              onClick={() => setCurrentTrackIndex(Math.min(session.tracks.length - 1, currentTrackIndex + 1))}
              className="text-white/20 hover:text-white transition-all transform hover:scale-125 duration-500"
            >
              <SkipForward size={32} />
            </button>
          </div>

          {/* Manifest Sequence */}
          <section className="portal-field p-12 space-y-10 relative overflow-hidden group/sequence animate-in slide-in-from-bottom-8 duration-1000">
             <div className="absolute top-0 right-0 p-12 opacity-5 group-hover/sequence:opacity-10 transition-opacity">
               <Infinity size={48} className="text-[#14B8A6]" />
             </div>
             
             <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.5em] text-[#14B8A6] flex items-center gap-3">
                <Music size={18} /> Manifest Sequence
              </h4>
              <p className="text-[11px] text-white/40 uppercase tracking-widest italic font-light">The neural seeds selected for this specific timeline.</p>
            </div>

             <div className="grid md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {session.tracks.map((t, i) => (
                  <button 
                    key={i} 
                    onClick={()=>setCurrentTrackIndex(i)} 
                    className={`p-6 rounded-[2rem] text-left border transition-all duration-700 group/item ${currentTrackIndex===i ? 'bg-[#14B8A6]/10 border-[#14B8A6]/40 text-white shadow-lg' : 'bg-white/5 border-transparent text-white/20 hover:bg-white/10 hover:border-white/10'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                       <span className={`text-xs font-bold truncate max-w-[160px] transition-colors duration-700 ${currentTrackIndex===i ? 'text-white' : 'text-white/40 group-hover/item:text-white/60'}`}>{t.title}</span>
                       <span className="text-[9px] font-bold opacity-30">{t.duration}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.2em] block opacity-40 italic">{t.artist}</span>
                  </button>
                ))}
             </div>
          </section>
        </div>

        <div className="w-full lg:w-96 space-y-8 relative">
          {/* Interactive Journey Phases */}
          {session.recipe && (
             <section className="portal-field p-8 space-y-6 border-[#8B008B]/20 animate-in slide-in-from-right-4 duration-1000 sticky top-24">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B008B] flex items-center gap-3">
                    <Clock size={14} /> Journey Phases
                  </h4>
                  <span className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Interactive</span>
                </div>
                
                <div className="space-y-4">
                   {session.recipe.phases.map((phase, idx) => {
                     const isActive = selectedPhase?.label === phase.label;
                     return (
                       <div 
                        key={idx} 
                        onClick={() => setSelectedPhase(phase)}
                        className={`relative pl-6 border-l py-4 group cursor-pointer transition-all duration-700 ${isActive ? 'border-[#14B8A6] bg-[#14B8A6]/5 rounded-r-2xl' : 'border-white/10 hover:border-white/40'}`}
                       >
                          <div className={`absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all ${isActive ? 'bg-[#14B8A6] shadow-[0_0_100px_#14B8A6]' : 'bg-white/10 group-hover:bg-white/40'}`}></div>
                          <div className="flex justify-between items-baseline mb-1">
                             <span className={`text-sm font-serif italic transition-colors ${isActive ? 'text-[#14B8A6]' : 'text-white/80'}`}>{phase.label}</span>
                             <span className="text-[9px] font-bold text-white/40">{phase.duration}</span>
                          </div>
                          <p className={`text-[9px] leading-relaxed uppercase tracking-tighter transition-opacity ${isActive ? 'text-white/70 opacity-100' : 'text-white/20 group-hover:text-white/40'}`}>{phase.desc}</p>
                          
                          {isActive && (
                            <div className="mt-4 flex gap-3 animate-in fade-in zoom-in-95 duration-500">
                               <button 
                                 onClick={(e) => { e.stopPropagation(); playPhaseGuidance(phase); }}
                                 className="flex-1 py-2 bg-white/10 hover:bg-[#14B8A6]/20 rounded-xl text-[8px] font-bold uppercase tracking-widest text-[#14B8A6] flex items-center justify-center gap-2 border border-transparent hover:border-[#14B8A6]/30 transition-all"
                               >
                                  {isSpeaking ? <Volume2 size={12} className="animate-pulse" /> : <Headphones size={12} />}
                                  {isSpeaking ? "Listening..." : "Hear Wisdom"}
                               </button>
                               <button 
                                 className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[#8B008B] border border-transparent hover:border-[#8B008B]/30 transition-all"
                                 title="Deep Wisdom"
                               >
                                  <BookOpen size={12} />
                               </button>
                            </div>
                          )}
                       </div>
                     );
                   })}
                </div>
                
                {/* Fine Tune CTA for Non-Logged In Users */}
                {!isLoggedIn && (
                  <div className="pt-6 border-t border-white/5 space-y-4 animate-in slide-in-from-bottom-2 duration-1000">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex items-center gap-2">
                        <HeartPulse size={12} className="text-[#8B008B]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/80">Fine Tune Your Field</span>
                      </div>
                      <p className="text-[9px] text-white/40 italic leading-relaxed">
                        "Up for some fine tuning? Sign in to check out Inner Echo, where you can add in your signature to fine tune your energy."
                      </p>
                      <button 
                        onClick={onFineTuneClick}
                        className="w-full py-3 bg-[#8B008B]/20 border border-[#8B008B]/40 text-white rounded-xl text-[8px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#8B008B]/40 transition-all shadow-lg shadow-[#8B008B]/10"
                      >
                        Sign In to Fine Tune <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-white/5 text-center">
                   <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] italic">Click a phase to deepen resonance.</p>
                </div>
             </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImmersiveResonance;
