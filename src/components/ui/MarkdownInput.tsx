import { marked } from 'marked';
import { useEffect, useRef, useState } from 'react';
import { Textarea } from './Input';

type Tab = 'write' | 'preview';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Height of the textarea / preview pane, e.g. 'h-36' */
  className?: string;
}

export function MarkdownInput({
  value,
  onChange,
  placeholder = '## Start writing...\n\n**bold**, *italic*, - lists, > quotes',
  className = 'h-36',
}: Props) {
  const [tab, setTab] = useState<Tab>('write');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = marked.parse(value || '*Nothing to preview yet.*') as string;
    }
  }, [value, tab]);

  return (
    <div className='border-[1.5px] border-[var(--border)] rounded overflow-hidden'>
      {/* Tab bar */}
      <div className='flex border-b border-[var(--border)] bg-[var(--bg)]'>
        <div className='text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--ink3)] px-2.5 flex items-center flex-1'>
          Body (Markdown)
        </div>
        {(['write', 'preview'] as Tab[]).map((t) => (
          <button
            key={t}
            type='button'
            onClick={() => setTab(t)}
            className={`font-mono text-[10px] font-bold px-3 py-1.5 capitalize border-l border-[var(--border)] transition-all ${
              tab === t
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--white)] text-[var(--ink2)] hover:text-[var(--ink)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Pane */}
      {tab === 'write' ? (
        <Textarea
          className={`${className} border-none rounded-none focus:ring-0 bg-[var(--white)]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <div
          ref={previewRef}
          className={`${className} overflow-y-auto px-3 py-2 md-preview bg-[var(--white)]`}
        />
      )}
    </div>
  );
}
