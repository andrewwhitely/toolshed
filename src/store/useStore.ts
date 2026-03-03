import type { Post, Project, Settings, Tool } from '@/types';
import { useCallback, useState } from 'react';
import { defaultPosts, defaultProjects, defaultTools } from './data';

const LS_DATA = 'toolshed-data';
const LS_SETTINGS = 'toolshed-settings';

function loadData() {
  try {
    const raw = localStorage.getItem(LS_DATA);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    return raw ? JSON.parse(raw) : defaultSettings();
  } catch {
    return defaultSettings();
  }
}

function defaultSettings(): Settings {
  return {
    theme: 'default',
    name: '',
    location: '',
    defaultProjectView: 'grid',
    currency: '$',
  };
}

interface AppData {
  tools: Tool[];
  projects: Project[];
  posts: Post[];
  nextId: number;
}

function initialData(): AppData {
  const saved = loadData();
  return (
    saved ?? {
      tools: defaultTools,
      projects: defaultProjects,
      posts: defaultPosts,
      nextId: 20,
    }
  );
}

export function useStore() {
  const [data, setData] = useState<AppData>(initialData);
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const persistData = useCallback((next: AppData) => {
    setData(next);
    localStorage.setItem(LS_DATA, JSON.stringify(next));
  }, []);

  const persistSettings = useCallback((next: Settings) => {
    setSettings(next);
    localStorage.setItem(LS_SETTINGS, JSON.stringify(next));
    document.body.setAttribute(
      'data-theme',
      next.theme === 'default' ? '' : next.theme,
    );
  }, []);

  // ── Tools ──
  const addTool = useCallback(
    (t: Omit<Tool, 'id'>) => {
      persistData({
        ...data,
        tools: [...data.tools, { ...t, id: data.nextId }],
        nextId: data.nextId + 1,
      });
    },
    [data, persistData],
  );

  const updateTool = useCallback(
    (id: number, t: Omit<Tool, 'id'>) => {
      persistData({
        ...data,
        tools: data.tools.map((tool) =>
          tool.id === id ? { ...tool, ...t } : tool,
        ),
      });
    },
    [data, persistData],
  );

  const deleteTool = useCallback(
    (id: number) => {
      persistData({ ...data, tools: data.tools.filter((t) => t.id !== id) });
    },
    [data, persistData],
  );

  // ── Projects ──
  const addProject = useCallback(
    (p: Omit<Project, 'id'>) => {
      persistData({
        ...data,
        projects: [...data.projects, { ...p, id: data.nextId }],
        nextId: data.nextId + 1,
      });
    },
    [data, persistData],
  );

  const updateProject = useCallback(
    (id: number, p: Omit<Project, 'id'>) => {
      persistData({
        ...data,
        projects: data.projects.map((proj) =>
          proj.id === id ? { ...proj, ...p } : proj,
        ),
      });
    },
    [data, persistData],
  );

  const deleteProject = useCallback(
    (id: number) => {
      persistData({
        ...data,
        projects: data.projects.filter((p) => p.id !== id),
      });
    },
    [data, persistData],
  );

  // ── Posts ──
  const addPost = useCallback(
    (p: Omit<Post, 'id' | 'date'>) => {
      const date = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      persistData({
        ...data,
        posts: [{ ...p, id: data.nextId, date }, ...data.posts],
        nextId: data.nextId + 1,
      });
    },
    [data, persistData],
  );

  const updatePost = useCallback(
    (id: number, p: Omit<Post, 'id' | 'date'>) => {
      persistData({
        ...data,
        posts: data.posts.map((post) =>
          post.id === id ? { ...post, ...p } : post,
        ),
      });
    },
    [data, persistData],
  );

  const deletePost = useCallback(
    (id: number) => {
      persistData({ ...data, posts: data.posts.filter((p) => p.id !== id) });
    },
    [data, persistData],
  );

  // ── Settings ──
  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      persistSettings({ ...settings, ...patch });
    },
    [settings, persistSettings],
  );

  // ── Helpers ──
  const isDoable = useCallback(
    (project: Project): boolean => {
      if (!project.tools?.length) return true;
      const requiredTools = Math.floor(project.tools.length / 2) + 1;
      const availableTools = project.tools.filter((needed) =>
        data.tools.some((t) =>
          t.name.toLowerCase().includes(needed.toLowerCase().split(' ')[0]),
        ),
      ).length;
      return availableTools >= requiredTools;
    },
    [data.tools],
  );

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify({ data, settings }, null, 2)], {
      type: 'application/json',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'toolshed-backup.json';
    a.click();
  }, [data, settings]);

  const importData = useCallback(
    (payload: { data: AppData; settings: Settings }) => {
      localStorage.setItem(LS_DATA, JSON.stringify(payload.data));
      localStorage.setItem(LS_SETTINGS, JSON.stringify(payload.settings));
      window.location.reload();
    },
    [],
  );

  const clearTools = useCallback(() => {
    persistData({ ...data, tools: [] });
  }, [data, persistData]);

  const clearProjects = useCallback(() => {
    persistData({ ...data, projects: [] });
  }, [data, persistData]);

  const clearData = useCallback(() => {
    localStorage.removeItem(LS_DATA);
    localStorage.removeItem(LS_SETTINGS);
    window.location.reload();
  }, []);

  return {
    tools: data.tools,
    projects: data.projects,
    posts: data.posts,
    settings,
    addTool,
    updateTool,
    deleteTool,
    addProject,
    updateProject,
    deleteProject,
    addPost,
    updatePost,
    deletePost,
    updateSettings,
    isDoable,
    exportData,
    importData,
    clearTools,
    clearProjects,
    clearData,
  };
}

export type Store = ReturnType<typeof useStore>;
