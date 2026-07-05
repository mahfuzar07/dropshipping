'use client';
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { X, Filter, ChevronDown, Star } from 'lucide-react';
import { useProductFilterStore } from '@/z-store/product/useProductFilterStore';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { motion } from 'framer-motion';
import ProductFilterSidebar from '@/components/pages/product/ProductFilterSidebar';

export default function ProductFilterDrawer() {
	const { isDrawerOpen, closeDrawer } = useLayoutStore();

	const handleClose = () => {
		closeDrawer();
	};

	return (
		<Drawer open={isDrawerOpen} onOpenChange={handleClose} direction="left">
			<DrawerContent className="h-full md:w-[400px] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between border-b px-4 py-4">
					<DrawerTitle className="text-lg font-medium flex items-center gap-2">
						<Filter className="h-4 w-4" />
						Product Filter
					</DrawerTitle>
					<Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-gray-100">
						<X className="h-4 w-4" />
					</Button>
				</div>
				<div>
					<ProductFilterSidebar />
				</div>
			</DrawerContent>
		</Drawer>
	);
}
