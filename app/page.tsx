import { UserDashboard } from '@/modules/dashboard';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-start min-h-screen p-4'>
      <UserDashboard />
    </div>
  );
}
