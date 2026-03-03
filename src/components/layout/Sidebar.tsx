import React, { useState } from 'react';

interface SidebarItem {
  icon: string;
  label: string;
  count?: number;
  onClick: () => void;
  active?: boolean;
  dot?: string;
  style?: React.CSSProperties;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

interface Props {
  sections: SidebarSection[];
  onClearFilters?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({
  sections,
  onClearFilters,
  mobileOpen = false,
  onMobileClose,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const hasActive = sections.some((s) => s.items.some((i) => i.active));
  const showExpanded = mobileOpen || !collapsed;

  return (
    <>
      {/* Mobile backdrop */}
      {onMobileClose && (
        <div
          className={`md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${
            mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar flex-shrink-0 border-r border-[var(--border)] overflow-y-auto overflow-x-hidden transition-all duration-200
          fixed top-[54px] left-0 bottom-0 -translate-x-full z-50
          md:relative md:top-auto md:left-auto md:bottom-auto md:translate-x-0 md:z-10
          ${mobileOpen ? 'translate-x-0' : ''}
        `}
        style={{
          width: showExpanded ? '188px' : '44px',
          background: 'var(--sidebar-bg)',
        }}
      >
      {/* Header: collapse on desktop, close on mobile */}
      <div className='flex border-b border-[var(--border2)]'>
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className='hidden md:flex w-full items-center justify-center py-3 text-[var(--ink3)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-all duration-150'
        >
          <span className='text-[10px] font-bold'>
            {collapsed ? '→' : '← Collapse'}
          </span>
        </button>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            title='Close menu'
            className='md:hidden w-full flex items-center justify-center py-3 text-[var(--ink3)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-all duration-150'
          >
            <span className='text-[10px] font-bold'>✕ Close</span>
          </button>
        )}
      </div>

      {!showExpanded ? (
        /* ── Collapsed: icons only ── */
        <div className='flex flex-col py-2'>
          {sections.map((section, i) => (
            <div
              key={i}
              className={
                i > 0 ? 'mt-1 pt-1 border-t border-[var(--border2)]' : ''
              }
            >
              {section.items.map((item, j) => (
                <div
                  key={j}
                  onClick={() => {
                    item.onClick();
                    onMobileClose?.();
                  }}
                  title={item.label}
                  className={`flex items-center justify-center py-[9px] cursor-pointer border-l-[3px] transition-all duration-100 select-none ${
                    item.active
                      ? 'bg-[var(--accent-bg)] border-l-[var(--accent)] text-[var(--accent)]'
                      : 'border-l-transparent text-[var(--ink)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]'
                  }`}
                >
                  {item.dot ? (
                    <span
                      className='w-[10px] h-[10px] rounded-full inline-block'
                      style={{ background: item.dot }}
                    />
                  ) : (
                    <span className='text-[14px]' style={item.style}>{item.icon}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
          {hasActive && onClearFilters && (
            <div className='flex justify-center mt-2 px-1'>
              <button
                onClick={onClearFilters}
                title='Clear filters'
                className='text-[11px] text-[var(--ink3)] hover:text-[var(--accent)] transition-colors'
              >
                ✕
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── Expanded: full labels ── */
        <div className='py-2'>
          {sections.map((section, i) => (
            <div key={i} className='mb-2'>
              <div className='text-[9px] uppercase tracking-[0.14em] font-bold text-[var(--ink3)] px-3.5 mb-1'>
                {section.label}
              </div>
              {section.items.map((item, j) => (
                <div
                  key={j}
                  onClick={() => {
                    item.onClick();
                    onMobileClose?.();
                  }}
                  className={`flex items-center gap-2 px-3.5 py-[7px] text-[11px] font-medium cursor-pointer border-l-[3px] transition-all duration-100 select-none ${
                    item.active
                      ? 'bg-[var(--accent-bg)] border-l-[var(--accent)] text-[var(--accent)]'
                      : 'border-l-transparent text-[var(--ink)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]'
                  }`}
                >
                  {item.dot ? (
                    <span
                      className='w-[10px] h-[10px] rounded-full inline-block'
                      style={{ background: item.dot }}
                    />
                  ) : (
                    <span className='text-[13px] w-4 text-center' style={item.style}>
                      {item.icon}
                    </span>
                  )}
                  <span className='flex-1'>{item.label}</span>
                  {item.count !== undefined && (
                    <span className='text-[9px] bg-[var(--border2)] px-1.5 py-0.5 rounded-full text-[var(--ink3)]'>
                      {item.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
          {hasActive && onClearFilters && (
            <div className='px-3.5 mt-1 pb-2'>
              <button
                onClick={onClearFilters}
                className='w-full text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--ink3)] border border-[var(--border)] rounded px-2 py-1.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150'
              >
                ✕ Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
    </>
  );
}
