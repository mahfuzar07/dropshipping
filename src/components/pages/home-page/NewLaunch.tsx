'use client';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { toast } from 'sonner';

type NewLaunchResponse = {
	page: number;
	limit: number;
	total: number;
	total_pages: number;
	results: Product[];
};

type Product = {
	_id: string;
	offer_id: string;
	title: string;
	url: string;
	image: string;

	product_name: string;
	promotion: string;
	rating: string;
	sold: string;

	price: {
		amount: string;
		currency: string;
		overseas: string;
		unit: string;
	};

	seller_icon: string;
	is_ad: boolean;
	moq: null | number;
};

export default function NewLaunch() {
	const { data: newLaunchProducts, isLoading: isLoadingAddress } = useAppData<NewLaunchResponse, 'single'>({
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
