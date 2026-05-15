
import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  FlaskConical, 
  ArrowRight, 
  Zap, 
  Waves, 
  Disc, 
  Apple, 
  Youtube, 
  Radio, 
  Link2, 
  Music,
  Clock,
  FastForward,
  X,
  BookOpen,
  Mountain, 
  Droplets,
  Wind,
  Heart,
  Activity,
  Sparkles,
  RotateCcw,
  Flame,
  Plus,
  Target,
  Settings2,
  Cpu,
  ChevronUp,
  Fingerprint,
  Mic2,
  Info
} from 'lucide-react';
import { JourneyProtocol, MorphLevel, Track, CurrentVibration, DesiredResonance, MomentSignal, ElementalAnchor, AlchemyJourneyPlan, JourneySession, InnerEchoPlan, GlobalSeedPreferences } from '../types';
import { PROTOCOLS } from '../constants';
import { generateAlchemyJourneyPlan } from '../services/geminiService';
import ImmersiveResonance from './ImmersiveResonance';

interface AlchemyLabProps {
  isLoggedIn: boolean;
  currentVibe: CurrentVibration;
  goalResonance: DesiredResonance;
  onVibeChange: (v: CurrentVibration) => void;
  onGoalChange: (g: DesiredResonance) => void;
  onOpenPortal: (config: {
    frequency: '440Hz' | '432Hz';
    protocol: JourneyProtocol;
    morph: MorphLevel;
    current: CurrentVibration;
    goal: DesiredResonance;
    userTracks: Track[];
  }) => void;
  signal: MomentSignal;
  onSignalChange: (s: MomentSignal) => void;
  activeSession: JourneySession | null;
  sessionIntro: string;
  onSaveSession: () => void;
  isSessionSaved: boolean;
  onPersonalizeClick: () => void;
  echoPlan: InnerEchoPlan | null;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (i: number) => void;
  globalSeedPreferences: GlobalSeedPreferences;
  onGlobalSeedPreferencesChange: (prefs: GlobalSeedPreferences) => void;
  youtubeSearchQuery: string;
  setYoutubeSearchQuery: (q: string) => void;
  youtubeResults: any[];
  isSearching: boolean;
  handleYoutubeSearch: () => void;
}

const AlchemyLab: React.FC<AlchemyLabProps> = ({ 
  isLoggedIn,
  currentVibe, 
  goalResonance, 
  onVibeChange, 
  onGoalChange, 
  onOpenPortal, 
  signal,
  onSignalChange,
  activeSession,
  sessionIntro,
  onSaveSession,
  isSessionSaved,
  onPersonalizeClick,
  echoPlan,
  isPlaying,
  setIsPlaying,
  currentTrackIndex,
  setCurrentTrackIndex,
  globalSeedPreferences,
  onGlobalSeedPreferencesChange,
  youtubeSearchQuery,
  setYoutubeSearchQuery,
  youtubeResults,
  isSearching,
  handleYoutubeSearch
}) => {
  const [frequency] = useState<'440Hz' | '432Hz'>('432Hz');
  const [protocol, setProtocol] = useState<JourneyProtocol>(JourneyProtocol.GroundedResonance);
  const [isManualProtocol, setIsManualProtocol] = useState(false);
  const [morph] = useState<MorphLevel>(MorphLevel.Balanced);
  const [element, setElement] = useState<ElementalAnchor>(ElementalAnchor.Ground);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [syncUrl, setSyncUrl] = useState('');
  const [userTracks, setUserTracks] = useState<Track[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showReadyOverlay, setShowReadyOverlay] = useState(false);
  const [alignmentReason, setAlignmentReason] = useState("");
  
  // Manual Preferences Modal State - Syncs with global
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualInput, setManualInput] = useState({
    genre: globalSeedPreferences.genre,
    songsAndArtists: globalSeedPreferences.songsAndArtists
  });

  // Keep local state in sync when global changes
  useEffect(() => {
    setManualInput({
      genre: globalSeedPreferences.genre,
      songsAndArtists: globalSeedPreferences.songsAndArtists
    });
  }, [globalSeedPreferences.genre, globalSeedPreferences.songsAndArtists]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resonanceRef = useRef<HTMLDivElement>(null);
  const lastEchoPlanRef = useRef<InnerEchoPlan | null>(null);

  const [journeyPlan, setJourneyPlan] = useState<AlchemyJourneyPlan | null>(null);
  const [isForgingPlan, setIsForgingPlan] = useState(false);

  useEffect(() => {
    if (echoPlan && echoPlan !== lastEchoPlanRef.current) {
      setShowReadyOverlay(true);
      lastEchoPlanRef.current = echoPlan;
      const timer = setTimeout(() => setShowReadyOverlay(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [echoPlan]);

  // Enhanced Alchemical Protocol Auto-Selection Logic
  useEffect(() => {
    if (isManualProtocol) return;

    let targetProtocol = JourneyProtocol.GroundedResonance;
    let reason = "Aligned to Ground Anchor";

    if (goalResonance === DesiredResonance.Focused) {
      targetProtocol = JourneyProtocol.HemiSync;
      reason = "Prioritizing Focus Goal";
    } else if (goalResonance === DesiredResonance.Empowered) {
      targetProtocol = JourneyProtocol.SolarVision;
      reason = "Prioritizing Empowerment Goal";
    } else if (goalResonance === DesiredResonance.Radiant && element === ElementalAnchor.Ether) {
      targetProtocol = JourneyProtocol.TwelveDActivations;
      reason = "Ether + Radiant Synergized";
    } else {
      switch (element) {
        case ElementalAnchor.Ground:
          targetProtocol = JourneyProtocol.GroundedResonance;
          reason = "Anchored to Earth Element";
          break;
        case ElementalAnchor.Flow:
          targetProtocol = JourneyProtocol.EchoFlow;
          reason = "Anchored to Flow Element";
          break;
        case ElementalAnchor.Fire:
          targetProtocol = JourneyProtocol.SolarVision;
          reason = "Anchored to Fire Element";
          break;
        case ElementalAnchor.Heart:
          targetProtocol = JourneyProtocol.EnergyAlignment;
          reason = "Anchored to Heart Element";
          break;
        case ElementalAnchor.Ether:
          if (signal.intent === 'Reset' || goalResonance === DesiredResonance.Serene) {
            targetProtocol = JourneyProtocol.CosmicRelease;
            reason = "Ether + Release Synergy";
          } else {
            targetProtocol = JourneyProtocol.TwelveDActivations;
            reason = "Etheric Activation active";
          }
          break;
      }
    }

    if (userTracks.length > 5 && targetProtocol === JourneyProtocol.GroundedResonance) {
      targetProtocol = JourneyProtocol.EchoFlow;
      reason = "Seed density shifted focus to Flow";
    }

    setProtocol(targetProtocol);
    setAlignmentReason(reason);
  }, [element, currentVibe, goalResonance, signal.intent, userTracks.length, isManualProtocol]);

  useEffect(() => {
    if (activeSession) {
      setTimeout(() => {
        resonanceRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [activeSession?.id]);

  const handleForgeJourneyPlan = async () => {
    setIsForgingPlan(true);
    try {
      const activeSig = {
        harmonicKeys: [element, currentVibe],
        overview: `A blueprint forged for ${element} resonance, moving from ${currentVibe} to ${goalResonance}.`,
        regulationTendencies: [`Balanced ${element} energy`],
        creativeAlchemy: [`${goalResonance} manifestation`]
      };
      const plan = await generateAlchemyJourneyPlan(signal.intent, element, activeSig);
      setJourneyPlan(plan);
    } catch (e) {
      console.error(e);
    } finally {
      setIsForgingPlan(false);
    }
  };

  const platforms = [
    { id: 'spotify', icon: <Disc size={20} />, color: 'text-green-500', name: 'Spotify' },
    { id: 'apple', icon: <Apple size={20} />, color: 'text-[#8B008B]', name: 'Apple Music' },
    { id: 'youtube', icon: <Youtube size={20} />, color: 'text-red-500', name: 'YouTube' },
    { id: 'other', icon: <Radio size={20} />, color: 'text-blue-400', name: 'Playlist Link' }
  ];

  const elements = [
    { id: ElementalAnchor.Ground, icon: <Mountain size={18} />, label: "Ground" },
    { id: ElementalAnchor.Flow, icon: <Droplets size={18} />, label: "Flow" },
    { id: ElementalAnchor.Fire, icon: <Flame size={18} />, label: "Fire" },
    { id: ElementalAnchor.Heart, icon: <Heart size={18} />, label: "Heart" },
    { id: ElementalAnchor.Ether, icon: <Wind size={18} />, label: "Ether" },
  ];

  const handleQuickFix = () => {
    onOpenPortal({
      frequency: '432Hz',
      protocol: JourneyProtocol.TwelveDActivations,
      morph: MorphLevel.Transform,
      current: CurrentVibration.Neutral,
      goal: DesiredResonance.Empowered,
      userTracks: []
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newTracks: Track[] = Array.from(files).map((file: File) => ({
        id: `upload-${Date.now()}-${Math.random()}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "User Upload",
        duration: "N/A",
        source: 'upload',
        type: 'Mirror',
        frequency: '432Hz'
      }));
      setUserTracks(prev => [...prev, ...newTracks]);
    }
  };

  const handleManualSubmit = () => {
    if (!manualInput.genre && !manualInput.songsAndArtists) return;
    
    // Update Global Selections for Vibe Guidance
    onGlobalSeedPreferencesChange({
      enabled: true,
      genre: manualInput.genre,
      songsAndArtists: manualInput.songsAndArtists
    });

    const manualTrack: Track = {
      id: `manual-${Date.now()}`,
      title: "Sonic Fingerprint",
      artist: "Various Alchemists",
      duration: "N/A",
      source: 'manual',
      type: 'Mirror',
      frequency: '432Hz',
      metadata: {
        genre: manualInput.genre,
        preferences: manualInput.songsAndArtists
      }
    };
    
    setUserTracks(prev => [...prev, manualTrack]);
    setShowManualForm(false);
  };

  const handleSyncLink = () => {
    if (!syncUrl) return;
    const isPlaylist = syncUrl.includes('playlist') || syncUrl.includes('album');
    const mockTrack: Track = {
      id: `linked-${Date.now()}`,
      title: isPlaylist ? "Collective Resonant Playlist" : "Resonant Harmonic Stream",
      artist: activePlatform?.toUpperCase() || "Universal Source",
      duration: "05:00",
      source: isPlaylist ? 'playlist' : 'platform',
      type: 'Mirror',
      frequency: '432Hz'
    };
    setUserTracks(prev => [...prev, mockTrack]);
    setSyncUrl('');
    setActivePlatform(null);
  };

  const removeQueuedTrack = (id: string) => {
    setUserTracks(prev => prev.filter(t => t.id !== id));
  };

  const currentProtocolInfo = PROTOCOLS.find(p => p.id === protocol);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-16 animate-in fade-in zoom-in-95 duration-1000 relative">
      
      {showReadyOverlay && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-500 pointer-events-none">
          <div className="bg-[#14B8A6] text-black px-10 py-5 rounded-full shadow-[0_0_50px_rgba(20,184,166,0.5)] border border-white/20 flex items-center gap-4">
            <Sparkles size={20} className="animate-spin-slow" />
            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.4em]">Moment Attunement Captured</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Blueprint Ready</p>
            </div>
          </div>
        </div>
      )}

      <header className="text-center space-y-4">
        <FlaskConical size={48} className="text-[#14B8A6] mx-auto opacity-50 animate-breath" />
        <h1 className="text-5xl font-serif text-white uppercase tracking-tighter glow-text">Alchemy Lab</h1>
        <p className="text-white/40 max-w-2xl mx-auto italic font-light leading-relaxed text-lg">Transmute your music seeds into 432Hz to re-align with your highest timeline.</p>
        
        {echoPlan && (
           <div className="max-w-xl mx-auto p-6 bg-white/5 rounded-[2.5rem] border border-[#14B8A6]/20 text-left relative overflow-hidden animate-in slide-in-from-top-4 duration-700">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Wind size={40} className="text-[#14B8A6]" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                 <h4 className="text-[8px] text-[#14B8A6] uppercase font-bold tracking-[0.6em]">Active Attunement Signal</h4>
                 <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></div>
              </div>
              <p className="text-[13px] text-white italic font-light leading-relaxed mb-4">"{echoPlan.groundingLine}"</p>
              <div className="flex gap-4 items-center">
                 <div className="flex gap-2 items-center">
                    <Wind size={10} className="text-[#14B8A6]" />
                    <span className="text-[9px] text-white/40 uppercase tracking-widest">{echoPlan.breathSync}</span>
                 </div>
              </div>
           </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 mt-8">
           <button 
             onClick={() => setShowExplanation(!showExplanation)}
             className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2 hover:bg-white/10 transition-all"
           >
             <BookOpen size={14} /> The Alchemical Process
           </button>
           <button 
             onClick={handleQuickFix}
             className="px-6 py-3 bg-[#14B8A6]/20 border border-[#14B8A6]/40 rounded-full text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-2 hover:bg-[#14B8A6]/40 transition-all group"
           >
             <FastForward size={14} className="group-hover:translate-x-1 transition-transform" /> Quick Fix Suggestion
           </button>
        </div>
      </header>

      {/* Moment Control Bar */}
      <div className="max-w-3xl mx-auto p-2 glass rounded-[3rem] border-white/10 bg-white/5 grid md:grid-cols-2 gap-2 animate-in slide-in-from-top-4 duration-1000 shadow-2xl relative z-20">
         <div className="p-6 flex items-center gap-4 border-r border-white/5">
            <div className="w-10 h-10 rounded-full bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6]">
               <Sparkles size={18} className="animate-spin-slow" />
            </div>
            <div>
               <span className="text-[9px] text-[#14B8A6] uppercase font-bold tracking-[0.4em]">Active Moment</span>
               <p className="text-xs text-white/60 font-serif italic truncate">Field: {signal.activity} • Calling: {signal.intent}</p>
            </div>
         </div>

         <div className="p-6 flex items-center justify-between group/time">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-[#8B008B]/10 flex items-center justify-center text-[#8B008B]">
                  <Clock size={18} />
               </div>
               <div>
                  <span className="text-[9px] text-[#8B008B] uppercase font-bold tracking-[0.4em]">Time Space</span>
                  <div className="flex gap-2 mt-1">
                     {[5, 15, 20].map(val => (
                       <button 
                         key={val} 
                         onClick={() => onSignalChange({ ...signal, timeAvailable: val as any })}
                         className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all ${signal.timeAvailable === val ? 'bg-[#8B008B] text-white' : 'text-white/20 hover:text-white/40'}`}
                       >
                         {val}m
                       </button>
                     ))}
                  </div>
               </div>
            </div>
            <button onClick={onPersonalizeClick} className="text-[8px] text-white/20 uppercase tracking-widest font-bold hover:text-[#14B8A6] transition-colors">Adjust Intent</button>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* column 1: Seeds */}
        <section className="portal-field p-10 space-y-8 flex flex-col relative overflow-hidden group min-h-[500px]">
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-[#14B8A6] flex items-center gap-2">
              Music Seeds
            </h3>
            <div className="space-y-1">
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Upload your tracks or link playlists.</p>
              <div className="flex items-center gap-2 text-[8px] text-[#14B8A6]/60 uppercase tracking-widest italic">
                <Info size={10} /> 
                <span>Optional: Default resonance provided if empty.</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleUploadClick} className="flex flex-col items-center justify-center gap-3 p-6 glass-button rounded-3xl group/btn">
              <Upload size={24} className="text-[#14B8A6]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 group-hover/btn:text-white">Upload</span>
            </button>
            <input type="file" multiple ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleFileChange} />
            <button onClick={() => setActivePlatform('other')} className="flex flex-col items-center justify-center gap-3 p-6 glass-button rounded-3xl group/btn">
              <Plus size={24} className="text-[#8B008B]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 group-hover/btn:text-white">Link Playlists</span>
            </button>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex justify-between items-center px-4">
              {platforms.map(p => (
                <button key={p.id} onClick={() => setActivePlatform(p.id)} className={`p-3 rounded-full transition-all duration-500 transform hover:scale-125 ${activePlatform === p.id ? 'bg-white/10 ' + p.color : 'text-white/20 hover:text-white/50'}`}>
                  {p.icon}
                </button>
              ))}
            </div>

            {activePlatform && (
              <div className="animate-in slide-in-from-top-4 fade-in duration-700 space-y-4 pt-4 relative z-10">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={`Paste ${activePlatform} link...`} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[11px] text-white placeholder:text-white/20"
                    value={syncUrl}
                    onChange={(e) => setSyncUrl(e.target.value)}
                  />
                  <button onClick={handleSyncLink} className="absolute right-3 top-2.5 p-2 bg-[#14B8A6] text-black rounded-xl">
                    <Link2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Manual Preferences Fallback */}
          <div className="pt-4 text-center">
            <button 
              onClick={() => setShowManualForm(true)}
              className="text-[9px] text-[#14B8A6] font-bold uppercase tracking-[0.2em] hover:text-white transition-all opacity-50 hover:opacity-100 flex items-center justify-center gap-2 mx-auto"
            >
              <Fingerprint size={12} /> Unable to add music seeds? (Optional)
            </button>
          </div>

          <div className="mt-auto space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2 pt-4 border-t border-white/5">
             {userTracks.length === 0 ? (
               <div className="py-4 text-center space-y-1">
                 <p className="text-[9px] text-white/10 uppercase tracking-widest">No personal seeds queued...</p>
                 <p className="text-[7px] text-[#14B8A6]/20 uppercase tracking-[0.2em] italic">Using Curated Alchemical Baseline</p>
               </div>
             ) : (
               userTracks.map(t => (
                 <div key={t.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex flex-col">
                       <span className="text-[10px] text-white/80 truncate uppercase tracking-tighter">{t.title}</span>
                       <span className="text-[7px] text-white/20 uppercase tracking-widest">{t.source === 'manual' ? 'Manual Preference' : t.artist}</span>
                    </div>
                    <button onClick={() => removeQueuedTrack(t.id)} className="p-1 text-white/20 hover:text-red-400 transition-all"><X size={12} /></button>
                 </div>
               ))
             )}
          </div>
        </section>

        {/* column 2: Alignment */}
        <section className="portal-field p-10 space-y-10 flex flex-col relative overflow-hidden group">
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-[#8B008B] flex items-center gap-2">
              Tone Alignment
            </h3>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Select your transmutation path.</p>
          </div>
          
          <div className="space-y-6 relative flex-1">
             <div className="space-y-3">
               <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">Elemental Anchor</span>
               <div className="flex justify-between gap-1 p-1 bg-white/5 rounded-2xl border border-white/10">
                  {elements.map(el => (
                    <button 
                      key={el.id} 
                      onClick={() => setElement(el.id)}
                      className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${element === el.id ? 'bg-[#8B008B]/20 text-[#8B008B] border border-[#8B008B]/20' : 'text-white/20 hover:text-white/40'}`}
                    >
                      {el.icon}
                      <span className="text-[7px] uppercase font-bold tracking-widest">{el.label}</span>
                    </button>
                  ))}
               </div>
             </div>

            <div className="space-y-3">
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">Current Vibration</span>
              <select value={currentVibe} onChange={e=>onVibeChange(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs text-white/70 outline-none appearance-none cursor-pointer">
                {Object.values(CurrentVibration).map(v => <option key={v} value={v} className="bg-[#05070a]">{v}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <span className="text-[9px] font-bold text-[#8B008B] uppercase tracking-[0.4em]">Desired Resonance</span>
              <select value={goalResonance} onChange={e=>onGoalChange(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs text-white/70 outline-none appearance-none cursor-pointer">
                {Object.values(DesiredResonance).map(g => <option key={g} value={g} className="bg-[#05070a]">{g}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* column 3: Focus & Blueprint */}
        <section className="portal-field p-10 space-y-8 flex flex-col relative overflow-hidden group">
          {journeyPlan ? (
            <div className="flex-1 space-y-6 animate-in zoom-in-95 duration-700">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-[#14B8A6]">Journey Blueprint</h3>
                  <button onClick={() => setJourneyPlan(null)} className="p-2 text-white/20 hover:text-white"><RotateCcw size={14} /></button>
               </div>
               
               <div className="p-6 bg-[#05070a]/40 rounded-3xl border border-white/5 space-y-6 overflow-y-auto max-h-[400px] no-scrollbar">
                  <div className="space-y-2">
                     <span className="text-[8px] text-[#14B8A6] uppercase font-bold tracking-widest">Opening Tone</span>
                     <p className="text-xs text-white/70 italic leading-relaxed">{journeyPlan.openingTone}</p>
                  </div>
                  <div className="space-y-2">
                     <span className="text-[8px] text-[#8B008B] uppercase font-bold tracking-widest">Alchemical Arc</span>
                     <div className="space-y-3">
                        {journeyPlan.arc.map((step, i) => (
                           <div key={i} className="flex gap-3 text-[11px] text-white/50 leading-relaxed italic border-l border-white/5 pl-4">{step}</div>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-2">
                     <span className="text-[8px] text-white/30 uppercase font-bold tracking-widest">Frequency Direction</span>
                     <p className="text-[10px] text-white/50 italic">{journeyPlan.frequencyDirection}</p>
                  </div>
               </div>

               <button 
                onClick={()=>onOpenPortal({ frequency, protocol, morph, current: currentVibe, goal: goalResonance, userTracks: userTracks })}
                className="w-full py-6 bg-[#14B8A6] text-black font-bold uppercase tracking-[0.5em] text-xs rounded-[2rem] flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl animate-pulse-glow"
               >
                 Activate Manifest <ArrowRight size={20} />
               </button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-[#14B8A6]">Alchemical Focus</h3>
                  <button 
                    onClick={() => setIsManualProtocol(!isManualProtocol)}
                    className={`px-3 py-1 rounded-full border transition-all text-[8px] font-bold uppercase tracking-widest ${isManualProtocol ? 'bg-[#14B8A6] text-black border-[#14B8A6]' : 'text-white/20 border-white/10 hover:text-white/40'}`}
                  >
                     <Settings2 size={10} className="inline mr-1" /> {isManualProtocol ? "Manual" : "Auto"}
                  </button>
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                  {isManualProtocol ? "Select a manual focus." : "AI is auto-aligning to your field."}
                </p>
                {!isManualProtocol && (
                  <p className="text-[8px] text-[#14B8A6]/60 font-bold uppercase tracking-widest animate-in fade-in duration-1000">
                    Trace: {alignmentReason}
                  </p>
                )}
              </div>
              
              <div className="space-y-3 relative flex-1">
                {isManualProtocol ? (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 animate-in fade-in zoom-in-95 duration-500">
                        {PROTOCOLS.map(p => (
                            <button key={p.id} onClick={()=>setProtocol(p.id)} className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-700 ${protocol===p.id ? 'bg-[#14B8A6]/10 border-[#14B8A6]/40 text-white' : 'bg-white/5 border-transparent text-white/20 hover:bg-white/10'}`}>
                                <span className={`font-serif italic text-base block ${protocol===p.id ? 'text-white' : 'text-white/40'}`}>{p.label}</span>
                                <p className="text-[9px] uppercase tracking-widest font-medium opacity-40 leading-relaxed mt-1">{p.desc}</p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6 animate-in fade-in duration-700">
                        <div className="p-8 rounded-full bg-[#14B8A6]/5 border border-[#14B8A6]/10 relative">
                            <Cpu size={40} className="text-[#14B8A6] opacity-40 animate-spin-slow" />
                            <div className="absolute inset-0 bg-[#14B8A6]/10 blur-xl rounded-full opacity-20"></div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-serif italic text-white/80">"{currentProtocolInfo?.label}"</h4>
                            <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] max-w-[180px] leading-relaxed">
                                {currentProtocolInfo?.desc}
                            </p>
                        </div>
                    </div>
                )}
              </div>

              <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
                <button 
                  onClick={handleForgeJourneyPlan}
                  disabled={isForgingPlan}
                  className={`w-full py-6 bg-[#14B8A6] text-black font-bold uppercase tracking-[0.5em] text-xs rounded-[2rem] flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all ${isForgingPlan ? 'opacity-50' : 'animate-pulse-glow'}`}
                >
                  {isForgingPlan ? "Forging..." : "Forge Blueprint"} <ArrowRight size={20} />
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {/* YouTube Search */}
      <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-3xl">
        <h3 className="text-white text-lg mb-4">🌌 Search YouTube for Conscious Music</h3>
        
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search 432hz, 528hz, healing music, meditation..."
            value={youtubeSearchQuery}
            onChange={(e) => setYoutubeSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleYoutubeSearch()}
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-[#14B8A6]"
          />
          <button 
            onClick={handleYoutubeSearch}
            disabled={isSearching}
            className="px-8 py-4 bg-[#14B8A6] hover:bg-[#0F766E] rounded-full font-medium transition-all disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Results */}
        {youtubeResults.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {youtubeResults.map((video: any) => (
              <div key={video.id} className="bg-white/5 rounded-2xl p-3 flex gap-4 hover:bg-white/10 transition-all">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-28 h-20 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <p className="text-white text-sm line-clamp-2">{video.title}</p>
                  <p className="text-white/50 text-xs mt-1">{video.channelTitle}</p>
                  <button className="mt-2 text-xs text-[#14B8A6] hover:underline">
                    Add to Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div ref={resonanceRef} className="pt-12 scroll-mt-24">
        {activeSession ? (
          <div className="animate-in slide-in-from-bottom-12 duration-1000">
            <div className="text-center mb-12 space-y-4">
              <span className="text-[11px] text-[#14B8A6] uppercase font-bold tracking-[0.6em] bg-[#14B8A6]/5 px-6 py-2 rounded-full border border-[#14B8A6]/20">Active Resonance Chamber</span>
            </div>
            <ImmersiveResonance 
              session={activeSession} 
              intro={sessionIntro} 
              onSave={onSaveSession}
              isSaved={isSessionSaved}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentTrackIndex={currentTrackIndex}
              setCurrentTrackIndex={setCurrentTrackIndex}
              isLoggedIn={isLoggedIn}
              onFineTuneClick={onPersonalizeClick}
            />
          </div>
        ) : (
          <div className="py-32 text-center opacity-10 border border-dashed border-white/10 rounded-[4rem]">
             <Waves size={64} className="mx-auto mb-6" />
             <p className="text-xl font-serif italic uppercase tracking-widest">Resonance Chamber Awaits Activation</p>
          </div>
        )}
      </div>

      {/* Manual Attunement Modal */}
      {showManualForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
           <div className="relative w-full max-w-lg p-12 glass rounded-[3rem] bg-[#02040a] border-[#14B8A6]/20 shadow-2xl space-y-8 animate-in zoom-in-95 duration-700">
              <button onClick={() => setShowManualForm(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                 <X size={24} />
              </button>
              
              <header className="text-center space-y-4">
                 <Fingerprint size={40} className="text-[#14B8A6] mx-auto animate-breath" />
                 <h2 className="text-3xl font-serif text-white italic leading-tight">Manual Music Attunement</h2>
                 <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] leading-relaxed">Define your sonic landscape manually to guide the Forge.</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] text-[#14B8A6] uppercase font-bold tracking-widest">Primary Genre</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ambient, Lo-Fi, Neoclassical..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:ring-1 focus:ring-[#14B8A6] outline-none placeholder:text-white/10"
                      value={manualInput.genre}
                      onChange={e => setManualInput({...manualInput, genre: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] text-[#14B8A6] uppercase font-bold tracking-widest">Top 3-10 Favorite Songs and Artists</label>
                    <textarea 
                      placeholder="e.g. Brian Eno - An Ending (Ascent)... The more unique the better."
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:ring-1 focus:ring-[#14B8A6] outline-none placeholder:text-white/10 resize-none no-scrollbar"
                      value={manualInput.songsAndArtists}
                      onChange={e => setManualInput({...manualInput, songsAndArtists: e.target.value})}
                    />
                    <p className="text-[8px] text-white/20 uppercase tracking-widest italic">Optional: This data acts as a blueprint if you choose not to upload files.</p>
                 </div>
              </div>

              <div className="pt-4">
                 <button 
                   onClick={handleManualSubmit}
                   disabled={!manualInput.genre && !manualInput.songsAndArtists}
                   className="w-full py-6 bg-[#14B8A6] text-black rounded-full font-bold uppercase tracking-[0.5em] text-[11px] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-20 disabled:grayscale"
                 >
                    <Target size={20} /> Anchor Manual Seeds
                 </button>
                 <p className="text-center text-[8px] text-white/20 uppercase tracking-widest mt-4">The Forge works with default support if you leave this empty.</p>
              </div>
           </div>
        </div>
      )}

      {/* Back to Top Button */}
      <div className="flex justify-center pt-8">
        <button 
          onClick={scrollToTop}
          className="p-4 bg-white/5 border border-white/10 rounded-full text-white/20 hover:text-[#14B8A6] hover:border-[#14B8A6]/40 hover:bg-[#14B8A6]/5 transition-all group shadow-xl"
          title="Return to Alchemy Summit"
        >
          <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default AlchemyLab;
