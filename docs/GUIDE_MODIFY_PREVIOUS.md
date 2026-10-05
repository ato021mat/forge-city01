# راهنمای اصلاح روی نسخه قبلی – رسیدن به v2.1

اگر نسخه v1.x یا v2.0 داری و نمی‌خواهی از صفر شروع کنی.

---

## الف) از v2.0 به v2.1

### فایل‌های جدید (حتماً اضافه کن)
```
src/lib/assets/manifest.ts
src/lib/audio/AudioManager.ts
src/lib/world/tilemap.ts
src/components/world/TilemapView.tsx
scripts/DOWNLOAD_ASSETS.md
public/sprites/tiles/   (خالی – بعداً پر کن)
public/audio/sfx/
public/audio/music/
```

### فایل‌هایی که باید عوض شوند
1. **src/app/page.tsx**
   - `CityMap` را با `TilemapView` عوض کن
   - `AudioManager` را import و init کن
   - روی startJob صدای work_start بزن

2. **package.json**
   - مطمئن شو `howler` در dependencies هست:
   ```json
   "howler": "^2.2.4"
   ```
   بعد: `npm install`

### کاراکتر و store
از v2.0 بدون تغییر می‌مانند. دیتای `forge-city-v2` در localStorage سازگار است.

### اسپرایت و صدا
طبق `scripts/DOWNLOAD_ASSETS.md` دانلود و در public بگذار.

---

## ب) از v1.x (بدون سیستم کاراکتر) به v2.1

نسخه ۲ بازنویسی مفهومی است (کاراکترمحور). پیشنهاد:

1. پوشه v2.1 را کامل بردار و از آن استفاده کن.
2. فقط مینی‌گیم‌ها را اگر سفارشی کرده‌ای از:
   `src/components/jobs/RealisticJobs.tsx`
   نگه دار / جایگزین کن.
3. دیتای بازیکن v1 در localStorage با کلیدهای قدیمی است و به v2 منتقل نمی‌شود.
   کاربران باید کاراکتر جدید بسازند.

اگر حتماً باید Credits قدیمی منتقل شود:
```js
// یک بار در کنسول مرورگر یا در init
const old = localStorage.getItem('forge-city-v1.2'); // یا کلید نسخه قبلی
// پارس کن و credits را روی character.stats.credits جدید بنویس
```

---

## ج) ترتیب امن آپدیت

1. از پروژه فعلی backup بگیر (کپی پوشه + export localStorage).
2. فایل‌های جدید v2.1 را کپی کن.
3. `npm install`
4. `npm run dev` و تست ساخت کاراکتر + نقشه.
5. اسپرایت و صدا را اضافه کن.
6. وقتی پایدار شد، دیپلوی.

---

## د) چک‌لیست بعد از مهاجرت

- [ ] ساخت کاراکتر کار می‌کند و در پروفایل دیده می‌شود
- [ ] نقشه تایل‌مپ نمایش داده می‌شود (حتی بدون اسپرایت)
- [ ] کلیک روی منطقه، منطقه را عوض می‌کند
- [ ] شغل‌ها باز می‌شوند و مینی‌گیم اجرا می‌شود
- [ ] بعد از گذاشتن فایل صدا، کلیک/شغل صدا دارد
- [ ] بعد از گذاشتن تایل PNG، بافت پیکسلی روی نقشه می‌آید
