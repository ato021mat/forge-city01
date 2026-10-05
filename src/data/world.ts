export interface District {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  color: string;
  jobs: string[];
  unlockLevel: number;
  icon: string;
  x: number; // position on city map 0-100
  y: number;
}

export const DISTRICTS: District[] = [
  {
    id: 'street',
    name: 'Street Level',
    nameFa: 'خیابان اصلی',
    description: 'جایی که همه از صفر شروع می‌کنند. گیگ‌های ساده اینجا هستند.',
    color: '#22c55e',
    jobs: ['trash_collect', 'street_courier', 'day_laborer', 'street_vendor'],
    unlockLevel: 0,
    icon: '🛣️',
    x: 50, y: 75,
  },
  {
    id: 'market',
    name: 'Market District',
    nameFa: 'منطقه بازار',
    description: 'فروشگاه‌ها، دستفروش‌ها و کافه‌ها.',
    color: '#f59e0b',
    jobs: ['barista', 'shop_clerk', 'street_vendor'],
    unlockLevel: 2,
    icon: '🏪',
    x: 25, y: 45,
  },
  {
    id: 'industrial',
    name: 'Industrial Zone',
    nameFa: 'منطقه صنعتی',
    description: 'گاراژها و کارگاه‌های ساختمانی.',
    color: '#78716c',
    jobs: ['mechanic', 'day_laborer'],
    unlockLevel: 3,
    icon: '🏭',
    x: 75, y: 50,
  },
  {
    id: 'downtown',
    name: 'Downtown',
    nameFa: 'مرکز شهر',
    description: 'رستوران‌ها، دفاتر و شغل‌های تخصصی.',
    color: '#3b82f6',
    jobs: ['chef', 'software_dev', 'taxi_driver', 'restaurant_manager'],
    unlockLevel: 5,
    icon: '🏙️',
    x: 50, y: 25,
  },
  {
    id: 'underground',
    name: 'Underground',
    nameFa: 'بازار زیرزمینی',
    description: 'ترید و معاملات خاص.',
    color: '#a855f7',
    jobs: ['trader'],
    unlockLevel: 4,
    icon: '🌑',
    x: 20, y: 70,
  },
];
