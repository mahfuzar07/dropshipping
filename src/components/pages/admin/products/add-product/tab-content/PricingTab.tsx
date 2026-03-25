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
import { Tag, RotateCw, Truck, Globe, Sliders, Lock, Type as type, LucideIcon, TagsIcon, BadgePercent, Package } from 'lucide-react';

import { formatCurrencyAmount, getCurrencySymbol, initCurrency } from '@/lib/utils/formatCurrency';
import LoadingData from '@/components/common/loader/LoadingData';

export default function PricingTab() {
	// const [ready, setReady] = useState(false);
	// useEffect(() => {
	// 	async function loadCurrency() {
	// 		await initCurrency();
	// 		setReady(true);
	// 	}
	// 	loadCurrency();
	// }, []);

	return (
		<div className="space-y-5 max-w-xs">
			<div className="space-y-2">
				<Label className="">Base Price</Label>
				<InputGroup>
					<InputGroupAddon side="left">
						<InputGroupText>{getCurrencySymbol()}</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput defaultValue={formatCurrencyAmount(0)} type="number" className="pl-7" leftAddon />
				</InputGroup>
			</div>
			<div className="space-y-2">
				<Label className="">Sales Price</Label>
				<InputGroup>
					<InputGroupAddon side="left">
						<InputGroupText>{getCurrencySymbol()}</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput defaultValue={formatCurrencyAmount(0)} type="number" className="pl-7" leftAddon />
				</InputGroup>
			</div>
		</div>
	);
}
