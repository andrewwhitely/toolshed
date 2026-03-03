import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} width='min(380px, 94vw)'>
      <h3 className='font-serif text-[18px] font-bold text-[var(--ink)] mb-2'>
        {title}
      </h3>
      {description && (
        <p className='text-[11px] text-[var(--ink2)] leading-[1.6] mb-5'>
          {description}
        </p>
      )}
      <div className='flex justify-end gap-2 pt-3 border-t border-[var(--border2)]'>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant='danger'
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
