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
import PieceWeightScaleInfoTable from './PieceWeightScaleInfoTable';

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

// export interface ProductDetails {
// 	_id: string;
// 	offer_id: string;
// 	title: string;
// 	image: string;
// 	rating: string;
// 	sold: string;

// 	price: {
// 		currency: string;
// 		amount: string;
// 		unit: string;
// 		overseas: string;
// 	};

// 	details: {
// 		extract_product_variants: Variant[];
// 		extract_product_attributes: Record<string, string>;
// 		extract_product_description: {
// 			images: string[];
// 		};
// 	};
// }

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
		data: {
			gallery: {
				fields: {
					offerImgList: string[];
				};
			};
			Root: {
				fields: {
					dataJson: {
						skuModel: {
							skuProps: Array<{
								prop: string;
								value: Array<{ name: string; imageUrl: string }>;
							}>;
							skuInfoMap: Record<
								// ← missing < was the core bug
								string,
								{ canBookCount: number; skuId: number }
							>;
						};
					};
				};
			};
			offerDetail: {
				// ← moved inside data, not a sibling of it
				featureAttributes: Array<{ name: string; value: string }>;
			};
		};
	};
}

export interface ProductApiResponse {
	updated: boolean;
	product: ProductDetails;
}

/* ================= MAPPER ================= */

// const mapProductData = (product: ProductDetails) => {
// 	const variants = product.details?.extract_product_variants || [];

// 	const colors = variants.map((v) => ({
// 		name: v.color_name,
// 		image: v.image,
// 	}));

// 	const galleryImages = [product.image, ...variants.map((v) => v.image)];

// 	return {
// 		id: product._id,
// 		offer_id: product.offer_id,
// 		name: product.title,
// 		price: Number(product.price?.amount || 0),
// 		overseasPrice: product.price?.overseas,
// 		currency: product.price?.currency,
// 		rating: Number(product.rating || 0),
// 		reviewCount: 0,

// 		image: product.image,
// 		sold: product.sold,

// 		colors,
// 		variants,
// 		galleryImages,

// 		specifications: product.details?.extract_product_attributes || {},
// 	};
// };

const mapProductData = (product: ProductDetails) => {
	const dataJson = product.details?.data?.Root?.fields?.dataJson;
	const skuModel = dataJson?.skuModel;

	// Colors come from skuProps (the "颜色" prop)
	const colorProp = skuModel?.skuProps?.find((p) => p.prop === '颜色');
	const colorValues = colorProp?.value || [];
	const skuInfoMap = skuModel?.skuInfoMap || {};

	// Build variants — one per color, with stock from skuInfoMap
	// const variants = colorValues.map((color) => ({
	// 	color_name: color.name,
	// 	image: color.imageUrl,
	// 	active: true,
	// 	// This product has no sizes — wrap stock as a single "size" entry
	// 	sizes: [
	// 		{
	// 			size_name: 'Standard',
	// 			price: product.price?.amount || '0',
	// 			stock: String(skuInfoMap[color.name]?.canBookCount ?? 0),
	// 		},
	// 	],
	// }));

	const findWeightBySku = (
		pieceWeightScaleInfo: Array<{
			sku1: string;
			weight: number;
			height: number;
			length: number;
			width: number;
			volume: number;
			skuId: number;
		}>,
		skuName: string,
	) => {
		return pieceWeightScaleInfo.find((item) => item.sku1 === skuName) ?? null;
	};

	const pieceWeightScaleInfo = product.details?.data?.productPackInfo?.fields?.pieceWeightScale?.pieceWeightScaleInfo ?? [];
	const pieceWeightScaleInfoColumnList = product.details?.data?.productPackInfo?.fields?.pieceWeightScale?.columnList ?? [];

	const variants = colorValues.map((color) => {
		const weightInfo = findWeightBySku(pieceWeightScaleInfo, color.name);
		const weightKg = weightInfo ? weightInfo.weight / 1000 : 0;

		return {
			color_name: color.name,
			image: color.imageUrl,
			active: true,
			weightKg,
			weightInfo, // attach full object if you need length/width/height later
			sizes: [
				{
					size_name: 'Standard',
					price: product.price?.amount || '0',
					stock: String(skuInfoMap[color.name]?.canBookCount ?? 0),
				},
			],
		};
	});

	const galleryImages = product.details?.data?.gallery?.fields?.offerImgList || [product.image];

	// Build specifications from featureAttributes
	const featureAttributes = (product.details?.data as any)?.offerDetail?.featureAttributes || [];
	const specifications: Record<string, string> = {};
	featureAttributes.forEach((attr: { name: string; value: string }) => {
		if (attr.name && attr.value) {
			specifications[attr.name] = attr.value;
		}
	});

	const colors = colorValues.map((c) => ({
		name: c.name,
		image: c.imageUrl,
	}));

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
		specifications,
		pieceWeightScaleInfo,
		pieceWeightScaleInfoColumnList,
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

	const productRaw = data;

	const product = useMemo(() => {
		if (!productRaw) return null;
		return mapProductData(productRaw);
	}, [productRaw]);

	const [selectedColorIndex, setSelectedColorIndex] = useState(0);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [qty, setQty] = useState<Record<string, number>>({});

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
				// remove size key if qty hits 0 to keep object clean
				const newColorQty = { ...colorQty };
				if (updated === 0) {
					delete newColorQty[size];
				} else {
					newColorQty[size] = updated;
				}
				// remove color key entirely if no sizes left
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
		return <LoadingSkeleton />;
	}

	const selectedVariant = product.variants[selectedColorIndex];

	const sizes = selectedVariant?.sizes?.map((s) => s.size_name) || [];

	const mainImage = selectedVariant?.image || product.image;

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
						{/* <ProductInfo
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
						/> */}

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
							}}
							selectedColorQty={selectedColorQty}
							updateColorQty={updateColorQty}
						/>
					</div>

					{/* TABS */}
					<div className="col-span-12 bg-white rounded-lg p-5">
						<SellerInfo />
						{/* <ProductTabs description={product.name} specifications={product.specifications} reviews={[]} /> */}
						<ProductTabs
							description={product.name} // keep as fallback until API provides description text
							specifications={product.specifications}
							reviews={[]}
						/>
						<PieceWeightScaleInfoTable data={product.pieceWeightScaleInfo} columns={product.pieceWeightScaleInfoColumnList} />
					</div>
				</div>

				{/* RIGHT */}
				<div className="col-span-3 sticky top-5 self-start">
					{/* <CartSection
						product={{
							...product,
							selectedVariant,
							selectedSize,
							qty,
						}}
					/> */}
					<CartSection
						product={{
							...product,
							selectedColorQty, // all selected colors + qtys
						}}
					/>
				</div>
			</div>
		</div>
	);
}
