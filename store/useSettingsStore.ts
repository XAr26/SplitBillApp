import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface SettingsState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

// Fallback storage if AsyncStorage is missing
const dummyStorage: StateStorage = {
  getItem: (name) => null,
  setItem: (name, value) => {},
  removeItem: (name) => {},
};

let storage = dummyStorage;

try {
  // Try to use AsyncStorage, but don't crash if it's not found
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  if (AsyncStorage) {
    storage = AsyncStorage;
  }
} catch (e) {
  console.warn('AsyncStorage not found, using dummy storage');
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => storage),
    }
  )
);
