
import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass,
  MessageCircle,
  Send,
  Zap,
  Activity,
  Info,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Stars,
  RotateCcw,
  User,
  AlertCircle,
  Dna,
  Heart,
  Music,
  Waves as WaveIcon,
  Check,
  BookOpen,
  HelpCircle,
  Stars as StarsIcon,
  Fingerprint,
  Target,
  Wind,
  Sparkle,
  X,
  Flame,
  FlaskConical,
  Settings,
  HeartPulse,
  ChevronUp
} from 'lucide-react';
import { CurrentVibration, DesiredResonance, JourneySession, MoodEntry, ChatMessage, AppView, MomentSignal, StellarSignature, InnerEchoPlan } from '../types';
import { generateAffirmation, getMetaphysicalInsight, generateInnerEchoPlan, generateStellarSignature } from '../services/geminiService';
import { GoogleGenAI } from '@google/genai';

interface InnerEchoProps {
  signature: StellarSignature | null;
  onSignatureChange: (sig: StellarSignature) => void;
  useStellarSettings: boolean;
  onToggleStellarSettings: () => void;
  currentVibe: CurrentVibration;
  goalResonance: DesiredResonance;
  onVibeChange: (v: CurrentVibration) => void;
  onGoalChange: (g: DesiredResonance) => void;
  savedSessions: JourneySession[];
  moodHistory: MoodEntry[];
  onLoadSession: (session: JourneySession) => void;
  signal: MomentSignal;
  onSignalChange: (s: MomentSignal) => void;
  autoOpenSignature?: boolean;
  onSignatureModalOpened?: () => void;
  echoPlan: InnerEchoPlan | null;
  onEchoPlanChange: (plan: InnerEchoPlan | null) => void;
  isMusicPlaying?: boolean;
}

const InnerEcho: React.FC<InnerEchoProps> = ({ 
  signature, 
  onSignatureChange,
  useStellarSettings,
  onToggleStellarSettings,
  currentVibe, 
  goalResonance, 
  onVibeChange, 
  onGoalChange, 
  savedSessions, 
  moodHistory, 
  onLoadSession, 
  signal, 
  onSignalChange,
  autoOpenSignature,
  onSignatureModalOpened,
  echoPlan,
  onEchoPlanChange,
  isMusicPlaying
}) => {
  const [affirmation, setAffirmation] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0); 
  const [showInfo, setShowInfo] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [insight, setInsight] = useState<{meaning: string, frequency: string, tone: string, chakra: string, balancing: string} | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const [showGenerator, setShowGenerator] = useState(false);
  const [isGeneratingSignature, setIsGeneratingSignature] = useState(false);
  const [birthDetails, setBirthDetails] = useState({ date: '', time: '', location: '' });

  const chatEndRef = useRef<HTMLDivElement>(null);

  const bodyParts = [
    "Crown & Scalp", "Eyes & Brows", "Jaw & Mouth", "ENT & Neck", "Shoulders & Traps", 
    "Hands & Arms", "Chest & Lungs", "Upper Back", "Lower Back", "Upper Stomach", 
    "Lower Stomach", "Digestion", "Pelvic Floor", "Base of Spine", "Knees & Feet"
  ];

  const feelingOptions = [
    "Anxiety", "Overstimulation", "Unable to Focus", "Unable to Sleep", 
    "Restlessness", "Fatigue", "Creative Block", "Brain Fog"
  ];

  useEffect(() => {
    generateAffirmation(currentVibe, goalResonance).then(setAffirmation);
  }, [currentVibe, goalResonance]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (autoOpenSignature) {
      setShowGenerator(true);
      onSignatureModalOpened?.();
    }
  }, [autoOpenSignature]);

  const handlePartSelection = async (part: string) => {
    setSelectedBodyPart(part);
    setIsLoadingInsight(true);
    try {
      const data = await getMetaphysicalInsight(part);
      setInsight(data);
    } catch (e) {
      console.error("Failed to get metaphysical insight:", e);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const handleAlchemize = async () => {
    setIsGeneratingPlan(true);
    try {
      const activeSig = (useStellarSettings && signature) ? signature : null;
      const sigToUse = activeSig || {
        harmonicKeys: ["Natural Flow"],
        overview: "A baseline alchemical attunement.",
        regulationTendencies: ["General awareness"],
        creativeAlchemy: ["Standard movement"]
      };
      const plan = await generateInnerEchoPlan(currentVibe, sigToUse);
      onEchoPlanChange(plan);
      // Automatically return to Alchemy Lab after generation as requested
      window.dispatchEvent(new CustomEvent('nav-view', { detail: AppView.AlchemyLab }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleResetAttunement = () => {
    setStep(0);
    setShowChoices(false);
    onEchoPlanChange(null);
    onSignalChange({
      activity: 'Presence',
      timeAvailable: 15,
      rhythm: 'Aligned',
      intent: 'Support'
    });
  };

  const handleRevealSignature = async () => {
    if (!birthDetails.date || !birthDetails.location) return;
    setIsGeneratingSignature(true);
    try {
      const sig = await generateStellarSignature(birthDetails.date, birthDetails.time, birthDetails.location);
      onSignatureChange(sig);
      setShowGenerator(false);
      
      // Navigate/Scroll to the results after a short rendering delay
      setTimeout(() => {
        const el = document.getElementById('stellar-results-anchor');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingSignature(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: inputText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    const sigContext = signature ? `Stellar Harmonix Context: Keys: ${signature.harmonicKeys.join(', ')}. Overview: ${signature.overview}` : "";
    const musicContext = isMusicPlaying ? "Atmosphere: A personalized sound journey is currently playing in the background. Incorporate the feeling of harmonic support into your guidance." : "Atmosphere: Silent integration.";

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the Resonance Guide in an Alchemical Sound Portal.
        - Tone: Compassionate DJ, grounded observer, poetic but secular.
        - Listening: Treat "umm", "I don't know", or hesitation as moments of recalibration.
        - Focus: Music curation and sound-based nervous system support.
        - POSITIVE PLATFORM: This is a positive-only space. Never use negative emotional terms. 
        
        Alchemist state: ${currentVibe} -> ${goalResonance}.
        Moment: ${signal.activity} (${signal.intent}).
        Current Feelings: ${signal.feelings?.join(', ') || 'No specific feelings noted'}.
        ${sigContext}
        ${musicContext}
        
        User says: ${inputText}`,
      });
      const aiMsg: ChatMessage = { role: 'model', text: response.text || "I am here, reflecting your resonance.", timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      setIsTyping(false);
    } finally {
      setIsTyping(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const toggleFeeling = (feeling: string) => {
    const currentFeelings = signal.feelings || [];
    if (currentFeelings.includes(feeling)) {
      onSignalChange({ ...signal, feelings: currentFeelings.filter(f => f !== feeling) });
    } else if (currentFeelings.length < 3) {
      onSignalChange({ ...signal, feelings: [...currentFeelings, feeling] });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderAttunementFlow = () => {
    const questions = [
      {
        q: "What's your current moment like?",
        options: [
          { label: 'Work/Meetings', val: 'Work/Meetings' },
          { label: 'Physical Activity', val: 'Physical Activity' },
          { label: 'Starting my day', val: 'Focus' },
          { label: 'Waiting for...', val: 'Somatic' },
          { label: 'Time to unwind', val: 'Softness' },
          { label: 'Need a boost', val: 'Rest' },
          { label: 'Just being present', val: 'Presence' }
        ],
        key: 'activity'
      },
      {
        q: "What are your top 3 feelings?",
        type: 'multi',
        options: feelingOptions,
        key: 'feelings'
      },
      {
        q: "Space available for you?",
        options: [
          { label: 'A quick shift (5m)', val: 5 },
          { label: 'A steady anchor (15m)', val: 15 },
          { label: 'A deep immersion (20m+)', val: 20 }
        ],
        key: 'timeAvailable'
      },
      {
        q: "Where are we headed?",
        options: [
          { label: 'Empowerment Beats', val: 'Empowerment' },
          { label: 'Pure Focus', val: 'Focus' },
          { label: 'Creative Flow', val: 'Flow' },
          { label: 'Releasing Density', val: 'Tension' },
          { label: 'A Reset', val: 'Reset' },
          { label: 'Gentle Support', val: 'Support' }
        ],
        key: 'intent'
      }
    ];

    if (step >= questions.length) {
      return (
        <div className="p-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <div className="relative inline-block">
              <FlaskConical size={48} className="text-[#14B8A6] mx-auto animate-breath" />
           </div>
           
           {!showChoices ? (
             <div className="space-y-6 animate-in zoom-in-95 duration-700">
               <div className="space-y-2">
                 <h3 className="text-2xl font-serif text-white italic">Attunement Anchored</h3>
                 <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] leading-relaxed">
                   Your resonance is captured in the field.
                 </p>
               </div>
               <button 
                 onClick={() => setShowChoices(true)}
                 className="w-full py-6 bg-[#14B8A6] text-black rounded-full font-bold uppercase tracking-[0.5em] text-[11px] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(20,184,166,0.2)] flex items-center justify-center gap-4 group"
               >
                 Add to Alchemy Lab <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </button>
             </div>
           ) : (
             <div className="space-y-8 animate-in fade-in duration-700">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif text-white italic">Select Laboratory Action</h3>
                </div>
                
                <div className="grid gap-3">
                   <button 
                     onClick={handleAlchemize}
                     disabled={isGeneratingPlan}
                     className="w-full p-6 bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] rounded-[2rem] text-left transition-all hover:bg-[#14B8A6]/20 flex items-center justify-between group"
                   >
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-[#14B8A6]/20 rounded-xl">
                            {isGeneratingPlan ? <Activity size={18} className="animate-spin" /> : <Flame size={18} />}
                         </div>
                         <div className="text-left">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-white">Alchemize</p>
                            <p className="text-[9px] text-white/40 uppercase tracking-tighter">Generate sound journey plan</p>
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-white/20 group-hover:translate-x-1 transition-all" />
                   </button>

                   <button 
                     onClick={() => setShowGenerator(true)}
                     className="w-full p-6 bg-[#8B008B]/10 border border-[#8B008B]/30 text-[#8B008B] rounded-[2rem] text-left transition-all hover:bg-[#8B008B]/20 flex items-center justify-between group"
                   >
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-[#8B008B]/20 rounded-xl">
                            {signature ? <Check size={18} className="text-[#14B8A6]" /> : <Sparkles size={18} />}
                         </div>
                         <div className="text-left">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-white">
                               {signature ? "Stellar Harmonix Active" : "Add Stellar Harmonix"}
                            </p>
                            <p className="text-[9px] text-white/40 uppercase tracking-tighter">
                               {signature ? "Cosmic Signature Anchored" : "Anchor cosmic signature keys"}
                            </p>
                         </div>
                      </div>
                      {signature ? <Check size={16} className="text-[#14B8A6]" /> : <ChevronRight size={16} className="text-white/20 group-hover:translate-x-1 transition-all" />}
                   </button>

                   {signature && (
                     <button 
                       onClick={() => window.dispatchEvent(new CustomEvent('nav-view', { detail: AppView.AlchemyLab }))}
                       className="w-full py-5 bg-[#14B8A6] text-black rounded-[2rem] font-bold uppercase tracking-[0.4em] text-[10px] hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3 animate-in zoom-in-95 duration-700"
                     >
                        <FlaskConical size={16} /> Proceed to Laboratory
                     </button>
                   )}

                   <button 
                     onClick={handleResetAttunement}
                     className="w-full p-6 bg-white/5 border border-white/10 text-white/40 rounded-[2rem] text-left transition-all hover:bg-white/10 flex items-center justify-between group"
                   >
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white/10 rounded-xl">
                            <RotateCcw size={18} />
                         </div>
                         <div className="text-left">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-white/80">Reset</p>
                            <p className="text-[9px] text-white/20 uppercase tracking-tighter">Recalibrate attunement</p>
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-white/10 group-hover:translate-x-1 transition-all" />
                   </button>
                </div>
             </div>
           )}
        </div>
      );
    }

    const cur = questions[step];

    if (cur.type === 'multi') {
      return (
        <div className="p-10 space-y-10 animate-in slide-in-from-right-8 duration-700">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] text-[#8B008B] uppercase font-bold tracking-[0.4em]">Resonance Mapping</span>
              <h3 className="text-3xl font-serif text-white italic leading-tight">{cur.q}</h3>
            </div>
            {step > 0 && (
              <button onClick={prevStep} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white">
                <ArrowLeft size={16} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(cur.options as string[]).map((opt: string) => {
              const isSelected = (signal.feelings || []).includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleFeeling(opt)}
                  className={`p-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest text-center border transition-all duration-300 ${isSelected ? 'bg-[#14B8A6]/20 border-[#14B8A6]/50 text-[#14B8A6]' : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          <button onClick={nextStep} className="w-full py-4 bg-white/5 border border-white/10 text-white/40 rounded-full text-[10px] font-bold uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
             Continue
          </button>
        </div>
      );
    }

    return (
      <div className="p-10 space-y-10 animate-in slide-in-from-right-8 duration-700">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-[10px] text-[#8B008B] uppercase font-bold tracking-[0.4em]">Moment Attunement</span>
            <h3 className="text-3xl font-serif text-white italic leading-tight">{cur.q}</h3>
          </div>
          {step > 0 && (
            <button onClick={prevStep} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white">
              <ArrowLeft size={16} />
            </button>
          )}
        </div>
        <div className="grid gap-3">
          {(cur.options as any[]).map((opt: any) => (
            <button
              key={opt.val}
              onClick={() => {
                onSignalChange({ ...signal, [cur.key]: opt.val });
                nextStep();
              }}
              className="w-full p-6 rounded-3xl text-left text-xs transition-all flex items-center justify-between group border bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
            >
              <span className="font-bold uppercase tracking-widest">{opt.label}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-16 animate-in fade-in duration-1000">
      <header className="text-center space-y-6">
        <HeartPulse size={48} className="text-[#8B008B] mx-auto opacity-40 animate-breath" />
        <h1 className="text-5xl font-serif text-white uppercase tracking-tighter glow-text">Inner Echo</h1>
        <p className="text-white/40 max-w-2xl mx-auto italic font-light leading-relaxed text-lg">"{affirmation}"</p>
        
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="mx-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#14B8A6] hover:text-white transition-colors"
        >
          <Info size={14} /> How Attunement Works
        </button>

        {showInfo && (
          <div className="max-w-2xl mx-auto p-8 glass rounded-[2.5rem] border-[#14B8A6]/20 bg-[#14B8A6]/5 text-left space-y-6 animate-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <BookOpen size={20} className="text-[#14B8A6]" />
              <h4 className="text-sm font-bold uppercase tracking-widest text-white">The Science of Inner Echo</h4>
            </div>
            <div className="space-y-4 text-xs text-white/60 leading-relaxed italic">
              <p>
                The **Inner Echo** is the "Attunement" engine. By identifying your current activity, somatic pressure, and emotional landscape, we calibrate the starting frequency for your session.
              </p>
            </div>
          </div>
        )}
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="space-y-8">
          <section className="portal-field p-0 relative overflow-hidden">
            {renderAttunementFlow()}
          </section>

          {/* Somatic Mapping Tool */}
          <section className="portal-field p-8 space-y-8 relative overflow-hidden group/somatic">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
                <User size={16} /> Somatic Mapping
              </h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                {bodyParts.map(part => (
                  <button 
                    key={part}
                    onClick={() => handlePartSelection(part)}
                    className={`p-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest text-center border transition-all duration-500 ${selectedBodyPart === part ? 'bg-[#14B8A6]/20 border-[#14B8A6]/50 text-[#14B8A6]' : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'}`}
                  >
                    {part}
                  </button>
                ))}
              </div>

              {selectedBodyPart && insight && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-1000 p-8 glass rounded-[3rem] border-[#14B8A6]/20 bg-[#14B8A6]/5 relative z-10 shadow-xl">
                    <div className="space-y-2">
                       <span className="text-[9px] text-[#14B8A6] uppercase font-bold tracking-[0.5em]">Insight</span>
                       <h4 className="text-xl font-serif italic text-white flex items-center gap-3">{insight.chakra}</h4>
                    </div>
                    <p className="text-[13px] text-white/70 leading-relaxed italic font-light">{insight.meaning}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 portal-field flex flex-col h-full min-h-[900px] overflow-hidden border-white/10 relative">
           <header className="p-8 border-b border-white/5 flex items-center justify-between backdrop-blur-3xl bg-white/5 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#8B008B]/10 border border-[#8B008B]/30 flex items-center justify-center text-[#8B008B] animate-breath">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase text-white tracking-[0.3em]">Resonance Guide</h4>
                  <p className="text-[10px] text-[#14B8A6] uppercase font-bold tracking-[0.4em] flex items-center gap-2 opacity-60">
                    <Zap size={10} className="animate-pulse" /> Live Mirror
                  </p>
                </div>
              </div>
           </header>
           
           <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-8 opacity-20 animate-breath">
                  <MessageCircle size={64} className="text-white" />
                  <p className="text-[10px] uppercase tracking-[0.6em] max-sm">I am your alchemical mirror. Speak what is density or what is expansion, and I will curate your field.</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-1000`}>
                  <div className={`max-w-[80%] p-6 rounded-[2.5rem] text-sm italic font-light shadow-xl border ${m.role === 'user' ? 'bg-[#8B008B]/20 border-[#8B008B]/30 text-white rounded-br-none' : 'bg-white/5 border-white/10 text-white/70 rounded-bl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] text-[#14B8A6]/60 italic animate-breath px-4 uppercase tracking-widest">Guide is listening...</div>}
              <div ref={chatEndRef} />
           </div>

           <div className="p-8 border-t border-white/5 flex gap-4 bg-white/5 backdrop-blur-3xl">
              <input 
                type="text" 
                placeholder="Deepen the resonance..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B008B] text-white placeholder:text-white/20 transition-all italic"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className="w-16 h-16 bg-[#8B008B]/80 text-white rounded-full hover:bg-[#8B008B] transition-all flex items-center justify-center">
                <Send size={24} />
              </button>
           </div>
        </div>
      </div>

      {/* Stellar Harmonix Results Display */}
      <section id="stellar-results-anchor" className="portal-field p-0 relative overflow-hidden border-[#14B8A6]/20 bg-[#14B8A6]/5 shadow-[0_0_50px_rgba(20,184,166,0.05)] animate-in fade-in slide-in-from-bottom-4 duration-1000">
         <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <StarsIcon size={18} className="text-[#14B8A6]" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#14B8A6]">Stellar Harmonix</span>
            </div>
            <div className="flex items-center gap-6">
              {signature && (
                <div className="flex items-center gap-3 group/sync">
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] text-white/40 uppercase font-bold tracking widest">Personal Settings</span>
                    <span className="text-[7px] text-[#14B8A6] uppercase font-bold tracking-[0.2em]">{useStellarSettings ? "Synced with Lab" : "Sync Disabled"}</span>
                  </div>
                  <button 
                    onClick={onToggleStellarSettings}
                    className={`w-10 h-5 rounded-full p-1 transition-all relative border ${useStellarSettings ? 'bg-[#14B8A6]/20 border-[#14B8A6]/40' : 'bg-white/5 border-white/10'}`}
                  >
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 absolute top-1 ${useStellarSettings ? 'right-1 bg-[#14B8A6]' : 'left-1 bg-white/40'}`}></div>
                  </button>
                </div>
              )}
              {signature && (
                <button onClick={() => setShowGenerator(true)} className="p-2 text-white/20 hover:text-white transition-colors" title="Re-Align Origin">
                   <RotateCcw size={14} />
                </button>
              )}
            </div>
         </div>
         
         <div className="p-10">
            {signature ? (
              <div className="space-y-12 animate-in zoom-in-95 duration-700">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  <div className="space-y-6">
                    <div className="space-y-3">
                       <span className="text-[8px] text-white/30 uppercase font-bold tracking-[0.6em]">Harmonix Keys</span>
                       <p className="text-2xl text-white italic font-serif leading-relaxed">{signature.harmonicKeys.join(' • ')}</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                       <p className="text-[13px] text-white/60 italic leading-relaxed font-light">{signature.overview}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#14B8A6]">
                           <Target size={16} />
                           <span className="text-[10px] uppercase font-bold tracking-widest">Regulation</span>
                        </div>
                        <ul className="text-[11px] text-white/40 space-y-2 leading-relaxed italic">
                           {signature.regulationTendencies.map((t, i) => <li key={i} className="pl-4 border-l border-[#14B8A6]/20">{t}</li>)}
                        </ul>
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#8B008B]">
                           <Sparkle size={16} />
                           <span className="text-[10px] uppercase font-bold tracking-widest">Creative Alchemy</span>
                        </div>
                        <ul className="text-[11px] text-white/40 space-y-2 leading-relaxed italic">
                           {signature.creativeAlchemy.map((t, i) => <li key={i} className="pl-4 border-l border-[#8B008B]/20">{t}</li>)}
                        </ul>
                     </div>
                  </div>
                </div>

                {/* Final Call to Action for Alchemy Lab */}
                <div className="pt-10 border-t border-white/5 mt-10">
                   <button 
                     onClick={() => window.dispatchEvent(new CustomEvent('nav-view', { detail: AppView.AlchemyLab }))}
                     className="w-full py-6 bg-[#14B8A6] text-black rounded-full font-bold uppercase tracking-[0.5em] text-[11px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                   >
                      <FlaskConical size={20} /> Transmute Results in Alchemy Lab
                   </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-10 opacity-60 max-w-md mx-auto">
                 <Fingerprint size={56} className="text-[#14B8A6] mx-auto opacity-30 animate-breath" />
                 <p className="text-[12px] text-white/40 uppercase tracking-[0.4em] leading-relaxed">Your unique alchemical blueprint is not yet revealed.</p>
                 <button 
                   onClick={() => setShowGenerator(true)}
                   className="w-full py-5 bg-[#14B8A6]/10 border border-[#14B8A6]/40 text-[#14B8A6] rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#14B8A6]/20 transition-all"
                 >
                    Reveal My Harmonix
                 </button>
              </div>
            )}
         </div>
      </section>

      {/* Back to Top Button */}
      <div className="flex justify-center pt-8">
        <button 
          onClick={scrollToTop}
          className="p-4 bg-white/5 border border-white/10 rounded-full text-white/20 hover:text-[#8B008B] hover:border-[#8B008B]/40 hover:bg-[#8B008B]/5 transition-all group shadow-xl"
          title="Return to Sanctuary Summit"
        >
          <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Harmonix Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
           <div className="relative w-full max-w-lg p-12 glass rounded-[3rem] bg-[#02040a] border-[#14B8A6]/20 shadow-2xl space-y-10 animate-in zoom-in-95 duration-700">
              <button onClick={() => setShowGenerator(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                 <X size={24} />
              </button>
              
              <header className="text-center space-y-4">
                 <Stars size={40} className="text-[#14B8A6] mx-auto animate-breath" />
                 <h2 className="text-3xl font-serif text-white italic leading-tight">Reveal Stellar Origin</h2>
                 <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] leading-relaxed">Input your origin to reveal your Stellar Harmonix.</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] text-[#14B8A6] uppercase font-bold tracking-widest">Origin Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:ring-1 focus:ring-[#14B8A6] outline-none"
                      value={birthDetails.date}
                      onChange={e => setBirthDetails({...birthDetails, date: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Origin Time</label>
                       <input 
                         type="time" 
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:ring-1 focus:ring-[#14B8A6] outline-none"
                         value={birthDetails.time}
                         onChange={e => setBirthDetails({...birthDetails, time: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Origin Location</label>
                       <input 
                         type="text" 
                         placeholder="City, Country"
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white placeholder:text-white/10 focus:ring-1 focus:ring-[#14B8A6] outline-none"
                         value={birthDetails.location}
                         onChange={e => setBirthDetails({...birthDetails, location: e.target.value})}
                       />
                    </div>
                 </div>
              </div>

              <div className="pt-6">
                 <button 
                   onClick={handleRevealSignature}
                   disabled={isGeneratingSignature || !birthDetails.date || !birthDetails.location}
                   className="w-full py-6 bg-[#14B8A6] text-black rounded-full font-bold uppercase tracking-[0.5em] text-[11px] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-20 disabled:grayscale"
                 >
                    {isGeneratingSignature ? <Activity size={20} className="animate-spin" /> : <Sparkles size={20} />}
                    {isGeneratingSignature ? "Revealing Origin..." : "Reveal My Harmonix"}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default InnerEcho;
