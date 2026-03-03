import { QuickAddModal } from '@/components/dashboard/QuickAddModal';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { AddToolCard } from '@/components/tools/AddToolCard';
import { ToolCard } from '@/components/tools/ToolCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { useWeather } from '@/hooks/useWeather';
import { useAppStore } from '@/store/StoreContext';
import type { PageId } from '@/types';
import { useState } from 'react';

interface Props {
  onNavigate: (page: PageId) => void;
  onViewToolProjects: (name: string) => void;
  onAddTool: () => void;
}

export function DashboardPage({
  onNavigate,
  onViewToolProjects,
  onAddTool,
}: Props) {
  const { tools, projects, posts, settings, isDoable } = useAppStore();
  const doable = projects.filter(isDoable);
  const greeting = settings.name ? settings.name + '.' : 'Homeowner.';
  const wxCoords =
    settings.locationLat != null && settings.locationLon != null
      ? { lat: settings.locationLat, lon: settings.locationLon }
      : undefined;
  const { data: wx, loading: wxLoading } = useWeather(
    settings.location,
    wxCoords,
  );
  const weatherStr = wxLoading
    ? '…'
    : wx
      ? `${wx.temp}°F · ${wx.description} ${wx.emoji}`
      : null;

  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title={
          <>
            {new Date().getHours() < 12
              ? 'Good morning'
              : new Date().getHours() < 18
                ? 'Good afternoon'
                : 'Good evening'}
            ,{' '}
            <em className='font-light text-[var(--accent)] italic'>
              {greeting}
            </em>
          </>
        }
        location={
          settings.location.includes(', ')
            ? settings.location.split(', ').slice(0, -1).join(', ')
            : settings.location
        }
        weather={weatherStr}
        subtitle="Here's what's happening with your projects & tools."
      />

      <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mb-6'>
        <StatCard value={tools.length} label='Tools in Inventory' />
        <StatCard value={projects.length} label='Total Projects' />
        <StatCard value={doable.length} label='Projects You Can Do Right Now' />
        {/* <StatCard value={posts.length} label='Blog Posts' /> */}
      </div>

      <div className='text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--ink2)] mb-2.5 mt-5'>
        ⚡ Projects You Can Do Right Now
      </div>
      {doable.length > 0 ? (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-3 mb-6'>
          {doable.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              ownedTools={tools}
              isDoable={true}
            />
          ))}
        </div>
      ) : (
        <div className='text-center py-10 text-[var(--ink3)]'>
          <div className='text-3xl mb-2'>⚡</div>
          <p className='text-[11px]'>
            Add more tools to unlock projects you can tackle now.
          </p>
        </div>
      )}

      <div className='text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--ink2)] mb-2.5 mt-5'>
        🔧 Recent Tools
      </div>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(185px,1fr))] gap-2.5'>
        {tools.slice(0, 6).map((t) => {
          const count = projects.filter((p) =>
            p.tools?.some((tn) =>
              tn.toLowerCase().includes(t.name.toLowerCase().split(' ')[0]),
            ),
          ).length;
          return (
            <ToolCard
              key={t.id}
              tool={t}
              projectCount={count}
              onViewProjects={onViewToolProjects}
            />
          );
        })}
        <AddToolCard
          onClick={() => {
            onNavigate('tools');
            onAddTool();
          }}
        />
      </div>

      <QuickAddModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />
    </div>
  );
}
