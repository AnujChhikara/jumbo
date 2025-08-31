import { DarkModeSwitch } from './radix/dark-mode-switch';

export function Navbar() {
  return (
    <nav className=''>
      <div className='flex justify-between items-center p-4 max-w-7xl mx-auto'>
        <h1 className='text-3xl font-semibold'>Jumbo</h1>
        <DarkModeSwitch />
      </div>
    </nav>
  );
}
