import { AddToolCard } from '@/components/tools/AddToolCard';
import { AddToolModal } from '@/components/tools/AddToolModal';
import { ToolCard } from '@/components/tools/ToolCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pill } from '@/components/ui/Pill';
import { useAppStore } from '@/store/StoreContext';
import type { Tool, ToolCategory } from '@/types';
import { useState } from 'react';

interface Props {
  filter: string | null;
  onFilterChange: (f: string | null) => void;
  onViewProjects: (toolName: string) => void;
}

export function ToolsPage({ filter, onFilterChange, onViewProjects }: Props) {
  const { tools, projects, addTool, updateTool } = useAppStore();
  const [addOpen, setAddOpen] = useState(false);
  const [addCat, setAddCat] = useState<ToolCategory | undefined>();
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  const activeFilter = filter ?? 'all';
  const brands = [...new Set(tools.map((t) => t.brand))];
  const filtered =
    activeFilter === 'all'
      ? tools
      : tools.filter((t) => t.brand === activeFilter || t.cat === activeFilter);

  const cats = [...new Set(filtered.map((t) => t.cat))];

  function openAdd(cat?: ToolCategory) {
    setAddCat(cat);
    setEditingTool(null);
    setAddOpen(true);
  }

  function closeModal() {
    setAddOpen(false);
    setEditingTool(null);
  }

  function projectCount(toolName: string) {
    return projects.filter((p) =>
      p.tools?.some((tn) =>
        tn.toLowerCase().includes(toolName.toLowerCase().split(' ')[0]),
      ),
    ).length;
  }

  return (
    <div>
      <PageHeader
        title={
          <>
            My{' '}
            <em className='font-light not-italic text-[var(--accent)]'>
              Tools
            </em>
          </>
        }
        subtitle='Click a tool to see linked projects · Color-coded by brand'
      />

      <div className='flex gap-1.5 flex-wrap mb-5'>
        <Pill
          key='all'
          active={activeFilter === 'all'}
          onClick={() => onFilterChange(null)}
        >
          All
        </Pill>
        {brands.map((b) => (
          <Pill
            key={b}
            active={activeFilter === b}
            brand={b}
            onClick={() => onFilterChange(b)}
          >
            {b}
          </Pill>
        ))}
      </div>

      {cats.length > 0 ? (
        cats.map((cat) => (
          <div key={cat} className='mb-7'>
            <div className='flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-[var(--ink3)] mb-2.5 pb-2 border-b border-[var(--border)]'>
              <span className='w-2 h-2 rounded-[2px] bg-[var(--accent)] inline-block transition-colors duration-300' />
              {cat}
            </div>
            <div className='grid grid-cols-[repeat(auto-fill,minmax(185px,1fr))] gap-2.5'>
              {filtered
                .filter((t) => t.cat === cat)
                .map((t) => (
                  <ToolCard
                    key={t.id}
                    tool={t}
                    projectCount={projectCount(t.name)}
                    onViewProjects={onViewProjects}
                    onClick={() => setEditingTool(t)}
                  />
                ))}
              <AddToolCard
                label={`Add to ${cat}`}
                onClick={() => openAdd(cat)}
              />
            </div>
          </div>
        ))
      ) : (
        <div className='text-center py-12 text-[var(--ink3)]'>
          <div className='text-3xl mb-2'>🔧</div>
          <p className='text-[11px]'>No tools found.</p>
        </div>
      )}

      <AddToolModal
        open={addOpen || !!editingTool}
        defaultCategory={editingTool ? undefined : addCat}
        tool={editingTool ?? undefined}
        onClose={closeModal}
        onSave={addTool}
        onUpdate={updateTool}
      />
    </div>
  );
}
