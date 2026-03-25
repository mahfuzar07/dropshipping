import React from 'react';
import TestPage from './TestPage';
import FlashBestSelling from './FlashBestSelling';
import BannerSection from './BannerSection';
import ShopByCategory from './ShopByCategory';
import NewInStoreSection from './NewInStoreSection';

export default function LandingPage() {
	return (
		<div className="min-h-screen">
			<ShopByCategory/>
			<NewInStoreSection/>
			<BannerSection/>
			<FlashBestSelling />
			{/* <TestPage /> */}
		</div>
	);
}
