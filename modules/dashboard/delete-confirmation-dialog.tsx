'use client';

import { User } from '@/api/users/users.types';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, Loader2, X } from 'lucide-react';

type DeleteConfirmationDialogProps = {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
};

export const DeleteConfirmationDialog = ({
  user,
  isOpen,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmationDialogProps) => {
  if (!user) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50' />
        <Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border border-border rounded-lg shadow-lg p-6 w-full max-w-md z-50'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10'>
              <AlertTriangle className='w-5 h-5 text-destructive' />
            </div>
            <div>
              <Dialog.Title className='text-lg font-semibold text-foreground'>
                Delete User
              </Dialog.Title>
              <Dialog.Description className='text-sm text-muted-foreground'>
                This action cannot be undone.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className='ml-auto p-1 hover:bg-accent rounded transition-colors'>
                <X className='w-4 h-4' />
              </button>
            </Dialog.Close>
          </div>

          <div className='mb-6'>
            <p className='text-sm text-foreground'>
              Are you sure you want to delete{' '}
              <span className='font-medium text-foreground'>{user.name}</span>?
            </p>
          </div>

          <div className='flex gap-3 justify-end'>
            <Dialog.Close asChild>
              <button
                type='button'
                disabled={isDeleting}
                className='px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className='px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[40px] min-w-[120px] flex items-center justify-center'
            >
              {isDeleting ? (
                <Loader2 className='w-4 h-4 animate-spin text-destructive-foreground' />
              ) : (
                'Delete User'
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
