'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrayInput } from '@/components/ui/custom/array-input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { OptionsSettings, SettingsFormData } from '@/types/types';
import { SearchableSelect } from '@/components/ui/custom/searchable-select';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';

type Props = {
	formData: SettingsFormData;
	setFormData: React.Dispatch<React.SetStateAction<SettingsFormData>>;
	handleFormDataChange: (field: keyof SettingsFormData) => any;
};

export default function ProductInformation({ formData, setFormData, handleFormDataChange }: Props) {
	const { openDrawer } = useLayoutStore();
	return (
		<Card className="shadow border-none h-full">
			<CardHeader className="border-b !pb-3 font-hanken">
				<CardTitle>Product Information</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5 text-dashboard-muted">
				<div className="grid gap-5 grid-cols-1 md:grid-cols-3">
					<div className="space-y-2 md:col-span-2">
						<Label>Product Name</Label>
						<Input value={formData.metaTitle} onChange={handleFormDataChange('metaTitle')} placeholder="Enter Product title" />
					</div>
					<div className="space-y-2">
						<Label className="flex items-center justify-between">
							Categories
							<button
								type="button"
								onClick={() => openDrawer({ drawerType: 'add-category', drawerData: {} })}
								className="text-xs cursor-pointer text-dashboard-primary hover:underline"
							>
								Add New
							</button>
						</Label>
						<SearchableSelect
							options={[
								{ value: 'cat-1', label: 'Category-1' },
								{ value: 'cat-2', label: 'Category-2' },
								{ value: 'cat-3', label: 'Category-3' },
							]}
							value={formData.country}
							onChange={(value) =>
								setFormData((prev) => ({
									...prev,
									country: value as OptionsSettings['value'],
								}))
							}
							placeholder="Select Category"
						/>
					</div>
				</div>

				<div className="space-y-3">
					<Label>Product Tags</Label>
					<ArrayInput
						placeholder="Type tags & press Enter"
						value={formData.metaKeywords}
						onChange={(newKeywords) =>
							setFormData((prev) => ({
								...prev,
								metaKeywords: newKeywords,
							}))
						}
					/>
				</div>

				<div className="space-y-2">
					<Label>Product Description</Label>
					<Textarea placeholder="Type meta description..." value={formData.metaDescription} onChange={handleFormDataChange('metaDescription')} />
				</div>
			</CardContent>
		</Card>
	);
}
