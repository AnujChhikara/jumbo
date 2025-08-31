import { UserDashboard } from '@/modules/dashboard';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-start min-h-screen p-4'>
      <Suspense fallback={<div>Loading...</div>}>
        <UserDashboard />
      </Suspense>
    </div>
  );
}
