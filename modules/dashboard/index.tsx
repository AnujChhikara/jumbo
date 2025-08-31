'use client';

import { UsersApi } from '@/api/users/users.api';
import { UserTable } from '@/components/user-table';
import { useQuery } from '@tanstack/react-query';

export const UserDashboard = () => {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => UsersApi.getUserData.fn(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='min-w-7xl mx-auto flex'>
      <div className=' flex flex-col  gap-4  '>
        <h1 className='text-2xl font-bold text-foreground mb-2'>
          User Dashboard
        </h1>
        <UserTable users={users ?? []} onEdit={() => {}} onDelete={() => {}} />
      </div>
    </div>
  );
};
