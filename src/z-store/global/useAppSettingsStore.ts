'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type Language = 'en' | 'bn';

interface AppSettingsState {
	theme: Theme;
	currency_sign: string;
	language: string;
	setTheme: (theme: Theme) => void;
	setCurrencySign: (currencySign: string) => void;
	setLanguage: (language: Language) => void;
	resetSettings: () => void;
}

const STORAGE_KEY = 'app-settings';

const applyTheme = (theme: Theme) => {
	if (typeof window === 'undefined') return;
	const root = window.document.documentElement;
	root.classList.remove('light', 'dark');

	if (theme === 'system') {
		// const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'light';
		root.classList.add(systemTheme);
	} else {
		root.classList.add(theme);
	}
};
const applyLanguage = (language: Language) => {
	if (typeof window === 'undefined') return;
	document.documentElement.lang = language || 'en';
};

export const useAppSettingsStore = create<AppSettingsState>()(
	persist(
		(set) => ({
			theme: 'light',
			currency_sign: '$',
			language: 'en',

			setTheme: (theme: Theme) => {
				set({ theme });
				applyTheme(theme);
			},

			setCurrencySign: (currencySign: string) => set({ currency_sign: currencySign }),

			setLanguage: (language: Language) => {
				set({ language });
				applyLanguage(language);
			},

			resetSettings: () => {
				set({
					theme: 'light',
					currency_sign: '$',
					language: 'en',
				});
				applyTheme('light');
				applyLanguage('en');
			},
		}),
		{
			name: STORAGE_KEY,
			storage: createJSONStorage(() => localStorage),
		}
	)
);
