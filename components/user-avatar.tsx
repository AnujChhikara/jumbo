'use client';

import { useSettingsStore } from '../stores/use-settings-store';

export const UserAvatar = () => {
  const { loggedInUser } = useSettingsStore();

  const user = loggedInUser;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(user.name);

  return (
    <div className='flex items-center gap-3'>
      <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium'>
        {initials}
      </div>
      <div className='hidden sm:block'>
        <p className='text-sm font-medium text-foreground'>{user.name}</p>
      </div>
    </div>
  );
};
