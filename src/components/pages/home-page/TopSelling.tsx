'use client';
import React, { useRef, useState } from 'react';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';

type TopSellingResponse = {
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

export default function TopSelling() {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const prevRef = useRef<HTMLDivElement>(null);
	const nextRef = useRef<HTMLDivElement>(null);
	const swiperRef = useRef<SwiperCore | null>(null);

	const { data: topProducts, isLoading: isLoadingAddress } = useAppData<TopSellingResponse, 'single'>({
		key: [QueriesKey.TOP_PRODUCTS],
		api: apiEndpoint.products.TOP_PRODUCTS(),
		auth: true,
		responseType: 'single',

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	const products = topProducts?.results || [];

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
					spaceBetween={12}
					// slidesPerView={5}
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
						<SwiperSlide key={product._id}>
							<ProductCard product={product} />
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
}
