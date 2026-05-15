
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import Portal from './components/Portal';
import AlchemyLab from './components/AlchemyLab';
import PortalAnimation from './components/PortalAnimation';
import InnerEcho from './components/InnerEcho';
import FrequencyGarden from './components/FrequencyGarden';
import ResonanceCircles from './components/ResonanceCircles';
import GuidedJourneys from './components/GuidedJourneys';
import SyncEnergy from './components/SyncEnergy';
import AlchemyVault from './components/AlchemyVault';
import ExperienceAtlas from './components/ExperienceAtlas';
import StarLanguages from './components/StarLanguages';
import MinimizedPlayer from './components/MinimizedPlayer';
import { AppView, JourneyProtocol, MorphLevel, Track, JourneySession, CurrentVibration, DesiredResonance, MoodEntry, MomentSignal, StellarSignature, InnerEchoPlan, GlobalSeedPreferences } from './types';
import { generateJourneyPlaylist, getSessionIntro, generateAlchemyRecipe } from './services/geminiService';
import { youtubeService } from './services/youtube';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.PortalGate);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPortalOpening, setIsPortalOpening] = useState(false);
  const [portalConfig, setPortalConfig] = useState<{morph: MorphLevel, addedCount: number} | null>(null);
  const [activeSession, setActiveSession] = useState<JourneySession | null>(null);
  const [savedSessions, setSavedSessions] = useState<JourneySession[]>([]);
  const [stellarSignature, setStellarSignature] = useState<StellarSignature | null>(null);
  const [useStellarSettings, setUseStellarSettings] = useState(true);
  const [globalSeedPreferences, setGlobalSeedPreferences] = useState<GlobalSeedPreferences>({
    enabled: false,
    genre: '',
    songsAndArtists: ''
  });
  const [autoOpenSignature, setAutoOpenSignature] = useState(false);
  const [pendingSignatureFlow, setPendingSignatureFlow] = useState(false);
  const [pendingInnerEchoRedirect, setPendingInnerEchoRedirect] = useState(false);
  const [echoPlan, setEchoPlan] = useState<InnerEchoPlan | null>(null);
  
    // YouTube Search State
  const [youtubeSearchQuery, setYoutubeSearchQuery] = useState('');
  const [youtubeResults, setYoutubeResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Global Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([
    { id: 'h1', current: CurrentVibration.DeepIntegration, goal: DesiredResonance.Serene, vibrationIndex: 3, timestamp: Date.now() - 86400000 * 4 },
    { id: 'h2', current: CurrentVibration.SoftFocus, goal: DesiredResonance.Empowered, vibrationIndex: 5, timestamp: Date.now() - 86400000 * 3 },
    { id: 'h3', current: CurrentVibration.ActiveEnergy, goal: DesiredResonance.Joyful, vibrationIndex: 4, timestamp: Date.now() - 86400000 * 2 },
    { id: 'h4', current: CurrentVibration.Neutral, goal: DesiredResonance.Radiant, vibrationIndex: 7, timestamp: Date.now() - 86400000 * 1 },
  ]);
  const [sessionIntro, setSessionIntro] = useState('');
  
  const [currentVibe, setCurrentVibe] = useState<CurrentVibration>(CurrentVibration.Neutral);
  const [goalResonance, setGoalResonance] = useState<DesiredResonance>(DesiredResonance.Serene);
  const [momentSignal, setMomentSignal] = useState<MomentSignal>({
    activity: 'Presence',
    timeAvailable: 15,
    rhythm: 'Aligned',
    intent: 'Support'
  });

  const prevIsLoggedIn = useRef(isLoggedIn);

  // Background Media Session API
  useEffect(() => {
    if ('mediaSession' in navigator && activeSession) {
      const track = activeSession.tracks[currentTrackIndex];
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: `Alchemical Protocol: ${activeSession.protocol}`,
        artwork: [
          { src: 'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?auto=format&fit=crop&q=80&w=512&h=512', sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        setCurrentTrackIndex(prev => Math.max(0, prev - 1));
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        setCurrentTrackIndex(prev => Math.min(activeSession.tracks.length - 1, prev + 1));
      });
    }
  }, [activeSession, currentTrackIndex]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Handle Login Redirect logic
  useEffect(() => {
    if (isLoggedIn && !prevIsLoggedIn.current) {
      if (pendingInnerEchoRedirect) {
        setPendingInnerEchoRedirect(false);
        setCurrentView(AppView.InnerEcho);
      } else if (pendingSignatureFlow) {
        setPendingSignatureFlow(false);
        setAutoOpenSignature(true);
        setCurrentView(AppView.InnerEcho);
      }
    }
    prevIsLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, pendingSignatureFlow, pendingInnerEchoRedirect]);

  useEffect(() => {
    const handleNav = (e: any) => {
      if (e.detail) setCurrentView(e.detail as AppView);
    };
    window.addEventListener('nav-view' as any, handleNav);
    return () => window.removeEventListener('nav-view' as any, handleNav);
  }, []);

  const getVibrationIndex = (vibe: CurrentVibration): number => {
    const map: Record<CurrentVibration, number> = {
      [CurrentVibration.DeepIntegration]: 2,
      [CurrentVibration.Stillness]: 1,
      [CurrentVibration.SoftFocus]: 4,
      [CurrentVibration.HighPotential]: 3,
      [CurrentVibration.ActiveEnergy]: 8,
      [CurrentVibration.SeekingFlow]: 5,
      [CurrentVibration.Neutral]: 6,
      [CurrentVibration.Peaceful]: 9
    };
    return map[vibe] || 5;
  };

  const handleOpenPortal = useCallback(async (config: {
    frequency: '440Hz' | '432Hz';
    protocol: JourneyProtocol;
    morph: MorphLevel;
    current: CurrentVibration;
    goal: DesiredResonance;
    userTracks: Track[];
  }) => {
    const MIN_TRACKS = 12;
    const userCount = config.userTracks.length;
    let supportNeeded = config.morph === MorphLevel.Mirror ? Math.ceil(userCount/3) : config.morph === MorphLevel.Balanced ? userCount : userCount*3;
    if (userCount + supportNeeded < MIN_TRACKS) supportNeeded = MIN_TRACKS - userCount;

    setPortalConfig({ morph: config.morph, addedCount: supportNeeded });
    setIsPortalOpening(true);
    
    try {
      const newMood: MoodEntry = { 
        id: `mood-${Date.now()}`, 
        current: config.current, 
        goal: config.goal, 
        vibrationIndex: getVibrationIndex(config.current),
        timestamp: Date.now() 
      };
      setMoodHistory(prev => [...prev, newMood]);

      const activeSig = useStellarSettings ? stellarSignature : null;

      const [supportTracks, introText, recipe] = await Promise.all([
        generateJourneyPlaylist(config.protocol, config.morph, supportNeeded, config.userTracks, config.current, config.goal, momentSignal, globalSeedPreferences),
        getSessionIntro(config.protocol, config.current, config.goal),
        generateAlchemyRecipe(momentSignal, config.protocol, config.current, goalResonance, activeSig || undefined)
      ]);

      const mixedTracks: Track[] = [...config.userTracks.map(t => ({ ...t, frequency: config.frequency })), ...supportTracks];

      setSessionIntro(introText);
      setActiveSession({
        id: `session-${Date.now()}`,
        protocol: config.protocol,
        morph: config.morph,
        startingVibe: config.current,
        goalResonance: config.goal,
        tracks: mixedTracks,
        recipe: recipe,
        timestamp: Date.now()
      });

      // Reset playback on new session
      setCurrentTrackIndex(0);
      setIsPlaying(true);

      setTimeout(() => {
        setIsPortalOpening(false);
        setCurrentView(AppView.AlchemyLab);
      }, 7500);
    } catch (err) {
      console.error(err);
      setIsPortalOpening(false);
    }
  }, [momentSignal, stellarSignature, goalResonance, useStellarSettings, globalSeedPreferences]);

  const updateSavedSession = (updatedSession: JourneySession) => {
    setSavedSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
  };

  const deleteSavedSession = (id: string) => {
    setSavedSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleFineTuneClick = () => {
    if (isLoggedIn) {
      setCurrentView(AppView.InnerEcho);
    } else {
      setPendingInnerEchoRedirect(true);
      setCurrentView(AppView.Portal);
    }
  };

  const handleYoutubeSearch = async () => {
    if (!youtubeSearchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await youtubeService.search(youtubeSearchQuery + " 432hz OR 528hz OR healing OR meditation");
      setYoutubeResults(results);
      console.log("YouTube Results:", results);
    } catch (error) {
      console.error("YouTube search failed:", error);
      alert("Search failed. Check console for details.");
    }
    setIsSearching(false);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.PortalGate:
        return (
          <div className="max-w-4xl mx-auto py-24 px-6 text-center space-y-16 animate-in fade-in zoom-in-95 duration-1000">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-9xl font-serif text-white tracking-tighter leading-none glow-text">
                Immersive <br /> 
                <span className="italic text-[#8B008B] font-light text-5xl md:text-8xl block mt-2 resonance-glow">Resonance</span>
              </h1>
              <p className="text-lg text-white/40 max-w-xl mx-auto font-light leading-relaxed italic">
                Step through the field. There is no rush here. Follow what is calling you home.
              </p>
            </div>
            
            <div className="flex flex-col gap-6 items-center justify-center mt-12 relative z-10">
              {/* Main CTA Section */}
              <div className="max-w-lg w-full flex flex-col gap-6">
                <button 
                  onClick={() => setCurrentView(AppView.AlchemyLab)} 
                  className="w-full px-10 py-6 bg-[#14B8A6]/20 border border-[#14B8A6]/40 text-white rounded-full font-bold uppercase tracking-[0.4em] hover:bg-[#14B8A6]/30 hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all text-[11px] shadow-xl"
                >
                  Ready to Tune my Energy
                </button>

                {/* Fine Tuning CTA */}
                <div className="p-8 glass rounded-[3rem] border-white/5 bg-white/5 space-y-6 animate-in slide-in-from-bottom-4 duration-1000">
                   <p className="text-xs text-white/60 italic leading-relaxed">
                     "Up for some fine tuning? Sign in to check out Inner Echo, where you can add in your signature to fine tune your energy."
                   </p>
                   <button 
                      onClick={handleFineTuneClick} 
                      className="px-10 py-4 bg-white/5 border border-white/10 text-white/40 rounded-full font-bold uppercase tracking-widest hover:text-white hover:border-[#14B8A6]/40 hover:bg-[#14B8A6]/5 transition-all text-[10px] w-full group"
                    >
                      Sign In to Fine Tune My Energy <span className="text-[#14B8A6] ml-2 group-hover:animate-pulse">✦</span>
                    </button>
                </div>
              </div>
            </div>

            <div className="pt-12 text-[10px] text-white/10 uppercase tracking-[1em] animate-breath">
              Harmonizing your highest timeline
            </div>
          </div>
        );
      case AppView.Portal:
        return (
          <Portal 
            isLoggedIn={isLoggedIn} 
            onLoginChange={setIsLoggedIn}
            onViewChange={setCurrentView} 
            signature={stellarSignature} 
            onTriggerSignature={() => {
              if (isLoggedIn) {
                if (!stellarSignature) {
                  setAutoOpenSignature(true);
                }
                setCurrentView(AppView.InnerEcho);
              } else {
                setPendingSignatureFlow(true);
                // The App View will remain on Portal but the redirect flag will handle the next move
              }
            }}
          />
        );
      case AppView.AlchemyLab:
        return (
          <AlchemyLab 
            isLoggedIn={isLoggedIn}
            currentVibe={currentVibe} 
            goalResonance={goalResonance} 
            onVibeChange={setCurrentVibe} 
            onGoalChange={setGoalResonance} 
            onOpenPortal={handleOpenPortal} 
            signal={momentSignal}
            onSignalChange={setMomentSignal}
            activeSession={activeSession}
            sessionIntro={sessionIntro}
            onSaveSession={() => {
              if (activeSession && !savedSessions.find(s => s.id === activeSession.id)) {
                setSavedSessions(prev => [...prev, activeSession]);
              }
            }}
            isSessionSaved={!!savedSessions.find(s => s.id === activeSession?.id)}
            onPersonalizeClick={handleFineTuneClick}
            echoPlan={echoPlan}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentTrackIndex={currentTrackIndex}
            setCurrentTrackIndex={setCurrentTrackIndex}
            globalSeedPreferences={globalSeedPreferences}
            onGlobalSeedPreferencesChange={setGlobalSeedPreferences}
            youtubeSearchQuery={youtubeSearchQuery}
            setYoutubeSearchQuery={setYoutubeSearchQuery}
            youtubeResults={youtubeResults}
            isSearching={isSearching}
            handleYoutubeSearch={handleYoutubeSearch}
          />
        );
      case AppView.InnerEcho:
        return (
          <InnerEcho 
            signature={stellarSignature}
            onSignatureChange={setStellarSignature}
            useStellarSettings={useStellarSettings}
            onToggleStellarSettings={() => setUseStellarSettings(!useStellarSettings)}
            currentVibe={currentVibe} 
            goalResonance={goalResonance} 
            onVibeChange={setCurrentVibe} 
            onGoalChange={setGoalResonance} 
            savedSessions={savedSessions} 
            moodHistory={moodHistory} 
            onLoadSession={(s) => { setActiveSession(s); setIsPlaying(true); setCurrentTrackIndex(0); setCurrentView(AppView.AlchemyLab); }} 
            signal={momentSignal}
            onSignalChange={setMomentSignal}
            autoOpenSignature={autoOpenSignature}
            onSignatureModalOpened={() => setAutoOpenSignature(false)}
            echoPlan={echoPlan}
            onEchoPlanChange={setEchoPlan}
            isMusicPlaying={isPlaying}
          />
        );
      case AppView.AlchemyVault:
        return (
          <AlchemyVault 
            sessions={savedSessions} 
            onDelete={deleteSavedSession} 
            onUpdate={updateSavedSession}
            onLoad={(s) => { setActiveSession(s); setIsPlaying(true); setCurrentTrackIndex(0); setCurrentView(AppView.AlchemyLab); }}
            moodHistory={moodHistory}
          />
        );
      case AppView.FrequencyGarden:
        return <FrequencyGarden />;
      case AppView.ResonanceCircles:
        return <ResonanceCircles mood={currentVibe} />;
      case AppView.GuidedJourneys:
        return <GuidedJourneys mood={currentVibe} />;
      case AppView.EnergyGuide:
        return (
          <SyncEnergy 
            isLoggedIn={isLoggedIn} 
            onLoginChange={setIsLoggedIn} 
            signature={stellarSignature}
            useStellarSettings={useStellarSettings}
            onToggleStellarSettings={() => setUseStellarSettings(!useStellarSettings)}
            globalSeedPreferences={globalSeedPreferences}
            onGlobalSeedPreferencesChange={setGlobalSeedPreferences}
          />
        );
      case AppView.StarLanguages:
        return <StarLanguages />;
      default:
        return <div className="text-white/20 p-20 text-center uppercase trackingest">Phasing into existence...</div>;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <div className="nebula-bg"></div>
      <div className="orbital-glow top-[10%] left-[-10%]"></div>
      <div className="orbital-glow bottom-[-20%] right-[-10%] opacity-50" style={{ animationDelay: '-5s' }}></div>
      
      <Navigation activeView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 pt-24 pb-12 relative z-10">
        {renderView()}
      </main>

      <ExperienceAtlas />
      
      {activeSession && isPlaying && currentView !== AppView.AlchemyLab && (
        <MinimizedPlayer 
          session={activeSession}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          currentTrackIndex={currentTrackIndex}
          onExpand={() => setCurrentView(AppView.AlchemyLab)}
        />
      )}
      
      {isPortalOpening && <PortalAnimation morph={portalConfig?.morph} addedCount={portalConfig?.addedCount} />}
      
      <footer className="py-12 text-center relative z-10 opacity-30 hover:opacity-60 transition-opacity">
        <p className="text-[9px] text-white/40 uppercase tracking-[0.6em]">Immersive Peace • Harmony in Every Frequency</p>
      </footer>
    </div>
  );
};

export default App;
