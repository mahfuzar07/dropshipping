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
import { Tag, RotateCw, Truck, Globe, Sliders, Lock, Type as type, LucideIcon, TagsIcon, BadgePercent, Package, TicketPercent } from 'lucide-react';

import { formatCurrencyAmount, getCurrencySymbol, initCurrency } from '@/lib/utils/formatCurrency';
import LoadingData from '@/components/common/loader/LoadingData';

export default function DiscountTab() {
	return (
		<div className="space-y-5 max-w-xs">
			<div className="space-y-2">
				<Label className="">Discount</Label>
				<InputGroup>
					<InputGroupAddon side="left">
						<InputGroupText>
							<TicketPercent size={18} />
						</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput defaultValue={formatCurrencyAmount(0)} type="number" className="pl-9" leftAddon />
				</InputGroup>
			</div>
			<div className="space-y-2">
				<Label className="">Discount Type</Label>
				<SearchableSelect
					triggerClassName="h-9"
					options={[
						{ value: 'FIXED', label: 'FIXED' },
						{ value: 'PERCENTAGE', label: 'PERCENTAGE' },
					]}
					value="FIXED"
					placeholder="Discount Type"
				/>
			</div>
		</div>
	);
}
