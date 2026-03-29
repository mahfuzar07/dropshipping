import { Boxes, CreditCard, Headset, LayoutPanelTop, MapPinCheck, MessageCircleWarning } from 'lucide-react';
import React from 'react';

const quickLinks = [
	'About Us',
	'Contact Us',
	'Quotation Request',
	'Intellectual Property',
	'Sitemap',
	'Track Order',
	'Customs tariffs and fees',
	'Shipping Policy',
	'Micro Influencer',
	'Ubuy Membership',
	'Ubuy Warranty',
	'Healthcare Disclaimer',
];

const brandLinks = [
	'Download App',
	'Brands List',
	'Customer Reviews',
	'Return Policy',
	'Blog',
	'FAQ',
	'About Ucredit',
	'Ubuy Affiliates',
	'Ubuy Gift Cards',
];

const cities = ['Dhaka', 'Chittagong (Chattogram)', 'Khulna', 'Rajshahi', 'Sylhet', 'Barisal (Bagerhat)', 'Mymensingh', 'Rangpur'];

const stores = ['USA', 'UK', 'Japan', 'Hong Kong', 'Korea', 'China', 'Turkey', 'Europe'];

const payments = [
	'https://www.ubuy.com.bd/assets/images/payment/paypal.svg',
	'https://www.ubuy.com.bd/assets/images/payment/visa.svg',
	'https://www.ubuy.com.bd/assets/images/payment/mastercard.svg',
];

export default function Footer() {
	return (
		<footer className="bg-white border-t mt-12">
			{/* Main Footer */}
			<div className="container mx-auto px-6 pt-10 pb-8">
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
					{/* QUICK LINKS */}
					<div>
						<h3 className="font-semibold text-md tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
							<MessageCircleWarning strokeWidth={2.75} className="text-slate-300" /> QUICK LINKS
						</h3>
						<ul className="footer-list">
							{quickLinks.map((item, i) => (
								<li key={i}>
									<a href="#" className="footer-link">
										{item}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* BRAND */}
					<div>
						<h3 className="font-semibold text-md tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
							<LayoutPanelTop strokeWidth={2.75} className="text-slate-300" /> Brand
						</h3>
						<ul className="footer-list">
							{brandLinks.map((item, i) => (
								<li key={i}>
									<a href="#" className="footer-link">
										{item}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* PAYMENT */}
					<div>
						<h3 className="font-semibold text-md tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
							<CreditCard strokeWidth={2.75} className="text-slate-300" /> PAYMENT
						</h3>
						<div className="flex flex-col gap-3">
							{payments.map((src, i) => (
								<img key={i} src={src} className="h-8 w-auto" />
							))}
						</div>
					</div>

					{/* SHIPPING */}
					<div>
						<h3 className="font-semibold text-md tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
							<Boxes strokeWidth={2.75} className="text-slate-300" /> SHIPPING
						</h3>

						<div className="space-y-4 text-sm">
							{[
								{ title: 'Express Shipping', desc: 'Fast Delivery' },
								{ title: 'Standard Shipping', desc: '10+ Business Days' },
							].map((item, i) => (
								<div key={i} className="flex gap-3">
									<div className="text-2xl">📦</div>
									<div>
										<p className="font-medium">{item.title}</p>
										<p className="text-gray-600">{item.desc}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* CITIES */}
					<div>
						<h3 className="font-semibold text-md tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
							<MapPinCheck strokeWidth={2.75} className="text-slate-300" /> CITIES COVERED
						</h3>
						<ul className="footer-list">
							{cities.map((city, i) => (
								<li key={i}>{city}</li>
							))}
							<li>
								<a href="#" className="text-blue-600 hover:underline">
									View More Cities →
								</a>
							</li>
						</ul>
					</div>

					{/* SUPPORT */}
					<div>
						<h3 className="font-semibold text-md tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
							<Headset strokeWidth={2.75} className="text-slate-300" />
							24/7 Support
						</h3>

						<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
							<div className="flex gap-3">
								<span className="text-2xl">💬</span>
								<div>
									<p className="font-semibold">24/7 Customer Support</p>
									<p className="text-xs text-gray-600">Get your texts/emails answered in your native language</p>
								</div>
							</div>
						</div>

						<div className="mb-4">
							<p className="font-medium text-sm">Customer Services</p>
							<p className="text-sm font-semibold text-blue-600">+880 9638001086</p>
						</div>

						<div>
							<p className="text-sm mb-2">Download our App</p>
							<div className="flex gap-3">
								<img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" className="h-10" />
								<img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" className="h-10" />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Trust */}
			<div className="border-t">
				<div className="container mx-auto px-6 py-6 flex justify-between flex-wrap gap-6">
					<div className="flex gap-8">
						<img src="https://www.ubuy.com.bd/assets/images/pci-dss.png" className="h-10" />
						<div className="flex gap-2 items-center">
							<img src="https://www.ubuy.com.bd/assets/images/iso.png" className="h-10" />
							<span className="text-sm font-semibold">27001:2022</span>
						</div>
					</div>

					<div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg">
						<span>🇧🇩</span>
						<span className="font-medium">Bangladesh</span>
					</div>
				</div>
			</div>

			{/* Stores */}
			<div className="border-t bg-gray-50">
				<div className="container mx-auto px-6 py-6">
					<p className="font-medium text-sm mb-3">Ubuy Popular Stores</p>

					<div className="flex flex-wrap gap-3 text-sm">
						{stores.map((store, i) => (
							<React.Fragment key={i}>
								<a href="#" className="footer-link">
									Shop from {store}
								</a>
								{i !== stores.length - 1 && <span className="text-yellow-400">•</span>}
							</React.Fragment>
						))}
					</div>
				</div>
			</div>

			{/* Bottom */}
			<div className="border-t">
				<div className="container mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
					<div>Copyright © 2026 Ubuy Co. All rights reserved.</div>

					<div className="flex gap-6 mt-4 md:mt-0">
						{['Terms & Conditions', 'Privacy Policy', 'About Us', 'Contact Us'].map((item, i) => (
							<a key={i} href="#" className="footer-link">
								{item}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
