'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Job } from '@/types/game';

interface Props {
  job: Job;
  durationMs: number;
  onComplete: (rate: number) => void;
  onCancel: () => void;
}

/* ============================================================
   1. TRASH COLLECTOR – راه برو، زباله بردار، سطل را پر کن
   ============================================================ */
function TrashCollectorGame({ durationMs, onComplete, onCancel }: Props) {
  const [pos, setPos] = useState(50);
  const [trash, setTrash] = useState<{ id: number; x: number; collected: boolean }[]>([]);
  const [bin, setBin] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000);
  const idRef = useRef(0);
  const start = useRef(Date.now());

  useEffect(() => {
    const spawn = setInterval(() => {
      setTrash(t => [...t.filter(x => !x.collected).slice(-6), { id: idRef.current++, x: 10 + Math.random() * 80, collected: false }]);
    }, 900);
    const tick = setInterval(() => {
      const left = Math.max(0, (durationMs - (Date.now() - start.current)) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(spawn); clearInterval(tick);
        onComplete(Math.min(1.5, 0.5 + score * 0.08));
      }
    }, 100);
    return () => { clearInterval(spawn); clearInterval(tick); };
  }, [durationMs, onComplete, score]);

  const move = (dir: number) => setPos(p => Math.max(5, Math.min(95, p + dir * 8)));
  const collect = () => {
    setTrash(prev => {
      const near = prev.find(t => !t.collected && Math.abs(t.x - pos) < 12);
      if (!near) return prev;
      setScore(s => s + 1);
      setBin(b => Math.min(10, b + 1));
      return prev.map(t => t.id === near.id ? { ...t, collected: true } : t);
    });
  };
  const emptyBin = () => { if (bin >= 5) { setScore(s => s + 3); setBin(0); } };

  return (
    <div className="fixed inset-0 z-50 scene-street flex flex-col text-white">
      <div className="flex justify-between items-center px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/5">
        <span>🗑️ جمع‌آوری زباله</span>
        <span className="text-emerald-400">{score} کیسه</span>
        <span>{timeLeft.toFixed(0)}s</span>
        <button onClick={onCancel} className="text-slate-400 text-sm">انصراف</button>
      </div>
      <div className="flex-1 relative overflow-hidden">
        {/* Street */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#2d4a2d]" />
        <div className="absolute bottom-20 left-0 right-0 h-2 bg-[#3d5a3d]" />
        {/* Trash items */}
        {trash.filter(t => !t.collected).map(t => (
          <div key={t.id} className="absolute text-2xl" style={{ left: `${t.x}%`, bottom: '28%' }}>🗑️</div>
        ))}
        {/* Player */}
        <div className="absolute text-4xl transition-all duration-100" style={{ left: `${pos}%`, bottom: '22%', transform: 'translateX(-50%)' }}>🚶</div>
        {/* Bin */}
        <div className="absolute left-4 bottom-28 text-center">
          <div className="text-3xl">🚮</div>
          <div className="text-xs text-emerald-300">{bin}/10</div>
          <button onClick={emptyBin} disabled={bin < 5} className="mt-1 px-2 py-1 bg-emerald-700 rounded text-xs disabled:opacity-40">تخلیه</button>
        </div>
      </div>
      <div className="flex gap-2 p-3 bg-black/50">
        <button onClick={() => move(-1)} className="flex-1 py-4 bg-slate-700 rounded-xl text-xl">◀ چپ</button>
        <button onClick={collect} className="flex-1 py-4 bg-emerald-600 rounded-xl font-bold">بردار</button>
        <button onClick={() => move(1)} className="flex-1 py-4 bg-slate-700 rounded-xl text-xl">راست ▶</button>
      </div>
    </div>
  );
}

/* ============================================================
   2. STREET COURIER – مسیر تحویل، اجتناب از ماشین
   ============================================================ */
function CourierGame({ durationMs, onComplete, onCancel }: Props) {
  const [lane, setLane] = useState(1); // 0 1 2
  const [obstacles, setObstacles] = useState<{ id: number; lane: number; y: number }[]>([]);
  const [packages, setPackages] = useState(0);
  const [distance, setDistance] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000);
  const idRef = useRef(0);
  const start = useRef(Date.now());
  const crashed = useRef(false);

  useEffect(() => {
    const spawn = setInterval(() => {
      if (crashed.current) return;
      setObstacles(o => [...o.filter(x => x.y < 100), { id: idRef.current++, lane: Math.floor(Math.random() * 3), y: -10 }]);
    }, 800);
    const move = setInterval(() => {
      if (crashed.current) return;
      setObstacles(o => o.map(x => ({ ...x, y: x.y + 4 })));
      setDistance(d => d + 1);
      // collision
      setObstacles(o => {
        const hit = o.find(x => x.lane === lane && x.y > 70 && x.y < 90);
        if (hit) { crashed.current = true; }
        return o;
      });
    }, 50);
    const tick = setInterval(() => {
      const left = Math.max(0, (durationMs - (Date.now() - start.current)) / 1000);
      setTimeLeft(left);
      if (left <= 0 || crashed.current) {
        clearInterval(spawn); clearInterval(move); clearInterval(tick);
        const rate = crashed.current ? Math.max(0.4, 0.3 + packages * 0.1) : Math.min(1.5, 0.6 + packages * 0.12 + distance * 0.002);
        onComplete(rate);
      }
    }, 100);
    return () => { clearInterval(spawn); clearInterval(move); clearInterval(tick); };
  }, [durationMs, onComplete, lane, packages, distance]);

  const deliver = () => { if (!crashed.current) setPackages(p => p + 1); };

  return (
    <div className="fixed inset-0 z-50 scene-road flex flex-col text-white">
      <div className="flex justify-between items-center px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/5">
        <span>📦 پیک خیابانی</span>
        <span className="text-cyan-400">{packages} بسته</span>
        <span>{timeLeft.toFixed(0)}s</span>
        <button onClick={onCancel} className="text-slate-400 text-sm">انصراف</button>
      </div>
      <div className="flex-1 relative overflow-hidden">
        {/* Road */}
        <div className="absolute inset-0 flex">
          {[0,1,2].map(l => (
            <div key={l} className={`flex-1 border-x border-dashed border-yellow-600/30 ${lane === l ? 'bg-slate-800/40' : 'bg-slate-900/60'}`} />
          ))}
        </div>
        {/* Obstacles (cars) */}
        {obstacles.map(o => (
          <div key={o.id} className="absolute text-3xl" style={{ left: `${o.lane * 33.3 + 10}%`, top: `${o.y}%` }}>🚗</div>
        ))}
        {/* Player */}
        <div className="absolute text-4xl transition-all" style={{ left: `${lane * 33.3 + 10}%`, bottom: '12%' }}>🛵</div>
        {crashed.current && <div className="absolute inset-0 flex items-center justify-center bg-red-900/60 text-2xl font-bold">تصادف!</div>}
      </div>
      <div className="flex gap-2 p-3 bg-black/50">
        <button onClick={() => setLane(l => Math.max(0, l - 1))} className="flex-1 py-4 bg-slate-700 rounded-xl">◀</button>
        <button onClick={deliver} className="flex-1 py-4 bg-cyan-600 rounded-xl font-bold">تحویل بسته</button>
        <button onClick={() => setLane(l => Math.min(2, l + 1))} className="flex-1 py-4 bg-slate-700 rounded-xl">▶</button>
      </div>
    </div>
  );
}

/* ============================================================
   3. DAY LABORER – ریتم چکش‌زنی / چیدن آجر
   ============================================================ */
function LaborerGame({ durationMs, onComplete, onCancel }: Props) {
  const [beat, setBeat] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000);
  const [flash, setFlash] = useState(false);
  const start = useRef(Date.now());
  const lastHit = useRef(0);

  useEffect(() => {
    const beatInt = setInterval(() => {
      setBeat(b => (b + 1) % 4);
      setFlash(true);
      setTimeout(() => setFlash(false), 150);
    }, 600);
    const tick = setInterval(() => {
      const left = Math.max(0, (durationMs - (Date.now() - start.current)) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(beatInt); clearInterval(tick);
        const total = hits + misses;
        onComplete(total === 0 ? 0.6 : Math.min(1.5, 0.5 + (hits / total) * 1.0));
      }
    }, 100);
    return () => { clearInterval(beatInt); clearInterval(tick); };
  }, [durationMs, onComplete, hits, misses]);

  const hammer = () => {
    const now = Date.now();
    if (now - lastHit.current < 200) return;
    lastHit.current = now;
    // Perfect if near beat 0 or 2 (strong beats)
    if (beat === 0 || beat === 2) setHits(h => h + 1);
    else setMisses(m => m + 1);
  };

  return (
    <div className="fixed inset-0 z-50 scene-construction flex flex-col text-white">
      <div className="flex justify-between items-center px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/5">
        <span>🧱 کارگر ساختمانی</span>
        <span className="text-amber-400">✓{hits} ✗{misses}</span>
        <span>{timeLeft.toFixed(0)}s</span>
        <button onClick={onCancel} className="text-slate-400 text-sm">انصراف</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="text-6xl">{flash ? '💥' : '🧱'}</div>
        <p className="text-slate-400 text-sm">با ریتم چکش بزن (ضرب‌های قوی)</p>
        <div className="flex gap-3">
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-6 h-6 rounded-full transition ${beat === i ? 'bg-amber-400 scale-125' : 'bg-slate-600'}`} />
          ))}
        </div>
        <button onClick={hammer} className="w-40 h-40 rounded-full bg-amber-600 active:bg-amber-500 active:scale-95 text-4xl shadow-lg font-bold">
          🔨
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   4. STREET VENDOR – سفارش مشتری را سریع آماده کن
   ============================================================ */
function VendorGame({ durationMs, onComplete, onCancel }: Props) {
  const items = ['🍎', '🥪', '🥤', '🍪', '🍌'];
  const [order, setOrder] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [served, setServed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000);
  const start = useRef(Date.now());

  const newOrder = useCallback(() => {
    const count = 2 + Math.floor(Math.random() * 3);
    const o = Array.from({ length: count }, () => items[Math.floor(Math.random() * items.length)]);
    setOrder(o);
    setCart([]);
  }, []);

  useEffect(() => {
    newOrder();
    const tick = setInterval(() => {
      const left = Math.max(0, (durationMs - (Date.now() - start.current)) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(tick);
        onComplete(Math.min(1.5, 0.5 + served * 0.15));
      }
    }, 100);
    return () => clearInterval(tick);
  }, [durationMs, onComplete, served, newOrder]);

  const add = (item: string) => {
    const next = [...cart, item];
    setCart(next);
    if (next.length === order.length) {
      const ok = next.every((v, i) => v === order[i]);
      if (ok) setServed(s => s + 1);
      setTimeout(newOrder, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 scene-market flex flex-col text-white">
      <div className="flex justify-between items-center px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/5">
        <span>🛒 دستفروش</span>
        <span className="text-emerald-400">{served} مشتری</span>
        <span>{timeLeft.toFixed(0)}s</span>
        <button onClick={onCancel} className="text-slate-400 text-sm">انصراف</button>
      </div>
      <div className="flex-1 p-4 space-y-6">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-xs text-slate-400 mb-2">سفارش مشتری</div>
          <div className="flex justify-center gap-3 text-4xl">{order.map((o, i) => <span key={i}>{o}</span>)}</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center min-h-[60px]">
          <div className="text-xs text-slate-400 mb-2">سبد شما</div>
          <div className="flex justify-center gap-3 text-3xl">{cart.map((c, i) => <span key={i}>{c}</span>)}</div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {items.map(item => (
            <button key={item} onClick={() => add(item)} className="py-4 bg-slate-700 rounded-xl text-3xl active:scale-95 hover:bg-slate-600">
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   5. BARISTA – مراحل درست کردن قهوه
   ============================================================ */
function BaristaGame({ durationMs, onComplete, onCancel }: Props) {
  const steps = [
    { id: 'grind', label: 'آسیاب کردن', icon: '⚙️', key: 0 },
    { id: 'tamp', label: 'فشردن', icon: '👊', key: 1 },
    { id: 'brew', label: 'دم کردن', icon: '☕', key: 2 },
    { id: 'foam', label: 'فوم شیر', icon: '🥛', key: 3 },
    { id: 'serve', label: 'سرو', icon: '✅', key: 4 },
  ];
  const [current, setCurrent] = useState(0);
  const [cups, setCups] = useState(0);
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000);
  const start = useRef(Date.now());
  const holdRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = setInterval(() => {
      const left = Math.max(0, (durationMs - (Date.now() - start.current)) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(tick);
        onComplete(Math.min(1.5, 0.5 + cups * 0.2));
      }
    }, 100);
    return () => clearInterval(tick);
  }, [durationMs, onComplete, cups]);

  const startHold = () => {
    setHolding(true);
    holdRef.current = window.setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(holdRef.current!);
          setHolding(false);
          if (current === steps.length - 1) {
            setCups(c => c + 1);
            setCurrent(0);
          } else {
            setCurrent(c => c + 1);
          }
          return 0;
        }
        return p + 3;
      });
    }, 40);
  };
  const endHold = () => {
    setHolding(false);
    if (holdRef.current) clearInterval(holdRef.current);
    if (progress < 100) setProgress(0); // must hold full
  };

  return (
    <div className="fixed inset-0 z-50 scene-cafe flex flex-col text-white">
      <div className="flex justify-between items-center px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/5">
        <span>☕ باریستا</span>
        <span className="text-amber-400">{cups} فنجان</span>
        <span>{timeLeft.toFixed(0)}s</span>
        <button onClick={onCancel} className="text-slate-400 text-sm">انصراف</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
        <div className="flex gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${i === current ? 'border-amber-400 bg-amber-500/20 scale-110' : i < current ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-600'}`}>
              {s.icon}
            </div>
          ))}
        </div>
        <div className="text-xl font-bold text-amber-300">{steps[current].label}</div>
        <div className="w-64 h-4 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <button
          onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
          onTouchStart={startHold} onTouchEnd={endHold}
          className={`w-36 h-36 rounded-full font-bold text-lg transition ${holding ? 'bg-amber-500 scale-95' : 'bg-amber-700'}`}
        >
          {holding ? 'نگه دار...' : 'فشار بده'}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   6. MECHANIC – قطعات را به ترتیب درست وصل کن
   ============================================================ */
function MechanicGame({ durationMs, onComplete, onCancel }: Props) {
  const parts = [
    { id: 'battery', label: 'باتری', icon: '🔋' },
    { id: 'spark', label: 'شمع', icon: '⚡' },
    { id: 'filter', label: 'فیلتر', icon: '🔧' },
    { id: 'belt', label: 'تسمه', icon: '⚙️' },
    { id: 'oil', label: 'روغن', icon: '🛢️' },
  ];
  const [order] = useState(() => [...parts].sort(() => Math.random() - 0.5));
  const [assembled, setAssembled] = useState<string[]>([]);
  const [engines, setEngines] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000);
  const start = useRef(Date.now());

  useEffect(() => {
    const tick = setInterval(() => {
      const left = Math.max(0, (durationMs - (Date.now() - start.current)) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(tick);
        onComplete(Math.min(1.5, 0.5 + engines * 0.25));
      }
    }, 100);
    return () => clearInterval(tick);
  }, [durationMs, onComplete, engines]);

  const place = (id: string) => {
    if (assembled.includes(id)) return;
    const nextExpected = order[assembled.length]?.id;
    if (id === nextExpected) {
      const next = [...assembled, id];
      setAssembled(next);
      if (next.length === order.length) {
        setEngines(e => e + 1);
        setAssembled([]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 scene-garage flex flex-col text-white">
      <div className="flex justify-between items-center px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/5">
        <span>🔧 مکانیک</span>
        <span className="text-cyan-400">{engines} موتور</span>
        <span>{timeLeft.toFixed(0)}s</span>
        <button onClick={onCancel} className="text-slate-400 text-sm">انصراف</button>
      </div>
      <div className="flex-1 p-4 space-y-6">
        <div className="text-center text-sm text-slate-400">قطعات را به ترتیب درست وصل کن</div>
        <div className="flex justify-center gap-2 flex-wrap">
          {order.map((p, i) => (
            <div key={p.id} className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border ${assembled.includes(p.id) ? 'border-emerald-400 bg-emerald-500/20' : 'border-slate-600 bg-slate-800'}`}>
              {assembled.includes(p.id) ? '✓' : i + 1}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {parts.map(p => (
            <button
              key={p.id}
              onClick={() => place(p.id)}
              disabled={assembled.includes(p.id)}
              className="py-5 rounded-xl bg-slate-700 text-2xl disabled:opacity-30 active:scale-95"
            >
              {p.icon}<div className="text-xs mt-1">{p.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   7. CHEF – مراحل پخت غذا با زمان‌بندی
   ============================================================ */
function ChefGame({ durationMs, onComplete, onCancel }: Props) {
  const recipe = [
    { id: 'chop', label: 'خرد کردن', icon: '🔪', hold: 40 },
    { id: 'fry', label: 'سرخ کردن', icon: '🍳', hold: 50 },
    { id: 'season', label: 'چاشنی', icon: '🧂', hold: 25 },
    { id: 'plate', label: 'بشقاب‌چینی', icon: '🍽️', hold: 35 },
  ];
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dishes, setDishes] = useState(0);
  const [holding, setHolding] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000);
  const start = useRef(Date.now());
  const holdRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = setInterval(() => {
      const left = Math.max(0, (durationMs - (Date.now() - start.current)) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(tick);
        onComplete(Math.min(1.5, 0.5 + dishes * 0.22));
      }
    }, 100);
    return () => clearInterval(tick);
  }, [durationMs, onComplete, dishes]);

  const startHold = () => {
    setHolding(true);
    const speed = recipe[step].hold;
    holdRef.current = window.setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(holdRef.current!);
          setHolding(false);
          if (step === recipe.length - 1) {
            setDishes(d => d + 1);
            setStep(0);
          } else setStep(s => s + 1);
          return 0;
        }
        return p + (100 / speed);
      });
    }, 50);
  };
  const endHold = () => {
    setHolding(false);
    if (holdRef.current) clearInterval(holdRef.current);
    if (progress < 95) setProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 scene-kitchen flex flex-col text-white">
      <div className="flex justify-between items-center px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/5">
        <span>👨‍🍳 آشپز</span>
        <span className="text-orange-400">{dishes} غذا</span>
        <span>{timeLeft.toFixed(0)}s</span>
        <button onClick={onCancel} className="text-slate-400 text-sm">انصراف</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-5 p-4">
        <div className="flex gap-2">
          {recipe.map((r, i) => (
            <div key={r.id} className={`px-3 py-2 rounded-lg text-sm border ${i === step ? 'border-orange-400 bg-orange-500/20' : i < step ? 'border-emerald-500' : 'border-slate-600'}`}>
              {r.icon} {r.label}
            </div>
          ))}
        </div>
        <div className="text-5xl">{recipe[step].icon}</div>
        <div className="text-lg font-bold text-orange-300">{recipe[step].label}</div>
        <div className="w-56 h-3 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <button
          onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
          onTouchStart={startHold} onTouchEnd={endHold}
          className={`w-32 h-32 rounded-full font-bold transition ${holding ? 'bg-orange-500 scale-95' : 'bg-orange-700'}`}
        >
          {holding ? '...' : 'انجام'}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   8. TRADER – بخر ارزان، بفروش گران
   ============================================================ */
function TraderGame({ durationMs, onComplete, onCancel }: Props) {
  const [price, setPrice] = useState(100);
  const [holding, setHolding] = useState(0);
  const [cash, setCash] = useState(200);
  const [profit, setProfit] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000);
  const start = useRef(Date.now());
  const history = useRef<number[]>([100]);

  useEffect(() => {
    const priceTick = setInterval(() => {
      setPrice(p => {
        const change = (Math.random() - 0.48) * 12;
        const next = Math.max(40, Math.min(200, p + change));
        history.current = [...history.current.slice(-20), next];
        return next;
      });
    }, 400);
    const tick = setInterval(() => {
      const left = Math.max(0, (durationMs - (Date.now() - start.current)) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(priceTick); clearInterval(tick);
        const final = cash + holding * price;
        onComplete(Math.min(1.5, 0.5 + Math.max(0, final - 200) / 150));
      }
    }, 100);
    return () => { clearInterval(priceTick); clearInterval(tick); };
  }, [durationMs, onComplete, cash, holding, price]);

  const buy = () => {
    if (cash >= price) {
      setCash(c => c - price);
      setHolding(h => h + 1);
    }
  };
  const sell = () => {
    if (holding > 0) {
      setCash(c => c + price);
      setHolding(h => h - 1);
      setProfit(p => p + (price - 100));
    }
  };

  return (
    <div className="fixed inset-0 z-50 scene-office flex flex-col text-white">
      <div className="flex justify-between items-center px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/5">
        <span>📈 تریدر</span>
        <span className="text-emerald-400">سود: {profit > 0 ? '+' : ''}{profit.toFixed(0)}</span>
        <span>{timeLeft.toFixed(0)}s</span>
        <button onClick={onCancel} className="text-slate-400 text-sm">انصراف</button>
      </div>
      <div className="flex-1 p-4 space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-cyan-300">{price.toFixed(0)}</div>
          <div className="text-xs text-slate-400">قیمت فعلی</div>
        </div>
        {/* Mini chart */}
        <div className="h-16 flex items-end gap-0.5 justify-center">
          {history.current.slice(-15).map((v, i) => (
            <div key={i} className="w-3 bg-cyan-500/60 rounded-t" style={{ height: `${(v / 200) * 100}%` }} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 text-center text-sm">
          <div className="glass rounded-xl p-3">نقد: <span className="text-emerald-400 font-bold">{cash.toFixed(0)}</span></div>
          <div className="glass rounded-xl p-3">دارایی: <span className="text-amber-400 font-bold">{holding}</span></div>
        </div>
        <div className="flex gap-3">
          <button onClick={buy} className="flex-1 py-5 bg-emerald-600 rounded-2xl font-bold text-lg active:scale-95">خرید</button>
          <button onClick={sell} className="flex-1 py-5 bg-red-600 rounded-2xl font-bold text-lg active:scale-95">فروش</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   9. SOFTWARE DEV – باگ را پیدا و درست کن
   ============================================================ */
function DevGame({ durationMs, onComplete, onCancel }: Props) {
  const bugs = [
    { code: 'const x = 10\nconsole.log(x)', wrong: 'const x = 10\nconsole.log(y)', fix: 'y → x' },
    { code: 'if (a > b) return a', wrong: 'if (a > b) return b', fix: 'return a' },
    { code: 'arr.map(n => n * 2)', wrong: 'arr.map(n => n + 2)', fix: '* 2' },
    { code: 'user?.name ?? "guest"', wrong: 'user.name ?? "guest"', fix: '?.' },
  ];
  const [idx, setIdx] = useState(0);
  const [fixed, setFixed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000);
  const start = useRef(Date.now());
  const current = bugs[idx % bugs.length];

  useEffect(() => {
    const tick = setInterval(() => {
      const left = Math.max(0, (durationMs - (Date.now() - start.current)) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(tick);
        onComplete(Math.min(1.5, 0.5 + fixed * 0.2));
      }
    }, 100);
    return () => clearInterval(tick);
  }, [durationMs, onComplete, fixed]);

  const choose = (correct: boolean) => {
    if (correct) {
      setFixed(f => f + 1);
      setIdx(i => i + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 scene-office flex flex-col text-white font-mono">
      <div className="flex justify-between items-center px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/5 font-sans">
        <span>💻 برنامه‌نویس</span>
        <span className="text-emerald-400">{fixed} باگ</span>
        <span>{timeLeft.toFixed(0)}s</span>
        <button onClick={onCancel} className="text-slate-400 text-sm font-sans">انصراف</button>
      </div>
      <div className="flex-1 p-4 space-y-4">
        <div className="text-sm text-slate-400">کد خراب را پیدا کن و نسخه درست را انتخاب کن</div>
        <div className="glass rounded-xl p-4 text-red-300 text-sm whitespace-pre-wrap border border-red-500/30">
          {current.wrong}
        </div>
        <div className="text-xs text-slate-500">کدام نسخه درست است؟</div>
        <button onClick={() => choose(true)} className="w-full glass rounded-xl p-4 text-left text-emerald-300 text-sm whitespace-pre-wrap border border-emerald-500/20 hover:border-emerald-400 active:scale-[0.98]">
          {current.code}
        </button>
        <button onClick={() => choose(false)} className="w-full glass rounded-xl p-4 text-left text-slate-400 text-sm whitespace-pre-wrap border border-slate-600 hover:border-slate-400 active:scale-[0.98]">
          {current.wrong.replace(current.fix.split('→')[0]?.trim() || '', '???')}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   10. TAXI / SHOP CLERK / MANAGER – مدیریت ساده
   ============================================================ */
function ServiceGame({ job, durationMs, onComplete, onCancel }: Props) {
  const [requests, setRequests] = useState<{ id: number; text: string; type: string }[]>([]);
  const [handled, setHandled] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000);
  const idRef = useRef(0);
  const start = useRef(Date.now());

  const pool = job.id === 'taxi_driver'
    ? ['مسافر شمال', 'مسافر فرودگاه', 'مسافر مرکز', 'مسافر بیمارستان']
    : job.id === 'restaurant_manager'
    ? ['میز ۲ منتظر', 'آشپزخانه شلوغ', 'شکایت مشتری', 'سفارش ویژه']
    : ['مشتری صف', 'برگشت کالا', 'سوال قیمت', 'پرداخت کارت'];

  useEffect(() => {
    const spawn = setInterval(() => {
      setRequests(r => [...r.slice(-3), { id: idRef.current++, text: pool[Math.floor(Math.random() * pool.length)], type: 'req' }]);
    }, 1200);
    const tick = setInterval(() => {
      const left = Math.max(0, (durationMs - (Date.now() - start.current)) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(spawn); clearInterval(tick);
        onComplete(Math.min(1.5, 0.5 + handled * 0.12));
      }
    }, 100);
    return () => { clearInterval(spawn); clearInterval(tick); };
  }, [durationMs, onComplete, handled]);

  const handle = (id: number) => {
    setRequests(r => r.filter(x => x.id !== id));
    setHandled(h => h + 1);
  };

  return (
    <div className="fixed inset-0 z-50 scene-shop flex flex-col text-white">
      <div className="flex justify-between items-center px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/5">
        <span>{job.icon} {job.nameFa}</span>
        <span className="text-cyan-400">{handled} رسیدگی</span>
        <span>{timeLeft.toFixed(0)}s</span>
        <button onClick={onCancel} className="text-slate-400 text-sm">انصراف</button>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {requests.length === 0 && <div className="text-center text-slate-500 mt-20">منتظر درخواست...</div>}
        {requests.map(r => (
          <div key={r.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm">{r.text}</span>
            <button onClick={() => handle(r.id)} className="px-4 py-2 bg-cyan-600 rounded-lg text-sm font-bold active:scale-95">
              رسیدگی
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   ROUTER – انتخاب مینی‌گیم بر اساس شغل
   ============================================================ */
export function RealisticJobGame({ job, durationMs, onComplete, onCancel }: Props) {
  switch (job.id) {
    case 'trash_collect':
      return <TrashCollectorGame job={job} durationMs={durationMs} onComplete={onComplete} onCancel={onCancel} />;
    case 'street_courier':
      return <CourierGame job={job} durationMs={durationMs} onComplete={onComplete} onCancel={onCancel} />;
    case 'day_laborer':
      return <LaborerGame job={job} durationMs={durationMs} onComplete={onComplete} onCancel={onCancel} />;
    case 'street_vendor':
      return <VendorGame job={job} durationMs={durationMs} onComplete={onComplete} onCancel={onCancel} />;
    case 'barista':
      return <BaristaGame job={job} durationMs={durationMs} onComplete={onComplete} onCancel={onCancel} />;
    case 'mechanic':
      return <MechanicGame job={job} durationMs={durationMs} onComplete={onComplete} onCancel={onCancel} />;
    case 'chef':
      return <ChefGame job={job} durationMs={durationMs} onComplete={onComplete} onCancel={onCancel} />;
    case 'trader':
      return <TraderGame job={job} durationMs={durationMs} onComplete={onComplete} onCancel={onCancel} />;
    case 'software_dev':
      return <DevGame job={job} durationMs={durationMs} onComplete={onComplete} onCancel={onCancel} />;
    case 'taxi_driver':
    case 'shop_clerk':
    case 'restaurant_manager':
      return <ServiceGame job={job} durationMs={durationMs} onComplete={onComplete} onCancel={onCancel} />;
    default:
      return <VendorGame job={job} durationMs={durationMs} onComplete={onComplete} onCancel={onCancel} />;
  }
}
