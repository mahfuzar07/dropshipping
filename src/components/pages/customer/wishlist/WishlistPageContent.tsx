'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

import WishlistProduct from './WishlistProduct';
import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';

import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';

interface WishlistItem {
	num_iid: string | number;
	title: string;
	pic_url: string;
	price: string;
	sales?: number;
	priceRange?: [string | number, string | number][];
}

function normalizeWishlistItem(raw: any): WishlistItem {
	return {
		num_iid: raw?.num_iid ?? raw?.product_id ?? raw?.id,
		title: raw?.title ?? raw?.product_name ?? raw?.name ?? 'Untitled product',
		pic_url: raw?.pic_url ?? raw?.image ?? raw?.product_image ?? raw?.thumbnail ?? '',
		price: String(raw?.price ?? raw?.unit_price ?? raw?.sale_price ?? '0'),
		sales: raw?.sales ?? raw?.sold_count ?? undefined,
		priceRange: raw?.priceRange,
	};
}

export default function WishlistPageContent() {
	const {
		data: wishlistResponse,
		isLoading,
		refetch,
	} = useAppData<any, 'single'>({
		key: [QueriesKey.WISHLIST],
		api: apiEndpoint.wishlist.WISHLIST(),
		auth: true,
		responseType: 'single',
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to load your wishlist');
		},
	});

	const products: WishlistItem[] = useMemo(() => {
		const raw = wishlistResponse?.data || wishlistResponse?.results || [];
		return Array.isArray(raw) ? raw.map(normalizeWishlistItem) : [];
	}, [wishlistResponse]);

	return (
		<div className="px-3 md:px-8 py-8 md:py-10 rounded bg-background">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b pb-5">
				<div className="flex items-center gap-3">
					<div className="bg-gradient-to-br from-orange-200 to-orange-400 w-16 h-16 flex items-center justify-center rounded-full shadow-sm">
						<Heart className="text-white w-8 h-8" />
					</div>

					<div>
						<h1 className="text-3xl font-medium">My Wishlist</h1>
						<p className="text-muted-foreground">Your saved favorite products</p>
					</div>
				</div>
			</motion.div>

			{/* Loading */}
			{isLoading && (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
					{Array.from({ length: 8 }).map((_, i) => (
						<LoadingSkeleton key={i} />
					))}
				</div>
			)}

			{/* Empty */}
			{!isLoading && products.length === 0 && (
				<div className="text-center py-24">
					<div className="mx-auto w-28 h-28 bg-muted rounded-full flex items-center justify-center mb-8">
						<Heart className="w-14 h-14 text-muted-foreground" />
					</div>
					<h2 className="text-3xl font-semibold text-foreground">Your wishlist is empty</h2>
					<p className="text-muted-foreground mt-3 max-w-md mx-auto">Tap the heart icon on any product you like to save it here for later.</p>
				</div>
			)}

			{/* Products */}
			{!isLoading && products.length > 0 && <WishlistProduct products={products} onChange={refetch} />}
		</div>
	);
}
