'use client';

import { UsersApi } from '@/api/users/users.api';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { UserFormDialog } from '@/components/user-form-dialog';
import { UserTable } from '@/components/user-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { User } from '../../api/users/users.types';

export const UserDashboard = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => UsersApi.getUserData.fn(),
  });

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: (user: User) => UsersApi.deleteUser.fn(user.id),
    onMutate: async deletedUser => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old: User[] | undefined) => {
        if (!old) return [];
        return old.filter(user => user.id !== deletedUser.id);
      });
      return { previousUsers };
    },
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    },
  });

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='min-w-7xl mx-auto flex'>
      <div className=' flex flex-col  gap-4  '>
        <h1 className='text-2xl font-bold text-foreground mb-2'>
          User Dashboard
        </h1>
        <UserTable
          users={users ?? []}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onAddUser={handleAddUser}
        />
        <UserFormDialog
          user={editingUser}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
        <DeleteConfirmationDialog
          user={userToDelete}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};
