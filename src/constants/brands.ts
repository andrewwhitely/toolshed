import type { BrandName, BrandTheme } from '@/types';

export const BRAND_THEMES: BrandTheme[] = [
  {
    id: 'default',
    name: 'Default',
    tagline: 'Earthy & Neutral',
    color: '#c4621a',
  },
  {
    id: 'dewalt',
    name: 'DeWalt',
    tagline: 'Black & Yellow',
    color: '#FFBE00',
    darkText: true,
  },
  { id: 'milwaukee', name: 'Milwaukee', tagline: 'Fuel Red', color: '#CC0000' },
  { id: 'ryobi', name: 'Ryobi', tagline: 'One+ Green', color: '#6AB023' },
  { id: 'makita', name: 'Makita', tagline: 'Teal Precision', color: '#00AEC7' },
  { id: 'bosch', name: 'Bosch', tagline: 'Deep Blue', color: '#006EAF' },
  { id: 'ridgid', name: 'Ridgid', tagline: 'Trade Orange', color: '#F05500' },
  { id: 'kobalt', name: 'Kobalt', tagline: "Lowe's Blue", color: '#0066CC' },
  {
    id: 'blueprint',
    name: 'Blueprint',
    tagline: 'Drafting Paper',
    color: '#0d6b8a',
  },
];

export const BRAND_COLORS: Record<
  BrandName,
  { bar: string; tag: string; text: string }
> = {
  DeWalt: { bar: '#FFBE00', tag: 'bg-yellow-50', text: 'text-yellow-800' },
  Milwaukee: { bar: '#CC0000', tag: 'bg-red-50', text: 'text-red-900' },
  Ryobi: { bar: '#6AB023', tag: 'bg-green-50', text: 'text-green-800' },
  Makita: { bar: '#00AEC7', tag: 'bg-cyan-50', text: 'text-cyan-800' },
  Bosch: { bar: '#006EAF', tag: 'bg-blue-50', text: 'text-blue-900' },
  Ridgid: { bar: '#F05500', tag: 'bg-orange-50', text: 'text-orange-800' },
  Kobalt: { bar: '#0066CC', tag: 'bg-blue-50', text: 'text-blue-800' },
  Other: { bar: '#888899', tag: 'bg-gray-100', text: 'text-gray-600' },
};

export const TOOL_CATEGORIES = [
  'Power Tools',
  'Hand Tools',
  'Measuring',
  'Cutting',
  'Fastening',
  'Finishing',
  'Outdoor',
  'Safety',
  'Other',
] as const;

export const BRAND_NAMES: BrandName[] = [
  'DeWalt',
  'Milwaukee',
  'Ryobi',
  'Makita',
  'Bosch',
  'Ridgid',
  'Kobalt',
  'Other',
];

export const STATUS_COLORS: Record<string, string> = {
  Complete: '#6AB023',
  'In Progress': '#3d5af1',
  Planned: '#9068d4',
};
