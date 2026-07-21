'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/axiosInstance';
import { Folder, Plus, Edit, Trash2, Layers, Tag, ArrowRight, Loader2 } from 'lucide-react';

interface Category {
	id: number;
	category_id: string;
	name: string;
	icon: string;
	subcategories?: any[];
}

export default function AdminCategoriesPage() {
	const queryClient = useQueryClient();
	const [globalSearch, setGlobalSearch] = useState('');

	// Active selected items for tree navigation
	const [activeCategory, setActiveCategory] = useState<Category | null>(null);
	const [activeSubcategory, setActiveSubcategory] = useState<any | null>(null);

	// Dialog open controls
	const [categoryModalOpen, setCategoryModalOpen] = useState(false);
	const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);
	const [itemModalOpen, setItemModalOpen] = useState(false);

	// CRUD states
	const [crudType, setCrudType] = useState<'create' | 'edit'>('create');
	const [isSaving, setIsSaving] = useState(false);

	// Target nodes for editing
	const [editCategory, setEditCategory] = useState<Category | null>(null);
	const [editSubcategory, setEditSubcategory] = useState<any | null>(null);
	const [editItem, setEditItem] = useState<any | null>(null);

	// Form field states
	const [categoryName, setCategoryName] = useState('');
	const [categorySlug, setCategorySlug] = useState('');
	const [categoryIcon, setCategoryIcon] = useState('📁');

	const [subcategoryName, setSubcategoryName] = useState('');
	const [itemName, setItemName] = useState('');

	// Fetch categories (pre-fetched nested tree from backend)
	const { data: categoriesResponse, isLoading, refetch } = useAppData<any, 'single'>({
		key: [QueriesKey.ADMIN_CATEGORIES],
		api: `/api/products/categories`,
		queryParams: { view: 'admin' },
		auth: true,
		responseType: 'single',
		onError: () => {
			toast.error('Failed to load categories schema');
		}
	});

	const categories: Category[] = useMemo(() => {
		if (!categoriesResponse) return [];
		const raw = categoriesResponse.categories || categoriesResponse.data || categoriesResponse.results || (Array.isArray(categoriesResponse) ? categoriesResponse : []);
		return raw.map((cat: any, index: number) => {
			const categoryId = cat.category_id || (typeof cat.id === 'string' ? cat.id : '');
			const dbId = cat.id && !isNaN(Number(cat.id)) ? Number(cat.id) : (cat.db_id || index + 1);
			return {
				id: dbId,
				category_id: categoryId,
				name: cat.name || '',
				icon: cat.icon || '📁',
				subcategories: cat.subcategories?.map((sub: any, subIdx: number) => ({
					id: sub.id && !isNaN(Number(sub.id)) ? Number(sub.id) : (sub.db_id || subIdx + 1),
					name: sub.name || '',
					items: sub.items?.map((item: any, itemIdx: number) => ({
						id: item.id && !isNaN(Number(item.id)) ? Number(item.id) : (item.db_id || itemIdx + 1),
						name: item.name || ''
					})) || []
				})) || []
			};
		});
	}, [categoriesResponse]);

	// Local filtering for main categories list
	const filteredCategories = useMemo(() => {
		if (!globalSearch.trim()) return categories;
		const query = globalSearch.toLowerCase();
		return categories.filter((c: any) =>
			c.name.toLowerCase().includes(query) || c.category_id.toLowerCase().includes(query)
		);
	}, [categories, globalSearch]);

	// Computed references pointing to the updated master tree
	const currentActiveCategory = useMemo(() => {
		if (!activeCategory) return null;
		return categories.find((c: any) => c.id === activeCategory.id) || null;
	}, [categories, activeCategory]);

	const currentActiveSubcategory = useMemo(() => {
		if (!activeSubcategory || !currentActiveCategory) return null;
		return currentActiveCategory.subcategories?.find((s: any) => s.id === activeSubcategory.id) || null;
	}, [currentActiveCategory, activeSubcategory]);

	// Auto-scroll on mobile viewports
	const scrollMobileTo = (elementId: string) => {
		if (typeof window !== 'undefined' && window.innerWidth < 768) {
			setTimeout(() => {
				const element = document.getElementById(elementId);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}, 100);
		}
	};

	// --- CRUD Triggers ---
	const triggerAddCategory = () => {
		setCrudType('create');
		setCategoryName('');
		setCategorySlug('');
		setCategoryIcon('📁');
		setCategoryModalOpen(true);
	};

	const triggerEditCategory = (cat: Category, e: React.MouseEvent) => {
		e.stopPropagation();
		setCrudType('edit');
		setEditCategory(cat);
		setCategoryName(cat.name);
		setCategorySlug(cat.category_id);
		setCategoryIcon(cat.icon || '📁');
		setCategoryModalOpen(true);
	};

	const triggerAddSubcategory = () => {
		if (!currentActiveCategory) return;
		setCrudType('create');
		setSubcategoryName('');
		setSubcategoryModalOpen(true);
	};

	const triggerEditSubcategory = (sub: any, e: React.MouseEvent) => {
		e.stopPropagation();
		setCrudType('edit');
		setEditSubcategory(sub);
		setSubcategoryName(sub.name);
		setSubcategoryModalOpen(true);
	};

	const triggerAddItem = () => {
		if (!currentActiveSubcategory) return;
		setCrudType('create');
		setItemName('');
		setItemModalOpen(true);
	};

	const triggerEditItem = (item: any, e: React.MouseEvent) => {
		e.stopPropagation();
		setCrudType('edit');
		setEditItem(item);
		setItemName(item.name);
		setItemModalOpen(true);
	};

	// --- Save Handlers ---
	const handleSaveCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!categoryName.trim() || !categorySlug.trim()) return;
		setIsSaving(true);
		try {
			const payload = {
				name: categoryName,
				category_id: categorySlug.toLowerCase().replace(/\s+/g, '-'),
				icon: categoryIcon || '📁'
			};

			if (crudType === 'edit' && editCategory) {
				await authApi.patch(`/api/products/categories/${editCategory.id}/`, payload);
				toast.success('Category updated successfully');
			} else {
				await authApi.post('/api/products/categories/', payload);
				toast.success('New category registered');
			}

			setCategoryModalOpen(false);
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_CATEGORIES] });
			queryClient.invalidateQueries({ queryKey: [QueriesKey.CATEGORIES] });
		} catch (err) {
			toast.error('Failed to save category');
		} finally {
			setIsSaving(false);
		}
	};

	const handleSaveSubcategory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!subcategoryName.trim() || !currentActiveCategory) return;
		setIsSaving(true);
		try {
			const payload = {
				category: currentActiveCategory.id,
				name: subcategoryName
			};

			if (crudType === 'edit' && editSubcategory) {
				await authApi.patch(`/api/products/subcategories/${editSubcategory.id}/`, payload);
				toast.success('Subcategory updated successfully');
			} else {
				await authApi.post('/api/products/subcategories/', payload);
				toast.success('New subcategory registered');
			}

			setSubcategoryModalOpen(false);
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_CATEGORIES] });
			queryClient.invalidateQueries({ queryKey: [QueriesKey.CATEGORIES] });
		} catch (err) {
			toast.error('Failed to save subcategory');
		} finally {
			setIsSaving(false);
		}
	};

	const handleSaveItem = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!itemName.trim() || !currentActiveSubcategory) return;
		setIsSaving(true);
		try {
			const payload = {
				subcategory: currentActiveSubcategory.id,
				name: itemName
			};

			if (crudType === 'edit' && editItem) {
				await authApi.patch(`/api/products/items/${editItem.id}/`, payload);
				toast.success('Leaf item updated successfully');
			} else {
				await authApi.post('/api/products/items/', payload);
				toast.success('New leaf item registered');
			}

			setItemModalOpen(false);
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_CATEGORIES] });
			queryClient.invalidateQueries({ queryKey: [QueriesKey.CATEGORIES] });
		} catch (err) {
			toast.error('Failed to save item');
		} finally {
			setIsSaving(false);
		}
	};

	// --- Delete Handlers ---
	const handleDeleteCategory = async (cat: Category, e: React.MouseEvent) => {
		e.stopPropagation();
		if (!confirm(`Are you sure you want to delete category "${cat.name}"? All nested subcategories and items will be deleted.`)) return;
		try {
			await authApi.delete(`/api/products/categories/${cat.id}/`);
			toast.success('Category deleted');
			if (activeCategory?.id === cat.id) {
				setActiveCategory(null);
				setActiveSubcategory(null);
			}
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_CATEGORIES] });
			queryClient.invalidateQueries({ queryKey: [QueriesKey.CATEGORIES] });
		} catch (err) {
			toast.error('Failed to delete category');
		}
	};

	const handleDeleteSubcategory = async (sub: any, e: React.MouseEvent) => {
		e.stopPropagation();
		if (!confirm(`Are you sure you want to delete subcategory "${sub.name}"? All nested items will be deleted.`)) return;
		try {
			await authApi.delete(`/api/products/subcategories/${sub.id}/`);
			toast.success('Subcategory deleted');
			if (activeSubcategory?.id === sub.id) {
				setActiveSubcategory(null);
			}
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_CATEGORIES] });
			queryClient.invalidateQueries({ queryKey: [QueriesKey.CATEGORIES] });
		} catch (err) {
			toast.error('Failed to delete subcategory');
		}
	};

	const handleDeleteItem = async (item: any, e: React.MouseEvent) => {
		e.stopPropagation();
		if (!confirm(`Are you sure you want to delete item "${item.name}"?`)) return;
		try {
			await authApi.delete(`/api/products/items/${item.id}/`);
			toast.success('Leaf item deleted');
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_CATEGORIES] });
			queryClient.invalidateQueries({ queryKey: [QueriesKey.CATEGORIES] });
		} catch (err) {
			toast.error('Failed to delete item');
		}
	};

	return (
		<div className="space-y-6 font-play">
			{/* Top Bar Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Category Explorer</h2>
					<p className="text-xs text-slate-400 font-medium">Manage root categories, sub-groups, and leaf items in a step-by-step cascading workflow.</p>
				</div>
				<div className="flex items-center gap-3">
					<Input
						placeholder="Search root category..."
						value={globalSearch}
						onChange={e => setGlobalSearch(e.target.value)}
						className="max-w-xs text-xs h-9"
					/>
					<Button onClick={refetch} variant="outline" size="sm" className="h-9">
						Reload Tree
					</Button>
				</div>
			</div>

			{/* Three-Column Interactive Cascading Panels */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
				
				{/* 1. Main Categories Panel */}
				<Card id="root-categories-card" className="shadow-sm border border-slate-200">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
						<div>
							<CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
								<Folder className="h-4.5 w-4.5 text-[#F16A38]" /> 1. Root Categories
							</CardTitle>
							<CardDescription className="text-[10px]">Select a category to view sub-groups</CardDescription>
						</div>
						<Button onClick={triggerAddCategory} size="sm" className="h-7 px-2.5 text-xs bg-[#F16A38] text-white hover:bg-orange-600 gap-1 font-semibold">
							<Plus size={13} /> Add
						</Button>
					</CardHeader>
					<CardContent className="pt-4 px-3">
						{isLoading ? (
							<div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
								<Loader2 className="h-6 w-6 animate-spin text-[#F16A38]" />
								<span className="text-xs">Loading categories...</span>
							</div>
						) : filteredCategories.length === 0 ? (
							<p className="text-xs text-center py-10 text-slate-400">No root categories found.</p>
						) : (
							<div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
								{filteredCategories.map((cat) => {
									const isActive = currentActiveCategory?.id === cat.id;
									return (
										<div
											key={cat.id}
											onClick={() => {
												setActiveCategory(cat);
												setActiveSubcategory(null);
												scrollMobileTo('sub-groups-card');
											}}
											className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 group ${
												isActive 
													? 'border-[#F16A38] bg-orange-50/50 shadow-xs' 
													: 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
											}`}
										>
											<div className="flex items-center gap-3">
												<span className="text-lg">{cat.icon || '📁'}</span>
												<div>
													<h4 className={`text-xs font-semibold ${isActive ? 'text-[#F16A38]' : 'text-slate-700'}`}>{cat.name}</h4>
													<p className="text-[9px] text-slate-400 font-mono">{cat.category_id}</p>
												</div>
											</div>
											
											<div className="flex items-center gap-2">
												<Badge variant="secondary" className="text-[9px] px-1.5 py-0">
													{cat.subcategories?.length || 0} sub
												</Badge>
												<div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
													<button
														onClick={(e) => triggerEditCategory(cat, e)}
														className="p-1 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition"
													>
														<Edit size={11} />
													</button>
													<button
														onClick={(e) => handleDeleteCategory(cat, e)}
														className="p-1 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
													>
														<Trash2 size={11} />
													</button>
													<ArrowRight size={12} className="text-slate-300 ml-0.5" />
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>

				{/* 2. Subcategories Panel */}
				<Card id="sub-groups-card" className="shadow-sm border border-slate-200">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
						<div>
							<CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
								<Layers className="h-4.5 w-4.5 text-[#F16A38]" /> 2. Sub-Groups
							</CardTitle>
							<CardDescription className="text-[10px]">
								{currentActiveCategory ? `Nested in ${currentActiveCategory.name}` : 'Select a root category to view'}
							</CardDescription>
						</div>
						{currentActiveCategory && (
							<Button onClick={triggerAddSubcategory} size="sm" className="h-7 px-2.5 text-xs bg-[#F16A38] text-white hover:bg-orange-600 gap-1 font-semibold">
								<Plus size={13} /> Add
							</Button>
						)}
					</CardHeader>
					<CardContent className="pt-4 px-3">
						{!currentActiveCategory ? (
							<div className="flex flex-col items-center justify-center py-14 text-center text-slate-400">
								<Folder className="h-8 w-8 mb-2 opacity-30" />
								<p className="text-xs font-semibold">No category selected</p>
								<p className="text-[10px] opacity-80 mt-1 max-w-[200px]">Click on a root category from the left pane to explore its subcategories.</p>
							</div>
						) : !currentActiveCategory.subcategories || currentActiveCategory.subcategories.length === 0 ? (
							<div className="text-center py-10">
								<p className="text-xs text-slate-400 mb-3">No sub-groups registered yet.</p>
								<Button onClick={triggerAddSubcategory} variant="outline" size="sm" className="h-8 text-xs gap-1 border-dashed">
									<Plus size={13} /> Create First Sub-Group
								</Button>
							</div>
						) : (
							<div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
								{currentActiveCategory.subcategories.map((sub) => {
									const isActive = currentActiveSubcategory?.id === sub.id;
									return (
										<div
											key={sub.id}
											onClick={() => {
												setActiveSubcategory(sub);
												scrollMobileTo('leaf-items-card');
											}}
											className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 group ${
												isActive 
													? 'border-[#F16A38] bg-orange-50/50 shadow-xs' 
													: 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
											}`}
										>
											<div>
												<h4 className={`text-xs font-semibold ${isActive ? 'text-[#F16A38]' : 'text-slate-700'}`}>{sub.name}</h4>
												<p className="text-[9px] text-slate-400">Database ID: {sub.id}</p>
											</div>

											<div className="flex items-center gap-2">
												<Badge variant="secondary" className="text-[9px] px-1.5 py-0">
													{sub.items?.length || 0} items
												</Badge>
												<div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
													<button
														onClick={(e) => triggerEditSubcategory(sub, e)}
														className="p-1 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition"
													>
														<Edit size={11} />
													</button>
													<button
														onClick={(e) => handleDeleteSubcategory(sub, e)}
														className="p-1 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
													>
														<Trash2 size={11} />
													</button>
													<ArrowRight size={12} className="text-slate-300 ml-0.5" />
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>

				{/* 3. Items Panel */}
				<Card id="leaf-items-card" className="shadow-sm border border-slate-200">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
						<div>
							<CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
								<Tag className="h-4.5 w-4.5 text-[#F16A38]" /> 3. Leaf Items
							</CardTitle>
							<CardDescription className="text-[10px]">
								{currentActiveSubcategory ? `Nested in ${currentActiveSubcategory.name}` : 'Select a sub-group to view'}
							</CardDescription>
						</div>
						{currentActiveSubcategory && (
							<Button onClick={triggerAddItem} size="sm" className="h-7 px-2.5 text-xs bg-[#F16A38] text-white hover:bg-orange-600 gap-1 font-semibold">
								<Plus size={13} /> Add
							</Button>
						)}
					</CardHeader>
					<CardContent className="pt-4 px-3">
						{!currentActiveSubcategory ? (
							<div className="flex flex-col items-center justify-center py-14 text-center text-slate-400">
								<Layers className="h-8 w-8 mb-2 opacity-30" />
								<p className="text-xs font-semibold">No sub-group selected</p>
								<p className="text-[10px] opacity-80 mt-1 max-w-[200px]">Click on a sub-group in the middle panel to view individual items.</p>
							</div>
						) : !currentActiveSubcategory.items || currentActiveSubcategory.items.length === 0 ? (
							<div className="text-center py-10">
								<p className="text-xs text-slate-400 mb-3">No leaf items registered yet.</p>
								<Button onClick={triggerAddItem} variant="outline" size="sm" className="h-8 text-xs gap-1 border-dashed">
									<Plus size={13} /> Create First Item
								</Button>
							</div>
						) : (
							<div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
								{currentActiveSubcategory.items.map((item: any) => (
									<div
										key={item.id}
										className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 group"
									>
										<div>
											<h4 className="text-xs font-semibold text-slate-700">{item.name}</h4>
											<p className="text-[9px] text-slate-400">Database ID: {item.id}</p>
										</div>

										<div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
											<button
												onClick={(e) => triggerEditItem(item, e)}
												className="p-1 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition"
											>
												<Edit size={11} />
											</button>
											<button
												onClick={(e) => handleDeleteItem(item, e)}
												className="p-1 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
											>
												<Trash2 size={11} />
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

			</div>

			{/* Category Dialog Modal */}
			<Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
				<DialogContent className="fixed top-0 left-0 w-full h-full max-w-none md:max-w-md md:h-auto md:max-h-[90vh] translate-x-0 translate-y-0 md:top-[50%] md:left-[50%] md:translate-x-[-50%] md:translate-y-[-50%] rounded-none md:rounded-lg overflow-y-auto bg-white p-5 md:p-6">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-800">
							{crudType === 'edit' ? 'Edit Category Settings' : 'Create Root Category'}
						</DialogTitle>
						<DialogDescription>Setup master category routing definitions.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Category Name</label>
							<Input required value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="e.g. Smart Watch" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Slug / Unique ID</label>
							<Input required value={categorySlug} onChange={e => setCategorySlug(e.target.value)} placeholder="e.g. smart-watch" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Icon Emoji</label>
							<Input value={categoryIcon} onChange={e => setCategoryIcon(e.target.value)} placeholder="e.g. ⌚" />
						</div>
						<DialogFooter className="pt-4 border-t">
							<Button type="button" variant="outline" onClick={() => setCategoryModalOpen(false)}>Cancel</Button>
							<Button type="submit" disabled={isSaving} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1.5">
								{isSaving ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" /> Saving...
									</>
								) : (
									'Save Category'
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Subcategory Dialog Modal */}
			<Dialog open={subcategoryModalOpen} onOpenChange={setSubcategoryModalOpen}>
				<DialogContent className="fixed top-0 left-0 w-full h-full max-w-none md:max-w-md md:h-auto md:max-h-[90vh] translate-x-0 translate-y-0 md:top-[50%] md:left-[50%] md:translate-x-[-50%] md:translate-y-[-50%] rounded-none md:rounded-lg overflow-y-auto bg-white p-5 md:p-6">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-800">
							{crudType === 'edit' ? 'Edit Sub-Group' : 'Create Sub-Group'}
						</DialogTitle>
						<DialogDescription>
							{currentActiveCategory ? `Will nest in root: ${currentActiveCategory.name}` : ''}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSaveSubcategory} className="space-y-4 pt-2">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Subcategory Name</label>
							<Input required value={subcategoryName} onChange={e => setSubcategoryName(e.target.value)} placeholder="e.g. AMOLED Smartwatches" />
						</div>
						<DialogFooter className="pt-4 border-t">
							<Button type="button" variant="outline" onClick={() => setSubcategoryModalOpen(false)}>Cancel</Button>
							<Button type="submit" disabled={isSaving} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1.5">
								{isSaving ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" /> Saving...
									</>
								) : (
									'Save Sub-Group'
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Item Dialog Modal */}
			<Dialog open={itemModalOpen} onOpenChange={setItemModalOpen}>
				<DialogContent className="fixed top-0 left-0 w-full h-full max-w-none md:max-w-md md:h-auto md:max-h-[90vh] translate-x-0 translate-y-0 md:top-[50%] md:left-[50%] md:translate-x-[-50%] md:translate-y-[-50%] rounded-none md:rounded-lg overflow-y-auto bg-white p-5 md:p-6">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-800">
							{crudType === 'edit' ? 'Edit Leaf Item' : 'Create Leaf Item'}
						</DialogTitle>
						<DialogDescription>
							{currentActiveSubcategory ? `Will nest in sub-group: ${currentActiveSubcategory.name}` : ''}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSaveItem} className="space-y-4 pt-2">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Item Name</label>
							<Input required value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. Ultra Smartwatch 8" />
						</div>
						<DialogFooter className="pt-4 border-t">
							<Button type="button" variant="outline" onClick={() => setItemModalOpen(false)}>Cancel</Button>
							<Button type="submit" disabled={isSaving} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1.5">
								{isSaving ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" /> Saving...
									</>
								) : (
									'Save Item'
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
