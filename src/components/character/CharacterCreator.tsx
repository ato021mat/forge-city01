'use client';

import { useState } from 'react';
import {
  CharacterAppearance, DEFAULT_APPEARANCE,
  BodyType, SkinTone, HairStyle, HairColor, EyeStyle, EyeColor,
  FaceFeature, FantasyTrait, TopStyle, BottomStyle, ShoeStyle, Accessory,
  SKIN_HEX, HAIR_HEX, EYE_HEX
} from '@/types/character';
import { CharacterSVG } from './CharacterSVG';

interface Props {
  onComplete: (name: string, appearance: CharacterAppearance) => void;
}

const TABS = ['بدن', 'صورت', 'مو', 'لباس', 'فانتزی'] as const;

const COLORS = ['#3b82f6','#ef4444','#22c55e','#eab308','#a855f7','#ec4899','#f97316','#06b6d4','#1e293b','#f8fafc','#78716c','#7c2d12'];

export function CharacterCreator({ onComplete }: Props) {
  const [tab, setTab] = useState(0);
  const [name, setName] = useState('');
  const [app, setApp] = useState<CharacterAppearance>({ ...DEFAULT_APPEARANCE });
  const [pose, setPose] = useState<'idle' | 'walk1' | 'work'>('idle');
  const [err, setErr] = useState('');

  const set = <K extends keyof CharacterAppearance>(key: K, val: CharacterAppearance[K]) => {
    setApp(prev => ({ ...prev, [key]: val }));
  };

  const finish = () => {
    if (name.trim().length < 3) { setErr('نام حداقل ۳ حرف'); return; }
    onComplete(name.trim(), app);
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col md:flex-row">
      {/* Preview Panel */}
      <div className="md:w-2/5 flex flex-col items-center justify-center p-6 relative bg-gradient-to-b from-[#0c1929] to-[#030712] border-b md:border-b-0 md:border-l border-slate-800">
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(34,211,238,0.12), transparent 60%)' }} />
        <p className="text-xs text-slate-500 tracking-widest uppercase mb-2 relative z-10">پیش‌نمایش کاراکتر</p>
        <div className="relative z-10 my-4">
          <CharacterSVG appearance={app} size={200} pose={pose} />
        </div>
        <div className="flex gap-2 relative z-10 mb-4">
          {(['idle', 'walk1', 'work'] as const).map(p => (
            <button key={p} onClick={() => setPose(p)}
              className={`px-3 py-1 rounded-lg text-xs ${pose === p ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {p === 'idle' ? 'ایستاده' : p === 'walk1' ? 'راه رفتن' : 'کار'}
            </button>
          ))}
        </div>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="نام کاراکتر..."
          maxLength={16}
          className="relative z-10 w-48 px-4 py-2 rounded-xl bg-slate-900 border border-slate-600 text-center text-white text-sm focus:border-cyan-400 focus:outline-none"
        />
        {err && <p className="text-amber-400 text-xs mt-2 relative z-10">{err}</p>}
      </div>

      {/* Controls Panel */}
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-800 shrink-0">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`flex-1 py-3 text-xs font-semibold transition ${
                tab === i ? 'text-cyan-300 border-b-2 border-cyan-400 bg-cyan-500/5' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* BODY */}
          {tab === 0 && (
            <>
              <Section title="نوع بدن">
                <OptionRow
                  options={[['slim','لاغر'],['average','معمولی'],['athletic','ورزشی'],['heavy','درشت']]}
                  value={app.bodyType}
                  onChange={v => set('bodyType', v as BodyType)}
                />
              </Section>
              <Section title="رنگ پوست">
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(SKIN_HEX) as SkinTone[]).map(s => (
                    <button key={s} onClick={() => set('skinTone', s)}
                      className={`w-10 h-10 rounded-full border-2 transition ${app.skinTone === s ? 'border-cyan-400 scale-110' : 'border-transparent'}`}
                      style={{ background: SKIN_HEX[s] }}
                    />
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* FACE */}
          {tab === 1 && (
            <>
              <Section title="شکل چشم">
                <OptionRow
                  options={[['round','گرد'],['almond','بادامی'],['sharp','تیز'],['sleepy','خواب‌آلود']]}
                  value={app.eyeStyle}
                  onChange={v => set('eyeStyle', v as EyeStyle)}
                />
              </Section>
              <Section title="رنگ چشم">
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(EYE_HEX) as EyeColor[]).map(c => (
                    <button key={c} onClick={() => set('eyeColor', c)}
                      className={`w-9 h-9 rounded-full border-2 ${app.eyeColor === c ? 'border-cyan-400 scale-110' : 'border-slate-600'}`}
                      style={{ background: EYE_HEX[c] }}
                    />
                  ))}
                </div>
              </Section>
              <Section title="ویژگی صورت">
                <OptionRow
                  options={[['none','هیچ'],['beard','ریش'],['mustache','سبیل'],['scar','زخم'],['freckles','کک‌ومک'],['glasses','عینک']]}
                  value={app.faceFeature}
                  onChange={v => set('faceFeature', v as FaceFeature)}
                />
              </Section>
            </>
          )}

          {/* HAIR */}
          {tab === 2 && (
            <>
              <Section title="مدل مو">
                <OptionRow
                  options={[['bald','تاس'],['short','کوتاه'],['medium','متوسط'],['long','بلند'],['mohawk','موهاوک'],['bun','دستمالی'],['braids','بافت'],['spiky','سیخی'],['wavy','موج‌دار']]}
                  value={app.hairStyle}
                  onChange={v => set('hairStyle', v as HairStyle)}
                />
              </Section>
              <Section title="رنگ مو">
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(HAIR_HEX) as HairColor[]).map(c => (
                    <button key={c} onClick={() => set('hairColor', c)}
                      className={`w-9 h-9 rounded-full border-2 ${app.hairColor === c ? 'border-cyan-400 scale-110' : 'border-slate-600'}`}
                      style={{ background: HAIR_HEX[c] }}
                    />
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* CLOTHES */}
          {tab === 3 && (
            <>
              <Section title="لباس بالا">
                <OptionRow
                  options={[['tank','رکابی'],['tee','تی‌شرت'],['hoodie','هودی'],['jacket','کت'],['armor_light','زره سبک'],['robe','ردا'],['vest','جلیقه']]}
                  value={app.topStyle}
                  onChange={v => set('topStyle', v as TopStyle)}
                />
                <ColorPicker value={app.topColor} onChange={c => set('topColor', c)} />
              </Section>
              <Section title="لباس پایین">
                <OptionRow
                  options={[['shorts','شلوارک'],['jeans','جین'],['cargo','کارگو'],['skirt','دامن'],['armor_legs','زره پا'],['robe_bottom','ردای پایین']]}
                  value={app.bottomStyle}
                  onChange={v => set('bottomStyle', v as BottomStyle)}
                />
                <ColorPicker value={app.bottomColor} onChange={c => set('bottomColor', c)} />
              </Section>
              <Section title="کفش">
                <OptionRow
                  options={[['bare','پابرهنه'],['sneakers','کتانی'],['boots','چکمه'],['sandals','صندل'],['armor_boots','چکمه زرهی']]}
                  value={app.shoeStyle}
                  onChange={v => set('shoeStyle', v as ShoeStyle)}
                />
                <ColorPicker value={app.shoeColor} onChange={c => set('shoeColor', c)} />
              </Section>
              <Section title="اکسسوری">
                <OptionRow
                  options={[['none','هیچ'],['hat','کلاه'],['cape','شنل'],['necklace','گردنبند'],['bag','کیف'],['belt','کمربند'],['gloves','دستکش']]}
                  value={app.accessory}
                  onChange={v => set('accessory', v as Accessory)}
                />
                {app.accessory !== 'none' && <ColorPicker value={app.accessoryColor} onChange={c => set('accessoryColor', c)} />}
              </Section>
            </>
          )}

          {/* FANTASY */}
          {tab === 4 && (
            <Section title="ویژگی فانتزی">
              <OptionRow
                options={[['none','انسان عادی'],['elf_ears','گوش الف'],['horns','شاخ'],['small_wings','بال کوچک'],['tail','دم'],['glow_marks','نشان درخشان']]}
                value={app.fantasyTrait}
                onChange={v => set('fantasyTrait', v as FantasyTrait)}
              />
              <p className="text-xs text-slate-500 mt-3 leading-5">
                ویژگی‌های فانتزی ظاهر کاراکتر را خاص می‌کنند و بعداً می‌توانند بونوس‌های کوچک در شغل‌های مرتبط بدهند.
              </p>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button onClick={finish}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white shadow-lg shadow-cyan-500/25 hover:scale-[1.01] active:scale-[0.99] transition">
            ساخت کاراکتر و ورود به شهر
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">{title}</h3>
      {children}
    </div>
  );
}

function OptionRow({ options, value, onChange }: { options: [string, string][]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(([id, label]) => (
        <button key={id} onClick={() => onChange(id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            value === id ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}>
          {label}
        </button>
      ))}
    </div>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {COLORS.map(c => (
        <button key={c} onClick={() => onChange(c)}
          className={`w-7 h-7 rounded-full border-2 ${value === c ? 'border-white scale-110' : 'border-transparent'}`}
          style={{ background: c }}
        />
      ))}
    </div>
  );
}
