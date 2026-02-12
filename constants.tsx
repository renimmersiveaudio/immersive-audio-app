
import React from 'react';
import { 
  FlaskConical, 
  Waves, 
  Telescope, 
  Library,
  Compass,
  HeartPulse
} from 'lucide-react';
import { AppView, JourneyProtocol } from './types';

export const COLORS = {
  magenta: '#8B008B',
  portalGreen: '#14B8A6',
};

export const NAV_ITEMS = [
  { id: AppView.Portal, icon: <Compass size={18} />, label: "Portal" },
  { id: AppView.InnerEcho, icon: <HeartPulse size={18} />, label: "Echo" },
  { id: AppView.AlchemyLab, icon: <FlaskConical size={18} />, label: "Lab" },
  { id: AppView.AlchemyVault, icon: <Library size={18} />, label: "Vault" },
];

export const PROTOCOLS = [
  { id: JourneyProtocol.GroundedResonance, label: 'Grounded Resonance', desc: 'Deep physical anchoring and stability' },
  { id: JourneyProtocol.SolarVision, label: 'Solar Vision', desc: 'Confidence, vitality, and creative drive' },
  { id: JourneyProtocol.CosmicRelease, label: 'Cosmic Release', desc: 'Letting go of heavy emotional weights' },
  { id: JourneyProtocol.EchoFlow, label: 'Echo Flow', desc: 'Harmonizing communication and voice' },
  { id: JourneyProtocol.HemiSync, label: 'Hemi-Sync', desc: 'Sharpening focus and brain synchronization' },
  { id: JourneyProtocol.EnergyAlignment, label: 'Energy Alignment', desc: 'Balancing the subtle energy centers' },
  { id: JourneyProtocol.TwelveDActivations, label: '12 D Activations', desc: 'Higher dimensional energy clearing' },
];

export const PITCH_RATIO_432 = 0.981818;
export const SEMITONE_SHIFT_432 = -0.3177;
