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

export type Category = {
	id: string;
	name: string;
	icon?: string;
};
const dummyCategories: Category[] = [
	{
		id: '1',
		name: 'Fruits',

		icon: '/assets/image-placeholder.png',
	},
	{
		id: '2',
		name: 'Vegetables',
		icon: '/assets/image-placeholder.png',
	},
	{
		id: '3',
		name: 'Meat',
		icon: '/assets/image-placeholder.png',
	},
	{
		id: '4',
		name: 'Fish',
		icon: '/assets/image-placeholder.png',
	},
	{
		id: '5',
		name: 'Beverages',
		icon: '/assets/image-placeholder.png',
	},
	{
		id: '6',
		name: 'Snacks',
		icon: '/assets/image-placeholder.png',
	},
	{
		id: '7',
		name: 'Dairy',
		icon: '/assets/image-placeholder.png',
	},
	{
		id: '8',
		name: 'Bakery',
		icon: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
	},
	{
		id: '9',
		name: 'Dairy',
		icon: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
	},
	{
		id: '10',
		name: 'Bakery',
		icon: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
	},
];

export default function ShopByCategory() {
	return (
		<section className="md:py-10 py-5 bg-white">
			<div className="container mx-auto md:px-3 px-3">
				<div className="flex items-center justify-between mb-2 md:mb-5">
					<TypoTitle title="Shop By Category" className=" uppercase" align="left" />
					<div className="flex items-center gap-2 text-primary shrink-0">
						<Link href=""> View All Categories </Link>
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
						{dummyCategories.map((category) => (
							<SwiperSlide key={category.id}>
								<Link href={`/products?category=${category.name}`}>
									<div className="group cursor-pointer rounded-lg py-5 text-center transition-all duration-300">
										<div className="flex flex-col items-center space-y-5">
											<div className="md:w-30 w-22 aspect-square rounded-full flex items-center justify-center bg-store-secondary-muted">
												<div className="relative md:h-22 md:w-22 h-14 w-14">
													<Image src={'/assets/image-placeholder.png'} fill alt={category.name} className="object-cover" />
												</div>
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
