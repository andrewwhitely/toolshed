export type BrandName =
  | 'DeWalt'
  | 'Milwaukee'
  | 'Ryobi'
  | 'Makita'
  | 'Bosch'
  | 'Ridgid'
  | 'Kobalt'
  | 'Other';

export type ThemeId =
  | 'default'
  | 'dewalt'
  | 'milwaukee'
  | 'ryobi'
  | 'makita'
  | 'bosch'
  | 'ridgid'
  | 'kobalt'
  | 'blueprint';

export type ToolCategory =
  | 'Power Tools'
  | 'Hand Tools'
  | 'Measuring'
  | 'Cutting'
  | 'Fastening'
  | 'Finishing'
  | 'Outdoor'
  | 'Safety'
  | 'Other';

export type ProjectType = 'DIY' | 'Paid' | 'Mixed';
export type ProjectStatus = 'Planned' | 'In Progress' | 'Complete';
export type PostType = 'DIY' | 'Paid' | 'Review' | 'Tips';
export type PageId = 'dashboard' | 'tools' | 'projects' | 'blog' | 'settings';

export interface Tool {
  id: number;
  name: string;
  brand: BrandName;
  cat: ToolCategory;
  model?: string;
  notes?: string;
}

export interface Project {
  id: number;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  cost: number;
  time: number;
  tools: string[];
  description: string;
}

export interface Post {
  id: number;
  title: string;
  date: string;
  tags: string[];
  type: PostType;
  cost?: string;
  time?: string;
  toolsUsed?: string;
  materials?: string;
  body: string;
}

export interface Settings {
  theme: ThemeId;
  name: string;
  location: string;
  locationLat?: number;
  locationLon?: number;
  defaultProjectView: 'grid' | 'list';
  currency: string;
}

export interface BrandTheme {
  id: ThemeId;
  name: string;
  tagline: string;
  color: string;
  darkText?: boolean;
}
