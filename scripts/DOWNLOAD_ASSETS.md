# دانلود و نصب اسپرایت، صدا و تایل‌مپ

چون لایسنس itch.io اجازه redistributing مستقیم فایل‌ها را نمی‌دهد،
باید خودت رایگان دانلود کنی و در پوشه‌های زیر بگذاری.

## ۱. اسپرایت پیکسل (تایل شهر)

### پیشنهاد اصلی (CC0 – بدون محدودیت)
1. برو به: https://kenney.nl/assets/rpg-urban-pack
2. Download بزن (رایگان)
3. از داخل زیپ، تایل‌های PNG را کپی کن به:
   `public/sprites/tiles/`
4. نام‌های پیشنهادی (یا در `src/lib/world/tilemap.ts` مسیر را عوض کن):
   - grass.png
   - road.png
   - sidewalk.png
   - building_01.png
   - building_02.png
   - tree.png
   - water.png

### جایگزین‌های itch.io
- https://gandalfhardcore.itch.io/free-pixel-art-sidescroller-asset-pack-32x32-city
- https://mariaparragames.itch.io/free-retro-city-assetpack
- https://ranitaya-studios.itch.io/ranitayas-city-essential

## ۲. صدا و موسیقی

### SFX (Kenney – CC0)
1. https://kenney.nl/assets/interface-sounds
2. https://kenney.nl/assets/rpg-audio
3. فایل‌های ogg/wav را در `public/audio/sfx/` بگذار با این نام‌ها:
   - click.ogg
   - confirm.ogg
   - error.ogg
   - success.ogg
   - coin.ogg
   - work_start.ogg (یا rename از یک sfx مناسب)
   - work_done.ogg
   - levelup.ogg

### موسیقی
1. OpenGameArt: https://opengameart.org → جستجو "town music" یا "city loop"
2. فایل را در `public/audio/music/` بگذار:
   - city_theme.ogg
   - work_theme.ogg

اگر فایل نباشد بازی بدون صدا کار می‌کند (خطا نمی‌دهد).

## ۳. تایل‌مپ

سیستم تایل‌مپ از قبل در کد است:
- `src/lib/world/tilemap.ts` → داده نقشه + رنگ fallback
- `src/components/world/TilemapView.tsx` → رندر Canvas

بدون اسپرایت: نقشه procedural رنگی نمایش داده می‌شود.
با اسپرایت: همان نقشه با بافت پیکسلی.

## ۴. کاراکتر

فعلاً کاراکتر با SVG لایه‌ای ساخته می‌شود (CharacterSVG).
اگر اسپرایت شیت کاراکتر از Kenney بگذاری در `public/sprites/characters/`،
بعداً می‌توانی رندر را به اسپرایت سوئیچ کنی.

## چک‌لیست
- [ ] public/sprites/tiles/*.png
- [ ] public/audio/sfx/*.ogg
- [ ] public/audio/music/*.ogg
- [ ] npm run dev و تست نقشه + صدا
