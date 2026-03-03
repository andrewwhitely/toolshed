import { Button } from '@/components/ui/Button';
import { FormGroup } from '@/components/ui/FormGroup';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { Project, ProjectStatus, ProjectType } from '@/types';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (p: Omit<Project, 'id'>) => void;
  onUpdate?: (id: number, p: Omit<Project, 'id'>) => void;
  project?: Project;
}

const fresh = () => ({
  name: '',
  type: 'DIY' as ProjectType,
  status: 'Planned' as ProjectStatus,
  cost: 0,
  time: 0,
  tools: '',
  description: '',
});

export function AddProjectModal({ open, onClose, onSave, onUpdate, project }: Props) {
  const [form, setForm] = useState(fresh());

  useEffect(() => {
    if (open) {
      if (project) {
        setForm({
          name: project.name,
          type: project.type,
          status: project.status,
          cost: project.cost,
          time: project.time,
          tools: project.tools?.join(', ') ?? '',
          description: project.description,
        });
      } else {
        setForm(fresh());
      }
    }
  }, [open, project]);

  function handle(field: string, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function submit() {
    if (!form.name.trim()) return;
    const payload = {
      ...form,
      tools: form.tools
        ?.split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (project && onUpdate) {
      onUpdate(project.id, payload);
    } else {
      onSave(payload);
    }
    onClose();
  }

  const isEdit = !!project;

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className='font-serif text-[18px] font-bold text-[var(--ink)] mb-4'>
        {isEdit ? 'Edit Project' : 'Add Project'}
      </h3>
      <FormGroup label='Project Name'>
        <Input
          className='mb-3'
          placeholder='e.g. Deck Refinishing'
          value={form.name}
          onChange={(e) => handle('name', e.target.value)}
          autoFocus
        />
      </FormGroup>
      <div className='grid grid-cols-2 gap-3 mb-3'>
        <FormGroup label='Type'>
          <Select
            value={form.type}
            onChange={(e) => handle('type', e.target.value)}
          >
            <option>DIY</option>
            <option>Paid</option>
            <option>Mixed</option>
          </Select>
        </FormGroup>
        <FormGroup label='Status'>
          <Select
            value={form.status}
            onChange={(e) => handle('status', e.target.value)}
          >
            <option>Planned</option>
            <option>In Progress</option>
            <option>Complete</option>
          </Select>
        </FormGroup>
        <FormGroup label='Est. Cost ($)'>
          <Input
            type='number'
            min='0'
            value={form.cost}
            onChange={(e) =>
              handle('cost', Math.max(parseFloat(e.target.value)) || 0)
            }
          />
        </FormGroup>
        <FormGroup label='Est. Time (hrs)'>
          <Input
            type='number'
            min='0'
            value={form.time}
            onChange={(e) => handle('time', parseFloat(e.target.value) || 0)}
          />
        </FormGroup>
      </div>
      <FormGroup label='Tools Needed (comma separated)'>
        <Input
          className='mb-3'
          placeholder='Drill, Circular Saw, Level'
          value={form.tools}
          onChange={(e) => handle('tools', e.target.value)}
        />
      </FormGroup>
      <FormGroup label='Description'>
        <Input
          placeholder='What is this project?'
          value={form.description}
          onChange={(e) => handle('description', e.target.value)}
        />
      </FormGroup>
      <div className='flex justify-end gap-2 mt-4 pt-3 border-t border-[var(--border2)]'>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant='primary' onClick={submit}>
          {isEdit ? 'Update Project' : 'Save Project'}
        </Button>
      </div>
    </Modal>
  );
}
