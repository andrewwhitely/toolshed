import { Button } from '@/components/ui/Button';
import { FormGroup } from '@/components/ui/FormGroup';
import { Input, Select } from '@/components/ui/Input';
import { MarkdownInput } from '@/components/ui/MarkdownInput';
import { Modal } from '@/components/ui/Modal';
import { BRAND_NAMES, TOOL_CATEGORIES } from '@/constants/brands';
import { useAppStore } from '@/store/StoreContext';
import type {
  BrandName,
  PostType,
  ProjectStatus,
  ProjectType,
  ToolCategory,
} from '@/types';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type AddType = 'tool' | 'project' | 'post';

const TABS: { id: AddType; emoji: string; label: string }[] = [
  { id: 'tool', emoji: '🔧', label: 'Tool' },
  { id: 'project', emoji: '🏗', label: 'Project' },
  { id: 'post', emoji: '📝', label: 'Post' },
];

const freshTool = () => ({
  name: '',
  brand: 'DeWalt' as BrandName,
  cat: 'Power Tools' as ToolCategory,
  model: '',
  notes: '',
});

const freshProject = () => ({
  name: '',
  type: 'DIY' as ProjectType,
  status: 'Planned' as ProjectStatus,
  cost: 0,
  time: 0,
  tools: '',
  description: '',
});

const freshPost = () => ({
  title: '',
  tags: '',
  type: 'DIY' as PostType,
  cost: '',
  time: '',
  toolsUsed: '',
  materials: '',
  body: '',
});

interface Props {
  open: boolean;
  onClose: () => void;
  defaultType?: AddType;
}

export function QuickAddModal({ open, onClose, defaultType = 'tool' }: Props) {
  const { addTool, addProject, addPost } = useAppStore();
  const [addType, setAddType] = useState<AddType>(defaultType);

  useEffect(() => {
    if (open) setAddType(defaultType);
  }, [open, defaultType]);
  const [tool, setTool] = useState(freshTool);
  const [project, setProject] = useState(freshProject);
  const [post, setPost] = useState(freshPost);

  function handleClose() {
    setTool(freshTool());
    setProject(freshProject());
    setPost(freshPost());
    onClose();
  }

  function submit() {
    if (addType === 'tool') {
      if (!tool.name.trim()) return;
      addTool(tool);
    } else if (addType === 'project') {
      if (!project.name.trim()) return;
      addProject({
        ...project,
        tools: project.tools
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
    } else {
      if (!post.title.trim()) return;
      addPost({
        title: post.title,
        body: post.body,
        type: post.type,
        cost: post.cost,
        time: post.time,
        toolsUsed: post.toolsUsed,
        materials: post.materials,
        tags: post.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
    }
    handleClose();
  }

  const saveLabel =
    addType === 'tool'
      ? 'Save Tool'
      : addType === 'project'
        ? 'Save Project'
        : 'Publish Post';

  return (
    <Modal open={open} onClose={handleClose} width='min(520px, 94vw)'>
      {/* Type switcher */}
      <div className='flex gap-1 mb-5 p-1 bg-[var(--bg)] rounded-md border border-[var(--border)]'>
        {TABS.map(({ id, emoji, label }) => (
          <button
            key={id}
            onClick={() => setAddType(id)}
            className={clsx(
              'flex-1 font-mono text-[11px] font-bold py-1.5 rounded transition-all',
              addType === id
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--ink2)] hover:text-[var(--ink)]',
            )}
          >
            {emoji} {label}
          </button>
        ))}
      </div>
      <div key={addType} className='animate-tab-in'>
        {/* ── Tool form ── */}
        {addType === 'tool' && (
          <div className='flex flex-col gap-3'>
            <div className='grid grid-cols-2 gap-3'>
              <FormGroup label='Tool Name'>
                <Input
                  placeholder='e.g. Circular Saw'
                  value={tool.name}
                  onChange={(e) =>
                    setTool((f) => ({ ...f, name: e.target.value }))
                  }
                  autoFocus
                />
              </FormGroup>
              <FormGroup label='Category'>
                <Select
                  value={tool.cat}
                  onChange={(e) =>
                    setTool((f) => ({
                      ...f,
                      cat: e.target.value as ToolCategory,
                    }))
                  }
                >
                  {TOOL_CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup label='Brand'>
                <Select
                  value={tool.brand}
                  onChange={(e) =>
                    setTool((f) => ({
                      ...f,
                      brand: e.target.value as BrandName,
                    }))
                  }
                >
                  {BRAND_NAMES.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup label='Model (optional)'>
                <Input
                  placeholder='e.g. DWS779'
                  value={tool.model}
                  onChange={(e) =>
                    setTool((f) => ({ ...f, model: e.target.value }))
                  }
                />
              </FormGroup>
            </div>
            <FormGroup label='Notes'>
              <Input
                placeholder='Battery type, condition, etc.'
                value={tool.notes}
                onChange={(e) =>
                  setTool((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </FormGroup>
          </div>
        )}

        {/* ── Project form ── */}
        {addType === 'project' && (
          <div className='flex flex-col gap-3'>
            <FormGroup label='Project Name'>
              <Input
                placeholder='e.g. Deck Refinishing'
                value={project.name}
                onChange={(e) =>
                  setProject((f) => ({ ...f, name: e.target.value }))
                }
                autoFocus
              />
            </FormGroup>
            <div className='grid grid-cols-2 gap-3'>
              <FormGroup label='Type'>
                <Select
                  value={project.type}
                  onChange={(e) =>
                    setProject((f) => ({
                      ...f,
                      type: e.target.value as ProjectType,
                    }))
                  }
                >
                  <option>DIY</option>
                  <option>Paid</option>
                  <option>Mixed</option>
                </Select>
              </FormGroup>
              <FormGroup label='Status'>
                <Select
                  value={project.status}
                  onChange={(e) =>
                    setProject((f) => ({
                      ...f,
                      status: e.target.value as ProjectStatus,
                    }))
                  }
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
                  value={project.cost}
                  onChange={(e) =>
                    setProject((f) => ({
                      ...f,
                      cost: Math.max(0, parseFloat(e.target.value) || 0),
                    }))
                  }
                />
              </FormGroup>
              <FormGroup label='Est. Time (hrs)'>
                <Input
                  type='number'
                  min='0'
                  value={project.time}
                  onChange={(e) =>
                    setProject((f) => ({
                      ...f,
                      time: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </FormGroup>
            </div>
            <FormGroup label='Tools Needed (comma separated)'>
              <Input
                placeholder='Drill, Circular Saw, Level'
                value={project.tools}
                onChange={(e) =>
                  setProject((f) => ({ ...f, tools: e.target.value }))
                }
              />
            </FormGroup>
            <FormGroup label='Description'>
              <Input
                placeholder='What is this project?'
                value={project.description}
                onChange={(e) =>
                  setProject((f) => ({ ...f, description: e.target.value }))
                }
              />
            </FormGroup>
          </div>
        )}

        {/* ── Post form ── */}
        {addType === 'post' && (
          <div className='flex flex-col gap-3'>
            <div className='grid grid-cols-2 gap-3'>
              <FormGroup label='Title'>
                <Input
                  placeholder='What did you build or learn?'
                  value={post.title}
                  onChange={(e) =>
                    setPost((f) => ({ ...f, title: e.target.value }))
                  }
                  autoFocus
                />
              </FormGroup>
              <FormGroup label='Type'>
                <Select
                  value={post.type}
                  onChange={(e) =>
                    setPost((f) => ({ ...f, type: e.target.value as PostType }))
                  }
                >
                  <option>DIY</option>
                  <option>Paid</option>
                  <option>Review</option>
                  <option>Tips</option>
                </Select>
              </FormGroup>
            </div>
            <FormGroup label='Tags (comma separated)'>
              <Input
                placeholder='deck, stain, outdoor'
                value={post.tags}
                onChange={(e) =>
                  setPost((f) => ({ ...f, tags: e.target.value }))
                }
              />
            </FormGroup>
            <div>
              <label className='block text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--ink3)] mb-1'>
                Quick Stats
              </label>
              <div className='grid grid-cols-2 gap-2'>
                <Input
                  type='number'
                  min='0'
                  value={post.cost}
                  onChange={(e) =>
                    setPost((f) => ({ ...f, cost: e.target.value }))
                  }
                  placeholder='Cost e.g. $240'
                />
                <Input
                  min='0'
                  type='number'
                  value={post.time}
                  onChange={(e) =>
                    setPost((f) => ({ ...f, time: e.target.value }))
                  }
                  placeholder='Time e.g. 6 hrs'
                />
                <Input
                  value={post.toolsUsed}
                  onChange={(e) =>
                    setPost((f) => ({ ...f, toolsUsed: e.target.value }))
                  }
                  placeholder='Tools used'
                />
                <Input
                  value={post.materials}
                  onChange={(e) =>
                    setPost((f) => ({ ...f, materials: e.target.value }))
                  }
                  placeholder='Key materials'
                />
              </div>
            </div>
            <MarkdownInput
              value={post.body}
              onChange={(v) => setPost((f) => ({ ...f, body: v }))}
              className='h-28'
            />
          </div>
        )}
      </div>{' '}
      {/* end animate-tab-in */}
      <div className='flex justify-end gap-2 mt-4 pt-3 border-t border-[var(--border2)]'>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant='primary' onClick={submit}>
          {saveLabel}
        </Button>
      </div>
    </Modal>
  );
}
