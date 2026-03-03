import { Button } from '@/components/ui/Button';
import { FormGroup } from '@/components/ui/FormGroup';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { BRAND_NAMES, TOOL_CATEGORIES } from '@/constants/brands';
import type { BrandName, Tool, ToolCategory } from '@/types';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  defaultCategory?: ToolCategory;
  onClose: () => void;
  onSave: (tool: Omit<Tool, 'id'>) => void;
  onUpdate?: (id: number, tool: Omit<Tool, 'id'>) => void;
  tool?: Tool;
}

const fresh = (defaultCategory?: ToolCategory) => ({
  name: '',
  brand: 'DeWalt' as BrandName,
  cat: (defaultCategory ?? 'Power Tools') as ToolCategory,
  model: '',
  notes: '',
});

export function AddToolModal({
  open,
  defaultCategory,
  onClose,
  onSave,
  onUpdate,
  tool,
}: Props) {
  const [form, setForm] = useState(fresh(defaultCategory));

  useEffect(() => {
    if (open) {
      if (tool) {
        setForm({
          name: tool.name,
          brand: tool.brand,
          cat: tool.cat,
          model: tool.model ?? '',
          notes: tool.notes ?? '',
        });
      } else {
        setForm(fresh(defaultCategory));
      }
    }
  }, [open, tool, defaultCategory]);

  function handle(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function submit() {
    if (!form.name.trim()) return;
    if (tool && onUpdate) {
      onUpdate(tool.id, form);
    } else {
      onSave(form);
    }
    onClose();
  }

  const isEdit = !!tool;

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className='font-serif text-[18px] font-bold text-[var(--ink)] mb-4'>
        {isEdit ? 'Edit Tool' : defaultCategory ? `Add ${defaultCategory} Tool` : 'Add Tool'}
      </h3>
      <div className='grid grid-cols-2 gap-3 mb-3'>
        <FormGroup label='Tool Name'>
          <Input
            placeholder='e.g. Circular Saw'
            value={form.name}
            onChange={(e) => handle('name', e.target.value)}
            autoFocus
          />
        </FormGroup>
        <FormGroup label='Category'>
          <Select
            value={form.cat}
            onChange={(e) => handle('cat', e.target.value)}
          >
            {TOOL_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup label='Brand'>
          <Select
            value={form.brand}
            onChange={(e) => handle('brand', e.target.value)}
          >
            {BRAND_NAMES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup label='Model (optional)'>
          <Input
            placeholder='e.g. DWS779'
            value={form.model}
            onChange={(e) => handle('model', e.target.value)}
          />
        </FormGroup>
      </div>
      <FormGroup label='Notes'>
        <Input
          placeholder='Battery type, condition, etc.'
          value={form.notes}
          onChange={(e) => handle('notes', e.target.value)}
        />
      </FormGroup>
      <div className='flex justify-end gap-2 mt-4 pt-3 border-t border-[var(--border2)]'>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant='primary' onClick={submit}>
          {isEdit ? 'Update Tool' : 'Save Tool'}
        </Button>
      </div>
    </Modal>
  );
}
