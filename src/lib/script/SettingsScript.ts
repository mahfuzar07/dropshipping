export default function SettingsScript() {
	try {
		const settings = localStorage.getItem('app-settings');
		let initialTheme = 'light';
		let initialLanguage = 'en';

		if (settings) {
			const parsed = JSON.parse(settings);
			initialTheme = parsed.state?.theme || 'light';
			initialLanguage = parsed.state?.language || 'en';
		}
		const root = document.documentElement;
		root.lang = initialLanguage;
		root.classList.remove('light', 'dark');
		if (initialTheme === 'light') {
			// const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'light';
			root.classList.add(systemTheme);
		} else {
			root.classList.add(initialTheme);
		}
	} catch (e) {
		document.documentElement.classList.add('light');
		document.documentElement.lang = 'en';
	}
}
