'use client';
import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import TypoTitle from '@/components/common/elements/TypoTitle';
import { ArrowRight } from 'lucide-react';
import { normalizeCategories } from '@/components/common/header/HeaderBottom';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useAppData } from '@/hooks/use-appdata';

export interface Category {
	id: number;
	name: string;
	slug: string;
	icon: string;
	subcategories: Category[];
}

// full API response
export interface CategoriesResponse {
	categories: Category[];
}

export default function ShopByCategory() {
	const { data, isLoading } = useAppData<CategoriesResponse, 'single'>({
		key: [QueriesKey.CATEGORIES],
		api: apiEndpoint.products.CATEGORIES(),
		auth: true,
		responseType: 'single',
	});

	const parentCategories = Array.isArray(data) ? data : (data?.categories ?? []);

	const isImageUrl = (icon: string) => {
		return icon.startsWith('/') || icon.startsWith('http://') || icon.startsWith('https://');
	};

	return (
		<section className="md:py-10 py-5 bg-white">
			<div className="container mx-auto md:px-3 px-3">
				<div className="flex items-center justify-between mb-2 md:mb-5">
					<TypoTitle title="Shop By Category" className=" uppercase" align="left" />
					<div className="flex items-center gap-2 text-primary shrink-0">
						<Link href="" className="flex items-center gap-1 text-sm md:text-base font-medium">
							View All <span className='hidden md:block'>Categories</span>
						</Link>
						<ArrowRight size={18} />
					</div>
				</div>
				<div className="py-2">
					<Swiper
						modules={[Autoplay, Navigation]}
						spaceBetween={0}
						slidesPerView={3}
						loop={true}
						// centeredSlidesBounds={true}
						breakpoints={{
							640: { slidesPerView: 3 },
							768: { slidesPerView: 3 },
							1024: { slidesPerView: 8 },
						}}
						autoplay={{
							delay: 3000,
							disableOnInteraction: false,
						}}
					>
						{parentCategories.map((category) => (
							<SwiperSlide key={category.id}>
								<Link href={`/products?category=${category.name}`}>
									<div className="group cursor-pointer rounded-lg py-5 text-center transition-all duration-300">
										<div className="flex flex-col items-center space-y-5">
											<div className="md:w-30 w-22 aspect-square rounded-full flex items-center justify-center bg-store-secondary-muted">
												{isImageUrl(category.icon) ? (
													<div className="relative md:h-22 md:w-22 h-14 w-14">
														<Image src={category.icon} fill alt={category.name} className="object-contain" />
													</div>
												) : (
													<div className="flex h-full w-full items-center justify-center text-[42px] md:text-[64px] leading-none">
														{category.icon}
													</div>
												)}
											</div>

											<h3 className="md:text-base text-sm font-medium text-foreground line-clamp-1 group-hover:text-twinkle-accent">
												{category.name}
											</h3>
										</div>
									</div>
								</Link>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</section>
	);
}
