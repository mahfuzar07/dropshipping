import React from 'react';
import TestPage from './TestPage';
import FlashBestSelling from './FlashBestSelling';
import BannerSection from './BannerSection';
import ShopByCategory from './ShopByCategory';
import NewInStoreSection from './NewInStoreSection';
import HeroSection from './HeroSection';
import FeatureHighlights from './FeatureHighlights';
import TopSelling from './TopSelling';
import NewLaunch from './NewLaunch';
import GiftIdeas from './GiftIdeas';
import SmallKitchenAndHouseholdSection from './SmallKitchenAndHouseholdSection';
import LatestDeal from './LatestDeal';
import WordlWideStore from './WordlWideStore';
import CategorySection from './CategorySection';

const HOME_SECTIONS = [
	{
		title: 'Fashion & Apparel',
		searchTag: 'fashion & apparel',
		icon: '👕',
		bgClass: 'bg-white',
	},
	{
		title: 'Home & Garden',
		searchTag: 'home & garden',
		icon: '🏡',
		bgClass: 'bg-gray-50',
	},
	{
		title: 'Beauty & Personal Care',
		searchTag: 'beauty & personal care',
		icon: '💄',
		bgClass: 'bg-white',
	},
	{
		title: 'Sports & Entertainment',
		searchTag: 'sports & entertainment',
		icon: '⚽',
		bgClass: 'bg-gray-50',
	},
	{
		title: 'Toys & Hobbies',
		searchTag: 'toys & hobbies',
		icon: '🧸',
		bgClass: 'bg-white',
	},
];

export default function LandingPage() {
	return (
		<div className="min-h-screen">
			<FeatureHighlights />
			<HeroSection />
			<ShopByCategory />
			<NewLaunch />
			{/* Dynamic Category Sections */}
			{HOME_SECTIONS.map((sec) => (
				<CategorySection key={sec.searchTag} title={sec.title} searchTag={sec.searchTag} icon={sec.icon} bgClass={sec.bgClass} />
			))}
		</div>
	);
}
