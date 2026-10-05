'use client';

import { DISTRICTS, District } from '@/data/world';
import { CharacterSVG } from '@/components/character/CharacterSVG';
import { CharacterAppearance } from '@/types/character';

interface Props {
  appearance: CharacterAppearance;
  currentDistrict: string;
  playerLevel: number;
  onSelectDistrict: (id: string) => void;
}

export function CityMap({ appearance, currentDistrict, playerLevel, onSelectDistrict }: Props) {
  const current = DISTRICTS.find(d => d.id === currentDistrict);

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700/50 bg-[#0a1628]">
      {/* Map background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 50% 75%, rgba(34,197,94,0.15), transparent 40%),
              radial-gradient(circle at 25% 45%, rgba(245,158,11,0.12), transparent 35%),
              radial-gradient(circle at 75% 50%, rgba(120,113,108,0.12), transparent 35%),
              radial-gradient(circle at 50% 25%, rgba(59,130,246,0.15), transparent 40%),
              radial-gradient(circle at 20% 70%, rgba(168,85,247,0.1), transparent 30%)
            `
          }}
        />
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Roads */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <line x1="50%" y1="75%" x2="25%" y2="45%" stroke="#94a3b8" strokeWidth="3" />
          <line x1="50%" y1="75%" x2="75%" y2="50%" stroke="#94a3b8" strokeWidth="3" />
          <line x1="50%" y1="75%" x2="50%" y2="25%" stroke="#94a3b8" strokeWidth="3" />
          <line x1="25%" y1="45%" x2="50%" y2="25%" stroke="#94a3b8" strokeWidth="2" />
          <line x1="75%" y1="50%" x2="50%" y2="25%" stroke="#94a3b8" strokeWidth="2" />
          <line x1="50%" y1="75%" x2="20%" y2="70%" stroke="#94a3b8" strokeWidth="2" />
        </svg>
      </div>

      {/* Districts */}
      {DISTRICTS.map(d => {
        const locked = playerLevel < d.unlockLevel;
        const active = d.id === currentDistrict;
        return (
          <button
            key={d.id}
            onClick={() => onSelectDistrict(d.id)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
              active ? 'z-20 scale-110' : 'z-10 hover:scale-105'
            } ${locked ? 'opacity-40' : ''}`}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition shadow-lg ${
                active
                  ? 'border-cyan-400 bg-cyan-500/20 shadow-cyan-500/30'
                  : locked
                  ? 'border-slate-600 bg-slate-800/80'
                  : 'border-slate-500 bg-slate-800/90 hover:border-slate-400'
              }`}
              style={active ? { boxShadow: `0 0 20px ${d.color}40` } : {}}
            >
              {locked ? '🔒' : d.icon}
            </div>
            <div className={`text-[10px] mt-1 font-medium text-center whitespace-nowrap ${
              active ? 'text-cyan-300' : 'text-slate-400'
            }`}>
              {d.nameFa}
            </div>
          </button>
        );
      })}

      {/* Player character on map */}
      {current && (
        <div
          className="absolute z-30 transform -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-700"
          style={{ left: `${current.x}%`, top: `${current.y}%`, marginTop: '-28px' }}
        >
          <CharacterSVG appearance={appearance} size={48} pose="idle" showShadow={false} />
        </div>
      )}
    </div>
  );
}
