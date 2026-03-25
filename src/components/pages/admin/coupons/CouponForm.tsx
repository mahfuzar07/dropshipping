'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { RadioCustomGroup, RadioCustomGroupItem } from '@/components/ui/radio-custom-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

import { CloudUpload } from 'lucide-react';
import { SearchableSelect } from '@/components/ui/custom/searchable-select';
import { DragUploadInput } from '@/components/ui/custom/DragUploadInput';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { DatePicker } from '@/components/ui/custom/DatePicker';

type Status = 'ACTIVE' | 'INACTIVE';
type CategoryScope = 'PRODUCT' | 'SERVICE' | 'BOTH';

export interface CategoryFormData {
	name: string;
	slug: string;
	icon?: string;
	banner?: string;
	status: Status;
	scope: CategoryScope;
	parentId?: number;
}

interface Category {
	id: number;
	name: string;
	slug?: string;
	status: Status;
	parentId?: number;
	children?: Category[];
	icon?: string;
	banner?: string;
}

interface CategoryFormProps {
	categoryId?: number; // for edit
	initialData?: CategoryFormData; // optional for edit
}

interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
}

/* ------------------- API Fetchers ------------------- */
// const fetchCategories = async (): Promise<Category[]> => {
// 	const res = await fetch('/api/categories');
// 	if (!res.ok) throw new Error('Failed to fetch categories');
// 	const json: ApiResponse<Category[]> = await res.json();
// 	return json.data ?? [];
// };

// const saveCategory = async (payload: CategoryFormData & { categoryId?: number }) => {
// 	const url = payload.categoryId ? `/api/categories/${payload.categoryId}` : '/api/categories';
// 	const res = await fetch(url, {
// 		method: payload.categoryId ? 'PUT' : 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify(payload),
// 	});
// 	const json: ApiResponse<CategoryFormData> = await res.json();
// 	if (!res.ok) throw new Error(json.message || 'Failed to save category');
// 	return json.data;
// };

/* ------------------- Component ------------------- */
export default function CouponForm({ categoryId, initialData }: CategoryFormProps) {
	const { isDrawerOpen, closeDrawer, drawerData } = useLayoutStore();
	const router = useRouter();
	const queryClient = useQueryClient();
	const isEditMode = Boolean(categoryId);

	const [formData, setFormData] = useState<CategoryFormData>({
		name: '',
		slug: '',
		icon: '',
		banner: '',
		status: 'ACTIVE',
		scope: 'PRODUCT',
		parentId: undefined,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [autoSlug, setAutoSlug] = useState(!isEditMode);

	/* ------------------- Load initial data ------------------- */
	useEffect(() => {
		if (initialData) {
			setFormData(initialData);
			setAutoSlug(false);
		}
	}, [initialData]);

	/* ------------------- Fetch all categories ------------------- */
	// const { data: allCategories = [], isLoading, isError, error } = useQuery<Category[], Error>(['categories'], fetchCategories);

	/* ------------------- Helpers ------------------- */
	const generateSlug = (text: string): string =>
		text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-');

	const handleNameChange = (value: string) => {
		setFormData((prev) => ({
			...prev,
			name: value,
			slug: autoSlug ? generateSlug(value) : prev.slug,
		}));
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};
		if (!formData.name.trim()) newErrors.name = 'Name is required';
		if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
		if (isEditMode && formData.parentId === categoryId) newErrors.parentId = 'Cannot select itself as parent';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleImageFile = (file?: File) => {
		if (!file) return;
		if (!file.type.startsWith('image/')) return;

		const previewUrl = URL.createObjectURL(file);

		setFormData((prev) => ({
			...prev,
			banner: previewUrl,
		}));
	};

	/* ------------------- Mutation ------------------- */
	// const mutation = useMutation(saveCategory, {
	// 	onSuccess: () => {
	// 		queryClient.invalidateQueries(['categories']);
	// 		router.push('/categories');
	// 	},
	// 	onError: (err: any) => {
	// 		setErrors({ submit: err?.message || 'Something went wrong' });
	// 	},
	// });

	/* ------------------- Submit ------------------- */
	// const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault();
	// 	if (!validateForm()) return;
	// 	mutation.mutate({ ...formData, categoryId });
	// };

	/* ------------------- Render ------------------- */
	// if (isLoading) return <p>Loading categories...</p>;
	// if (isError) return <p className="text-destructive">Error: {error?.message}</p>;

	const statusOptions = [
		{ value: 'ACTIVE', label: 'Active' },
		{ value: 'INACTIVE', label: 'Inactive' },
	];

	const [startDate, setStartDate] = useState<Date | undefined>();
	const [endDate, setEndDate] = useState<Date | undefined>();

	return (
		<div className="text-dashboard-muted font-play space-y-5">
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				{/* <div className="space-y-3">
					<Label className="">Category Icon *</Label>
					<DragUploadInput
						value={formData.banner}
						onChange={(file, preview) => {
							setFormData((prev) => ({
								...prev,
								banner: preview,
							}));
						}}
					/>
				</div> */}
				<div className="space-y-3">
					<Label className="">Title (Optional)</Label>
					<Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Enter coupon title" />
					{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
				</div>
				<div className="space-y-3">
					<Label className="">Description (Optional)</Label>
					<Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Enter coupon description" />
					{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
				</div>
			</div>
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<div className="space-y-3">
					<Label className="">Coupons Code *</Label>
					<Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Enter category name" />
					{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
				</div>

				<div className="space-y-3">
					<Label>Discount by Category</Label>

					<SearchableSelect
						options={statusOptions}
						value={formData.status}
						onChange={(value) =>
							setFormData((prev) => ({
								...prev,
								status: value as Status,
							}))
						}
						placeholder="Select Status"
					/>
					{errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
				</div>
			</div>

			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<div className="space-y-3">
					<Label className="">Discount Value *</Label>
					<Input value={formData.name} type="number" onChange={(e) => handleNameChange(e.target.value)} placeholder="Enter discount value" />
					{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
				</div>

				<div className="space-y-3">
					<Label className="">Coupons Limits *</Label>
					<Input value={formData.name} type="number" onChange={(e) => handleNameChange(e.target.value)} placeholder="Enter coupons limits" />
					{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
				</div>
			</div>
			<div className="p-3 bg-slate-50">Coupons Types</div>
			<RadioCustomGroup defaultValue="comfortable" className="flex text-md flex-col md:flex-row gap-5 md:gap-8 md:items-center flex-wrap px-2">
				<div className="flex items-center gap-3">
					<RadioCustomGroupItem value="default" id="r1" />
					<Label htmlFor="r1">Free Shipping</Label>
				</div>
				<div className="flex items-center gap-3">
					<RadioCustomGroupItem value="comfortable" id="r2" />
					<Label htmlFor="r2">Percentage</Label>
				</div>
				<div className="flex items-center gap-3">
					<RadioCustomGroupItem value="compact" id="r3" />
					<Label htmlFor="r3">Fixed Amount</Label>
				</div>
			</RadioCustomGroup>

			<div className="p-3 bg-slate-50">Coupons Status</div>
			<RadioCustomGroup defaultValue="comfortable" className="flex text-md flex-col md:flex-row gap-5 md:gap-8 md:items-center flex-wrap px-2">
				<div className="flex items-center gap-3">
					<RadioCustomGroupItem value="default" id="r1" />
					<Label htmlFor="r1">Active</Label>
				</div>
				<div className="flex items-center gap-3">
					<RadioCustomGroupItem value="comfortable" id="r2" />
					<Label htmlFor="r2">In Active</Label>
				</div>
				<div className="flex items-center gap-3">
					<RadioCustomGroupItem value="compact" id="r3" />
					<Label htmlFor="r3">Future Plan</Label>
				</div>
			</RadioCustomGroup>

			<div className="p-3 bg-slate-50">Date Schedule</div>
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<div className="space-y-3">
					<Label className="">Start Date *</Label>
					<DatePicker value={startDate} onChange={setStartDate} />
				</div>

				<div className="space-y-3">
					<Label className="">End Date *</Label>
					<DatePicker value={endDate} onChange={setEndDate} />
				</div>
			</div>

			{/* Bottom Actions */}
			<div className="flex justify-end gap-3 mt-8">
				<Button variant="outline" onClick={closeDrawer}>
					Cancel
				</Button>
				<Button className="bg-dashboard-primary hover:bg-dashboard-primary/80">{isEditMode ? 'Save Changes' : 'Create Coupon'}</Button>
			</div>
		</div>
	);
}
