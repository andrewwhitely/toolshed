import { QuickAddModal } from '@/components/dashboard/QuickAddModal';
import { Button } from '@/components/ui/Button';
import { BRAND_THEMES } from '@/constants/brands';
import type { PageId, ThemeId } from '@/types';
import { useState } from 'react';

type AddType = 'tool' | 'project' | 'post';

const PAGE_TO_TYPE: Partial<Record<PageId, AddType>> = {
  tools: 'tool',
  projects: 'project',
  blog: 'post',
};

const PAGES: { id: PageId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tools', label: 'Tools' },
  { id: 'projects', label: 'Projects' },
  { id: 'blog', label: 'Blog' },
  { id: 'settings', label: 'Settings' },
];

interface Props {
  currentPage: PageId;
  theme: ThemeId;
  onNavigate: (page: PageId) => void;
}

export function Topbar({ currentPage, theme, onNavigate }: Props) {
  const brandTheme =
    BRAND_THEMES.find((t) => t.id === theme) ?? BRAND_THEMES[0];
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <>
      <header
        className='topbar relative z-50 flex items-center h-[54px] px-6 border-b border-[var(--border)] flex-shrink-0'
        style={{ background: 'var(--topbar-bg)', backdropFilter: 'blur(8px)' }}
      >
        <button
          onClick={() => onNavigate('dashboard')}
          className='font-serif text-[20px] font-black mr-9 tracking-tight flex items-baseline gap-0 cursor-pointer hover:opacity-80 transition-opacity'
        >
          <span className='text-[var(--ink)]'>Tool</span>
          <span className='text-[var(--accent)] transition-colors duration-300'>
            Shed
          </span>
          <span className='text-[var(--ink3)] text-[12px] font-medium ml-0.5'>
            .fyi
          </span>
        </button>

        <nav className='flex'>
          {PAGES.map((p) => (
            <button
              key={p.id}
              onClick={() => onNavigate(p.id)}
              className={`font-mono text-[11px] font-semibold px-4 py-2 border-b-[2.5px] -mb-[1.5px] transition-all duration-150 uppercase tracking-[0.04em] bg-transparent border-x-0 border-t-0 cursor-pointer ${
                currentPage === p.id
                  ? 'text-[var(--accent)] border-b-[var(--accent)]'
                  : 'text-[var(--ink2)] border-b-transparent hover:text-[var(--accent)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </nav>

        <div className='ml-auto flex items-center gap-2'>
          <button
            onClick={() => onNavigate('settings')}
            title={`Theme: ${brandTheme.name}`}
            className='animate-pulse w-4 h-4 rounded-full border-2 border-white/60 shadow-md cursor-pointer hover:scale-110 transition-transform'
            style={{ background: brandTheme.color }}
          />
          <Button
            variant='primary'
            size='sm'
            onClick={() => setQuickAddOpen(true)}
          >
            + Add{' '}
            {(PAGE_TO_TYPE[currentPage] &&
              PAGE_TO_TYPE[currentPage].charAt(0).toUpperCase() +
                PAGE_TO_TYPE[currentPage].slice(1)) ??
              null}
          </Button>
        </div>
      </header>

      <QuickAddModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        defaultType={PAGE_TO_TYPE[currentPage] ?? 'tool'}
      />
    </>
  );
}
