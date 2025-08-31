import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '../api/users/users.types';

type Theme = 'light' | 'dark';

type SettingsState = {
  theme: Theme;
  loggedInUser: User;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setLoggedInUser: (user: User) => void;
};

const defaultLoggedInUser: User = {
  id: 2,
  name: 'Ervin Howell',
  username: 'Antonette',
  email: 'Shanna@melissa.tv',
  address: {
    street: 'Victor Plains',
    suite: 'Suite 879',
    city: 'Wisokyburgh',
    zipcode: '90566-7771',
    geo: {
      lat: '-43.9509',
      lng: '-34.4618',
    },
  },
  phone: '010-692-6593 x09125',
  website: 'anastasia.net',
  company: {
    name: 'Deckow-Crist',
    catchPhrase: 'Proactive didactic contingency',
    bs: 'synergize scalable supply-chains',
  },
};

const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return;

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      loggedInUser: defaultLoggedInUser,
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        set({ theme: newTheme });
        applyTheme(newTheme);
      },
      setTheme: (theme: Theme) => {
        set({ theme });
        applyTheme(theme);
      },
      setLoggedInUser: user => set({ loggedInUser: user }),
    }),
    {
      name: 'settings-storage',
      partialize: state => ({ theme: state.theme }),
      onRehydrateStorage: () => state => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);
