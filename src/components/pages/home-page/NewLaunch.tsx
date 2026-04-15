'use client';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { APIResponse } from '@/types/types';
import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';

// const products = [
// 	{
// 		id: 1,
// 		title: 'DUDE Wipes DUDE Bombs Toilet Stank Eliminator - 2-in-1 Air Freshener and Toilet...',
// 		image: '/assets/hero/slide-1.jpg',
// 		store: 'US',
// 		price: '1233.00',
// 	},
// 	{
// 		id: 2,
// 		title: 'Gain In-Wash Laundry Scent Booster Beads, Happy, 24 oz',
// 		image: '/assets/hero/slide-1.jpg',
// 		store: 'US',
// 		price: '12.99',
// 	},
// 	{
// 		id: 3,
// 		title: 'SmoothSpine Triple Fusion Back Massager - The Official Smooth Spine Massager with...',
// 		image: '/assets/hero/slide-1.jpg',
// 		store: 'US',
// 		price: '199.99',
// 	},
// 	{
// 		id: 4,
// 		title: 'Jell-O Cheesecake Instant Pudding & Pie Filling Mix, 3.4 oz Box',
// 		image: '/assets/hero/slide-1.jpg',
// 		store: 'US',
// 		price: '2.99',
// 	},
// 	{
// 		id: 5,
// 		title: 'Jell-O Cheesecake Instant Pudding & Pie Filling Mix, 3.4 oz Box',
// 		image: '/assets/hero/slide-1.jpg',
// 		store: 'US',
// 		price: '2.99',
// 	},
// ];

export default function NewLaunch() {
	const { data: newLaunchProducts, isLoading: isLoadingAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.NEW_LAUNCH_PRODUCTS],
		api: apiEndpoint.products.NEW_LAUNCH_PRODUCTS(),
		auth: true,
		responseType: 'single',

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	const products = newLaunchProducts?.results || [];

	return (
		<div className="bg-gray-100 py-8">
			<div className="container mx-auto px-4">
				{/* Title */}
				<h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight">NEW LAUNCHES</h2>

				{/* Product Grid */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
					{products.map((product) => (
						<ProductCard product={product} key={product?._id} />
					))}
				</div>
			</div>
		</div>
	);
}
