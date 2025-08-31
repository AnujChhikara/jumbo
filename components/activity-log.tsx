'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Clock, Trash2, UserCheck, UserPlus, UserX, X } from 'lucide-react';
import {
  ActivityLogEntry,
  useActivityLogStore,
} from '../stores/use-activity-log-store';

type ActivityLogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const getActionIcon = (action: ActivityLogEntry['action']) => {
  switch (action) {
    case 'created':
      return <UserPlus className='w-4 h-4 text-green-500' />;
    case 'updated':
      return <UserCheck className='w-4 h-4 text-blue-500' />;
    case 'deleted':
      return <UserX className='w-4 h-4 text-red-500' />;
    default:
      return <UserCheck className='w-4 h-4' />;
  }
};

const getActionText = (action: ActivityLogEntry['action']) => {
  switch (action) {
    case 'created':
      return 'Created';
    case 'updated':
      return 'Updated';
    case 'deleted':
      return 'Deleted';
    default:
      return action;
  }
};

const formatTimestamp = (timestamp: Date | string) => {
  const now = new Date();
  const timestampDate =
    typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const diffInMinutes = Math.floor(
    (now.getTime() - timestampDate.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  }
};

export const ActivityLog = ({ isOpen, onClose }: ActivityLogProps) => {
  const { logs, clearLogs } = useActivityLogStore();

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50' />
        <Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl h-[650px] z-50 flex flex-col overflow-hidden'>
          <div className='flex items-center justify-between px-8 py-6 bg-gradient-to-r from-background to-muted/20 border-b border-border/50 flex-shrink-0'>
            <div className='flex items-center gap-3'>
              <div className='w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'></div>
              <Dialog.Title className='text-xl font-bold text-foreground tracking-tight'>
                Activity Feed
              </Dialog.Title>
              {logs.length > 0 && (
                <span className='px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full'>
                  {logs.length}
                </span>
              )}
            </div>
            <div className='flex items-center gap-1'>
              <button
                onClick={clearLogs}
                className='p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200'
                title='Clear all logs'
              >
                <Trash2 className='w-4 h-4' />
              </button>
              <Dialog.Close asChild>
                <button className='p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-200'>
                  <X className='w-4 h-4' />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto'>
            {logs.length === 0 ? (
              <div className='h-full flex items-center justify-center text-muted-foreground'>
                <div className='text-center space-y-4'>
                  <div className='relative'>
                    <div className='w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mx-auto'>
                      <Clock className='w-8 h-8 opacity-60' />
                    </div>
                    <div className='absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60'></div>
                  </div>
                  <div className='space-y-2'>
                    <p className='font-medium text-foreground/80'>
                      No activity yet
                    </p>
                    <p className='text-sm text-muted-foreground/70'>
                      User actions will appear here
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className='p-6 space-y-3'>
                {logs.map((log, index) => (
                  <div
                    key={log.id}
                    className='group relative flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-border hover:bg-gradient-to-r hover:from-accent/30 hover:to-accent/10 transition-all duration-300 hover:shadow-sm'
                  >
                    {index < logs.length - 1 && (
                      <div className='absolute left-7 top-12 w-0.5 h-8 bg-gradient-to-b from-border/50 to-transparent'></div>
                    )}

                    <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center'>
                      {getActionIcon(log.action)}
                    </div>

                    <div className='flex-1 min-w-0 space-y-2'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <p className='text-sm font-semibold text-foreground'>
                            {getActionText(log.action)} user
                          </p>
                          <div className='w-1 h-1 bg-muted-foreground/40 rounded-full'></div>
                          <p className='text-sm font-medium text-foreground/90'>
                            {log.userName}
                          </p>
                        </div>
                        <span className='text-xs font-medium text-muted-foreground/70 bg-muted/50 px-2 py-1 rounded-lg'>
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className='text-sm text-muted-foreground/80 leading-relaxed'>
                        {log.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
