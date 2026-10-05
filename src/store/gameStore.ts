'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  PlayerCharacter, CharacterAppearance, DEFAULT_APPEARANCE
} from '@/types/character';
import { JOBS } from '@/lib/game/data';
import { DISTRICTS } from '@/data/world';

interface State {
  phase: 'creator' | 'world' | 'job';
  character: PlayerCharacter | null;
  currentDistrict: string;
  activeJobId: string | null;
  jobEndsAt: number;
  notifications: { id: string; title: string; message: string; type: string }[];

  createCharacter: (name: string, appearance: CharacterAppearance) => void;
  goToDistrict: (districtId: string) => void;
  startJob: (jobId: string) => string | null;
  finishJob: (performance: number) => void;
  cancelJob: () => void;
  buyTool: (toolId: string, price: number) => string | null;
  addNotif: (title: string, message: string, type?: string) => void;
  clearNotif: (id: string) => void;
  regenEnergy: () => void;
}

function makeCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const useGameStore = create<State>()(
  persist(
    (set, get) => ({
      phase: 'creator',
      character: null,
      currentDistrict: 'street',
      activeJobId: null,
      jobEndsAt: 0,
      notifications: [],

      createCharacter: (name, appearance) => {
        const char: PlayerCharacter = {
          id: crypto.randomUUID(),
          appearance,
          stats: {
            name,
            level: 1,
            totalXp: 0,
            credits: 40,
            energy: 100,
            maxEnergy: 100,
            skills: { physical: 0, service: 0, tech: 0, business: 0 },
            skillXp: { physical: 0, service: 0, tech: 0, business: 0 },
          },
          inventory: [],
          ownedBusinesses: [],
          position: { district: 'street', x: 50, y: 75 },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          streakDays: 1,
          referralCode: makeCode(),
          totalJobsCompleted: 0,
          totalCreditsEarned: 0,
          title: 'تازه‌وارد',
        };
        set({ character: char, phase: 'world', currentDistrict: 'street' });
        get().addNotif('خوش آمدی!', `${name} وارد شهر فورج شد`, 'success');
      },

      goToDistrict: (districtId) => {
        const { character } = get();
        if (!character) return;
        const d = DISTRICTS.find(x => x.id === districtId);
        if (!d) return;
        if (character.stats.level < d.unlockLevel) {
          get().addNotif('قفل است', `نیاز به سطح ${d.unlockLevel}`, 'error');
          return;
        }
        set({
          currentDistrict: districtId,
          character: {
            ...character,
            position: { district: districtId, x: d.x, y: d.y },
          },
        });
      },

      startJob: (jobId) => {
        const { character } = get();
        if (!character) return 'خطا';
        const job = JOBS.find(j => j.id === jobId);
        if (!job) return 'شغل پیدا نشد';
        if (character.stats.energy < job.energyCost) return 'انرژی کافی نیست';
        const sk = character.stats.skills[job.requiredSkill];
        if (sk < job.minSkillLevel) return 'مهارت کافی نیست';
        if (character.stats.level < job.unlockLevel) return 'سطح کافی نیست';

        set({
          phase: 'job',
          activeJobId: jobId,
          jobEndsAt: Date.now() + job.durationSeconds * 1000,
          character: {
            ...character,
            stats: {
              ...character.stats,
              energy: character.stats.energy - job.energyCost,
            },
          },
        });
        return null;
      },

      finishJob: (performance) => {
        const { character, activeJobId } = get();
        if (!character || !activeJobId) return;
        const job = JOBS.find(j => j.id === activeJobId);
        if (!job) return;

        const reward = Math.floor(job.baseReward * performance);
        const xp = Math.floor(job.baseXp * Math.min(1.3, performance));
        const skills = { ...character.stats.skills };
        const skillXp = { ...character.stats.skillXp };
        skillXp[job.requiredSkill] += xp;
        // level skill every 50 xp
        while (skillXp[job.requiredSkill] >= 50 + skills[job.requiredSkill] * 30) {
          skillXp[job.requiredSkill] -= 50 + skills[job.requiredSkill] * 30;
          skills[job.requiredSkill]++;
        }
        let totalXp = character.stats.totalXp + xp;
        let level = character.stats.level;
        while (totalXp >= level * 100) {
          totalXp -= level * 100;
          level++;
        }
        let title = 'تازه‌وارد';
        if (level >= 15) title = 'امپراتور شهر';
        else if (level >= 10) title = 'صاحب کسب‌وکار';
        else if (level >= 5) title = 'حرفه‌ای';
        else if (level >= 2) title = 'کارگر';

        set({
          phase: 'world',
          activeJobId: null,
          jobEndsAt: 0,
          character: {
            ...character,
            stats: {
              ...character.stats,
              credits: character.stats.credits + reward,
              totalXp,
              level,
              skills,
              skillXp,
            },
            totalJobsCompleted: character.totalJobsCompleted + 1,
            totalCreditsEarned: character.totalCreditsEarned + reward,
            title,
          },
        });
        get().addNotif(
          performance >= 1.2 ? 'عالی!' : 'کار تموم شد',
          `+${reward} کردیت · +${xp} XP`,
          'reward'
        );
      },

      cancelJob: () => {
        const { character, activeJobId } = get();
        if (!character || !activeJobId) return;
        const job = JOBS.find(j => j.id === activeJobId);
        set({
          phase: 'world',
          activeJobId: null,
          jobEndsAt: 0,
          character: {
            ...character,
            stats: {
              ...character.stats,
              energy: Math.min(
                character.stats.maxEnergy,
                character.stats.energy + Math.floor((job?.energyCost || 0) * 0.4)
              ),
            },
          },
        });
      },

      buyTool: (toolId, price) => {
        const { character } = get();
        if (!character) return 'خطا';
        if (character.stats.credits < price) return 'کردیت کافی نیست';
        if (character.inventory.includes(toolId)) return 'قبلاً داری';
        set({
          character: {
            ...character,
            stats: { ...character.stats, credits: character.stats.credits - price },
            inventory: [...character.inventory, toolId],
          },
        });
        get().addNotif('خرید شد', 'به اینونتوری اضافه شد', 'success');
        return null;
      },

      addNotif: (title, message, type = 'info') => {
        const id = crypto.randomUUID();
        set(s => ({
          notifications: [{ id, title, message, type }, ...s.notifications].slice(0, 4),
        }));
        setTimeout(() => get().clearNotif(id), 4000);
      },

      clearNotif: (id) => set(s => ({ notifications: s.notifications.filter(n => n.id !== id) })),

      regenEnergy: () => {
        const { character } = get();
        if (!character) return;
        if (character.stats.energy >= character.stats.maxEnergy) return;
        set({
          character: {
            ...character,
            stats: {
              ...character.stats,
              energy: Math.min(character.stats.maxEnergy, character.stats.energy + 1),
            },
            lastLogin: new Date().toISOString(),
          },
        });
      },
    }),
    {
      name: 'forge-city-v2',
      partialize: (s) => ({ character: s.character, currentDistrict: s.currentDistrict }),
    }
  )
);
