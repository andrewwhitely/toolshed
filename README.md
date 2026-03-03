# ToolShed.fyi

A homeowner's one-stop shop — tool tracker, project planner, and markdown blog.

## Stack

- **React 18** + **TypeScript** — component-driven UI with full type safety
- **Vite** — instant HMR dev server, fast production builds
- **Tailwind CSS v3** — utility-first styling with CSS variable theming
- **localStorage** — zero-backend persistence, export JSON anytime

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

The `dist/` folder is a static site — drag it into [Netlify Drop](https://app.netlify.com/drop) and you're live in 30 seconds.

## Project Structure

```
src/
├── components/
│   ├── ui/           # Button, Modal, Input, Pill, PageHeader, FormGroup
│   ├── tools/        # ToolCard, AddToolCard, AddToolModal
│   ├── projects/     # ProjectCard, AddProjectModal
│   ├── blog/         # PostCard, PostDetail, MarkdownEditor
│   ├── settings/     # BrandPicker
│   ├── dashboard/    # StatCard
│   └── layout/       # Topbar, Sidebar
├── pages/            # DashboardPage, ToolsPage, ProjectsPage, BlogPage, SettingsPage
├── store/            # useStore (localStorage), StoreContext, data (seed data)
├── hooks/            # useTheme
├── constants/        # brands.ts (colors, themes, categories)
├── types/            # index.ts (all shared TypeScript types)
├── App.tsx
├── main.tsx
└── index.css         # CSS variables per brand theme + markdown styles
```

## Features

### Tools
- Track tools by name, brand, category, model, and notes
- Brand color-coded bars (DeWalt yellow, Milwaukee red, Ryobi green, etc.)
- Filter by brand or category
- Click "N projects" on any tool to jump to linked projects

### Projects
- Track status (Planned / In Progress / Complete), cost, time, and tools needed
- **⚡ Can Do Now** filter — automatically shows projects where you own all required tools
- Tool chips on each card show owned (accent) vs. missing (gray)
- Grid and list view

### Blog
- Write posts in **Markdown** with a live split-pane editor
- Attach structured metadata: cost, time, tools used, materials
- Tag system with sidebar filtering

### Settings
- **Brand Theme picker** — 8 themes (Default, DeWalt, Milwaukee, Ryobi, Makita, Bosch, Ridgid, Kobalt)
  - Each theme changes the grid tint, accent color, and sidebar/topbar mood
  - DeWalt goes full black topbar with yellow accents
- Set your name (updates dashboard greeting)
- Export data as JSON / clear all data

## When you're ready to add a backend

The store in `src/store/useStore.ts` is the only place data is read/written.
Swap `localStorage.getItem/setItem` calls for `fetch()` calls to your API
(Supabase, PlanetScale, or a simple Express endpoint) and you're done.
