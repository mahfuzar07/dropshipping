'use client';
import React, { useRef, useState } from 'react';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';

const products = [
	{
		id: 1,
		title: ' US',
		image: '/assets/country/us.webp',
	},
	{ id: 2, title: 'UK', image: '/assets/country/uk.webp' },
	{
		id: 3,
		title: ' China',
		image: '/assets/country/china.webp',
	},
	{ id: 4, title: ' Japan', image: '/assets/country/japan.webp' },
	{ id: 5, title: ' Europe', image: '/assets/country/europe.webp' },
	{ id: 6, title: ' Hong Kong', image: '/assets/country/hong-kong.webp' },
	{ id: 7, title: ' Korea', image: '/assets/country/korea.webp' },
];

export default function WordlWideStore() {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const prevRef = useRef<HTMLDivElement>(null);
	const nextRef = useRef<HTMLDivElement>(null);
	const swiperRef = useRef<SwiperCore | null>(null);
	return (
		<div className="bg-gray-100 py-8">
			<div className="container mx-auto px-4 relative">
				{/* Title */}
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">PREMIUM PRODUCTS FROM WORLDWIDE STORES</h2>
				</div>

				{/* Swiper */}
				<div className="relative">
					{/* Custom Nav Buttons */}
					<div
						ref={prevRef}
						className={`prev-btn cursor-pointer absolute -left-5 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-orange-300 hover:text-white text-gray-700 p-3 rounded-full shadow-lg  transition-all duration-200`}
					>
						<ChevronLeft className={`w-3 h-3  md:w-5 md:h-5 ${activeIndex === 0 ? 'text-gray-300' : 'text-gray-800 hover:text-white'}`} />
					</div>

					<div
						ref={nextRef}
						className={`next-btn cursor-pointer absolute -right-5 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-orange-300  hover:text-white text-gray-700 p-3 rounded-full shadow-lg  transition-all duration-200`}
					>
						<ChevronRight
							className={`w-3 h-3  md:w-5 md:h-5  ${activeIndex === products.length - 1 ? 'text-gray-300' : 'text-gray-800 hover:text-white'}`}
						/>
					</div>
					<Swiper
						modules={[Navigation, Autoplay]}
						spaceBetween={16}
						// slidesPerView={6}
						navigation={{
							prevEl: prevRef.current,
							nextEl: nextRef.current,
						}}
						autoplay={{
							delay: 4000,
							disableOnInteraction: false,
						}}
						breakpoints={{
							200: { slidesPerView: 2 },
							768: { slidesPerView: 4 },
							1024: { slidesPerView: 5 },
							1280: { slidesPerView: 6 },
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
								<Link href={`/products/${product.id}`} className="group cursor-pointer bg-white overflow-hidden rounded-md h-full flex flex-col transition-all duration-300">
									{/* Image Container - Fixed aspect ratio */}
									<div className="relative w-full aspect-[8/5] overflow-hidden flex-shrink-0 bg-white">
										<Image src={product.image} alt={product.title} fill className="object-cover transition-transform " />
									</div>

									<div className="flex-1 flex flex-col lg:px-5 2xl:px-8 py-3 pt-4">
										<h3 className="text-xs md:text-sm 2xl:text-md text-center leading-tight mb-3 flex-grow">
											Buy Imported Products from
											<strong> {product.title}</strong>
										</h3>
									</div>
								</Link>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</div>
	);
}
