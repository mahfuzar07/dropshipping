// ProductDetailsPageContent.tsx
'use client';

import { useMemo, useState } from 'react';
import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import CartSection from './CartSection';
import SellerInfo from './SellerInfo';

const demoProduct = {
	id: 1,
	name: 'Premium Hoodie',
	slug: 'premium-hoodie',
	image: '/assets/product/product-2.webp',
	sell_price: '59.99',
	qty: 15,
	est_del_days: '3-5 days',
	is_overseas: 0,
	product_review: '4.5',
	product_review_count: 124,
	variant: [
		{
			id: 101,
			name: 'Black Hoodie',
			additional_image: '/assets/product/product-5.png',
			pivot: {
				color_name: 'Black',
				item_code: 'PH-BLK',
				qty: 8,
				additional_image: '/assets/product/product-5.png',
			},
		},
		{
			id: 102,
			name: 'Red Hoodie',
			additional_image: '/assets/product/product-6.png',
			pivot: {
				color_name: 'Red',
				item_code: 'PH-RED',
				qty: 5,
				additional_image: '/assets/product/product-6.png',
			},
		},
		{
			id: 103,
			name: 'Blue Hoodie',
			additional_image: '/assets/product/product-7.png',
			pivot: {
				color_name: 'Blue',
				item_code: 'PH-BLU',
				qty: 2,
				additional_image: '/assets/product/product-7.png',
			},
		},
	],
	pro_specification: [
		{
			Material: '100% Premium Cotton',
			'Fit Type': 'Regular Fit',
			'Care Instructions': 'Machine wash cold, tumble dry low',
			Origin: 'Bangladesh',
			Weight: '320 GSM',
		},
	],
};

export default function ProductDetailsPageContent({ productSlug }: { productSlug: string }) {
	// For now using demo data (you can later uncomment the API call)
	const product = useMemo(() => demoProduct, []);
	const [selectedColorIndex, setSelectedColorIndex] = useState(0);

	// Gallery Images (Main image + all variant images)
	const galleryImages = useMemo(() => {
		const mainImage = product.image;
		const variantImages = product.variant.map((v) => v.additional_image || v.pivot?.additional_image).filter(Boolean) as string[];
		return [mainImage, ...variantImages];
	}, [product]);

	// Colors for selection
	const colors = useMemo(
		() =>
			product.variant.map((v) => ({
				name: v.pivot.color_name,
				image: v.additional_image || v.pivot.additional_image || '',
			})),
		[product],
	);

	// Main image shown in gallery (based on selected color)
	const mainImage =
		product.variant[selectedColorIndex]?.additional_image || product.variant[selectedColorIndex]?.pivot?.additional_image || product.image;

	return (
		<div className="px-2 py-3">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:mb-20 mb-12">
				<div className="col-span-9 grid grid-cols-1 md:grid-cols-12 gap-6">
					<div className="col-span-5">
						<ProductImageGallery
							images={galleryImages}
							productName={product.name}
							selectedImageIndex={selectedColorIndex + 1} // +1 because first image is main product image
							onSelectImage={(index) => {
								if (index > 0) setSelectedColorIndex(index - 1);
							}}
						/>
					</div>
					<div className="col-span-7">
						<ProductInfo
							product={{
								id: product.id,
								name: product.name,
								price: Number(product.sell_price),
								description: `Estimated delivery: ${product.est_del_days}`,
								inStock: product.qty > 0,
								stockCount: product.qty,
								colors,
								image: mainImage,
								sizes: ['S', 'M', 'L', 'XL'], // You can make this dynamic later
								rating: Number(product.product_review),
								reviewCount: product.product_review_count,
								selectedColorIndex,
								setSelectedColorIndex,
							}}
						/>
					</div>

					<div className="col-span-12 bg-white rounded-lg p-5">
						<SellerInfo/>
						<ProductTabs
							description={`Check out the ${product.name}. Available colors: ${colors.map((c) => c.name).join(', ')}.`}
							specifications={product.pro_specification?.[0] || {}}
							reviews={[]} // You can add demo reviews later
						/>
					</div>
				</div>

				<div className="col-span-3 sticky top-5 self-start">
					<CartSection/>
				</div>
			</div>
		</div>
	);
}
