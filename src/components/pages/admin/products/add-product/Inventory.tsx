'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrayInput } from '@/components/ui/custom/array-input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { OptionsSettings, SettingsFormData } from '@/types/types';
import { SearchableSelect } from '@/components/ui/custom/searchable-select';
import { Tag, RotateCw, Truck, Globe, Sliders, Lock, Type as type, LucideIcon, TagsIcon, BadgePercent, Package, SquareStack } from 'lucide-react';
import InventoryTabs from './InventoryTabs';
import { formatCurrencyAmount, getCurrencySymbol, initCurrency } from '@/lib/utils/formatCurrency';
import LoadingData from '@/components/common/loader/LoadingData';
import PricingTab from './tab-content/PricingTab';
import AttributesTab from './tab-content/AttributesTab';
import DiscountTab from './tab-content/DiscountTab';
import StockTab from './tab-content/StockTab';
import VarientsTab from './tab-content/VarientsTab';

interface TabItem {
	id: string;
	label: string;
	icon: LucideIcon;
	content: React.ReactNode;
}

type Props = {
	formData: SettingsFormData;
	setFormData: React.Dispatch<React.SetStateAction<SettingsFormData>>;
	handleFormDataChange: (field: keyof SettingsFormData) => any;
};

export default function Inventory({ formData, setFormData, handleFormDataChange }: Props) {
	const [ready, setReady] = useState(false);

	const inventoryTabs: TabItem[] = [
		{
			id: 'pricing',
			label: 'Pricing',
			icon: Tag,
			content: <PricingTab />,
		},
		{
			id: 'restock',
			label: 'Stock',
			icon: Package,

			content: <StockTab />,
		},

		{
			id: 'discount',
			label: 'Discount',
			icon: BadgePercent,
			content: <DiscountTab />,
		},
		{
			id: 'attributes',
			label: 'Attributes',
			icon: Sliders,
			content: (
				<div>
					<h3 className="font-semibold mb-2">Advanced</h3>
					<AttributesTab />
				</div>
			),
		},
		{
			id: 'varients',
			label: 'Varients',
			icon: SquareStack,

			content: (
				<div>
					<h3 className="font-semibold mb-2">First Create Attributes</h3>
					<VarientsTab />
				</div>
			),
		},
	];

	useEffect(() => {
		async function loadCurrency() {
			await initCurrency();
			setReady(true);
		}
		loadCurrency();
	}, []);

	return (
		<Card className="shadow-none border gap-0 pb-0">
			<CardHeader className="border-b !pb-3 font-hanken">
				<CardTitle>Inventory</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5 text-dashboard-muted !pb-0 !px-0">
				<InventoryTabs tabs={inventoryTabs} />
			</CardContent>
		</Card>
	);
}
