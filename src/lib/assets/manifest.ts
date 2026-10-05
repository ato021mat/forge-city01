/**
 * Forge City Asset Manifest
 * اسپرایت‌ها و صداهای رایگان پیشنهادی از itch.io
 * بعد از دانلود، فایل‌ها را در public/ قرار بده
 */

export const SPRITE_PACKS = [
  {
    id: 'kenney_rpg',
    name: 'Kenney RPG Urban Pack',
    url: 'https://kenney.nl/assets/rpg-urban-pack',
    license: 'CC0',
    placeIn: 'public/sprites/tiles/',
    description: 'ساختمان، خیابان، مبلمان شهری – کاملاً رایگان',
  },
  {
    id: 'kenney_characters',
    name: 'Kenney New Platformer Pack (characters)',
    url: 'https://kenney.nl/assets/new-platformer-pack',
    license: 'CC0',
    placeIn: 'public/sprites/characters/',
    description: 'کاراکتر پیکسلی پایه',
  },
  {
    id: 'itch_modern_city',
    name: 'FREE Pixel Art Sidescroller Modern City',
    url: 'https://gandalfhardcore.itch.io/free-pixel-art-sidescroller-asset-pack-32x32-city',
    license: 'itch free',
    placeIn: 'public/sprites/tiles/',
    description: 'تایل‌های شهر مدرن ۳۲×۳۲',
  },
  {
    id: 'itch_retro_city',
    name: 'Free Retro City Asset Pack',
    url: 'https://mariaparragames.itch.io/free-retro-city-assetpack',
    license: 'Commercial OK',
    placeIn: 'public/sprites/tiles/',
    description: 'شهر رترو پیکسلی',
  },
  {
    id: 'itch_city_essential',
    name: "Ranitaya's 50+ City Essential Assets",
    url: 'https://ranitaya-studios.itch.io/ranitayas-city-essential',
    license: 'Royalty-free',
    placeIn: 'public/sprites/tiles/',
    description: 'ساختمان و جزئیات شهری',
  },
  {
    id: 'kenney_ui',
    name: 'Kenney UI Pack',
    url: 'https://kenney.nl/assets/ui-pack',
    license: 'CC0',
    placeIn: 'public/sprites/ui/',
    description: 'دکمه و پنل UI',
  },
];

export const AUDIO_PACKS = [
  {
    id: 'kenney_interface',
    name: 'Kenney Interface Sounds',
    url: 'https://kenney.nl/assets/interface-sounds',
    license: 'CC0',
    placeIn: 'public/audio/sfx/',
    files: ['click', 'confirm', 'error', 'success'],
  },
  {
    id: 'kenney_rpg_audio',
    name: 'Kenney RPG Audio',
    url: 'https://kenney.nl/assets/rpg-audio',
    license: 'CC0',
    placeIn: 'public/audio/sfx/',
    files: ['coin', 'work', 'levelup'],
  },
  {
    id: 'opengameart_music',
    name: 'OpenGameArt casual town music',
    url: 'https://opengameart.org/art-search-advanced?keys=town+music&field_art_type_tid%5B%5D=12',
    license: 'Various CC',
    placeIn: 'public/audio/music/',
    files: ['city_theme', 'work_theme'],
  },
];

/** مسیرهای مورد انتظار داخل پروژه بعد از قرار دادن فایل‌ها */
export const ASSET_PATHS = {
  tiles: {
    grass: '/sprites/tiles/grass.png',
    road: '/sprites/tiles/road.png',
    sidewalk: '/sprites/tiles/sidewalk.png',
    building1: '/sprites/tiles/building_01.png',
    building2: '/sprites/tiles/building_02.png',
    tree: '/sprites/tiles/tree.png',
    water: '/sprites/tiles/water.png',
  },
  characters: {
    base: '/sprites/characters/base.png',
  },
  sfx: {
    click: '/audio/sfx/click.ogg',
    confirm: '/audio/sfx/confirm.ogg',
    error: '/audio/sfx/error.ogg',
    success: '/audio/sfx/success.ogg',
    coin: '/audio/sfx/coin.ogg',
    work_start: '/audio/sfx/work_start.ogg',
    work_done: '/audio/sfx/work_done.ogg',
    levelup: '/audio/sfx/levelup.ogg',
  },
  music: {
    city: '/audio/music/city_theme.ogg',
    work: '/audio/music/work_theme.ogg',
  },
};

export const TILE_SIZE = 32;
