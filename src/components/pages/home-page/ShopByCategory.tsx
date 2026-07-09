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
import { useProductFilterStore } from '@/z-store/product/useProductFilterStore';

export interface Category {
	id: number;
	name: string;
	slug: string;
	icon?: string;
	subcategories: Category[];
}

// full API response
export interface CategoriesResponse {
	categories: Category[];
}

export default function ShopByCategory() {
	const setCategory = useProductFilterStore((state) => state.setCategory);
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

	const handleClick = (item: Category) => {
		setCategory(item.name);
	};

	return (
		<section className="md:py-10 py-3">
			<div className="container mx-auto px-2">
				<div className="grid md:grid-cols-7 grid-cols-4 gap-1">
					{parentCategories.map((category) => (
						<Link
							key={category.id}
							href={`/product-list?search=${category.name}`}
							onClick={() => handleClick(category)}
							className="group cursor-pointer md:rounded-md rounded-sm  text-center transition-all duration-300 flex flex-col items-center md:p-3 p-1 md:gap-2 border border-primary/10 bg-white"
						>
							<div className="md:w-20 w-16 aspect-square flex items-center justify-center">
								{isImageUrl(category.icon) ? (
									<div className="relative md:h-22 md:w-22 h-12 w-12">
										<Image src={category.icon} fill alt={category.name} className="object-contain" />
									</div>
								) : (
									<div className="flex h-full w-full items-center justify-center text-[28px] md:text-[64px] leading-none">{category.icon}</div>
								)}
							</div>

							<h3 className="md:text-base text-[10px] font-medium text-foreground line-clamp-1 group-hover:text-twinkle-accent">{category.name}</h3>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
