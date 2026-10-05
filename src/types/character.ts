/** Forge City v2 – Character System (Sims/Albion style) */

export type BodyType = 'slim' | 'average' | 'athletic' | 'heavy';
export type SkinTone = 'fair' | 'light' | 'medium' | 'tan' | 'brown' | 'dark';
export type HairStyle = 'bald' | 'short' | 'medium' | 'long' | 'mohawk' | 'bun' | 'braids' | 'spiky' | 'wavy';
export type HairColor = 'black' | 'brown' | 'blonde' | 'red' | 'white' | 'blue' | 'purple' | 'green' | 'pink';
export type EyeStyle = 'round' | 'almond' | 'sharp' | 'sleepy';
export type EyeColor = 'brown' | 'blue' | 'green' | 'hazel' | 'gray' | 'gold' | 'violet';
export type FaceFeature = 'none' | 'beard' | 'mustache' | 'scar' | 'freckles' | 'glasses';
export type FantasyTrait = 'none' | 'elf_ears' | 'horns' | 'small_wings' | 'tail' | 'glow_marks';
export type TopStyle = 'tank' | 'tee' | 'hoodie' | 'jacket' | 'armor_light' | 'robe' | 'vest';
export type BottomStyle = 'shorts' | 'jeans' | 'cargo' | 'skirt' | 'armor_legs' | 'robe_bottom';
export type ShoeStyle = 'bare' | 'sneakers' | 'boots' | 'sandals' | 'armor_boots';
export type Accessory = 'none' | 'bag' | 'cape' | 'necklace' | 'hat' | 'belt' | 'gloves';

export interface CharacterAppearance {
  bodyType: BodyType;
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  eyeStyle: EyeStyle;
  eyeColor: EyeColor;
  faceFeature: FaceFeature;
  fantasyTrait: FantasyTrait;
  topStyle: TopStyle;
  topColor: string; // hex
  bottomStyle: BottomStyle;
  bottomColor: string;
  shoeStyle: ShoeStyle;
  shoeColor: string;
  accessory: Accessory;
  accessoryColor: string;
}

export interface CharacterStats {
  name: string;
  level: number;
  totalXp: number;
  credits: number;
  energy: number;
  maxEnergy: number;
  skills: {
    physical: number;
    service: number;
    tech: number;
    business: number;
  };
  skillXp: {
    physical: number;
    service: number;
    tech: number;
    business: number;
  };
}

export interface PlayerCharacter {
  id: string;
  appearance: CharacterAppearance;
  stats: CharacterStats;
  inventory: string[];
  ownedBusinesses: string[];
  position: { district: string; x: number; y: number };
  createdAt: string;
  lastLogin: string;
  streakDays: number;
  referralCode: string;
  totalJobsCompleted: number;
  totalCreditsEarned: number;
  title: string;
}

export const SKIN_HEX: Record<SkinTone, string> = {
  fair: '#FFE0BD',
  light: '#F5D0A9',
  medium: '#D4A574',
  tan: '#C68642',
  brown: '#8D5524',
  dark: '#5C3317',
};

export const HAIR_HEX: Record<HairColor, string> = {
  black: '#1a1a1a',
  brown: '#4a3728',
  blonde: '#e6c35c',
  red: '#a33b24',
  white: '#e8e8e8',
  blue: '#3b82f6',
  purple: '#7c3aed',
  green: '#22c55e',
  pink: '#ec4899',
};

export const EYE_HEX: Record<EyeColor, string> = {
  brown: '#5c3317',
  blue: '#3b82f6',
  green: '#22c55e',
  hazel: '#8b6914',
  gray: '#6b7280',
  gold: '#eab308',
  violet: '#8b5cf6',
};

export const DEFAULT_APPEARANCE: CharacterAppearance = {
  bodyType: 'average',
  skinTone: 'medium',
  hairStyle: 'short',
  hairColor: 'brown',
  eyeStyle: 'round',
  eyeColor: 'brown',
  faceFeature: 'none',
  fantasyTrait: 'none',
  topStyle: 'tee',
  topColor: '#3b82f6',
  bottomStyle: 'jeans',
  bottomColor: '#1e3a5f',
  shoeStyle: 'sneakers',
  shoeColor: '#1a1a1a',
  accessory: 'none',
  accessoryColor: '#78716c',
};
