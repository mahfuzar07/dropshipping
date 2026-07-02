'use client';

import { useRef, useState } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { X, ChevronUp, Search, Camera } from 'lucide-react';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { Input } from '@/components/ui/input';
import SearchBar from '../../elements/SearchBar';

export default function SearchDrawer() {
	const { isDrawerOpen, closeDrawer } = useLayoutStore();

	return (
		<Drawer open={isDrawerOpen} onOpenChange={closeDrawer} direction="top">
			<DrawerContent className="w-full !rounded-b-none">
				<div className="max-w-7xl mx-auto w-full px-3 py-3">
					<SearchBar />
				</div>
			</DrawerContent>
		</Drawer>
	);
}
