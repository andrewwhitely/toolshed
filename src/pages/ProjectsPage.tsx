import { AddProjectCard } from '@/components/projects/AddProjectCard';
import { AddProjectModal } from '@/components/projects/AddProjectModal';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pill } from '@/components/ui/Pill';
import { useAppStore } from '@/store/StoreContext';
import type { Project } from '@/types';
import { useState } from 'react';

type Filter =
	| 'all'
	| 'doable'
	| 'In Progress'
	| 'Planned'
	| 'Complete'
	| 'DIY'
	| 'Paid';

interface Props {
	filter: string;
	onFilterChange: (f: string) => void;
	filterToolName?: string;
	onClearToolFilter?: () => void;
}

export function ProjectsPage({
	filter,
	onFilterChange,
	filterToolName,
	onClearToolFilter,
}: Props) {
	const { tools, projects, settings, addProject, updateProject, isDoable } = useAppStore();
	const [view, setView] = useState<'grid' | 'list'>(
		settings.defaultProjectView,
	);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [addProjectOpen, setAddProjectOpen] = useState(false);

	const activeFilter = (filter || 'all') as Filter;

	const filtered = projects.filter((p) => {
		if (filterToolName) {
			const key = filterToolName.toLowerCase().split(' ')[0];
			return p.tools?.some((t) => t.toLowerCase().includes(key));
		}
		if (activeFilter === 'all') return true;
		if (activeFilter === 'doable') return isDoable(p);
		return p.status === activeFilter || p.type === activeFilter;
	});

	return (
		<div>
			<PageHeader
				title={
					<em className='font-light not-italic text-[var(--accent)]'>
						Projects
					</em>
				}
				subtitle='All your builds, repairs, and plans'
			/>

			{filterToolName && (
				<div className='mb-3 text-[11px] text-[var(--ink2)]'>
					Showing projects using <strong>{filterToolName}</strong> ·{' '}
					<button
						onClick={onClearToolFilter}
						className='text-[var(--accent)] hover:underline'
					>
						show all
					</button>
				</div>
			)}

			<div className='flex flex-col sm:flex-row gap-2 mb-5 flex-wrap items-stretch sm:items-center'>
				<div className='flex gap-1.5 flex-wrap'>
					{(
						[
							['all', 'All'],
							['doable', '⚡ Can Do Now'],
							['In Progress', 'In Progress'],
							['Planned', 'Planned'],
							['Complete', 'Complete'],
							['DIY', 'DIY'],
							['Paid', 'Paid'],
						] as [Filter, string][]
					).map(([id, label]) => (
						<Pill
							key={id}
							active={activeFilter === id && !filterToolName}
							onClick={() => {
								onFilterChange(id);
								if (onClearToolFilter) onClearToolFilter();
							}}
						>
							{label}
						</Pill>
					))}
				</div>
				<div className='sm:ml-auto flex border-[1.5px] border-[var(--border)] rounded overflow-hidden self-start'>
					{(['grid', 'list'] as const).map((v) => (
						<button
							key={v}
							onClick={() => setView(v)}
							className={`font-mono text-[10px] font-semibold px-3 py-1.5 transition-all border-none cursor-pointer ${view === v ? 'bg-[var(--accent)] text-white' : 'bg-[var(--white)] text-[var(--ink2)]'}`}
						>
							{v === 'grid' ? '⊞ Grid' : '☰ List'}
						</button>
					))}
				</div>
			</div>

			{filtered.length > 0 ? (
				<div
					className={
						view === 'grid'
							? 'grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-3.5'
							: 'flex flex-col gap-2.5'
					}
				>
					{filtered.map((p) => (
						<ProjectCard
							key={p.id}
							project={p}
							ownedTools={tools}
							isDoable={isDoable(p)}
							listMode={view === 'list'}
							onClick={() => setSelectedProject(p)}
						/>
					))}
					<AddProjectCard
						onClick={() => setAddProjectOpen(true)}
						listMode={view === 'list'}
					/>
				</div>
			) : (
				<div className='text-center py-12 text-[var(--ink3)] flex flex-col items-center gap-3'>
					<div className='text-3xl mb-2'>🏗</div>
					<p className='text-[11px]'>No projects match this filter. Want to start one?</p>
					<AddProjectCard
						onClick={() => setAddProjectOpen(true)}
						listMode={view === 'list'}
					/>
				</div>
			)}

			<AddProjectModal
				open={addProjectOpen || selectedProject !== null}
				onClose={() => {
					setAddProjectOpen(false);
					setSelectedProject(null);
				}}
				onSave={addProject}
				onUpdate={updateProject}
				project={selectedProject ?? undefined}
			/>
		</div>
	);
}
