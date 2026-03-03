import { WelcomeModal, hasSeenWelcome } from '@/components/WelcomeModal';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { AddProjectModal } from '@/components/projects/AddProjectModal';
import { AddToolModal } from '@/components/tools/AddToolModal';
import { BRAND_THEMES } from '@/constants/brands';
import { BlogPage } from '@/pages/BlogPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ToolsPage } from '@/pages/ToolsPage';
import { useAppStore } from '@/store/StoreContext';
import type { PageId } from '@/types';
import { useEffect, useState } from 'react';

export function App() {
	const { tools, projects, posts, settings, addTool, addProject, isDoable, resetToEmpty } = useAppStore();
	const [page, setPage] = useState<PageId>('dashboard');
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [toolFilter, setToolFilter] = useState<string | null>(null);
	const [projFilter, setProjFilter] = useState<string>('all');
	const [blogFilter, setBlogFilter] = useState<string[]>([]);
	const [addToolOpen, setAddToolOpen] = useState(false);
	const [welcomeOpen, setWelcomeOpen] = useState(!hasSeenWelcome());
	const [addProjectOpen, setAddProjectOpen] = useState(false);
	useEffect(() => {
		document.body.setAttribute(
			'data-theme',
			settings.theme === 'default' ? '' : settings.theme,
		);
	}, [settings.theme]);

	const PAGE_LABELS: Record<PageId, string> = {
		dashboard: 'Dashboard',
		tools: 'Tools',
		projects: 'Projects',
		blog: 'Field Notes',
		settings: 'Settings',
	};

	useEffect(() => {
		document.title = `ToolShed.fyi - Tool Inventory & Project Planner | ${PAGE_LABELS[page]}`;
	}, [page]);

	function navigate(p: PageId) {
		setPage(p);
		setToolFilter(null);
		setProjFilter('all');
		setBlogFilter([]);
	}

	function handleViewToolProjects(toolName: string) {
		setToolFilter(toolName);
		setProjFilter('all');
		setPage('projects');
	}

	const brands = [...new Set(tools.map((t) => t.brand))];
	const cats = [...new Set(tools.map((t) => t.cat))];
	const tags = [...new Set(posts.flatMap((p) => p.tags))];
	const doableCount = projects.filter(isDoable).length;
	const currentBrand =
		BRAND_THEMES.find((b) => b.id === settings.theme) ?? BRAND_THEMES[0];

	const navSection = {
		label: 'Navigate',
		items: [
			{
				icon: '🏠',
				label: 'Dashboard',
				onClick: () => navigate('dashboard'),
				active: page === 'dashboard',
			},
			{
				icon: '🔧',
				label: 'Tools',
				count: tools.length,
				onClick: () => navigate('tools'),
				active: page === 'tools',
			},
			{
				icon: '🏗',
				label: 'Projects',
				count: projects.length,
				onClick: () => navigate('projects'),
				active: page === 'projects',
			},
			{
				icon: '📝',
				label: 'Blog',
				count: posts.length,
				onClick: () => navigate('blog'),
				active: page === 'blog',
			},
			{
				icon: '⚙️',
				label: 'Settings',
				onClick: () => navigate('settings'),
				active: page === 'settings',
			},
		],
	};

	const sidebarSections: Record<PageId, any[]> = {
		dashboard: [navSection],
		tools: [
			navSection,
			{
				label: 'Brands',
				items: brands.map((b) => ({
					icon: '●',
					label: b,
					count: tools.filter((t) => t.brand === b).length,
					onClick: () => setToolFilter(b),
					style: {
						color: BRAND_THEMES.find((br) => br.name === b)?.color ?? 'inherit',
					},
				})),
			},
			{
				label: 'Categories',
				items: cats.map((c) => ({
					icon: '◦',
					label: c,
					count: tools.filter((t) => t.cat === c).length,
					onClick: () => setToolFilter(c),
				})),
			},
		],
		projects: [
			navSection,
			{
				label: 'Filter',
				items: [
					{
						icon: '◉',
						label: 'All Projects',
						count: projects.length,
						onClick: () => {
							setProjFilter('all');
							setToolFilter(null);
						},
						active: projFilter === 'all' && !toolFilter,
					},
					{
						icon: '⚡',
						label: 'Can Do Now',
						count: doableCount,
						onClick: () => {
							setProjFilter('doable');
							setToolFilter(null);
						},
						active: projFilter === 'doable',
					},
					{
						icon: '●',
						label: 'In Progress',
						onClick: () => {
							setProjFilter('In Progress');
							setToolFilter(null);
						},
						active: projFilter === 'In Progress',
					},
					{
						icon: '○',
						label: 'Planned',
						onClick: () => {
							setProjFilter('Planned');
							setToolFilter(null);
						},
						active: projFilter === 'Planned',
					},
					{
						icon: '✓',
						label: 'Complete',
						onClick: () => {
							setProjFilter('Complete');
							setToolFilter(null);
						},
						active: projFilter === 'Complete',
					},
					{
						icon: '🔧',
						label: 'DIY Only',
						onClick: () => {
							setProjFilter('DIY');
							setToolFilter(null);
						},
						active: projFilter === 'DIY',
					},
					{
						icon: '💰',
						label: 'Paid Jobs',
						onClick: () => {
							setProjFilter('Paid');
							setToolFilter(null);
						},
						active: projFilter === 'Paid',
					},
				],
			},
		],
		blog: [
			navSection,
			{
				label: 'Type',
				items: ['DIY', 'Paid', 'Review', 'Tips'].map((t) => ({
					icon: '◦',
					label: t,
					onClick: () =>
						setBlogFilter(
							blogFilter.includes(t)
								? blogFilter.filter((f) => f !== t)
								: [...blogFilter, t],
						),
					active: blogFilter.includes(t),
				})),
			},
			{
				label: 'Tags',
				items: tags.map((t) => ({
					icon: '#',
					label: t,
					onClick: () =>
						setBlogFilter(
							blogFilter.includes(t)
								? blogFilter.filter((f) => f !== t)
								: [...blogFilter, t],
						),
					active: blogFilter.includes(t),
				})),
			},

		],
		settings: [
			navSection,
			{
				label: 'Theme',
				items: [
					{
						icon: '',
						label: currentBrand.name,
						active: true,
						onClick: () => { },
						dot: currentBrand.color,
					},
				],
			},
			{
				label: 'Sections',
				items: [
					{ icon: '🎨', label: 'Brand Theme', onClick: () => { } },
					{ icon: '👤', label: 'Your Info', onClick: () => { } },
					{ icon: '⚙️', label: 'Preferences', onClick: () => { } },
					{ icon: '💾', label: 'Data', onClick: () => { } },
				],
			},
		],
	};

	return (
		<div className='flex flex-col h-screen overflow-hidden relative z-[1]'>
			<Topbar
				currentPage={page}
				theme={settings.theme}
				onNavigate={navigate}
				onMenuClick={() => setSidebarOpen((o) => !o)}
				sidebarOpen={sidebarOpen}
			/>
			<div className='flex flex-1 overflow-hidden relative'>
				<Sidebar
					sections={sidebarSections[page]}
					onClearFilters={
						page === 'blog' && blogFilter.length > 0
							? () => setBlogFilter([])
							: undefined
					}
					mobileOpen={sidebarOpen}
					onMobileClose={() => setSidebarOpen(false)}
				/>
				<main className='flex-1 overflow-y-auto p-4 sm:p-5 md:p-7 min-w-0'>
					{page === 'dashboard' && (
						<DashboardPage
							onNavigate={navigate}
							onViewToolProjects={handleViewToolProjects}
							onAddTool={() => setAddToolOpen(true)}
							onAddProject={() => setAddProjectOpen(true)}
						/>
					)}
					{page === 'tools' && (
						<ToolsPage
							filter={toolFilter}
							onFilterChange={setToolFilter}
							onViewProjects={handleViewToolProjects}
						/>
					)}
					{page === 'projects' && (
						<ProjectsPage
							filter={projFilter}
							onFilterChange={setProjFilter}
							filterToolName={toolFilter ?? undefined}
							onClearToolFilter={() => setToolFilter(null)}
						/>
					)}
					{page === 'blog' && (
						<BlogPage filter={blogFilter} onFilterChange={setBlogFilter} />
					)}
					{page === 'settings' && <SettingsPage />}
				</main>
			</div>
			<AddToolModal
				open={addToolOpen}
				onClose={() => setAddToolOpen(false)}
				onSave={(t) => {
					addTool(t);
					setAddToolOpen(false);
				}}
			/>
			<AddProjectModal
				open={addProjectOpen}
				onClose={() => setAddProjectOpen(false)}
				onSave={(p) => {
					addProject(p);
					setAddProjectOpen(false);
				}}
			/>
			<WelcomeModal
				open={welcomeOpen}
				onClose={() => setWelcomeOpen(false)}
				onStartFresh={resetToEmpty}
				onExploreSample={() => { }}
			/>
		</div>
	);
}
