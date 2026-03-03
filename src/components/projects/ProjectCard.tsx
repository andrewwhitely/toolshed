import { STATUS_COLORS } from '@/constants/brands';
import { useAppStore } from '@/store/StoreContext';
import type { Project, Tool } from '@/types';

interface Props {
  project: Project;
  ownedTools: Tool[];
  isDoable: boolean;
  listMode?: boolean;
  onClick?: () => void;
}

export function ProjectCard({
  project,
  ownedTools,
  isDoable,
  listMode = false,
  onClick,
}: Props) {
  const statusColor = STATUS_COLORS[project.status] ?? '#888';

  const { settings } = useAppStore();

  const toolChips = project.tools?.map((needed) => {
    const owned = ownedTools.some((t) =>
      t.name.toLowerCase().includes(needed.toLowerCase().split(' ')[0]),
    );
    return { name: needed, owned };
  });

  const typeClass = {
    DIY: 'bg-green-100 text-green-800',
    Paid: 'bg-yellow-100 text-yellow-800',
    Mixed: 'bg-indigo-100 text-indigo-800',
  }[project.type];

  const statusClass = {
    Complete: 'bg-green-100 text-green-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Planned: 'bg-purple-100 text-purple-800',
  }[project.status];

  if (listMode) {
    return (
      <div onClick={onClick} className='bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-md overflow-hidden flex items-center hover:shadow-md transition-all duration-150 cursor-pointer'>
        <div className='w-1 self-stretch' style={{ background: statusColor }} />
        <div className='flex-1 flex items-center gap-4 px-4 py-3'>
          <div className='flex gap-1.5 flex-wrap'>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${typeClass}`}
            >
              {project.type}
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${statusClass}`}
            >
              {project.status}
            </span>
            {isDoable && (
              <span className='text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-bg2)]'>
                ⚡ Can Do
              </span>
            )}
          </div>
          <div className='font-serif text-[13px] font-bold text-[var(--ink)] flex-1'>
            {project.name}
          </div>
          <div className='text-[10px] text-[var(--ink3)]'>
            ${settings.currency}
            {project.cost} · {project.time}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} className='bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-md overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer'>
      <div className='h-1' style={{ background: statusColor }} />
      <div className='p-4'>
        <div className='flex gap-1.5 mb-2 flex-wrap'>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${typeClass}`}
          >
            {project.type}
          </span>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${statusClass}`}
          >
            {project.status}
          </span>
          {isDoable && (
            <span className='text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-bg2)]'>
              ⚡ Can Do
            </span>
          )}
        </div>
        <div className='font-serif text-[16px] font-bold text-[var(--ink)] mb-1.5'>
          {project.name}
        </div>
        <div className='text-[10px] text-[var(--ink2)] leading-[1.65] mb-3'>
          {project.description}
        </div>
        <div className='grid grid-cols-3 gap-1.5 pt-2.5 border-t border-[var(--border2)]'>
          {[
            { value: `${settings.currency}${project.cost}`, label: 'Cost' },
            { value: `${project.time}`, label: 'Hours Taken' },
            {
              value: `${toolChips?.filter((t) => t.owned).length}/${toolChips?.length}`,
              label: 'Tools Owned',
            },
          ].map((s) => (
            <div key={s.label} className='text-center'>
              <div className='text-[12px] font-bold text-[var(--ink)]'>
                {s.value}
              </div>
              <div className='text-[8px] uppercase tracking-[0.07em] text-[var(--ink3)] mt-0.5'>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        {toolChips?.length > 0 && (
          <div className='flex gap-1 flex-wrap mt-2.5'>
            {toolChips?.map((tc) => (
              <span
                key={tc.name}
                className={`text-[9px] px-1.5 py-0.5 rounded border ${tc.owned ? 'bg-[var(--accent-bg)] text-[var(--accent)] border-[var(--accent-bg2)]' : 'border-[var(--border2)] text-[var(--ink3)]'}`}
              >
                {tc.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
