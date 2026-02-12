
import React, { useEffect, useState } from 'react';
import { Wind, Sparkles, Zap, FlaskConical, ShieldCheck, Flame, Radio } from 'lucide-react';
import { MorphLevel } from '../types';

interface PortalAnimationProps {
  morph?: MorphLevel;
  addedCount?: number;
}

const PortalAnimation: React.FC<PortalAnimationProps> = ({ morph, addedCount }) => {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  const messages = [
    "Analyzing your Seeds...",
    "Scanning Musical DNA...",
    "Filtering discord into coherence...",
    "Shifting timeline to 432 Hz...",
    "Calibrating neural pathways...",
    "Opening the Journey Portal..."
  ];

  const morphMessages = {
    [MorphLevel.Mirror]: `Mirror Active: Completing the ritual. ${addedCount} tracks added to maintain the 432 Hz rhythm. Scaling library to match your vibe.`,
    [MorphLevel.Balanced]: `Balance Active: Creating Sine Wave resonance. Preparing 2:2 frequency intervals of music and stillness.`,
    [MorphLevel.Transform]: `Lyrical Alchemy Active: Elevating the message. Scanning for high-vibe matches. Transmuting density into Radiant Coherence.`
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + 0.8; // Slightly slower for more impact
      });
    }, 100);

    const msgTimer = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length);
    }, 1600);

    return () => {
      clearInterval(timer);
      clearInterval(msgTimer);
    };
  }, []);

  const getMorphIcon = () => {
    switch (morph) {
      case MorphLevel.Mirror: return <ShieldCheck size={20} className="text-teal-400" />;
      case MorphLevel.Balanced: return <Radio size={20} className="text-teal-400" />;
      case MorphLevel.Transform: return <Flame size={20} className="text-orange-400 animate-pulse" />;
      default: return <FlaskConical size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#05070a] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-64 h-64 mb-12">
        {/* Decorative Rings */}
        <div className="absolute inset-0 rounded-full border border-teal-500/10 animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute inset-4 rounded-full border border-teal-500/20 animate-[spin_25s_linear_infinite_reverse]"></div>
        <div className="absolute inset-8 rounded-full border border-white/5 animate-[pulse_4s_infinite]"></div>
        
        {/* Synthesis Core */}
        <div className="absolute inset-12 rounded-full bg-teal-500/10 blur-[60px] animate-pulse"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
           <div className="relative">
             <Wind size={48} className="text-teal-400 animate-pulse" />
             <div className="absolute -top-4 -right-4">
                <Sparkles size={24} className="text-white/40 animate-bounce" />
             </div>
           </div>
        </div>
      </div>

      <div className="space-y-8 max-w-lg">
        <div className="space-y-3">
          <h2 className="text-2xl font-serif text-white tracking-wide transition-all duration-500">{messages[msgIndex]}</h2>
          
          {progress > 30 && morph && (
            <div className="flex flex-col items-center gap-3 p-4 glass rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-1000">
               <div className="flex items-center gap-3">
                 {getMorphIcon()}
                 <span className="text-teal-400 text-xs font-bold uppercase tracking-[0.3em]">
                   {morph} Synthesis Engaged
                 </span>
               </div>
               <p className="text-white/60 text-[11px] font-medium leading-relaxed max-w-xs italic">
                 {morphMessages[morph]}
               </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 via-teal-200 to-white transition-all duration-300 ease-out shadow-[0_0_10px_rgba(45,212,191,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold">
            <span className={progress > 10 ? 'text-teal-400' : ''}>Analyze</span>
            <span className={progress > 50 ? 'text-teal-400' : ''}>{Math.round(progress)}% Synthesis</span>
            <span className={progress > 90 ? 'text-teal-400' : ''}>Manifest</span>
          </div>
        </div>
        
        {progress > 85 && morph === MorphLevel.Transform && (
           <p className="text-[10px] text-orange-400/80 font-bold uppercase tracking-widest animate-pulse">
             Transmuting Density into Radiant Coherence
           </p>
        )}
      </div>
    </div>
  );
};

export default PortalAnimation;
