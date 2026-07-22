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
import ProductDetailsSkeleton from '@/components/common/loader/ProductDetailsSkeleton';

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
	skuId: number;
	sizes: VariantSize[];
}

export interface ProductDetails {
	item: {
		num_iid: number;
		title: string;
		price: number;
		orginal_price: number;
		nick: string;
		num: number;
		detail_url: string;
		pic_url: string;

		item_imgs: {
			url: string;
		}[];

		desc: string;
		desc_img: string[];

		props: {
			name: string;
			value: string | null;
		}[];

		skus: {
			sku: {
				price: number;
				quantity: number;
				sku_id: number;
				properties: string;
				properties_name: string;
				spec_id: string;
			}[];
		};

		props_list: Record<string, string>;

		seller_info: {
			nick: string;
			shop_name: string;
			sid: string;
			title: string;
			zhuy: string;
		};

		video?: {
			url: string;
		};

		unit: string;
		location: string;
		weight: string;
	};
}

const mapProductData = (response: ProductDetails) => {
	const product = response.item;

	console.log('product', product);

	const galleryImages = Array.isArray(product.item_imgs) ? product.item_imgs.map((img) => img?.url).filter((url): url is string => Boolean(url)) : [];

	const image = product.pic_url || galleryImages[0] || '/images/product-placeholder.png';

	const specifications: Record<string, string> = {};

	if (Array.isArray(product.props)) {
		product.props.forEach((prop) => {
			if (prop?.name && prop?.value) {
				specifications[prop.name] = prop.value;
			}
		});
	}

	const variants: Variant[] = Array.isArray(product.skus?.sku)
		? product.skus.sku.map((sku) => ({
				color_name: sku.properties_name,
				image,
				active: true,
				skuId: sku.sku_id,
				sizes: [
					{
						size_name: 'Default',
						price: String(sku.price),
						stock: String(sku.quantity),
					},
				],
			}))
		: [];

	return {
		id: String(product.num_iid),
		offer_id: String(product.num_iid),
		name: product.title,
		price: product.price,
		overseasPrice: product.orginal_price,
		currency: 'CNY',

		rating: 0,
		reviewCount: 0,
		sold: String(product.num),

		image: product.pic_url,
		galleryImages,

		colors: variants.map((v) => ({
			name: v.color_name,
			image: v.image,
		})),

		variants,
		specifications,
		description: product.desc,

		seller: product.seller_info,
		unit: product.unit,
		location: product.location,
		video: product.video?.url,
	};
};

/* ================= COMPONENT ================= */

export default function ProductDetailsPageContent({ productId, initialProduct }: { productId: number; initialProduct?: ProductDetails | null }) {
	const { data, isLoading } = useAppData<ProductDetails, 'single'>({
		key: [QueriesKey.PRODUCT_DETAIL, productId],
		api: apiEndpoint.products.productsDetails,
		routeParams: { id: productId },
		auth: false,
		responseType: 'single',
		enabled: !!productId,
		staleTime: 0,
		clientOnly: true,
		initialData: initialProduct ?? undefined,
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to load product');
		},
	});

	const product = useMemo(() => {
		if (!data) return null;
		return mapProductData(data);
	}, [JSON.stringify(data)]);

	const [selectedColorIndex, setSelectedColorIndex] = useState(0);
	const [selectedColorQty, setSelectedColorQty] = useState<Record<number, Record<string, number>>>({});

	const updateColorQty = (colorIndex: number, size: string, type: 'inc' | 'dec', stock: number) => {
		setSelectedColorQty((prev) => {
			const colorQty = prev[colorIndex] || {};
			const current = colorQty[size] || 0;

			if (type === 'inc' && current < stock) {
				return { ...prev, [colorIndex]: { ...colorQty, [size]: current + 1 } };
			}
			if (type === 'dec' && current > 0) {
				const updated = current - 1;
				const newColorQty = { ...colorQty };
				if (updated === 0) {
					delete newColorQty[size];
				} else {
					newColorQty[size] = updated;
				}
				const newState = { ...prev, [colorIndex]: newColorQty };
				if (Object.keys(newColorQty).length === 0) {
					delete newState[colorIndex];
				}
				return newState;
			}
			return prev;
		});
	};

	if (isLoading || !product) {
		return <ProductDetailsSkeleton />;
	}

	const selectedVariant = product.variants[selectedColorIndex];
	const mainImage = selectedVariant?.image || product.image;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:mb-20 mb-12">
			{/* LEFT */}
			<div className="md:col-span-9 col-span-1 grid grid-cols-1 md:grid-cols-12 gap-6">
				{/* IMAGE */}
				<div className="md:col-span-5 col-span-12">
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
				<div className="md:col-span-7 col-span-12">
					<ProductInfo
						product={{
							id: product.id,
							name: product.name,
							price: product.price,
							currency: product.currency,
							solded: product.sold,
							description: product.description,
							colors: product.colors,
							image: mainImage,
							variants: product.variants,
							rating: product.rating,
							reviewCount: product.reviewCount,
						}}
						selectedColorQty={selectedColorQty}
						updateColorQty={updateColorQty}
					/>
				</div>
				<div className="md:hidden col-span-12">
					<CartSection
						product={{
							...product,
							selectedColorQty,
						}}
					/>
				</div>

				{/* TABS */}
				<div className="col-span-12 bg-white rounded-lg p-5">
					<SellerInfo seller={product.seller} />
					<ProductTabs description={product.description} specifications={product.specifications} reviews={[]} />
				</div>
			</div>

			{/* RIGHT */}
			<div className="md:col-span-3 col-span-1 sticky top-18 self-start hidden md:block">
				<CartSection
					product={{
						...product,
						selectedColorQty,
					}}
				/>
			</div>
		</div>
	);
}
