'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CharacterCreator } from '@/components/character/CharacterCreator';
import { CharacterSVG } from '@/components/character/CharacterSVG';
import { TilemapView } from '@/components/world/TilemapView';
import { AudioManager } from '@/lib/audio/AudioManager';
import { RealisticJobGame } from '@/components/jobs/RealisticJobs';
import { JOBS, TOOLS } from '@/lib/game/data';
import { DISTRICTS } from '@/data/world';
import type { Job } from '@/types/game';

type Tab = 'map' | 'jobs' | 'shop' | 'profile';

export default function ForgeCityV2() {
  const {
    phase, character, currentDistrict, activeJobId, jobEndsAt, notifications,
    createCharacter, goToDistrict, startJob, finishJob, cancelJob, buyTool,
    addNotif, clearNotif, regenEnergy,
  } = useGameStore();

  const [tab, setTab] = useState<Tab>('map');

  useEffect(() => {
    AudioManager.init().then(() => {
      AudioManager.playMusic('city');
    });
    return () => AudioManager.stopMusic();
  }, []);

  useEffect(() => {
    if (!character) return;
    const id = setInterval(() => regenEnergy(), 8000);
    return () => clearInterval(id);
  }, [character, regenEnergy]);

  // Character Creator
  if (phase === 'creator' || !character) {
    return <CharacterCreator onComplete={createCharacter} />;
  }

  // Job mini-game
  if (phase === 'job' && activeJobId) {
    const jobDef = JOBS.find(j => j.id === activeJobId);
    if (jobDef) {
      const job: Job = {
        ...jobDef,
        description: jobDef.descriptionFa,
        miniGameType: 'click',
      };
      const duration = Math.max(1000, jobEndsAt - Date.now());
      return (
        <RealisticJobGame
          job={job}
          durationMs={duration > 5000 ? jobDef.durationSeconds * 1000 : duration}
          onComplete={(rate) => finishJob(rate)}
          onCancel={cancelJob}
        />
      );
    }
  }

  const district = DISTRICTS.find(d => d.id === currentDistrict);
  const districtJobs = JOBS.filter(j =>
    j.district === currentDistrict &&
    character.stats.level >= j.unlockLevel &&
    character.stats.skills[j.requiredSkill] >= j.minSkillLevel
  );

  return (
    <div className="min-h-screen bg-[#030712] pb-24 safe-bottom">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-slate-800 px-4 py-2.5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CharacterSVG appearance={character.appearance} size={40} showShadow={false} />
            <div>
              <div className="font-bold text-white text-sm">{character.stats.name}</div>
              <div className="text-[10px] text-slate-400">{character.title} · Lv.{character.stats.level}</div>
            </div>
          </div>
          <div className="text-left">
            <div className="text-cyan-300 font-bold text-sm">{character.stats.credits.toLocaleString()} ¢</div>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${(character.stats.energy / character.stats.maxEnergy) * 100}%` }} />
              </div>
              <span className="text-[10px] text-emerald-400">{Math.floor(character.stats.energy)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications */}
      <div className="fixed top-14 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id}
            className={`pointer-events-auto glass-strong rounded-xl px-4 py-2 text-sm max-w-sm w-full flex justify-between animate-slide-up border ${
              n.type === 'reward' ? 'border-emerald-500/40' : n.type === 'error' ? 'border-red-500/40' : 'border-cyan-500/30'
            }`}>
            <div>
              <div className="font-semibold text-white text-xs">{n.title}</div>
              <div className="text-slate-300 text-xs">{n.message}</div>
            </div>
            <button onClick={() => clearNotif(n.id)} className="text-slate-500 text-lg">×</button>
          </div>
        ))}
      </div>

      <main className="max-w-lg mx-auto px-4 pt-3 space-y-3">
        {/* Tabs */}
        <div className="flex gap-1 p-1 glass rounded-2xl">
          {([
            { id: 'map' as Tab, label: 'نقشه', icon: '🗺️' },
            { id: 'jobs' as Tab, label: 'کارها', icon: '💼' },
            { id: 'shop' as Tab, label: 'فروشگاه', icon: '🛍️' },
            { id: 'profile' as Tab, label: 'کاراکتر', icon: '👤' },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-0.5 transition ${
                tab === t.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500'
              }`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* MAP */}
        {tab === 'map' && (
          <div className="space-y-3 animate-slide-up">
            <TilemapView
              appearance={character.appearance}
              currentDistrict={currentDistrict}
              playerLevel={character.stats.level}
              onSelectDistrict={goToDistrict}
            />
            {district && (
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{district.icon}</span>
                  <div>
                    <div className="font-bold text-white text-sm">{district.nameFa}</div>
                    <div className="text-[10px] text-slate-400">{district.description}</div>
                  </div>
                </div>
                <button onClick={() => setTab('jobs')}
                  className="mt-3 w-full py-2 rounded-xl bg-cyan-600/80 text-white text-sm font-semibold">
                  دیدن شغل‌های این منطقه
                </button>
              </div>
            )}
          </div>
        )}

        {/* JOBS */}
        {tab === 'jobs' && (
          <div className="space-y-3 animate-slide-up">
            <div className="flex items-center gap-2">
              <span className="text-xl">{district?.icon}</span>
              <h2 className="font-bold text-white text-sm">شغل‌های {district?.nameFa}</h2>
            </div>
            {districtJobs.length === 0 && (
              <div className="glass rounded-2xl p-6 text-center text-slate-400 text-sm">
                در این منطقه شغلی برای سطح و مهارت شما باز نیست.
              </div>
            )}
            {districtJobs.map(job => (
              <button key={job.id} onClick={() => {
                const err = startJob(job.id);
                if (err) { addNotif('نشد', err, 'error'); AudioManager.playSfx('error'); } else { AudioManager.playSfx('work_start'); AudioManager.playMusic('work'); }
              }}
                className="w-full glass rounded-2xl p-4 text-right hover:border-cyan-500/30 border border-transparent transition">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `${job.color}25` }}>{job.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-white text-sm">{job.nameFa}</span>
                      <span className="text-emerald-400 font-bold text-sm">+{job.baseReward}¢</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{job.descriptionFa}</p>
                    <div className="flex gap-2 mt-1.5 text-[10px] text-slate-500">
                      <span>⚡{job.energyCost}</span>
                      <span>⏱{job.durationSeconds}s</span>
                      <span>{job.requiredSkill} {job.minSkillLevel}+</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* SHOP */}
        {tab === 'shop' && (
          <div className="space-y-3 animate-slide-up">
            <h2 className="font-bold text-white text-sm">فروشگاه</h2>
            {TOOLS.map(t => {
              const owned = character.inventory.includes(t.id);
              return (
                <div key={t.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-3xl">{t.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-white text-sm">{t.nameFa}</div>
                    <div className="text-[10px] text-slate-400">
                      {t.incomeBonus > 0 && `+${(t.incomeBonus*100).toFixed(0)}% درآمد `}
                      {t.speedBonus > 0 && `+${(t.speedBonus*100).toFixed(0)}% سرعت `}
                      {t.energyBonus > 0 && `+${t.energyBonus} انرژی`}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-cyan-300 font-bold text-sm">{t.price}¢</div>
                    <button disabled={owned || character.stats.credits < t.price}
                      onClick={() => buyTool(t.id, t.price)}
                      className={`mt-1 px-3 py-1 rounded-lg text-[11px] font-semibold ${
                        owned ? 'bg-slate-700 text-slate-400' :
                        character.stats.credits >= t.price ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'
                      }`}>
                      {owned ? 'مالک' : 'خرید'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <div className="space-y-4 animate-slide-up">
            <div className="glass-strong rounded-3xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
              <div className="relative flex flex-col items-center">
                <CharacterSVG appearance={character.appearance} size={140} pose="idle" />
                <h2 className="text-xl font-bold text-white mt-2">{character.stats.name}</h2>
                <p className="text-cyan-400 text-sm">{character.title}</p>
                <div className="grid grid-cols-2 gap-3 mt-4 w-full">
                  <div className="bg-slate-900/60 rounded-xl p-3">
                    <div className="text-[10px] text-slate-500">سطح</div>
                    <div className="text-lg font-bold text-white">{character.stats.level}</div>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-3">
                    <div className="text-[10px] text-slate-500">کد دعوت</div>
                    <div className="text-lg font-bold text-cyan-300">{character.referralCode}</div>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-3">
                    <div className="text-[10px] text-slate-500">کارها</div>
                    <div className="text-lg font-bold text-white">{character.totalJobsCompleted}</div>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-3">
                    <div className="text-[10px] text-slate-500">کل درآمد</div>
                    <div className="text-lg font-bold text-emerald-400">{character.totalCreditsEarned.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-4">
              <h3 className="font-semibold text-white text-sm mb-3">مهارت‌ها</h3>
              {(['physical','service','tech','business'] as const).map(sk => (
                <div key={sk} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">
                      {sk === 'physical' ? '💪 بدنی' : sk === 'service' ? '🤝 خدمات' : sk === 'tech' ? '⚙️ فنی' : '📊 کسب‌وکار'}
                    </span>
                    <span className="text-slate-500">Lv.{character.stats.skills[sk]}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{
                      width: `${Math.min(100, (character.stats.skillXp[sk] / (50 + character.stats.skills[sk] * 30)) * 100)}%`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
