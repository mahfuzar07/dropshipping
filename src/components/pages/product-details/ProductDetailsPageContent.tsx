'use client';

import { useMemo, useState } from 'react';
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

export interface VariantOptionItem {
	id: string;
	value: string;
	image?: string;
}

export interface VariantGroup {
	groupId: string;
	label: string;
	options: VariantOptionItem[];
	hasImages: boolean;
}

export interface VariantOption {
	skuId: number;
	price: number;
	stock: number;
	selections: Record<string, string>; // groupId -> optionId
	label: string;
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

		prop_imgs?: {
			prop_img: { properties: string; url: string }[];
		};

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
	if (!product) return null;
	const galleryImages = Array.isArray(product.item_imgs) ? product.item_imgs.map((img) => img?.url).filter((url): url is string => Boolean(url)) : [];

	const specifications: Record<string, string> = {};
	if (Array.isArray(product.props)) {
		product.props.forEach((prop) => {
			if (prop?.name && prop?.value) {
				specifications[prop.name] = prop.value;
			}
		});
	}

	// ---- Parse props_list into groups ----
	const propsList: Record<string, string> = product.props_list || {};
	const groupsMap: Record<string, { label: string; options: Record<string, string> }> = {};

	Object.entries(propsList).forEach(([key, val]) => {
		const [groupId, optId] = key.split(':');
		const [label, value] = val.split(':');
		if (!groupsMap[groupId]) groupsMap[groupId] = { label, options: {} };
		groupsMap[groupId].options[optId] = value;
	});

	// ---- Parse prop_imgs -> "groupId:optId" -> image url ----
	const imageMap: Record<string, string> = {};
	product.prop_imgs?.prop_img?.forEach((p) => {
		if (p?.properties && p?.url) imageMap[p.properties] = p.url;
	});

	// Drop meaningless groups (single option that's just "#NA" / "NA" / empty)
	const isMeaningless = (opts: Record<string, string>) => {
		const vals = Object.values(opts);
		return vals.length <= 1 && /^#?NA$/i.test(vals[0] || '');
	};

	const variantGroups: VariantGroup[] = Object.entries(groupsMap)
		.filter(([, g]) => !isMeaningless(g.options))
		.map(([groupId, g]) => {
			const options: VariantOptionItem[] = Object.entries(g.options).map(([id, value]) => ({
				id,
				value,
				image: imageMap[`${groupId}:${id}`],
			}));
			return {
				groupId,
				label: g.label,
				options,
				hasImages: options.some((o) => !!o.image),
			};
		});

	// ---- Build per-SKU variant options ----
	const variantOptions: VariantOption[] = Array.isArray(product.skus?.sku)
		? product.skus.sku.map((sku) => {
				const selections: Record<string, string> = {};
				sku.properties.split(';').forEach((pair) => {
					const [groupId, optId] = pair.split(':');
					selections[groupId] = optId;
				});

				const label = Object.entries(selections)
					.filter(([groupId]) => variantGroups.some((g) => g.groupId === groupId))
					.map(([groupId, optId]) => groupsMap[groupId]?.options[optId])
					.filter(Boolean)
					.join(' / ');

				return {
					skuId: sku.sku_id,
					price: sku.price,
					stock: sku.quantity,
					selections,
					label: label || 'Default',
				};
			})
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

		variantGroups,
		variantOptions,
		specifications,
		description: product.desc,

		seller: product.seller_info,
		unit: product.unit,
		location: product.location,
		video: product.video?.url,
		weight: product.weight,
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

	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	// cart qty keyed by skuId
	const [selectedQty, setSelectedQty] = useState<Record<number, number>>({});

	const updateQty = (skuId: number, type: 'inc' | 'dec', stock: number) => {
		setSelectedQty((prev) => {
			const current = prev[skuId] || 0;

			if (type === 'inc' && current < stock) {
				return { ...prev, [skuId]: current + 1 };
			}
			if (type === 'dec' && current > 0) {
				const updated = current - 1;
				const next = { ...prev };
				if (updated === 0) {
					delete next[skuId];
				} else {
					next[skuId] = updated;
				}
				return next;
			}
			return prev;
		});
	};

	// when a color/image variant is selected, sync the main gallery image
	const handleVariantImageSelect = (image?: string) => {
		if (!image || !product) return;
		const idx = product.galleryImages.findIndex((img) => img === image);
		if (idx >= 0) setSelectedImageIndex(idx);
	};

	if (isLoading || !product) {
		return <ProductDetailsSkeleton />;
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:mb-20 mb-12 py-2">
			{/* LEFT */}
			<div className="md:col-span-9 col-span-1 grid grid-cols-1 md:grid-cols-12 gap-6">
				{/* IMAGE */}
				<div className="md:col-span-5 col-span-12">
					<ProductImageGallery
						images={product.galleryImages}
						productName={product.name}
						selectedImageIndex={selectedImageIndex}
						onSelectImage={setSelectedImageIndex}
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
							rating: product.rating,
							reviewCount: product.reviewCount,
							variantGroups: product.variantGroups,
							variantOptions: product.variantOptions,
						}}
						selectedQty={selectedQty}
						updateQty={updateQty}
						onVariantImageSelect={handleVariantImageSelect}
					/>
				</div>
				<div className="md:hidden col-span-12">
					<CartSection
						product={{
							...product,
							selectedQty,
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
			<div className="md:col-span-3 col-span-1 hidden md:block">
				<CartSection
					product={{
						...product,
						selectedQty,
					}}
				/>
			</div>
		</div>
	);
}
