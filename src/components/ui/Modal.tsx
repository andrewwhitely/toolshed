import { type ReactNode, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
  closeOnBackdrop?: boolean;
}

export function Modal({
  open,
  onClose,
  children,
  width = 'min(440px, 94vw)',
  closeOnBackdrop = true,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className='rounded-lg border-[1.5px] border-[var(--border)] bg-[var(--white)] p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto'
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
