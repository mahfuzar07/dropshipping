'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/custom/searchable-select';
import { useSettingsFormStore } from '@/z-store/admin/useSettingsFormStore';

const CountryOptions = [
	{ value: 'BD', label: 'Bangladesh' },
	{ value: 'IND', label: 'India' },
	{ value: 'PAK', label: 'Pakistan' },
];

const LanguageOptions = [
	{ value: 'en', label: 'English' },
	{ value: 'bn', label: 'Bangla' },
];

const ThemesOptions = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
];

const CurrencyOptions = [
	{ value: 'BDT', label: 'BDT (৳)' },
	{ value: 'USD', label: 'USD ($)' },
];

export default function LocalizationSettings() {
	const { formData, setField } = useSettingsFormStore();

	return (
		<Card className="shadow border-none">
			<CardHeader className="border-b !pb-3 font-hanken">
				<CardTitle>Localization Settings</CardTitle>
			</CardHeader>
			<CardContent className="text-dashboard-muted space-y-5">
				<div className="grid gap-5 grid-cols-1 md:grid-cols-4">
					<div className="space-y-2">
						<Label>Country</Label>

						<SearchableSelect
							options={CountryOptions}
							value={formData.country}
							onChange={(value) => setField('country', value)}
							placeholder="Select Country"
						/>
					</div>
					<div className="space-y-2">
						<Label>Language</Label>

						<SearchableSelect
							options={LanguageOptions}
							value={formData.language}
							onChange={(value) => setField('language', value)}
							placeholder="Select Language"
						/>
					</div>
					<div className="space-y-2">
						<Label>Currency</Label>

						<SearchableSelect
							options={CurrencyOptions}
							value={formData.currency}
							onChange={(value) => setField('currency', value)}
							placeholder="Select Currency"
						/>
					</div>{' '}
					<div className="space-y-2">
						<Label>Themes</Label>

						<SearchableSelect
							options={ThemesOptions}
							value={formData.theme}
							onChange={(value) => setField('theme', value)}
							placeholder="Select Theme"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
