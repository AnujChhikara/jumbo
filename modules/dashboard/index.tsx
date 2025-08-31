'use client';

import { UsersApi } from '@/api/users/users.api';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { useToast } from '@/components/toast-provider';
import { UserFormDialog } from '@/components/user-form-dialog';
import { UserTable } from '@/components/user-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { User } from '../../api/users/users.types';

export const UserDashboard = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchTerm = searchParams.get('search') || '';
  const selectedCompany = searchParams.get('company') || 'all';
  const usersPerPage = 8;

  const {
    data: paginatedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users', 'paginated', currentPage, usersPerPage],
    queryFn: () => UsersApi.getUsersPaginated.fn(currentPage, usersPerPage),
  });

  const users = paginatedData?.users ?? [];
  const totalPages = paginatedData?.totalPages ?? 0;
  const allUsers = users;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSearchChange = (search: string) => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const handleCompanyChange = (company: string) => {
    const params = new URLSearchParams(searchParams);
    if (company && company !== 'all') {
      params.set('company', company);
    } else {
      params.delete('company');
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

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
    onSuccess: (data, deletedUser) => {
      queryClient.setQueriesData({ queryKey: ['users'] }, (old: any) => {
        if (!old) return old;

        if (old.users) {
          const updatedUsers = old.users.filter(
            (u: User) => u.id !== deletedUser.id
          );
          return {
            ...old,
            users: updatedUsers,
            total: old.total - 1,
            totalPages: Math.ceil((old.total - 1) / 8),
          };
        }

        return old;
      });

      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      showToast('success', 'User deleted successfully');
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
      <div className='min-w-7xl space-y-4'>
        <h1 className='text-2xl font-bold'>User Dashboard</h1>
        <UserTable
          allUsers={allUsers ?? []}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onAddUser={handleAddUser}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          selectedCompany={selectedCompany}
          onSearchChange={handleSearchChange}
          onCompanyChange={handleCompanyChange}
        />
      </div>

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
  );
};
