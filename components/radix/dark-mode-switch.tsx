'use client';

import * as Switch from '@radix-ui/react-switch';
import { Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '../../stores/use-settings-store';

export const DarkModeSwitch = () => {
  const { theme, toggleTheme } = useSettingsStore();

  return (
    <div className='flex items-center gap-2'>
      <Sun className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
      <Switch.Root
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        className='relative h-6 w-11 rounded-full bg-neutral-200 transition-colors dark:bg-neutral-800'
      >
        <Switch.Thumb className='block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out will-change-transform data-[state=checked]:translate-x-[22px]' />
      </Switch.Root>
      <Moon className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
    </div>
  );
};
