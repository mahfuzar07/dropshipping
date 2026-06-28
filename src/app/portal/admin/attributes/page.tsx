'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
	Layers,
	Plus,
	Trash2,
	Eye,
	Settings
} from 'lucide-react';

interface AttributeType {
	id: string;
	name: string;
	code: string;
	values: string[];
}

export default function AttributesPage() {
	const router = useRouter();
	const [attributes, setAttributes] = useState<AttributeType[]>([
		{ id: 'attr-1', name: 'Size', code: 'size', values: ['S', 'M', 'L', 'XL', 'XXL'] },
		{ id: 'attr-2', name: 'Color', code: 'color', values: ['Black', 'White', 'Brown', 'Navy Blue', 'Silver'] },
		{ id: 'attr-3', name: 'Plug Type', code: 'plug_type', values: ['EU Plug', 'US Plug', 'UK Plug'] }
	]);

	const handleDelete = (attrId: string) => {
		setAttributes(prev => prev.filter(a => a.id !== attrId));
		toast.success('Attribute successfully deleted');
	};

	return (
		<div className="space-y-6 font-play max-w-4xl mx-auto">
			{/* Top Bar */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Product Attributes</h2>
					<p className="text-xs text-slate-400">Manage global variants attributes like sizes, colors, and plug options.</p>
				</div>
				<Button onClick={() => router.push('/admin/add-attribute')} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1.5">
					<Plus size={16} /> Create Attribute
				</Button>
			</div>

			{/* Attributes List */}
			<Card className="shadow-sm">
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm border-collapse">
							<thead>
								<tr className="border-b bg-slate-50 text-slate-400 font-bold text-xs uppercase">
									<th className="py-3 px-4">Attribute Name</th>
									<th className="py-3 px-4">Code Reference</th>
									<th className="py-3 px-4">Defined Values</th>
									<th className="py-3 px-4 text-center">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y text-slate-700">
								{attributes.map((attr) => (
									<tr key={attr.id} className="hover:bg-slate-50/50 duration-200">
										<td className="py-4 px-4 font-bold text-slate-800 flex items-center gap-2">
											<Layers size={16} className="text-[#F16A38]" />
											{attr.name}
										</td>
										<td className="py-4 px-4 font-mono text-xs text-slate-500">{attr.code}</td>
										<td className="py-4 px-4 max-w-xs">
											<div className="flex flex-wrap gap-1">
												{attr.values.map(val => (
													<Badge key={val} variant="outline" className="text-[10px] bg-slate-50 border-slate-100 text-slate-500">
														{val}
													</Badge>
												))}
											</div>
										</td>
										<td className="py-4 px-4">
											<div className="flex justify-center gap-2">
												<Button size="sm" variant="ghost" onClick={() => handleDelete(attr.id)} className="text-slate-400 hover:text-rose-600">
													<Trash2 size={16} />
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
