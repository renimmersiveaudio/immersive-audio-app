
import React from 'react';
import { Zap } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { AppView } from '../types';

interface NavigationProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 p-2 flex items-center gap-2 bg-black/40 border border-white/10 backdrop-blur-3xl rounded-full shadow-2xl max-w-[95vw] transition-all duration-1000">
      {/* Portal Core Home Link */}
      <div 
        className="flex items-center gap-3 pl-2 pr-4 border-r border-white/10 cursor-pointer group"
        onClick={() => onViewChange(AppView.PortalGate)}
      >
        <div className={`w-10 h-10 rounded-full transition-all duration-700 flex items-center justify-center relative overflow-hidden shrink-0 ${activeView === AppView.PortalGate ? 'bg-[#14B8A6]/20 border border-[#14B8A6]/40' : 'bg-white/5 border border-white/10 group-hover:bg-white/10'}`}>
          <div className={`w-2 h-2 rounded-full transition-all duration-700 ${activeView === AppView.PortalGate ? 'bg-[#14B8A6] animate-breath shadow-[0_0_15px_#14B8A6]' : 'bg-white/20 shadow-none'}`}></div>
        </div>
        <div className="flex flex-col overflow-hidden max-w-0 group-hover:max-w-[120px] transition-all duration-700 opacity-0 group-hover:opacity-100">
          <span className="font-serif italic text-[11px] tracking-tight leading-none text-white whitespace-nowrap">Immersive Audio</span>
          <span className="text-[7px] text-[#14B8A6] uppercase tracking-[0.3em] font-bold whitespace-nowrap">The Gate</span>
        </div>
      </div>
      
      {/* Navigation Links */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-1">
        {NAV_ITEMS.map((item) => (
          item.id !== AppView.EnergyGuide && (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`relative flex items-center h-11 px-3.5 rounded-full transition-all duration-500 group ${
                activeView === item.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/20 hover:text-white/80 hover:bg-white/5'
              }`}
              title={item.label}
            >
              <span className={`transition-all duration-500 shrink-0 ${activeView === item.id ? 'scale-110 text-[#14B8A6] glow-text' : 'scale-100 group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <div className="overflow-hidden max-w-0 group-hover:max-w-[140px] transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none">
                <span className="whitespace-nowrap font-bold uppercase tracking-[0.4em] text-[8px] ml-4 transition-all duration-700">
                  {item.label}
                </span>
              </div>
              {activeView === item.id && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#14B8A6] rounded-full animate-breath"></div>
              )}
            </button>
          )
        ))}
      </div>

      {/* Profile/Sync Link */}
      <div className="pl-2 border-l border-white/10">
        <button 
          onClick={() => onViewChange(AppView.EnergyGuide)}
          className={`relative w-11 h-11 rounded-full border flex items-center justify-center group transition-all duration-700 overflow-hidden ${
            activeView === AppView.EnergyGuide 
              ? 'bg-[#14B8A6]/20 border-[#14B8A6]/50 text-[#14B8A6]' 
              : 'text-white/20 border-white/10 hover:border-[#14B8A6]/30 hover:bg-[#14B8A6]/10 hover:text-[#14B8A6]/80'
          }`}
          title="Vibe Guidance"
        >
          <Zap size={16} className={`${activeView === AppView.EnergyGuide ? 'animate-pulse' : ''}`} />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#14B8A6] text-black">
             <Zap size={18} fill="currentColor" />
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
