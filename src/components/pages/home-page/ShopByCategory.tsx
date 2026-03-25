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

export type Category = {
	id: string;
	name: string;
	icon?: string;
};
const dummyCategories: Category[] = [
	{
		id: '1',
		name: 'Fruits',

		icon: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
	},
	{
		id: '2',
		name: 'Vegetables',
		icon: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
	},
	{
		id: '3',
		name: 'Meat',
		icon: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
	},
	{
		id: '4',
		name: 'Fish',
		icon: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
	},
	{
		id: '5',
		name: 'Beverages',
		icon: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
	},
	{
		id: '6',
		name: 'Snacks',
		icon: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
	},
	{
		id: '7',
		name: 'Dairy',
		icon: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
	},
	{
		id: '8',
		name: 'Bakery',
		icon: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
	},
];

export default function ShopByCategory() {
	return (
		<section className="md:py-12 py-10">
			<div className="container max-w-7xl mx-auto md:px-0 px-2">
				<TypoTitle title="Shop By Category" className="mb-2 md:mb-5" align="center" />
				<div className="md:py-5 py-2">
					<Swiper
						modules={[Autoplay, Navigation]}
						spaceBetween={0}
						slidesPerView={3}
						loop={true}
						// centeredSlidesBounds={true}
						breakpoints={{
							640: { slidesPerView: 3 },
							768: { slidesPerView: 3 },
							1024: { slidesPerView: 6 },
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
											<div className="md:w-38 w-22 aspect-square rounded-full flex items-center justify-center bg-store-secondary-muted">
												<div className="relative md:h-25 md:w-25 h-14 w-14">
													<Image src={category.icon ?? '/assets/icons/cat-icon.png'} fill alt={category.name} className="object-cover" />
												</div>
											</div>

											<h3 className="md:text-lg text-sm font-medium text-foreground line-clamp-1 group-hover:text-twinkle-accent">{category.name}</h3>
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
