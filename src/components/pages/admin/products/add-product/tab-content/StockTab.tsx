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
import { Tag, RotateCw, Truck, Globe, Sliders, Lock, Type as type, LucideIcon, TagsIcon, BadgePercent, Package, LayersPlus } from 'lucide-react';

import { formatCurrencyAmount, getCurrencySymbol, initCurrency } from '@/lib/utils/formatCurrency';
import LoadingData from '@/components/common/loader/LoadingData';

export default function StockTab() {
	function InfoRow({ label, value }: { label: string; value: string }) {
		return (
			<div className="grid md:grid-cols-2 gap-2 grid-cols-1 text-sm py-3 border-b last:border-none">
				<div className="text-muted-foreground font-semibold">{label}</div>
				<div className="font-medium ">{value}</div>
			</div>
		);
	}
	return (
		<div className="space-y-5 max-w-sm">
			<div className="space-y-2">
				<Label className="">Add Stock</Label>
				<InputGroup>
					<InputGroupAddon side="left">
						<InputGroupText>
							<LayersPlus size={16} />
						</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput defaultValue={0} type="number" className="pl-9" leftAddon />
				</InputGroup>
			</div>
			<div className="">
				<InfoRow label="Product in stock now:" value={`${getCurrencySymbol()} 1,090`} />
				<InfoRow label="Last time restocked:" value="30th June, 2021" />
				<InfoRow label="Total stock over lifetime" value="20,000" />
			</div>
		</div>
	);
}
