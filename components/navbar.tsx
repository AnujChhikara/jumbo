import { DarkModeSwitch } from './radix/dark-mode-switch';
import { UserAvatar } from './user-avatar';

export function Navbar() {
  return (
    <nav className='border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50'>
      <div className='flex justify-between items-center p-4 px-8 '>
        <h1 className='text-3xl font-semibold text-foreground'>Jumbo</h1>
        <div className='flex items-center gap-4'>
          <UserAvatar />
          <DarkModeSwitch />
        </div>
      </div>
    </nav>
  );
}
