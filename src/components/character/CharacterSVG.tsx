'use client';

import {
  CharacterAppearance, SKIN_HEX, HAIR_HEX, EYE_HEX, BodyType
} from '@/types/character';

interface Props {
  appearance: CharacterAppearance;
  size?: number;
  pose?: 'idle' | 'walk1' | 'walk2' | 'work' | 'sit';
  showShadow?: boolean;
  className?: string;
}

function bodyScale(bt: BodyType): { w: number; h: number } {
  switch (bt) {
    case 'slim': return { w: 0.85, h: 1.05 };
    case 'athletic': return { w: 1.1, h: 1.05 };
    case 'heavy': return { w: 1.25, h: 0.95 };
    default: return { w: 1, h: 1 };
  }
}

export function CharacterSVG({ appearance: a, size = 120, pose = 'idle', showShadow = true, className = '' }: Props) {
  const skin = SKIN_HEX[a.skinTone];
  const hair = HAIR_HEX[a.hairColor];
  const eye = EYE_HEX[a.eyeColor];
  const sc = bodyScale(a.bodyType);
  const legOffset = pose === 'walk1' ? -6 : pose === 'walk2' ? 6 : 0;
  const armOffset = pose === 'work' ? -15 : pose === 'walk1' ? 8 : pose === 'walk2' ? -8 : 0;

  const vb = 100;
  const cx = 50;

  return (
    <svg
      viewBox={`0 0 ${vb} ${vb + 20}`}
      width={size}
      height={size * 1.2}
      className={className}
      style={{ overflow: 'visible' }}
    >
      {showShadow && (
        <ellipse cx={cx} cy={115} rx={22 * sc.w} ry={5} fill="rgba(0,0,0,0.25)" />
      )}

      {/* ===== LEGS ===== */}
      <g transform={`translate(${cx}, 78)`}>
        {/* Left leg */}
        <rect x={-12 * sc.w + legOffset * 0.3} y={0} width={10 * sc.w} height={28 * sc.h} rx={3}
          fill={a.bottomColor} opacity={0.9} />
        {/* Right leg */}
        <rect x={2 * sc.w - legOffset * 0.3} y={0} width={10 * sc.w} height={28 * sc.h} rx={3}
          fill={a.bottomColor} />
        {/* Shoes */}
        {a.shoeStyle !== 'bare' && (
          <>
            <ellipse cx={-7 * sc.w + legOffset * 0.3} cy={28 * sc.h} rx={7} ry={3.5} fill={a.shoeColor} />
            <ellipse cx={7 * sc.w - legOffset * 0.3} cy={28 * sc.h} rx={7} ry={3.5} fill={a.shoeColor} />
          </>
        )}
      </g>

      {/* ===== BODY / TORSO ===== */}
      <g transform={`translate(${cx}, 42)`}>
        <rect
          x={-16 * sc.w} y={0}
          width={32 * sc.w} height={38 * sc.h}
          rx={6}
          fill={a.topColor}
        />
        {/* Shirt detail */}
        <rect x={-4} y={4} width={8} height={12} rx={2} fill="rgba(255,255,255,0.12)" />
        {/* Armor / robe extras */}
        {a.topStyle === 'armor_light' && (
          <rect x={-14 * sc.w} y={2} width={28 * sc.w} height={8} rx={2} fill="rgba(255,255,255,0.2)" />
        )}
        {a.topStyle === 'hoodie' && (
          <path d={`M ${-10 * sc.w} 0 Q 0 -8 ${10 * sc.w} 0`} fill={a.topColor} opacity={0.8} />
        )}
      </g>

      {/* ===== ARMS ===== */}
      <g transform={`translate(${cx}, 48)`}>
        <rect x={-22 * sc.w} y={armOffset * 0.5} width={8} height={26 * sc.h} rx={3} fill={skin}
          transform={`rotate(${armOffset * 0.4})`} />
        <rect x={14 * sc.w} y={-armOffset * 0.5} width={8} height={26 * sc.h} rx={3} fill={skin}
          transform={`rotate(${-armOffset * 0.4})`} />
        {/* Hands */}
        <circle cx={-18 * sc.w} cy={24 * sc.h + armOffset * 0.3} r={4.5} fill={skin} />
        <circle cx={18 * sc.w} cy={24 * sc.h - armOffset * 0.3} r={4.5} fill={skin} />
      </g>

      {/* ===== FANTASY: WINGS / TAIL ===== */}
      {a.fantasyTrait === 'small_wings' && (
        <g opacity={0.85}>
          <path d="M 28 50 Q 45 35 48 55 Q 42 48 28 55 Z" fill="#a78bfa" />
          <path d="M 72 50 Q 55 35 52 55 Q 58 48 72 55 Z" fill="#a78bfa" />
        </g>
      )}
      {a.fantasyTrait === 'tail' && (
        <path d="M 50 75 Q 70 90 65 105" stroke={skin} strokeWidth={5} fill="none" strokeLinecap="round" />
      )}

      {/* ===== HEAD ===== */}
      <g transform={`translate(${cx}, 22)`}>
        {/* Neck */}
        <rect x={-5} y={12} width={10} height={10} fill={skin} />
        {/* Head shape */}
        <ellipse cx={0} cy={0} rx={16} ry={18} fill={skin} />

        {/* Fantasy ears */}
        {a.fantasyTrait === 'elf_ears' && (
          <>
            <path d="M -16 -2 L -28 -12 L -14 4 Z" fill={skin} />
            <path d="M 16 -2 L 28 -12 L 14 4 Z" fill={skin} />
          </>
        )}
        {a.fantasyTrait === 'horns' && (
          <>
            <path d="M -10 -14 Q -18 -28 -8 -20" stroke="#4a3728" strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M 10 -14 Q 18 -28 8 -20" stroke="#4a3728" strokeWidth={4} fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Eyes */}
        {a.eyeStyle === 'round' && (
          <>
            <ellipse cx={-6} cy={-2} rx={3.5} ry={4} fill="white" />
            <ellipse cx={6} cy={-2} rx={3.5} ry={4} fill="white" />
            <circle cx={-6} cy={-1} r={2} fill={eye} />
            <circle cx={6} cy={-1} r={2} fill={eye} />
            <circle cx={-5.5} cy={-1.5} r={0.7} fill="white" />
            <circle cx={6.5} cy={-1.5} r={0.7} fill="white" />
          </>
        )}
        {a.eyeStyle === 'almond' && (
          <>
            <ellipse cx={-6} cy={-2} rx={4} ry={3} fill="white" />
            <ellipse cx={6} cy={-2} rx={4} ry={3} fill="white" />
            <ellipse cx={-6} cy={-1.5} rx={2} ry={1.8} fill={eye} />
            <ellipse cx={6} cy={-1.5} rx={2} ry={1.8} fill={eye} />
          </>
        )}
        {a.eyeStyle === 'sharp' && (
          <>
            <path d="M -10 -2 L -2 -4 L -2 1 Z" fill="white" />
            <path d="M 10 -2 L 2 -4 L 2 1 Z" fill="white" />
            <circle cx={-5} cy={-1.5} r={1.8} fill={eye} />
            <circle cx={5} cy={-1.5} r={1.8} fill={eye} />
          </>
        )}
        {a.eyeStyle === 'sleepy' && (
          <>
            <ellipse cx={-6} cy={-1} rx={3.5} ry={2.5} fill="white" />
            <ellipse cx={6} cy={-1} rx={3.5} ry={2.5} fill="white" />
            <ellipse cx={-6} cy={-0.5} rx={2} ry={1.5} fill={eye} />
            <ellipse cx={6} cy={-0.5} rx={2} ry={1.5} fill={eye} />
            <path d="M -10 -3 Q -6 -5 -2 -3" stroke={skin} strokeWidth={1.5} fill="none" opacity={0.5} />
            <path d="M 2 -3 Q 6 -5 10 -3" stroke={skin} strokeWidth={1.5} fill="none" opacity={0.5} />
          </>
        )}

        {/* Face features */}
        {a.faceFeature === 'beard' && (
          <path d="M -10 8 Q 0 22 10 8 Q 0 14 -10 8" fill={hair} opacity={0.85} />
        )}
        {a.faceFeature === 'mustache' && (
          <path d="M -8 6 Q 0 10 8 6" stroke={hair} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        )}
        {a.faceFeature === 'scar' && (
          <line x1={4} y1={-8} x2={10} y2={2} stroke="#a33b24" strokeWidth={1.2} opacity={0.7} />
        )}
        {a.faceFeature === 'freckles' && (
          <>
            <circle cx={-8} cy={4} r={0.8} fill="#c68642" opacity={0.5} />
            <circle cx={-5} cy={6} r={0.6} fill="#c68642" opacity={0.5} />
            <circle cx={7} cy={5} r={0.7} fill="#c68642" opacity={0.5} />
            <circle cx={5} cy={7} r={0.5} fill="#c68642" opacity={0.5} />
          </>
        )}
        {a.faceFeature === 'glasses' && (
          <>
            <circle cx={-6} cy={-2} r={5} fill="none" stroke="#333" strokeWidth={1.5} />
            <circle cx={6} cy={-2} r={5} fill="none" stroke="#333" strokeWidth={1.5} />
            <line x1={-1} y1={-2} x2={1} y2={-2} stroke="#333" strokeWidth={1.5} />
          </>
        )}

        {/* Glow marks fantasy */}
        {a.fantasyTrait === 'glow_marks' && (
          <>
            <path d="M -12 2 Q -8 8 -4 4" stroke="#22d3ee" strokeWidth={1.5} fill="none" opacity={0.7} />
            <path d="M 12 2 Q 8 8 4 4" stroke="#22d3ee" strokeWidth={1.5} fill="none" opacity={0.7} />
          </>
        )}

        {/* Mouth */}
        <path d="M -4 8 Q 0 11 4 8" stroke="#c4866a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </g>

      {/* ===== HAIR ===== */}
      <g transform={`translate(${cx}, 22)`}>
        {a.hairStyle === 'short' && (
          <path d="M -15 -16 Q 0 -24 15 -16 Q 14 -6 0 -8 Q -14 -6 -15 -16" fill={hair} />
        )}
        {a.hairStyle === 'medium' && (
          <path d="M -16 -14 Q 0 -26 16 -14 L 17 2 Q 0 -4 -17 2 Z" fill={hair} />
        )}
        {a.hairStyle === 'long' && (
          <>
            <path d="M -16 -14 Q 0 -26 16 -14 L 18 20 Q 0 8 -18 20 Z" fill={hair} />
            <path d="M -14 10 Q -18 25 -10 28" fill={hair} opacity={0.9} />
            <path d="M 14 10 Q 18 25 10 28" fill={hair} opacity={0.9} />
          </>
        )}
        {a.hairStyle === 'mohawk' && (
          <path d="M -4 -16 L 0 -32 L 4 -16 Q 0 -18 -4 -16" fill={hair} />
        )}
        {a.hairStyle === 'bun' && (
          <>
            <path d="M -14 -14 Q 0 -22 14 -14 Q 12 -6 0 -8 Q -12 -6 -14 -14" fill={hair} />
            <circle cx={0} cy={-22} r={7} fill={hair} />
          </>
        )}
        {a.hairStyle === 'braids' && (
          <>
            <path d="M -15 -14 Q 0 -24 15 -14 Q 14 -6 0 -8 Q -14 -6 -15 -14" fill={hair} />
            <path d="M -12 0 Q -16 15 -10 22" stroke={hair} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M 12 0 Q 16 15 10 22" stroke={hair} strokeWidth={4} fill="none" strokeLinecap="round" />
          </>
        )}
        {a.hairStyle === 'spiky' && (
          <>
            <path d="M -12 -12 L -14 -26 L -6 -14" fill={hair} />
            <path d="M -4 -14 L 0 -30 L 4 -14" fill={hair} />
            <path d="M 6 -14 L 14 -26 L 12 -12" fill={hair} />
            <path d="M -15 -10 Q 0 -18 15 -10 Q 12 -4 0 -6 Q -12 -4 -15 -10" fill={hair} />
          </>
        )}
        {a.hairStyle === 'wavy' && (
          <path d="M -16 -12 Q -8 -26 0 -14 Q 8 -26 16 -12 Q 14 4 0 0 Q -14 4 -16 -12" fill={hair} />
        )}
      </g>

      {/* ===== ACCESSORIES ===== */}
      {a.accessory === 'hat' && (
        <g transform={`translate(${cx}, 8)`}>
          <ellipse cx={0} cy={0} rx={20} ry={5} fill={a.accessoryColor} />
          <rect x={-12} y={-12} width={24} height={12} rx={3} fill={a.accessoryColor} />
        </g>
      )}
      {a.accessory === 'cape' && (
        <path d={`M ${cx - 18} 45 Q ${cx} 90 ${cx + 18} 45 L ${cx + 14} 48 Q ${cx} 70 ${cx - 14} 48 Z`}
          fill={a.accessoryColor} opacity={0.7} />
      )}
      {a.accessory === 'necklace' && (
        <circle cx={cx} cy={42} r={3} fill={a.accessoryColor} />
      )}
      {a.accessory === 'bag' && (
        <rect x={cx + 16} y={55} width={12} height={16} rx={2} fill={a.accessoryColor} />
      )}
    </svg>
  );
}
