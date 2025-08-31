import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActivityLogEntry {
  id: string;
  action: 'created' | 'updated' | 'deleted';
  userId: number;
  userName: string;
  timestamp: Date | string;
  details: string;
}

interface ActivityLogState {
  logs: ActivityLogEntry[];
  addLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  getLogs: () => ActivityLogEntry[];
}

export const useActivityLogStore = create<ActivityLogState>()(
  persist(
    (set, get) => ({
      logs: [],
      addLog: entry => {
        const newLog: ActivityLogEntry = {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        set(state => ({
          logs: [newLog, ...state.logs].slice(0, 100),
        }));
      },
      clearLogs: () => set({ logs: [] }),
      getLogs: () => get().logs,
    }),
    {
      name: 'activity-log-storage',
    }
  )
);
