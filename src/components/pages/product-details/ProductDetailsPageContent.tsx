'use client';

import { useMemo, useState } from 'react';
import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import CartSection from './CartSection';
import SellerInfo from './SellerInfo';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';

/* ================= TYPES ================= */

export interface VariantSize {
	size_name: string;
	price: string;
	stock: string;
}

export interface Variant {
	color_name: string;
	image: string;
	active: boolean;
	sizes: VariantSize[];
}

export interface ProductDetails {
	_id: string;
	offer_id: string;
	title: string;
	image: string;
	rating: string;
	sold: string;

	price: {
		currency: string;
		amount: string;
		unit: string;
		overseas: string;
	};

	details: {
		extract_product_variants: Variant[];
		extract_product_attributes: Record<string, string>;
		extract_product_description: {
			images: string[];
		};
	};
}

export interface ProductApiResponse {
	updated: boolean;
	product: ProductDetails;
}

/* ================= MAPPER ================= */

const mapProductData = (product: ProductDetails) => {
	const variants = product.details?.extract_product_variants || [];

	const colors = variants.map((v) => ({
		name: v.color_name,
		image: v.image,
	}));

	const galleryImages = [product.image, ...variants.map((v) => v.image)];

	return {
		id: product._id,
		offer_id: product.offer_id,
		name: product.title,
		price: Number(product.price?.amount || 0),
		overseasPrice: product.price?.overseas,
		currency: product.price?.currency,
		rating: Number(product.rating || 0),
		reviewCount: 0,

		image: product.image,
		sold: product.sold,

		colors,
		variants,
		galleryImages,

		specifications: product.details?.extract_product_attributes || {},
	};
};

/* ================= COMPONENT ================= */

export default function ProductDetailsPageContent({ productSlug }: { productSlug: string }) {
	const { data, isLoading } = useAppData<ProductApiResponse, 'single'>({
		key: [QueriesKey.PRODUCT_DETAIL, productSlug],
		api: apiEndpoint.products.DETAILS(productSlug),
		auth: true,
		responseType: 'single',
		enabled: !!productSlug,
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to load product');
		},
	});

	const productRaw = data?.product;

	// console.log('product details', productRaw);

	const product = useMemo(() => {
		if (!productRaw) return null;
		return mapProductData(productRaw);
	}, [productRaw]);

	const [selectedColorIndex, setSelectedColorIndex] = useState(0);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [qty, setQty] = useState<Record<string, number>>({});

	if (isLoading || !product) {
		return <LoadingSkeleton />;
	}

	const selectedVariant = product.variants[selectedColorIndex];

	const sizes = selectedVariant?.sizes?.map((s) => s.size_name) || [];

	const mainImage = selectedVariant?.image || product.image;
	// console.log('qty==', qty);

	return (
		<div className="px-2 py-3">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:mb-20 mb-12">
				{/* LEFT */}
				<div className="col-span-9 grid grid-cols-1 md:grid-cols-12 gap-6">
					{/* IMAGE */}
					<div className="col-span-5">
						<ProductImageGallery
							images={product.galleryImages}
							productName={product.name}
							selectedImageIndex={selectedColorIndex + 1}
							onSelectImage={(index) => {
								if (index > 0) {
									setSelectedColorIndex(index - 1);
								}
							}}
						/>
					</div>

					{/* INFO */}
					<div className="col-span-7">
						<ProductInfo
							product={{
								id: product.id,
								name: product.name,
								price: product.price,
								currency: product.currency,
								overseas: product.overseasPrice,
								solded: product.sold,
								description: product.sold,
								inStock: true,
								stockCount: null,

								colors: product.colors,
								image: mainImage,

								variants: product.variants,

								rating: product.rating,
								reviewCount: product.reviewCount,

								selectedColorIndex,
								setSelectedColorIndex,
							}}
							qty={qty}
							setQty={setQty}
						/>
					</div>

					{/* TABS */}
					<div className="col-span-12 bg-white rounded-lg p-5">
						<SellerInfo />
						<ProductTabs description={product.name} specifications={product.specifications} reviews={[]} />
					</div>
				</div>

				{/* RIGHT */}
				<div className="col-span-3 sticky top-5 self-start">
					<CartSection
						product={{
							...product,
							selectedVariant,
							selectedSize,
							qty,
						}}
					/>
				</div>
			</div>
		</div>
	);
}
