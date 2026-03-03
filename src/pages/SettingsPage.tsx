import { BrandPicker } from '@/components/settings/BrandPicker';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FormGroup } from '@/components/ui/FormGroup';
import { Input, Select } from '@/components/ui/Input';
import { LocationAutocomplete } from '@/components/ui/LocationAutocomplete';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAppStore } from '@/store/StoreContext';
import type { ThemeId } from '@/types';
import { useRef, useState } from 'react';

type PendingAction = 'tools' | 'projects' | 'all' | null;

const CONFIRM_CONFIG: Record<
  Exclude<PendingAction, null>,
  { title: string; description: string; confirmLabel: string }
> = {
  tools: {
    title: 'Clear All Tools?',
    description:
      'This will permanently delete every tool in your inventory. This cannot be undone.',
    confirmLabel: '🔧 Clear All Tools',
  },
  projects: {
    title: 'Clear All Projects?',
    description:
      'This will permanently delete every project you have created. This cannot be undone.',
    confirmLabel: '🏗 Clear All Projects',
  },
  all: {
    title: 'Clear All Data?',
    description:
      'This will permanently delete all your tools, projects, posts, and settings. This cannot be undone.',
    confirmLabel: '🗑 Clear Everything',
  },
};

export function SettingsPage() {
  const {
    settings,
    updateSettings,
    exportData,
    importData,
    clearTools,
    clearProjects,
    clearData,
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingAction>(null);

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed?.data && parsed?.settings) {
          importData(parsed);
        } else {
          alert('Invalid backup file — expected a ToolShed JSON export.');
        }
      } catch {
        alert('Could not parse file. Make sure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleConfirm() {
    if (pending === 'tools') clearTools();
    else if (pending === 'projects') clearProjects();
    else if (pending === 'all') clearData();
  }

  const confirmConfig = pending ? CONFIRM_CONFIG[pending] : null;

  return (
    <div>
      <PageHeader
        title='Settings'
        subtitle='Customize your ToolShed experience.'
      />

      <div className='grid grid-cols-2 gap-5 max-w-[800px]'>
        {/* Brand theme — full width */}
        <div className='col-span-2 bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-lg p-5 transition-colors duration-300'>
          <h3 className='font-serif text-[16px] font-bold text-[var(--ink)] mb-1'>
            Brand Theme
          </h3>
          <p className='text-[10px] text-[var(--ink3)] mb-4 leading-[1.6]'>
            Skin the whole app to match your preferred tool brand. Changes
            accent colors, grid tint, and UI mood instantly.
          </p>
          <BrandPicker
            current={settings.theme}
            onChange={(id: ThemeId) => updateSettings({ theme: id })}
          />
        </div>

        {/* Your Info */}
        <div className='bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-lg p-5 transition-colors duration-300'>
          <h3 className='font-serif text-[16px] font-bold text-[var(--ink)] mb-1'>
            Your Info
          </h3>
          <p className='text-[10px] text-[var(--ink3)] mb-4 leading-[1.6]'>
            Personalize the dashboard greeting.
          </p>
          <div className='flex flex-col gap-3'>
            <FormGroup label='Your Name'>
              <Input
                placeholder='e.g. Mike'
                value={settings.name}
                onChange={(e) => updateSettings({ name: e.target.value })}
              />
            </FormGroup>
            <FormGroup label='Location'>
              <LocationAutocomplete
                placeholder='e.g. Nashville, TN'
                value={settings.location}
                onChange={(loc) =>
                  updateSettings({
                    location: loc,
                    locationLat: undefined,
                    locationLon: undefined,
                  })
                }
                onSelect={({ label, lat, lon }) =>
                  updateSettings({
                    location: label,
                    locationLat: lat,
                    locationLon: lon,
                  })
                }
              />
            </FormGroup>
          </div>
        </div>

        {/* Preferences */}
        <div className='bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-lg p-5 transition-colors duration-300'>
          <h3 className='font-serif text-[16px] font-bold text-[var(--ink)] mb-1'>
            Preferences
          </h3>
          <p className='text-[10px] text-[var(--ink3)] mb-4 leading-[1.6]'>
            Adjust default display options.
          </p>
          <div className='flex flex-col gap-3'>
            <FormGroup label='Default Project View'>
              <Select
                value={settings.defaultProjectView}
                onChange={(e) =>
                  updateSettings({
                    defaultProjectView: e.target.value as 'grid' | 'list',
                  })
                }
              >
                <option value='grid'>Grid</option>
                <option value='list'>List</option>
              </Select>
            </FormGroup>
            <FormGroup label='Currency Symbol'>
              <Select
                value={settings.currency}
                onChange={(e) => updateSettings({ currency: e.target.value })}
              >
                <option value='$'>$ - United States Dollar (USD)</option>
                <option value='£'>£ - Euro</option>
                <option value='€'>€ - British Pound</option>
                <option value='¥'>¥ - Japanese Yen</option>
                <option disabled value=''>
                  ──────────
                </option>
                <option value='other'>Other</option>
              </Select>
              {settings.currency === 'other' && (
                <Input
                  placeholder='Enter currency symbol'
                  value={''}
                  onChange={(e) => updateSettings({ currency: e.target.value })}
                  className='mt-2'
                />
              )}
            </FormGroup>
          </div>
        </div>

        {/* Data */}
        <div className='col-span-2 bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-lg p-5 transition-colors duration-300'>
          <h3 className='font-serif text-[16px] font-bold text-[var(--ink)] mb-1'>
            Data
          </h3>
          <p className='text-[10px] text-[var(--ink3)] mb-4 leading-[1.6]'>
            Your data is stored locally in your browser. Export it as JSON to
            back it up, or clear everything to start fresh.
          </p>
          <div className='flex gap-2.5 flex-wrap'>
            <Button onClick={exportData}>⬇ Export JSON</Button>
            <Button onClick={() => fileInputRef.current?.click()}>
              ⬆ Import JSON
            </Button>
            <input
              ref={fileInputRef}
              type='file'
              accept='.json'
              className='hidden'
              onChange={handleImport}
            />
          </div>
          <div className='mt-4 pt-4 border-t border-[var(--border2)] flex flex-col gap-2.5'>
            <p className='text-[10px] text-[var(--ink3)] leading-[1.6]'>
              Selectively clear a category, or wipe everything to start fresh.
            </p>
            <div className='flex gap-2.5 flex-wrap'>
              <Button variant='danger' onClick={() => setPending('tools')}>
                🔧 Clear All Tools
              </Button>
              <Button variant='danger' onClick={() => setPending('projects')}>
                🏗 Clear All Projects
              </Button>
              <Button variant='danger' onClick={() => setPending('all')}>
                🗑 Clear All Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {confirmConfig && (
        <ConfirmModal
          open={pending !== null}
          title={confirmConfig.title}
          description={confirmConfig.description}
          confirmLabel={confirmConfig.confirmLabel}
          onConfirm={handleConfirm}
          onClose={() => setPending(null)}
        />
      )}
    </div>
  );
}
