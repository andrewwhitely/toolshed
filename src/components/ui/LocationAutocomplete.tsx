import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

interface GeoResult {
  id: number;
  name: string;
  admin1?: string;
  country_code?: string;
  latitude: number;
  longitude: number;
}

export interface LocationSelection {
  label: string;
  lat: number;
  lon: number;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (selection: LocationSelection) => void;
  placeholder?: string;
}

const inputBase =
  'w-full font-mono text-[11px] px-[10px] py-2 border-[1.5px] border-[var(--border)] rounded bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-colors';

function format(r: GeoResult): string {
  const parts = [r.name];
  if (r.admin1) parts.push(r.admin1);
  if (r.country_code) parts.push(r.country_code);
  return parts.join(', ');
}

export function LocationAutocomplete({ value, onChange, onSelect, placeholder }: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const hasMounted = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`,
        );
        const data = await res.json();
        const list: GeoResult[] = data.results ?? [];
        setResults(list);
        setOpen(list.length > 0);
        setActiveIndex(-1);
      } catch {
        setResults([]);
        setOpen(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function select(r: GeoResult) {
    const label = format(r);
    setQuery(label);
    onChange(label);
    onSelect?.({ label, lat: r.latitude, lon: r.longitude });
    setOpen(false);
    setResults([]);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      select(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className='relative'>
      <input
        className={inputBase}
        value={query}
        placeholder={placeholder}
        autoComplete='off'
        onChange={(e) => {
          setQuery(e.target.value);
          if (!e.target.value.trim()) onChange('');
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
      />
      {open && (
        <ul className='absolute z-50 left-0 right-0 top-[calc(100%+3px)] bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded shadow-lg overflow-hidden'>
          {results.map((r, i) => (
            <li
              key={r.id}
              onMouseDown={() => select(r)}
              className={clsx(
                'px-[10px] py-2 font-mono text-[11px] cursor-pointer transition-colors',
                i === activeIndex
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--ink)] hover:bg-[var(--bg)]',
              )}
            >
              {format(r)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
