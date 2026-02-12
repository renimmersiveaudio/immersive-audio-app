
import React, { useState, useMemo } from 'react';
import { 
  Library, 
  Trash2, 
  Download, 
  Edit3, 
  X, 
  Check, 
  Play, 
  Music, 
  Sparkles, 
  Clock, 
  Shield, 
  Infinity, 
  Save,
  PenTool,
  ExternalLink,
  ChevronRight,
  Disc,
  ArrowUpRight,
  Activity,
  Calendar,
  BarChart3,
  TrendingUp,
  Wind
} from 'lucide-react';
import { JourneySession, Track, MoodEntry, CurrentVibration } from '../types';

interface AlchemyVaultProps {
  sessions: JourneySession[];
  onDelete: (id: string) => void;
  onUpdate: (session: JourneySession) => void;
  onLoad: (session: JourneySession) => void;
  moodHistory: MoodEntry[];
}

const AlchemyVault: React.FC<AlchemyVaultProps> = ({ sessions, onDelete, onUpdate, onLoad, moodHistory }) => {
  const [selectedSession, setSelectedSession] = useState<JourneySession | null>(null);
  const [isEditingReflection, setIsEditingReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const [activeTab, setActiveTab] = useState<'Echoes' | 'Seeds' | 'Evaluator'>('Echoes');
  const [timeRange, setTimeRange] = useState<'Day' | 'Week' | 'Month'>('Week');

  const handleExport = (session: JourneySession) => {
    const data = {
      protocol: session.protocol,
      mantra: session.recipe?.mantra,
      phases: session.recipe?.phases,
      reflection: session.reflection,
      playlist: session.tracks.map(t => `${t.title} - ${t.artist}`),
      timestamp: new Date(session.timestamp).toLocaleString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Alchemy-Manifest-${session.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeTrack = (trackId: string) => {
    if (!selectedSession) return;
    const updated = {
      ...selectedSession,
      tracks: selectedSession.tracks.filter(t => t.id !== trackId)
    };
    setSelectedSession(updated);
    onUpdate(updated);
  };

  const saveReflection = () => {
    if (!selectedSession) return;
    const updated = { ...selectedSession, reflection: reflectionText };
    setSelectedSession(updated);
    onUpdate(updated);
    setIsEditingReflection(false);
  };

  const allSeeds: Track[] = Array.from(new Set(sessions.flatMap(s => s.tracks.filter(t => t.source !== 'platform'))));

  // Evaluator Chart Logic
  const chartData = useMemo(() => {
    if (moodHistory.length === 0) return [];

    const now = Date.now();
    let filtered = moodHistory;
    
    if (timeRange === 'Day') {
      filtered = moodHistory.filter(m => now - m.timestamp < 86400000);
    } else if (timeRange === 'Week') {
      filtered = moodHistory.filter(m => now - m.timestamp < 604800000);
    } else if (timeRange === 'Month') {
      filtered = moodHistory.filter(m => now - m.timestamp < 2592000000);
    }

    return filtered.sort((a, b) => a.timestamp - b.timestamp);
  }, [moodHistory, timeRange]);

  const renderEvaluator = () => {
    if (moodHistory.length === 0) {
      return (
        <div className="py-32 text-center space-y-8 opacity-20 border border-dashed border-white/10 rounded-[4rem] animate-breath">
           <BarChart3 size={64} className="mx-auto" />
           <p className="text-xl font-serif italic">Chart activates once we have data to analyze.</p>
           <p className="text-[10px] uppercase tracking-[0.5em] max-w-xs mx-auto">Begin a journey in the Lab to seed your evaluator.</p>
        </div>
      );
    }

    const width = 800;
    const height = 300;
    const padding = 40;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;

    const points = chartData.map((d, i) => {
      const x = padding + (i / (chartData.length - 1 || 1)) * innerWidth;
      // vibrationIndex is 1-10. 10 is top (Active), 1 is bottom (Stillness)
      const y = padding + innerHeight - ((d.vibrationIndex - 1) / 9) * innerHeight;
      return { x, y, data: d };
    });

    const pathD = points.length > 1 
      ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
      : "";

    const areaD = points.length > 1
      ? pathD + ` L ${points[points.length-1].x} ${padding + innerHeight} L ${points[0].x} ${padding + innerHeight} Z`
      : "";

    return (
      <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex justify-center gap-4">
          {(['Day', 'Week', 'Month'] as const).map(range => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${timeRange === range ? 'bg-[#14B8A6] text-black border-[#14B8A6]' : 'text-white/20 border-white/5 hover:border-white/20'}`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="p-10 glass rounded-[3rem] border-white/5 bg-white/5 relative">
          <div className="absolute top-8 left-10 flex flex-col gap-6 text-[8px] text-white/20 uppercase font-bold tracking-widest h-[calc(100%-100px)] justify-between">
             <div className="flex items-center gap-2"><TrendingUp size={10} /> Active</div>
             <div className="flex items-center gap-2"><Activity size={10} /> Mixed</div>
             <div className="flex items-center gap-2"><Wind size={10} /> Chill</div>
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-[0_0_20px_rgba(20,184,166,0.1)]">
            {/* Grid Lines */}
            {[0, 0.5, 1].map(v => (
              <line 
                key={v}
                x1={padding} 
                y1={padding + v * innerHeight} 
                x2={width - padding} 
                y2={padding + v * innerHeight} 
                stroke="white" 
                strokeOpacity="0.05" 
                strokeDasharray="4 4"
              />
            ))}

            {/* Gradient Fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#areaGradient)" />

            {/* Main Line */}
            <path 
              d={pathD} 
              fill="none" 
              stroke="#14B8A6" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="animate-pulse"
            />

            {/* Data Points */}
            {points.map((p, i) => (
              <g key={i} className="group/point cursor-pointer">
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="4" 
                  fill="#14B8A6" 
                  className="transition-all group-hover/point:r-6"
                />
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="12" 
                  fill="#14B8A6" 
                  fillOpacity="0" 
                  className="group-hover/point:fill-opacity-5"
                />
                <text 
                  x={p.x} 
                  y={p.y - 15} 
                  textAnchor="middle" 
                  className="text-[10px] fill-white/0 group-hover/point:fill-white/60 font-bold tracking-tighter"
                >
                  {p.data.current}
                </text>
              </g>
            ))}
          </svg>

          <div className="mt-8 flex justify-between px-10">
             <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">
               {chartData.length > 0 ? new Date(chartData[0].timestamp).toLocaleDateString() : ""}
             </span>
             <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">
               {chartData.length > 0 ? new Date(chartData[chartData.length-1].timestamp).toLocaleDateString() : ""}
             </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <section className="p-8 glass rounded-[2.5rem] border-white/5 bg-white/5 space-y-4">
              <h5 className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-[0.5em]">Energetic Trend</h5>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-serif italic text-white">
                   {chartData.length > 0 ? chartData[chartData.length-1].current : "Dormant"}
                 </span>
                 <span className="text-xs text-white/20 uppercase tracking-widest">Latest Transmission</span>
              </div>
              <p className="text-[11px] text-white/40 italic leading-relaxed">
                Your frequency tends to settle toward <strong>{chartData.length > 0 ? chartData[chartData.length-1].goal : "Stillness"}</strong> after sessions.
              </p>
           </section>

           <section className="p-8 glass rounded-[2.5rem] border-[#8B008B]/20 bg-[#8B008B]/5 space-y-4">
              <h5 className="text-[10px] font-bold text-[#8B008B] uppercase tracking-[0.5em]">Attunement Density</h5>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-serif italic text-white">{chartData.length}</span>
                 <span className="text-xs text-white/20 uppercase tracking-widest">Successful Syncs</span>
              </div>
              <p className="text-[11px] text-white/40 italic leading-relaxed">
                Consistent attunement strengthens your sovereign field boundaries.
              </p>
           </section>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-16 animate-in fade-in duration-1000">
      <header className="text-center space-y-6">
        <Library size={48} className="text-[#14B8A6] mx-auto opacity-40 animate-breath" />
        <h1 className="text-5xl font-serif text-white uppercase tracking-tighter glow-text">Alchemy Vault</h1>
        <p className="text-white/40 max-w-2xl mx-auto italic font-light leading-relaxed text-lg">
          Your private repository of resonance. Revisit the threads you have woven into the field.
        </p>

        <div className="flex justify-center gap-4 pt-8">
           <button 
            onClick={() => setActiveTab('Echoes')}
            className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] border transition-all ${activeTab === 'Echoes' ? 'bg-[#14B8A6] text-black border-[#14B8A6]' : 'text-white/30 border-white/10 hover:border-white/20'}`}
           >
             Full Echoes
           </button>
           <button 
            onClick={() => setActiveTab('Seeds')}
            className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] border transition-all ${activeTab === 'Seeds' ? 'bg-[#8B008B] text-white border-[#8B008B]' : 'text-white/30 border-white/10 hover:border-white/20'}`}
           >
             Resonant Seeds
           </button>
           <button 
            onClick={() => setActiveTab('Evaluator')}
            className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] border transition-all ${activeTab === 'Evaluator' ? 'bg-[#14B8A6]/20 text-[#14B8A6] border-[#14B8A6]/40' : 'text-white/30 border-white/10 hover:border-white/20'}`}
           >
             Evaluator
           </button>
        </div>
      </header>

      {activeTab === 'Echoes' && (
        sessions.length === 0 ? (
          <div className="py-24 text-center space-y-8 opacity-20 border border-dashed border-white/10 rounded-[4rem] animate-breath">
             <Shield size={64} className="mx-auto" />
             <p className="text-xl font-serif italic">The vault is silent and sovereign.</p>
             <p className="text-[10px] uppercase tracking-[0.5em]">Capture an Echo in Alchemy Resonance to begin.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((s) => (
              <div 
                key={s.id} 
                onClick={() => { setSelectedSession(s); setReflectionText(s.reflection || ""); }}
                className="portal-field p-8 space-y-6 group cursor-pointer hover:border-[#14B8A6]/30 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight size={20} className="text-[#14B8A6]" />
                </div>
                <div className="flex justify-between items-start">
                   <span className="text-[9px] font-bold text-[#14B8A6] uppercase tracking-[0.4em] px-3 py-1 bg-[#14B8A6]/10 rounded-full border border-[#14B8A6]/20">
                      {s.protocol}
                   </span>
                   <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">
                      {new Date(s.timestamp).toLocaleDateString()}
                   </span>
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-serif text-white italic leading-tight group-hover:glow-text transition-all duration-700">
                     "{s.recipe?.mantra || 'A Silent Echo'}"
                   </h3>
                   <p className="text-[10px] text-white/40 uppercase tracking-widest italic">{s.tracks.length} Frequency Layers</p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-[#05070a] bg-white/5"></div>)}
                   </div>
                   <button className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold hover:text-white transition-colors">Inspect Field</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'Seeds' && (
        <div className="max-w-4xl mx-auto space-y-4">
           {allSeeds.length === 0 ? (
             <div className="py-20 text-center opacity-20 uppercase tracking-[0.5em] italic">No seeds discovered yet...</div>
           ) : (
             <div className="grid gap-4">
                {allSeeds.map(seed => (
                  <div key={seed.id} className="p-6 glass rounded-[2.5rem] border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-6">
                       <div className="p-4 rounded-2xl bg-white/5 text-[#8B008B]">
                          <Disc size={20} className="animate-spin-slow" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white uppercase tracking-widest">{seed.title}</p>
                          <p className="text-[9px] text-white/40 uppercase tracking-[0.3em]">{seed.artist} • {seed.source}</p>
                       </div>
                    </div>
                    <button className="p-4 rounded-full border border-white/5 text-white/20 hover:text-[#14B8A6] hover:border-[#14B8A6]/40 transition-all">
                       <ArrowUpRight size={18} />
                    </button>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}

      {activeTab === 'Evaluator' && renderEvaluator()}

      {selectedSession && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-700">
          <div className="absolute inset-0 bg-[#05070a]/90 backdrop-blur-3xl" onClick={() => setSelectedSession(null)}></div>
          
          <div className="relative w-full max-w-5xl h-full max-h-[90vh] portal-field overflow-hidden flex flex-col border-[#14B8A6]/20 animate-in zoom-in-95 duration-700">
             <header className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#05070a] z-10">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 flex items-center justify-center text-[#14B8A6]">
                      <Sparkles size={24} />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-[0.3em]">{selectedSession.protocol}</h4>
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold">{new Date(selectedSession.timestamp).toLocaleString()}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <button onClick={() => handleExport(selectedSession)} className="p-3 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all" title="Manifest to Physical">
                      <Download size={20} />
                   </button>
                   <button onClick={() => { onDelete(selectedSession.id); setSelectedSession(null); }} className="p-3 rounded-full hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all" title="Dissolve Resonance">
                      <Trash2 size={20} />
                   </button>
                   <button onClick={() => setSelectedSession(null)} className="p-3 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all">
                      <X size={24} />
                   </button>
                </div>
             </header>

             <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                <div className="grid lg:grid-cols-2 gap-16">
                   <div className="space-y-12">
                      <section className="space-y-6">
                         <h5 className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-[0.5em]">The Weave (Playlist)</h5>
                         <div className="space-y-3">
                            {selectedSession.tracks.map((t) => (
                              <div key={t.id} className="flex items-center justify-between p-5 glass rounded-[2rem] border-white/5 group hover:bg-white/10 transition-all">
                                 <div className="flex items-center gap-4">
                                    <Music size={16} className="text-white/20" />
                                    <div>
                                       <p className="text-xs font-bold text-white/80">{t.title}</p>
                                       <p className="text-[9px] text-white/30 uppercase tracking-widest">{t.artist}</p>
                                    </div>
                                 </div>
                                 <button onClick={() => removeTrack(t.id)} className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-400 transition-all">
                                    <X size={14} />
                                 </button>
                              </div>
                            ))}
                         </div>
                      </section>
                   </div>

                   <div className="space-y-12">
                      <section className="space-y-6">
                         <div className="flex justify-between items-center">
                            <h5 className="text-[10px] font-bold text-[#8B008B] uppercase tracking-[0.5em]">Inner Reflection</h5>
                            {!isEditingReflection && (
                              <button onClick={() => setIsEditingReflection(true)} className="text-[9px] text-white/20 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                                <Edit3 size={12} /> Refine Thought
                              </button>
                            )}
                         </div>
                         <div className="p-8 glass rounded-[3rem] border-white/5 bg-white/5 min-h-[200px] flex flex-col relative">
                            {isEditingReflection ? (
                              <div className="flex flex-col h-full gap-4">
                                 <textarea 
                                    className="flex-1 bg-transparent border-none text-sm italic font-light leading-relaxed text-white/80 focus:ring-0 placeholder:text-white/10 resize-none no-scrollbar"
                                    placeholder="Speak to the moment..."
                                    value={reflectionText}
                                    onChange={(e) => setReflectionText(e.target.value)}
                                 ></textarea>
                                 <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                    <button onClick={() => setIsEditingReflection(false)} className="px-5 py-2 text-[9px] uppercase font-bold tracking-widest text-white/30">Cancel</button>
                                    <button onClick={saveReflection} className="px-5 py-2 bg-[#8B008B]/20 text-[#8B008B] rounded-full text-[9px] uppercase font-bold tracking-widest">Seal Reflection</button>
                                 </div>
                              </div>
                            ) : (
                              <p className="text-sm italic font-light leading-relaxed text-white/60">
                                {selectedSession.reflection || "A quiet space for your integration. How did this resonance shift your field?"}
                              </p>
                            )}
                         </div>
                      </section>

                      <section className="p-8 glass rounded-[3rem] border-[#14B8A6]/20 bg-[#14B8A6]/5 space-y-4">
                         <h5 className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-[0.5em]">Mantra Anchored</h5>
                         <p className="text-xl font-serif italic text-white leading-relaxed">"{selectedSession.recipe?.mantra}"</p>
                      </section>

                      <button 
                        onClick={() => onLoad(selectedSession)}
                        className="w-full py-6 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 hover:bg-white/10 hover:text-white transition-all group"
                      >
                         <Play size={18} className="group-hover:text-[#14B8A6] transition-colors" /> Re-Enter Resonance
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlchemyVault;
