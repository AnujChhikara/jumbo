'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { UsersApi } from '../api/users/users.api';
import { User } from '../api/users/users.types';
import { ActivityLogEntry } from '../stores/use-activity-log-store';
import { useToast } from './toast-provider';

interface UserFormDialogProps {
  user?: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAction?: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
}

const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(1, 'Phone is required'),
  company: z.string().min(1, 'Company is required'),
});

type UserFormData = z.infer<typeof userFormSchema>;

type PaginatedUsersData = {
  users: User[];
  total: number;
  totalPages: number;
};

export const UserFormDialog = ({
  user,
  isOpen,
  onOpenChange,
  onUserAction,
}: UserFormDialogProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const isEditing = !!user;

  const createUserData = (formData: UserFormData): User => ({
    id: user?.id || Date.now(),
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    username: formData.name,
    website: `${formData.name.toLowerCase().replace(/\s+/g, '')}.com`,
    address: {
      street: '123 Main St',
      suite: 'Apt 1',
      city: 'New York',
      zipcode: '10001',
      geo: { lat: '40.7128', lng: '-74.0060' },
    },
    company: {
      name: formData.company,
      catchPhrase: 'Innovation at its finest',
      bs: 'synergize scalable supply-chains',
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company.name,
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
      });
    }
  }, [user, isOpen, reset]);

  const { mutate: saveUser, isPending } = useMutation({
    mutationFn: async (formData: UserFormData) => {
      const userData = createUserData(formData);

      if (isEditing) {
        return UsersApi.updateUser.fn(userData);
      } else {
        return UsersApi.createUser.fn(userData);
      }
    },
    onSuccess: (data, formData) => {
      const userData = createUserData(formData);

      if (onUserAction) {
        onUserAction({
          action: isEditing ? 'updated' : 'created',
          userId: userData.id,
          userName: userData.name,
          details: `${isEditing ? 'Updated' : 'Created'} user ${userData.name} (${userData.email})`,
        });
      }

      queryClient.setQueriesData(
        { queryKey: ['users'] },
        (old: PaginatedUsersData | undefined) => {
          if (!old) return old;

          if (old.users) {
            if (isEditing) {
              const updatedUsers = old.users.map((u: User) =>
                u.id === userData.id ? userData : u
              );
              return { ...old, users: updatedUsers };
            } else {
              return {
                ...old,
                users: [userData, ...old.users],
                total: old.total + 1,
                totalPages: Math.ceil((old.total + 1) / 8),
              };
            }
          }

          return old;
        }
      );

      onOpenChange(false);
      reset();
      showToast(
        'success',
        isEditing ? 'User updated successfully' : 'User created successfully'
      );
    },
  });

  const onSubmit = (data: UserFormData) => {
    saveUser(data);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50' />
        <Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border border-border rounded-lg shadow-lg p-6 w-full max-w-md z-50'>
          <div className='flex items-center justify-between mb-6'>
            <Dialog.Title className='text-xl font-semibold text-foreground'>
              {isEditing ? 'Edit User' : 'Add User'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className='p-1 hover:bg-accent rounded transition-colors'>
                <X className='w-4 h-4' />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-foreground mb-1'
              >
                Name *
              </label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id='name'
                    type='text'
                    className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                      errors.name ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder='Enter full name'
                  />
                )}
              />
              {errors.name && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-foreground mb-1'
              >
                Email *
              </label>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id='email'
                    type='email'
                    className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                      errors.email ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder='Enter email address'
                  />
                )}
              />
              {errors.email && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-foreground mb-1'
              >
                Phone *
              </label>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id='phone'
                    type='tel'
                    className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                      errors.phone ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder='Enter phone number'
                  />
                )}
              />
              {errors.phone && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='company'
                className='block text-sm font-medium text-foreground mb-1'
              >
                Company *
              </label>
              <Controller
                name='company'
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id='company'
                    type='text'
                    className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                      errors.company ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder='Enter company name'
                  />
                )}
              />
              {errors.company && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.company.message}
                </p>
              )}
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='submit'
                disabled={isPending}
                className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[40px] min-w-[120px]'
              >
                {isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin text-primary-foreground' />
                ) : (
                  <>{isEditing ? 'Update User' : 'Add User'}</>
                )}
              </button>
              <Dialog.Close asChild>
                <button
                  type='button'
                  className='px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-accent transition-colors'
                >
                  Cancel
                </button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
