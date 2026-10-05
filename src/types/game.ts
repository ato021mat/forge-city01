// Compatibility layer for RealisticJobs mini-games
export interface Job {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  requiredSkill: 'physical' | 'service' | 'tech' | 'business';
  minSkillLevel: number;
  baseReward: number;
  baseXp: number;
  durationSeconds: number;
  energyCost: number;
  category: string;
  unlockLevel: number;
  miniGameType: string;
  icon: string;
  color: string;
}
