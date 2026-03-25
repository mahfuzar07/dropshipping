'use client';

import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Grid } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import Image from 'next/image';
import TypoTitle from '@/components/common/elements/TypoTitle';

/* ---------------- TYPES ---------------- */
interface Product {
	id: number;
	name: string;
	image: string;
	rating: number;
	price: number;
	originalPrice?: number;
}

/* ---------------- DATA ---------------- */
const bestSellingProducts: Product[] = [
	{ id: 1, name: 'Baby Bear Hoodie', image: '🧸', rating: 4, price: 33 },
	{ id: 2, name: 'Toddler Tutu Dress', image: '👗', rating: 3, price: 38, originalPrice: 45 },
	{ id: 3, name: 'Tiny Tuxedo Shirt', image: '👔', rating: 5, price: 45 },
	{ id: 4, name: 'Soft Cotton Pajama', image: '🧦', rating: 4, price: 29 },
	{ id: 5, name: 'Mini Denim Jacket', image: '🧥', rating: 5, price: 52 },
	{ id: 6, name: 'Cute Knit Cap', image: '🧢', rating: 4, price: 18 },
];

const flashSaleProducts: Product[] = [
	{ id: 1, name: 'Petite Plaid Skirt', image: '👗', rating: 5, price: 33, originalPrice: 39 },
	{ id: 2, name: 'Little Lumberjack Flannel', image: '👕', rating: 5, price: 23, originalPrice: 45 },
	{ id: 3, name: 'Tiny Sneakers', image: '👟', rating: 4, price: 60 },
	{ id: 4, name: 'Baby Winter Coat', image: '🧥', rating: 5, price: 70 },
	{ id: 5, name: 'Soft Wool Sweater', image: '🧶', rating: 4, price: 42 },
	{ id: 6, name: 'Cute Hair Band', image: '🎀', rating: 3, price: 12 },
];

/* ---------------- PRODUCT SLIDER ---------------- */
function ProductSlider({ title, products, id, autoplayDelay = 3000 }: { title: string; products: Product[]; id: string; autoplayDelay?: number }) {
	return (
		<div className="flex-1">
			{/* Header */}
			<div className="flex items-center justify-between mb-10">
				<TypoTitle title={title} className="" />

				<div className="flex gap-3">
					<button className={`prev-${id} p-1 rounded-full cursor-pointer hover:bg-gray-200`}>
						<ChevronLeft className="w-5 h-5" />
					</button>
					<button className={`next-${id} p-1 rounded-full cursor-pointer hover:bg-gray-200`}>
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Swiper */}
			<Swiper
				modules={[Navigation, Autoplay, Grid]}
				navigation={{
					prevEl: `.prev-${id}`,
					nextEl: `.next-${id}`,
				}}
				autoplay={{
					delay: autoplayDelay,
					disableOnInteraction: false,
				}}
				grid={{
					rows: 3,
					fill: 'row',
				}}
				loop={true}
				slidesPerView={1}
				spaceBetween={10}
			>
				{products.map((product) => (
					<SwiperSlide key={product.id}>
						<div className="flex items-center gap-5">
							<div className="relative w-35 h-35 border rounded overflow-hidden">
								<Image
									src="https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png"
									fill
									alt={product.name}
									className="w-full h-full object-cover"
								/>
							</div>

							<div>
								<h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>

								<div className="flex gap-1 mb-2">
									{[...Array(5)].map((_, i) => (
										<Star key={i} className={`w-4 h-4 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
									))}
								</div>

								<div className="flex gap-2 items-center">
									{product.originalPrice && <span className="text-gray-400 line-through">${product.originalPrice}.00</span>}
									<span className="text-twinkle-accent font-bold">${product.price}.00</span>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}

/* ---------------- PROMO SECTION ---------------- */
function PromoSection() {
	return (
		<div className="flex flex-col gap-6">
			<div className="bg-pink-300 rounded-xl md:h-full h-[220px] relative overflow-hidden">
				<div className="absolute inset-0 p-8 flex flex-col justify-center">
					<h3 className="text-4xl font-bold mb-2">Kids Dress</h3>
					<p className="mb-4">Get an extra 30% discount</p>
					<button className="bg-twinkle-accent hover:bg-twinkle-accent/80 text-white px-6 py-2 rounded-lg w-fit">SHOP NOW</button>
				</div>
				<div className="absolute bottom-0 right-0 text-9xl opacity-30">👧</div>
			</div>

			<div className="bg-blue-300 rounded-xl md:h-full h-[220px]  relative overflow-hidden">
				<div className="absolute inset-0 p-8 flex flex-col justify-center">
					<h3 className="text-4xl font-bold mb-2">Girls Apparels</h3>
					<p className="mb-4">Get an extra 50% discount</p>
					<button className="bg-twinkle-accent hover:bg-twinkle-accent/80 text-white px-6 py-2 rounded-lg w-fit">SHOP NOW</button>
				</div>
				<div className="absolute bottom-0 right-0 text-9xl opacity-30">👗</div>
			</div>
		</div>
	);
}

/* ---------------- MAIN EXPORT ---------------- */
export default function FlashBestSelling() {
	return (
		<div className="container max-w-7xl mx-auto py-16 px-5">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
				<ProductSlider id="best" title="Best Selling" products={bestSellingProducts} autoplayDelay={3000} />

				<ProductSlider id="flash" title="Flash Sale" products={flashSaleProducts} autoplayDelay={3800} />

				<PromoSection />
			</div>
		</div>
	);
}
