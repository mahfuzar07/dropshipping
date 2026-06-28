'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
	Folder,
	Plus,
	Edit,
	Trash2,
	ChevronRight,
	ChevronDown,
	Check,
	FolderPlus
} from 'lucide-react';

interface CategoryNode {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
	children: CategoryNode[];
}

const initialCategories: CategoryNode[] = [
	{
		id: 'cat-1',
		name: 'Smart Electronics',
		slug: 'smart-electronics',
		isActive: true,
		children: [
			{ id: 'cat-1-1', name: 'Smartphones & Accessories', slug: 'smartphones-accessories', isActive: true, children: [] },
			{ id: 'cat-1-2', name: 'Smart Wearables & Watch', slug: 'smart-wearables-watch', isActive: true, children: [] },
			{ id: 'cat-1-3', name: 'Bluetooth Earphones', slug: 'bluetooth-earphones', isActive: true, children: [] }
		]
	},
	{
		id: 'cat-2',
		name: 'Home & Living',
		slug: 'home-living',
		isActive: true,
		children: [
			{ id: 'cat-2-1', name: 'Kitchen & Tableware', slug: 'kitchen-tableware', isActive: true, children: [] },
			{ id: 'cat-2-2', name: 'Bedroom Accessories', slug: 'bedroom-accessories', isActive: true, children: [] }
		]
	},
	{
		id: 'cat-3',
		name: 'Fashion & Apparel',
		slug: 'fashion-apparel',
		isActive: true,
		children: []
	}
];

export default function AdminCategoriesPage() {
	const [categories, setCategories] = useState<CategoryNode[]>(initialCategories);
	const [expandedNodes, setExpandedNodes] = useState<string[]>(['cat-1', 'cat-2']);

	// Modals State
	const [isOpen, setIsOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [catName, setCatName] = useState('');
	const [selectedNode, setSelectedNode] = useState<CategoryNode | null>(null);

	const toggleNode = (nodeId: string) => {
		setExpandedNodes(prev =>
			prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
		);
	};

	const handleAddCategory = () => {
		setIsEdit(false);
		setCatName('');
		setIsOpen(true);
	};

	const handleSaveCategory = (e: React.FormEvent) => {
		e.preventDefault();
		if (!catName.trim()) return;

		if (isEdit && selectedNode) {
			// Edit existing category
			setCategories(prev =>
				prev.map(c => {
					if (c.id === selectedNode.id) return { ...c, name: catName, slug: catName.toLowerCase().replace(/\s+/g, '-') };
					return {
						...c,
						children: c.children.map(child =>
							child.id === selectedNode.id ? { ...child, name: catName, slug: catName.toLowerCase().replace(/\s+/g, '-') } : child
						)
					};
				})
			);
			toast.success('Category updated successfully!');
		} else {
			// Add new root category
			const newCat: CategoryNode = {
				id: `cat-${Date.now()}`,
				name: catName,
				slug: catName.toLowerCase().replace(/\s+/g, '-'),
				isActive: true,
				children: []
			};
			setCategories([...categories, newCat]);
			toast.success('Category added successfully!');
		}
		setIsOpen(false);
	};

	const handleDeleteCategory = (catId: string) => {
		setCategories(prev =>
			prev.filter(c => c.id !== catId).map(c => ({
				...c,
				children: c.children.filter(child => child.id !== catId)
			}))
		);
		toast.success('Category successfully deleted!');
	};

	// Recursively render MPTT categories tree
	const renderCategoryNode = (node: CategoryNode, depth = 0) => {
		const hasChildren = node.children && node.children.length > 0;
		const isExpanded = expandedNodes.includes(node.id);

		return (
			<div key={node.id} className="space-y-1.5 font-play">
				<div
					className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 border rounded-xl duration-200 group"
					style={{ marginLeft: `${depth * 24}px` }}
				>
					<div className="flex items-center gap-2">
						{hasChildren ? (
							<button onClick={() => toggleNode(node.id)} className="text-slate-400 hover:text-slate-600 focus:outline-none">
								{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
							</button>
						) : (
							<span className="w-4" />
						)}
						<Folder className="text-[#F16A38] shrink-0" size={18} />
						<span className="font-semibold text-slate-800 text-sm">{node.name}</span>
						<Badge variant="outline" className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100">
							/{node.slug}
						</Badge>
					</div>

					<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 duration-200">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => {
								setSelectedNode(node);
								setCatName(node.name);
								setIsEdit(true);
								setIsOpen(true);
							}}
							className="text-slate-600 hover:text-indigo-600"
						>
							<Edit size={14} />
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => handleDeleteCategory(node.id)}
							className="text-slate-600 hover:text-rose-600"
						>
							<Trash2 size={14} />
						</Button>
					</div>
				</div>

				{hasChildren && isExpanded && (
					<div className="space-y-1.5">
						{node.children.map(child => renderCategoryNode(child, depth + 1))}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="space-y-6 font-play max-w-4xl mx-auto">
			{/* Top Bar actions */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Categories (MPTT Tree)</h2>
					<p className="text-xs text-slate-400">Configure nesting categories tree to manage storefront navigation schemas.</p>
				</div>
				<Button onClick={handleAddCategory} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1.5">
					<FolderPlus size={16} /> Add Category
				</Button>
			</div>

			{/* Tree List container */}
			<Card className="shadow-sm">
				<CardContent className="p-6 space-y-3 bg-slate-50/40">
					{categories.map(node => renderCategoryNode(node))}
				</CardContent>
			</Card>

			{/* Add/Edit Modal */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-sm bg-white">
					<DialogHeader>
						<DialogTitle className="text-base font-bold">
							{isEdit ? 'Edit Category' : 'Create Root Category'}
						</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSaveCategory} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Category Name</label>
							<Input required value={catName} onChange={e => setCatName(e.target.value)} placeholder="e.g. Smart Wearables" />
						</div>
						<DialogFooter className="pt-2">
							<Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
							<Button type="submit" className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1">
								<Check size={14} /> Save Category
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
