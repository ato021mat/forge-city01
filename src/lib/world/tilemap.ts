export const TILE = {
  EMPTY: 0, GRASS: 1, ROAD_H: 2, ROAD_V: 3, ROAD_CROSS: 4,
  SIDEWALK: 5, BUILDING: 6, BUILDING2: 7, TREE: 8, WATER: 9, PLAZA: 10,
} as const;

export const TILE_COLORS: Record<number, string> = {
  0: '#0a1628', 1: '#1a4d2e', 2: '#2d3748', 3: '#2d3748', 4: '#374151',
  5: '#4a5568', 6: '#1e3a5f', 7: '#3b1f4a', 8: '#166534', 9: '#0c4a6e', 10: '#44403c',
};

export const TILE_SPRITE_PATH: Record<number, string> = {
  1: '/sprites/tiles/grass.png',
  2: '/sprites/tiles/road.png',
  3: '/sprites/tiles/road.png',
  4: '/sprites/tiles/road.png',
  5: '/sprites/tiles/sidewalk.png',
  6: '/sprites/tiles/building_01.png',
  7: '/sprites/tiles/building_02.png',
  8: '/sprites/tiles/tree.png',
  9: '/sprites/tiles/water.png',
  10: '/sprites/tiles/sidewalk.png',
};

export const MAP_W = 20;
export const MAP_H = 15;
export const TILE_SIZE = 32;

export function generateCityMap(): number[][] {
  const map: number[][] = [];
  for (let y = 0; y < MAP_H; y++) {
    const row: number[] = [];
    for (let x = 0; x < MAP_W; x++) {
      let t = 1; // grass
      if (y === 11 || y === 5) t = 2;
      if (x === 10 || x === 5) t = 3;
      if ((y === 11 || y === 5) && (x === 10 || x === 5)) t = 4;
      if (y === 10 || y === 12) t = 5;
      if ((x === 9 || x === 11) && y !== 11 && y !== 5) t = 5;
      if (y >= 1 && y <= 3 && x >= 1 && x <= 3) t = 6;
      if (y >= 1 && y <= 3 && x >= 13 && x <= 16) t = 7;
      if (y >= 7 && y <= 9 && x >= 14 && x <= 17) t = 6;
      if (y >= 7 && y <= 8 && x >= 1 && x <= 3) t = 7;
      if (y >= 6 && y <= 8 && x >= 8 && x <= 12) t = 10;
      if ((x === 2 && y === 13) || (x === 17 && y === 13) || (x === 7 && y === 2)) t = 8;
      if (y >= 12 && x >= 16) t = 9;
      row.push(t);
    }
    map.push(row);
  }
  return map;
}

export const DISTRICT_TILE_POS: Record<string, { tx: number; ty: number }> = {
  street: { tx: 10, ty: 11 },
  market: { tx: 3, ty: 5 },
  industrial: { tx: 15, ty: 8 },
  downtown: { tx: 10, ty: 3 },
  underground: { tx: 3, ty: 12 },
};
