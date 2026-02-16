import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface UIStore {
    darkMode: boolean;
    copied: boolean;
    currentPreset: string | null;
    showKeyboardHelp: boolean;
    notifications: Notification[];

    toggleDarkMode: () => void;
    setDarkMode: (value: boolean) => void;
    setCopied: (value: boolean) => void;
    setCurrentPreset: (id: string | null) => void;
    toggleKeyboardHelp: () => void;
    addNotification: (message: string, type?: NotificationType) => void;
    removeNotification: (id: string) => void;
}

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            darkMode: true,
            copied: false,
            currentPreset: null,
            showKeyboardHelp: false,
            notifications: [],

            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
            setDarkMode: (value: boolean) => set({ darkMode: value }),
            setCopied: (value: boolean) => set({ copied: value }),
            setCurrentPreset: (id: string | null) => set({ currentPreset: id }),
            toggleKeyboardHelp: () => set((state) => ({ showKeyboardHelp: !state.showKeyboardHelp })),

            addNotification: (message: string, type = 'info' as const) => set((state) => ({
                notifications: [
                    ...state.notifications,
                    { id: Date.now().toString(), message, type }
                ]
            })),

            removeNotification: (id: string) => set((state) => ({
                notifications: state.notifications.filter(n => n.id !== id)
            })),
        }),
        {
            name: 'cineprompt-ui-storage',
            partialize: (state) => ({ darkMode: state.darkMode }),
        }
    )
);
