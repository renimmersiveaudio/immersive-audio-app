
export enum AppView {
  PortalGate = 'Portal Gate',
  Portal = 'Portal',
  AlchemyLab = 'Alchemy Lab',
  ImmersiveResonance = 'Alchemy Resonance',
  FrequencyGarden = 'Frequency Garden',
  GuidedJourneys = 'Guided Journeys',
  InnerEcho = 'Inner Echo',
  ResonanceCircles = 'Resonance Circles',
  EnergyGuide = 'Energy Guide',
  AlchemyVault = 'Alchemy Vault',
  StarLanguages = 'Star Languages'
}

export enum JourneyProtocol {
  GroundedResonance = 'Grounded Resonance',
  SolarVision = 'Solar Vision',
  CosmicRelease = 'Cosmic Release',
  EchoFlow = 'Echo Flow',
  HemiSync = 'Hemi-Sync',
  EnergyAlignment = 'Energy Alignment',
  TwelveDActivations = '12D Activations'
}

export enum MorphLevel {
  Mirror = 'Mirror',
  Balanced = 'Balanced',
  Transform = 'Transform'
}

export enum ElementalAnchor {
  Ground = 'Ground',
  Flow = 'Flow',
  Fire = 'Fire',
  Heart = 'Heart',
  Ether = 'Ether'
}

export enum CurrentVibration {
  HighPotential = 'High Potential',
  DeepIntegration = 'Deep Integration',
  ActiveEnergy = 'Active Energy',
  SoftFocus = 'Soft Focus',
  Neutral = 'Neutral',
  Peaceful = 'Peaceful',
  Stillness = 'Stillness',
  SeekingFlow = 'Seeking Flow'
}

export enum DesiredResonance {
  Empowered = 'Empowered',
  Radiant = 'Radiant',
  Serene = 'Serene',
  Inspired = 'Inspired',
  Joyful = 'Joyful',
  Grateful = 'Grateful',
  Focused = 'Focused',
  SurpriseMe = 'Surprise Me',
  AnythingButHere = 'Anything but here'
}

export interface MomentSignal {
  activity: 'Focus' | 'Somatic' | 'Transit' | 'Break' | 'Softness' | 'Rest' | 'Work/Meetings' | 'Physical Activity' | 'Presence';
  feelings?: string[];
  timeAvailable: 5 | 15 | 20;
  rhythm: 'Aligned' | 'Rushed' | 'Footing';
  intent: 'Reset' | 'Tension' | 'Focus' | 'Flow' | 'Support' | 'Empowerment';
  energy?: 'Soft' | 'Medium' | 'Vibrant';
}

export interface StellarSignature {
  harmonicKeys: string[];
  overview: string;
  regulationTendencies: string[];
  creativeAlchemy: string[];
}

export interface InnerEchoPlan {
  groundingLine: string;
  breathSync: string;
  soundSoften: string;
  reflectionQuestion: string;
}

export interface AlchemyJourneyPlan {
  openingTone: string;
  arc: string[];
  frequencyDirection: string;
  closingTone: string;
  mantra?: string;
}

export interface JourneyPhase {
  label: string;
  duration: string;
  desc: string;
}

export interface AlchemyRecipe {
  morphTarget: number; // 0.0 (Mirror) to 1.0 (Support)
  phases: JourneyPhase[];
  mantra: string;
  suggestedVolume: string;
}

export interface GlobalSeedPreferences {
  enabled: boolean;
  genre: string;
  songsAndArtists: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  source: 'upload' | 'platform' | 'recording' | 'playlist' | 'manual';
  type: 'Mirror' | 'Support';
  frequency: '440Hz' | '432Hz';
  url?: string;
  metadata?: {
    genre?: string;
    preferences?: string;
  };
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: number;
}

export interface JourneySession {
  id: string;
  protocol: JourneyProtocol;
  morph: MorphLevel;
  startingVibe?: CurrentVibration;
  goalResonance?: DesiredResonance;
  tracks: Track[];
  recipe?: AlchemyRecipe;
  timestamp: number;
  reflection?: string;
}

export interface MoodEntry {
  id: string;
  current: CurrentVibration;
  goal: DesiredResonance;
  vibrationIndex: number; // 1-10
  timestamp: number;
  sessionRef?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
