import { type ReactNode } from 'react';

interface Props {
  title: ReactNode;
  subtitle?: string;
  location?: string;
  weather?: string | null;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, location, weather }: Props) {
  return (
    <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
      <div>
        <h2 className='font-serif text-[28px] font-black text-[var(--ink)]'>
          {title}
        </h2>
        {location && (
          <p className='text-[10px] text-[var(--ink3)] mt-0.5'>
            {location}
            {weather ? ` · ${weather}` : ''}
          </p>
        )}
        {subtitle && (
          <p className='text-[10px] text-[var(--ink3)] mt-0.5'>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
