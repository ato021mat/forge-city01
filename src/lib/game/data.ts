export interface JobDef {
  id: string;
  name: string;
  nameFa: string;
  descriptionFa: string;
  requiredSkill: 'physical' | 'service' | 'tech' | 'business';
  minSkillLevel: number;
  baseReward: number;
  baseXp: number;
  durationSeconds: number;
  energyCost: number;
  category: string;
  unlockLevel: number;
  district: string;
  icon: string;
  color: string;
}

export const JOBS: JobDef[] = [
  { id:'trash_collect', name:'Trash Collector', nameFa:'جمع‌آوری زباله', descriptionFa:'در خیابان راه برو و زباله جمع کن', requiredSkill:'physical', minSkillLevel:0, baseReward:14, baseXp:9, durationSeconds:45, energyCost:7, category:'gig', unlockLevel:0, district:'street', icon:'🗑️', color:'#64748b' },
  { id:'street_courier', name:'Courier', nameFa:'پیک خیابانی', descriptionFa:'بسته را بین خطوط جاده تحویل بده', requiredSkill:'physical', minSkillLevel:0, baseReward:20, baseXp:11, durationSeconds:55, energyCost:10, category:'gig', unlockLevel:0, district:'street', icon:'📦', color:'#78716c' },
  { id:'day_laborer', name:'Laborer', nameFa:'کارگر ساختمانی', descriptionFa:'با ریتم چکش بزن و آجر بچین', requiredSkill:'physical', minSkillLevel:1, baseReward:32, baseXp:16, durationSeconds:70, energyCost:16, category:'gig', unlockLevel:0, district:'industrial', icon:'🧱', color:'#a8a29e' },
  { id:'street_vendor', name:'Vendor', nameFa:'دستفروش', descriptionFa:'سفارش مشتری را درست آماده کن', requiredSkill:'service', minSkillLevel:0, baseReward:17, baseXp:10, durationSeconds:50, energyCost:6, category:'gig', unlockLevel:0, district:'market', icon:'🛒', color:'#f59e0b' },
  { id:'barista', name:'Barista', nameFa:'باریستا', descriptionFa:'مراحل درست کردن قهوه را انجام بده', requiredSkill:'service', minSkillLevel:2, baseReward:48, baseXp:22, durationSeconds:70, energyCost:9, category:'skilled', unlockLevel:2, district:'market', icon:'☕', color:'#92400e' },
  { id:'shop_clerk', name:'Clerk', nameFa:'فروشنده', descriptionFa:'به درخواست مشتری‌ها رسیدگی کن', requiredSkill:'service', minSkillLevel:2, baseReward:42, baseXp:19, durationSeconds:60, energyCost:8, category:'skilled', unlockLevel:2, district:'market', icon:'🏪', color:'#0369a1' },
  { id:'taxi_driver', name:'Taxi', nameFa:'راننده تاکسی', descriptionFa:'مسافرها را جابجا کن', requiredSkill:'service', minSkillLevel:3, baseReward:62, baseXp:28, durationSeconds:80, energyCost:14, category:'skilled', unlockLevel:3, district:'downtown', icon:'🚕', color:'#eab308' },
  { id:'mechanic', name:'Mechanic', nameFa:'مکانیک', descriptionFa:'قطعات را به ترتیب درست وصل کن', requiredSkill:'tech', minSkillLevel:3, baseReward:72, baseXp:32, durationSeconds:90, energyCost:18, category:'skilled', unlockLevel:3, district:'industrial', icon:'🔧', color:'#475569' },
  { id:'chef', name:'Chef', nameFa:'آشپز', descriptionFa:'مراحل پخت غذا را با زمان‌بندی انجام بده', requiredSkill:'service', minSkillLevel:5, baseReward:105, baseXp:45, durationSeconds:100, energyCost:20, category:'specialist', unlockLevel:5, district:'downtown', icon:'👨‍🍳', color:'#dc2626' },
  { id:'trader', name:'Trader', nameFa:'تریدر', descriptionFa:'بخر ارزان، بفروش گران', requiredSkill:'business', minSkillLevel:4, baseReward:88, baseXp:38, durationSeconds:75, energyCost:11, category:'specialist', unlockLevel:4, district:'underground', icon:'📈', color:'#16a34a' },
  { id:'software_dev', name:'Developer', nameFa:'برنامه‌نویس', descriptionFa:'باگ کد را پیدا و درست کن', requiredSkill:'tech', minSkillLevel:5, baseReward:135, baseXp:55, durationSeconds:100, energyCost:24, category:'specialist', unlockLevel:5, district:'downtown', icon:'💻', color:'#7c3aed' },
  { id:'restaurant_manager', name:'Manager', nameFa:'مدیر رستوران', descriptionFa:'درخواست‌های رستوران را مدیریت کن', requiredSkill:'business', minSkillLevel:6, baseReward:165, baseXp:65, durationSeconds:110, energyCost:16, category:'management', unlockLevel:6, district:'downtown', icon:'🍽️', color:'#be185d' },
];

export const TOOLS = [
  { id:'gloves', nameFa:'دستکش کار', price:40, incomeBonus:0.05, speedBonus:0, energyBonus:0, rarity:'common', icon:'🧤' },
  { id:'bike', nameFa:'دوچرخه', price:160, incomeBonus:0.08, speedBonus:0.2, energyBonus:5, rarity:'common', icon:'🚲' },
  { id:'toolbox', nameFa:'جعبه ابزار', price:210, incomeBonus:0.12, speedBonus:0, energyBonus:0, rarity:'uncommon', icon:'🧰' },
  { id:'scooter', nameFa:'اسکوتر', price:420, incomeBonus:0.14, speedBonus:0.35, energyBonus:8, rarity:'uncommon', icon:'🛴' },
  { id:'laptop', nameFa:'لپ‌تاپ', price:580, incomeBonus:0.22, speedBonus:0, energyBonus:0, rarity:'rare', icon:'💻' },
  { id:'motorbike', nameFa:'موتور', price:1150, incomeBonus:0.28, speedBonus:0.5, energyBonus:12, rarity:'rare', icon:'🏍️' },
];
