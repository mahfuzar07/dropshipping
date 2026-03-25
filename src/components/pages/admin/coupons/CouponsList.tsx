'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function CouponsList() {
	const { openDrawer } = useLayoutStore();

	return (
		<div className="space-y-1">
			<Card className="shadow border-none">
				<CardHeader className="border-b !pb-3 font-hanken flex items-center justify-between">
					<CardTitle>Coupons List </CardTitle>
					<Button
						onClick={() => openDrawer({ drawerType: 'add-coupon', drawerData: {} })}
						className="bg-dashboard-primary cursor-pointer text-primary-foreground px-6 py-2 rounded-md hover:bg-opacity-90 font-medium transition-colors"
					>
						<PlusIcon />
						Create Coupon
					</Button>
				</CardHeader>
				<CardContent className="text-dashboard-muted space-y-5">
					{/* {dummyCategories.map((category) => (
						<CategoryTreeItem
							key={category.id}
							category={category}
							level={0}
							expandedIds={expandedIds}
							onToggleExpand={toggleExpand}
							onDelete={handleDelete}
						/>
					))} */}
				</CardContent>
			</Card>
		</div>
	);
}
