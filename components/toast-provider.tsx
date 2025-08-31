'use client';

import * as Toast from '@radix-ui/react-toast';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { createContext, useContext, useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastData = {
  id: string;
  type: ToastType;
  title: string;
};

type ToastContextType = {
  showToast: (type: ToastType, title: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className='w-5 h-5 text-green-500' />;
    case 'error':
      return <AlertTriangle className='w-5 h-5 text-red-500' />;
    case 'warning':
      return <AlertTriangle className='w-5 h-5 text-yellow-500' />;
    case 'info':
      return <Info className='w-5 h-5 text-blue-500' />;
    default:
      return null;
  }
};

const getToastStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
    case 'error':
      return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
    case 'warning':
      return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
    case 'info':
      return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
    default:
      return 'border-border bg-background';
  }
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (type: ToastType, title: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = { id, type, title };

    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast.Provider swipeDirection='right'>
        {toasts.map(toast => (
          <Toast.Root
            key={toast.id}
            className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg ${getToastStyles(toast.type)}`}
            onOpenChange={() => removeToast(toast.id)}
          >
            <div className='flex-shrink-0'>{getToastIcon(toast.type)}</div>
            <div className='flex-1'>
              <Toast.Title className='text-sm font-medium text-white'>
                {toast.title}
              </Toast.Title>
            </div>
            <Toast.Close asChild>
              <button className='flex-shrink-0 p-1 hover:bg-accent rounded transition-colors'>
                <X className='w-4 h-4 text-white' />
              </button>
            </Toast.Close>
          </Toast.Root>
        ))}
        <Toast.Viewport className='fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm' />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};
