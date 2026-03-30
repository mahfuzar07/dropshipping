'use client';

import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const slides = [
	{
		id: 1,
		title: 'SUMMER',
		subtitle: 'Fresh Picks For The Season',
		buttonText: 'Shop Now',
		bg: '/assets/hero/slide-1.jpg',
	},
	{
		id: 2,
		title: 'WINTER',
		subtitle: 'Warm & Cozy Essentials',
		buttonText: 'Explore Now',
		bg: '/assets/hero/slide-2.jpg',
	},
	{
		id: 3,
		title: 'ACCESSORIES',
		subtitle: 'Trendy Add-Ons For Every Look',
		buttonText: 'Discover',
		bg: '/assets/hero/slide-3.jpg',
	},
];

export default function HeroSection() {
	// const [slides, setSlides] = useState<Slide[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const prevRef = useRef<HTMLDivElement>(null);
	const nextRef = useRef<HTMLDivElement>(null);
	const swiperRef = useRef<SwiperCore | null>(null);
	return (
		<div className="relative w-full aspect-[10/16] md:aspect-[16/6] lg:aspect-[10/4] 2xl:aspect-[18/6] overflow-hidden">
			<Swiper
				modules={[Autoplay, Pagination, Navigation]}
				spaceBetween={0}
				slidesPerView={1}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
				}}
				pagination={{
					clickable: true,
					el: '.swiper-pagination',
					bulletClass: 'swiper-pagination-bullet',
					bulletActiveClass: 'swiper-pagination-bullet-active',
				}}
				navigation={{
					prevEl: prevRef.current,
					nextEl: nextRef.current,
					disabledClass: 'swiper-button-disabled',
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
				className="w-full h-full"
			>
				{slides.map((slide) => (
					<SwiperSlide key={slide.id} className="rounded overflow-hidden">
						<div className="relative w-full h-full">
							<Image src={slide.bg} alt={slide.title} fill objectFit="cover" objectPosition="top-center" priority={slide.id === 1} />
							<div className="absolute inset-0 bg-black/30 transition-opacity duration-500" />

							<div className="absolute left-1/2 md:top-40 2xl:top-60 top-50 -translate-x-1/2 z-10 flex items-center justify-center text-center px-4">
								<div className="text-white max-w-xl">
									<h1 className="text-3xl md:text-5xl font-bold text-white">{slide.title}</h1>

									<p className="mt-2 text-lg md:text-xl">{slide.subtitle}</p>

									<button className="mt-4 px-6 py-2 bg-orange-300 hover:bg-orange-400 rounded-lg font-semibold">{slide.buttonText}</button>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			{/* Search Box */}
			<div className="absolute left-1/2 bottom-20 -translate-x-1/2 w-full px-4 z-10">
				<div className="bg-white/30 backdrop-blur-xl p-5 max-w-3xl mx-auto rounded-xl shadow-xl">
					<div className="bg-white/10 rounded-full flex items-center pl-4 pr-1 py-1 gap-3 border border-orange-300">
						<input
							type="text"
							placeholder="Search from 300M+ premium products Around the World ..."
							className="flex-1 outline-none text-sm md:text-base text-white placeholder:text-orange-100 bg-transparent"
						/>

						<button className="flex shadow items-center justify-center bg-orange-300 text-white  2xl:w-12 2xl:h-12 w-10 h-10 md:w-10 md:h-10 rounded-full">
							<Search className="w-4 h-4 md:w-5 md:h-5 2xl:w-6 2xl:h-6" />
						</button>
					</div>

					{/* Country selector */}
					<div className="mt-3 flex items-center justify-center gap-5 text-xs md:text-sm text-gray-100">
						<span>Order From:</span>
						{['🇧🇩', '🇺🇸', '🇬🇧', '🇨🇳', '🇩🇪', '🇵🇰'].map((flag, i) => (
							<span className="text-xl" key={i}>
								{flag}
							</span>
						))}
					</div>
				</div>
			</div>

			{/* Custom Navigation Arrows and Pagination */}
			<div className="bg-white/50 flex items-center justify-between absolute h-6 md:h-9.5 rounded-full md:bottom-4 bottom-2 z-10 left-1/2 -translate-x-1/2 md:gap-3 gap-1 overflow-hidden">
				<div ref={prevRef} className={`cursor-pointer md:p-2 p-1 shadow transition-all duration-300`}>
					<ChevronLeft className={`w-3 h-3  md:w-5 md:h-5 ${activeIndex === 0 ? 'text-gray-300' : 'text-gray-800 hover:text-primary'}`} />
				</div>
				{/* Custom Pagination Dots */}
				<div className="flex justify-center gap-2 shrink-0">
					{slides.map((_, index) => (
						<span
							key={index}
							className={`md:w-2 md:h-2 w-1 h-1 rounded-full cursor-pointer ${index === activeIndex ? 'bg-gray-400' : 'bg-gray-300'}`}
							onClick={() => {
								if (swiperRef.current) {
									swiperRef.current.slideTo(index);
								}
							}}
						></span>
					))}
				</div>

				<div ref={nextRef} className={`cursor-pointer md:p-2 p-1 shadow transition-all duration-300`}>
					<ChevronRight
						className={`w-3 h-3  md:w-5 md:h-5 ${activeIndex === slides.length - 1 ? 'text-gray-300' : 'text-gray-800 hover:text-primary'}`}
					/>
				</div>
			</div>
		</div>
	);
}
