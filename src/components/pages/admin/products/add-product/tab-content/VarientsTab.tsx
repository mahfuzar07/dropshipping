'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { SearchableSelect } from '@/components/ui/custom/searchable-select';

const ViewTypeOptions = [
	{ value: 'DROPDOWN', label: 'Dropdown' },
	{ value: 'RADIO', label: 'Radio' },
];
const StatusOptions = [
	{ value: 'DRAFT', label: 'Draft' },
	{ value: 'ACTIVE', label: 'Active' },
	{ value: 'INACTIVE', label: 'Inactive' },
];

type AttributeValueForm = {
	value: string;
	price: number;
	discount: number;
	stock: number;
};

type AttributeForm = {
	name: string;
	code: string;
	values: AttributeValueForm[];
};

type VariantFormState = {
	attributes: AttributeForm[];
};

const dummyInitialData: VariantFormState = {
	attributes: [
		{
			name: 'Color',
			code: 'color',
			values: [{ value: 'Red', price: 0, discount: 0, stock: 10 }],
		},
	],
};

export default function VarientsTab() {
	const [variants, setVariants] = useState<VariantFormState>(dummyInitialData);

	const addAttribute = () => {
		setVariants((prev) => ({
			...prev,
			attributes: [
				...prev.attributes,
				{
					name: '',
					code: '',
					values: [{ value: '', price: 0, discount: 0, stock: 0 }],
				},
			],
		}));
	};

	const addValue = (attrIndex: number) => {
		setVariants((prev) => {
			const copy = structuredClone(prev);
			copy.attributes[attrIndex].values.push({
				value: '',
				price: 0,
				discount: 0,
				stock: 0,
			});
			return copy;
		});
	};

	const updateAttribute = (i: number, field: 'name' | 'code', value: string) => {
		setVariants((prev) => {
			const copy = structuredClone(prev);
			copy.attributes[i][field] = value;
			if (field === 'name') {
				copy.attributes[i].code = value.toLowerCase().replace(/\s+/g, '-');
			}
			return copy;
		});
	};

	const updateValue = (attrIndex: number, valIndex: number, field: keyof AttributeValueForm, value: string | number) => {
		setVariants((prev) => {
			const copy = structuredClone(prev);
			// @ts-ignore
			copy.attributes[attrIndex].values[valIndex][field] = value;
			return copy;
		});
	};

	return (
		<div className="space-y-3">
			{variants.attributes.map((attr, attrIndex) => (
				<div key={attrIndex} className="border rounded-xl p-4 space-y-3 ">
					{/* Attribute Header */}
					<div className="grid md:grid-cols-3 gap-3">
						<div className="space-y-5">
							<Label className="text-sm">Attributes Name</Label>
							<Input
								placeholder="Attribute Name (Color, Size)"
								value={attr.name}
								onChange={(e) => updateAttribute(attrIndex, 'name', e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-sm">View Type</Label>
							<SearchableSelect
								options={ViewTypeOptions}
								// value={formData.departmentId}
								// onChange={(v) => {
								// 	setField('departmentId', v);

								// 	setField('designationId', '');
								// }}
							/>
						</div>

						<div className="space-y-2">
							<Label className="text-sm">Status</Label>
							<SearchableSelect
								options={StatusOptions}
								// value={formData.departmentId}
								// onChange={(v) => {
								// 	setField('departmentId', v);

								// 	setField('designationId', '');
								// }}
							/>
						</div>

						{/* <Input placeholder="Code" value={attr.code} onChange={(e) => updateAttribute(attrIndex, 'code', e.target.value)} /> */}
					</div>

					{/* Values Table Header */}
					<div className="hidden md:grid md:grid-cols-6 gap-2 text-sm font-medium bg-dashboard-background p-2 rounded text-muted-foreground">
						<h1>Attributes Values</h1>
					</div>

					{/* Values */}
					{attr.values.map((val, valIndex) => (
						<div
							key={valIndex}
							className="border md:border-0 rounded-lg p-3 md:p-0
               grid grid-cols-1 md:grid-cols-6 gap-2"
						>
							{/* Value */}
							<div className="space-y-1">
								<Label className="md:hidden text-xs">Value</Label>
								<Input
									className="h-9"
									placeholder="Red / M / XL"
									value={val.value}
									onChange={(e) => updateValue(attrIndex, valIndex, 'value', e.target.value)}
								/>
							</div>

							{/* Price */}
							<div className="space-y-1">
								<Label className="md:hidden text-xs">Price</Label>
								<Input
									className="h-9"
									type="number"
									value={val.price}
									onChange={(e) => updateValue(attrIndex, valIndex, 'price', Number(e.target.value))}
								/>
							</div>

							{/* Discount */}
							<div className="space-y-1">
								<Label className="md:hidden text-xs">Discount</Label>
								<Input
									className="h-9"
									type="number"
									value={val.discount}
									onChange={(e) => updateValue(attrIndex, valIndex, 'discount', Number(e.target.value))}
								/>
							</div>

							{/* Discount Type */}
							<div className="space-y-1">
								<Label className="md:hidden text-xs">Discount Type</Label>
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

							{/* Stock */}
							<div className="space-y-1">
								<Label className="md:hidden text-xs">Stock</Label>
								<Input
									className="h-9"
									type="number"
									value={val.stock}
									onChange={(e) => updateValue(attrIndex, valIndex, 'stock', Number(e.target.value))}
								/>
							</div>

							{/* Remove */}
							<div className="flex items-end md:items-center">
								<Button type="button" variant="outline" className="w-full md:w-auto">
									Remove
								</Button>
							</div>
						</div>
					))}

					<Button type="button" variant="secondary" onClick={() => addValue(attrIndex)}>
						+ Add More Value
					</Button>
				</div>
			))}

			<Button type="button" className="bg-slate-200 hover:bg-slate-200 text-slate-600" onClick={addAttribute}>
				+ Add Another Attribute
			</Button>
		</div>
	);
}
