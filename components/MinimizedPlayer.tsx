
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize2, Music, Waves, GripVertical } from 'lucide-react';
import { JourneySession } from '../types';

interface MinimizedPlayerProps {
  session: JourneySession;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTrackIndex: number;
  onExpand: () => void;
}

const MinimizedPlayer: React.FC<MinimizedPlayerProps> = ({ 
  session, 
  isPlaying, 
  onTogglePlay, 
  currentTrackIndex,
  onExpand 
}) => {
  const track = session.tracks[currentTrackIndex];
  
  // State for dragging
  const [position, setPosition] = useState({ 
    x: typeof window !== 'undefined' ? (window.innerWidth / 2) - 200 : 0, 
    y: 110 // Default to top area below navigation
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ offsetX: number; offsetY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragRef.current = {
      offsetX: clientX - position.x,
      offsetY: clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !dragRef.current) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      
      setPosition({
        x: clientX - dragRef.current.offsetX,
        y: clientY - dragRef.current.offsetY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      className={`fixed z-[250] w-full max-w-md px-4 transition-transform duration-75 ease-out select-none ${isDragging ? 'cursor-grabbing scale-105' : 'cursor-default'}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        margin: 0 // Reset margins for absolute positioning
      }}
    >
      <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 flex items-center justify-between shadow-[0_0_50px_rgba(0,0,0,0.5)] group overflow-hidden">
        {/* Drag Handle */}
        <div 
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          className="p-2 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40 transition-colors"
        >
          <GripVertical size={16} />
        </div>

        {/* Progress Background */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-[#14B8A6]/10 w-full">
           <div className="h-full bg-[#14B8A6] animate-breath" style={{ width: '40%' }}></div>
        </div>

        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center shrink-0 border border-[#14B8A6]/20 relative overflow-hidden">
             <Music size={14} className={`text-[#14B8A6] ${isPlaying ? 'animate-pulse' : ''}`} />
             {isPlaying && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <Waves size={20} className="animate-spin-slow text-[#14B8A6]" />
               </div>
             )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-bold text-white truncate uppercase tracking-tighter">
              {track.title}
            </span>
            <span className="text-[7px] text-[#14B8A6] font-bold uppercase tracking-[0.3em] opacity-60 truncate">
              {track.artist} • {session.protocol}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90"
          >
            {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
          </button>
          <button 
            onClick={onExpand}
            className="w-8 h-8 rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/30 flex items-center justify-center text-[#14B8A6] hover:bg-[#14B8A6]/30 transition-all active:scale-90"
            title="Return to Lab"
          >
            <Maximize2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinimizedPlayer;
