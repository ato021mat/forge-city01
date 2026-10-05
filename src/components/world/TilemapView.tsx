'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  generateCityMap, TILE_COLORS, TILE_SPRITE_PATH, TILE_SIZE, MAP_W, MAP_H,
  DISTRICT_TILE_POS
} from '@/lib/world/tilemap';
import { CharacterSVG } from '@/components/character/CharacterSVG';
import { CharacterAppearance } from '@/types/character';
import { DISTRICTS } from '@/data/world';

interface Props {
  appearance: CharacterAppearance;
  currentDistrict: string;
  playerLevel: number;
  onSelectDistrict: (id: string) => void;
}

export function TilemapView({ appearance, currentDistrict, playerLevel, onSelectDistrict }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [map] = useState(() => generateCityMap());
  const [spritesLoaded, setSpritesLoaded] = useState(false);
  const spriteCache = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    const paths = [...new Set(Object.values(TILE_SPRITE_PATH))];
    let done = 0;
    const total = paths.length;
    if (total === 0) return;
    paths.forEach(src => {
      const img = new Image();
      img.onload = () => {
        spriteCache.current.set(src, img);
        done++;
        if (done >= total) setSpritesLoaded(true);
      };
      img.onerror = () => {
        done++;
        if (done >= total) setSpritesLoaded(spriteCache.current.size > 0);
      };
      img.src = src;
    });
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    canvas.width = MAP_W * TILE_SIZE;
    canvas.height = MAP_H * TILE_SIZE;

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const t = map[y][x];
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;
        const path = TILE_SPRITE_PATH[t];
        const img = path ? spriteCache.current.get(path) : null;
        if (img) {
          ctx.drawImage(img, px, py, TILE_SIZE, TILE_SIZE);
        } else {
          ctx.fillStyle = TILE_COLORS[t] || '#0a1628';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          if (t === 2 || t === 3 || t === 4) {
            ctx.strokeStyle = 'rgba(250,204,21,0.3)';
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            if (t === 2 || t === 4) {
              ctx.moveTo(px, py + 16); ctx.lineTo(px + 32, py + 16);
            }
            if (t === 3 || t === 4) {
              ctx.moveTo(px + 16, py); ctx.lineTo(px + 16, py + 32);
            }
            ctx.stroke();
            ctx.setLineDash([]);
          }
          if (t === 6 || t === 7) {
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(px + 4, py + 6, 8, 8);
            ctx.fillRect(px + 16, py + 6, 8, 8);
          }
          if (t === 8) {
            ctx.fillStyle = '#15803d';
            ctx.beginPath();
            ctx.arc(px + 16, py + 14, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#78350f';
            ctx.fillRect(px + 14, py + 22, 4, 8);
          }
        }
      }
    }
  }, [map, spritesLoaded]);

  useEffect(() => { draw(); }, [draw]);

  const pos = DISTRICT_TILE_POS[currentDistrict] || { tx: 10, ty: 11 };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/50 bg-[#0a1628]">
      <div className="overflow-auto max-h-[340px] flex justify-center">
        <div className="relative" style={{ width: MAP_W * TILE_SIZE }}>
          <canvas ref={canvasRef} className="block" style={{ imageRendering: 'pixelated', width: '100%' }} />
          {DISTRICTS.map(d => {
            const tp = DISTRICT_TILE_POS[d.id];
            if (!tp) return null;
            const locked = playerLevel < d.unlockLevel;
            const active = d.id === currentDistrict;
            return (
              <button
                key={d.id}
                onClick={() => onSelectDistrict(d.id)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 ${active ? 'scale-110 z-20' : ''} ${locked ? 'opacity-50' : ''}`}
                style={{ left: tp.tx * TILE_SIZE + 16, top: tp.ty * TILE_SIZE + 16 }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border ${
                  active ? 'border-cyan-400 bg-cyan-500/30 shadow-lg shadow-cyan-500/30' :
                  locked ? 'border-slate-600 bg-slate-900/80' : 'border-slate-500 bg-slate-800/90'
                }`}>
                  {locked ? '🔒' : d.icon}
                </div>
              </button>
            );
          })}
          <div
            className="absolute z-20 pointer-events-none transition-all duration-500 -translate-x-1/2"
            style={{ left: pos.tx * TILE_SIZE + 16, top: pos.ty * TILE_SIZE - 20 }}
          >
            <CharacterSVG appearance={appearance} size={36} showShadow={false} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-2 text-[9px] text-slate-500 bg-black/50 px-2 py-0.5 rounded">
        {spritesLoaded ? '✓ اسپرایت پیکسل' : 'تایل procedural — اسپرایت را در public/sprites/tiles بگذار'}
      </div>
    </div>
  );
}
