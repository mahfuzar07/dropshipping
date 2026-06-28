'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Check } from 'lucide-react';

export default function AddAttributePage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [valueInput, setValueInput] = useState('');
	const [values, setValues] = useState<string[]>([]);

	const handleAddValue = (e: React.FormEvent) => {
		e.preventDefault();
		if (!valueInput.trim()) return;
		if (values.includes(valueInput.trim())) {
			toast.error('Value already exists');
			return;
		}
		setValues([...values, valueInput.trim()]);
		setValueInput('');
	};

	const handleRemoveValue = (val: string) => {
		setValues(values.filter(v => v !== val));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !code) {
			toast.error('Attribute name and code are required');
			return;
		}
		if (values.length === 0) {
			toast.error('Please define at least one attribute value');
			return;
		}

		toast.success('Attribute registered successfully!');
		router.push('/admin/attributes');
	};

	return (
		<div className="space-y-6 font-play max-w-xl mx-auto">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon" onClick={() => router.push('/admin/attributes')} className="bg-slate-50">
					<ArrowLeft size={18} />
				</Button>
				<div>
					<h2 className="text-xl font-bold text-slate-800">Create Attribute</h2>
					<p className="text-xs text-slate-400">Define a global product attribute category.</p>
				</div>
			</div>

			<Card className="shadow-sm">
				<CardHeader>
					<CardTitle className="text-base font-bold text-slate-800">Attribute configuration</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Attribute Name</label>
							<Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Memory Capacity" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">System Code</label>
							<Input required value={code} onChange={e => setCode(e.target.value.toLowerCase().replace(/\s+/g, '_'))} placeholder="e.g. memory_capacity" />
						</div>

						{/* Values tag editor */}
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Attribute values</label>
							<div className="flex gap-2">
								<Input value={valueInput} onChange={e => setValueInput(e.target.value)} placeholder="e.g. 128GB" />
								<Button type="button" onClick={handleAddValue} className="bg-slate-100 text-slate-800 hover:bg-slate-200">
									Add value
								</Button>
							</div>

							<div className="flex flex-wrap gap-1.5 mt-3 p-3 bg-slate-50 border rounded-lg min-h-16 items-center">
								{values.map(val => (
									<Badge key={val} className="bg-white border text-slate-700 flex items-center gap-1.5 py-1 px-2.5">
										{val}
										<button type="button" onClick={() => handleRemoveValue(val)} className="text-slate-400 hover:text-rose-500">
											<X size={12} />
										</button>
									</Badge>
								))}
								{values.length === 0 && (
									<span className="text-xs text-slate-400 font-semibold italic">No values added yet.</span>
								)}
							</div>
						</div>

						<div className="flex justify-end gap-2 pt-4 border-t">
							<Button type="button" variant="outline" onClick={() => router.push('/admin/attributes')}>Cancel</Button>
							<Button type="submit" className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1">
								<Check size={14} /> Save Attribute
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
