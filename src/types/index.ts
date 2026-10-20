export type HoldingHand = 'left' | 'right';
export type AppLayout = 'usual' | 'left-thumb';
export type ThemeMode = 'sunlight' | 'night' | 'high-contrast';
export type PaymentStep = 'enter-pin' | 'verifying' | 'error' | 'success';

export interface TrialRecord {
  id: string;
  timestamp: string;
  layout: AppLayout;
  holdingHand: HoldingHand;
  timeTakenSeconds: number;
  wrongTaps: number; // wrong digits entered or clear taps or missed screen taps
  switchedHands: boolean; // did tester switch hands to reach button?
  confidenceRating: number; // 1 to 5
  notes: string;
  completedAt: string;
}

export interface PersonaProfile {
  name: string;
  age: number;
  role: string;
  techExperience: string;
  physicalContext: string;
  emotionalContext: string;
  hmwQuestion: string;
}

export interface SoundHapticSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  speechEnabled: boolean;
}
