'use client';
import React, { useRef, useState } from 'react';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

const products = [
	{
		id: 1,
		title: 'DUDE Wipes DUDE Bombs Toilet Stank Eliminator - 2-in-1 Air Freshener and Toilet...',
		image: '/assets/hero/slide-1.jpg',
		store: 'US',
		price: '1233.00',
	},
	{ id: 2, title: 'Gain In-Wash Laundry Scent Booster Beads, Happy, 24 oz', image: '/assets/hero/slide-1.jpg', store: 'US', price: '12.99' },
	{
		id: 3,
		title: 'SmoothSpine Triple Fusion Back Massager - The Official Smooth Spine Massager with...',
		image: '/assets/hero/slide-1.jpg',
		store: 'US',
		price: '199.99',
	},
	{ id: 4, title: 'Jell-O Cheesecake Instant Pudding & Pie Filling Mix, 3.4 oz Box', image: '/assets/hero/slide-1.jpg', store: 'US', price: '2.99' },
	{ id: 5, title: 'Jell-O Cheesecake Instant Pudding & Pie Filling Mix, 3.4 oz Box', image: '/assets/hero/slide-1.jpg', store: 'US', price: '2.99' },
	{ id: 6, title: 'Jell-O Cheesecake Instant Pudding & Pie Filling Mix, 3.4 oz Box', image: '/assets/hero/slide-1.jpg', store: 'US', price: '2.99' },
	{ id: 7, title: 'Jell-O Cheesecake Instant Pudding & Pie Filling Mix, 3.4 oz Box', image: '/assets/hero/slide-1.jpg', store: 'US', price: '2.99' },
];

export default function TopSelling() {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const prevRef = useRef<HTMLDivElement>(null);
	const nextRef = useRef<HTMLDivElement>(null);
	const swiperRef = useRef<SwiperCore | null>(null);
	return (
		<div className="bg-gray-100 py-8">
			<div className="container mx-auto px-4 relative">
				{/* Title */}
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">TOP SELLING</h2>
				</div>

				{/* Custom Nav Buttons */}
				<div
					ref={prevRef}
					className={`prev-btn cursor-pointer absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-orange-300 hover:text-white text-gray-700 p-3 rounded-full shadow-lg  transition-all duration-200`}
				>
					<ChevronLeft className={`w-3 h-3  md:w-5 md:h-5 ${activeIndex === 0 ? 'text-gray-300' : 'text-gray-800 hover:text-white'}`} />
				</div>

				<div
					ref={nextRef}
					className={`next-btn cursor-pointer absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-orange-300  hover:text-white text-gray-700 p-3 rounded-full shadow-lg  transition-all duration-200`}
				>
					<ChevronRight
						className={`w-3 h-3  md:w-5 md:h-5  ${activeIndex === products.length - 1 ? 'text-gray-300' : 'text-gray-800 hover:text-white'}`}
					/>
				</div>

				{/* Swiper */}
				<Swiper
					modules={[Navigation, Autoplay]}
					spaceBetween={16}
					slidesPerView={5}
					navigation={{
						prevEl: prevRef.current,
						nextEl: nextRef.current,
					}}
					autoplay={{
						delay: 4000,
						disableOnInteraction: false,
					}}
					breakpoints={{
						640: { slidesPerView: 3 },
						768: { slidesPerView: 4 },
						1024: { slidesPerView: 5 },
						1280: { slidesPerView: 5 },
					}}
					onBeforeInit={(swiper) => {
						if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
							swiper.params.navigation.prevEl = prevRef.current;
							swiper.params.navigation.nextEl = nextRef.current;
						}
					}}
					onSwiper={(swiper) => {
						swiperRef.current = swiper;
					}}
					onSlideChange={(swiper) => {
						setActiveIndex(swiper.activeIndex);
					}}
				>
					{products.map((product) => (
						<SwiperSlide key={product.id}>
							<ProductCard product={product} />
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
}
