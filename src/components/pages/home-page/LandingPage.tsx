import React from 'react';
import TestPage from './TestPage';
import FlashBestSelling from './FlashBestSelling';
import BannerSection from './BannerSection';
import ShopByCategory from './ShopByCategory';
import NewInStoreSection from './NewInStoreSection';
import HeroSection from './HeroSection';
import FeatureHighlights from './FeatureHighlights';
import TopSelling from './TopSelling';
import Footer from './Footer';

export default function LandingPage() {
	return (
		<div className="min-h-screen">
			<HeroSection />
			<FeatureHighlights />
			<TopSelling />
			<Footer />
		</div>
	);
}
