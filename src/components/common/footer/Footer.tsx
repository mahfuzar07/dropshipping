import { Boxes, CreditCard, Headset, ShieldCheck, MapPinCheck, Compass, ChevronRight, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// সহজ ও প্রাসঙ্গিক Quick Links — শুধু যা ইউজারের দরকার হতে পারে
const quickLinks = [
	{ label: 'Home', href: '/' },
	{ label: 'About Us', href: '/about' },
	{ label: 'All Products', href: '/products' },
	{ label: 'Track Order', href: '/track-order' },
	{ label: 'Contact Us', href: '/contact' },
	{ label: 'FAQ', href: '/faq' },
];

// Legal & Policies — Brand column-এর জায়গায়, কারণ dropshipping-এ এগুলো জানা কাস্টমারের জন্য জরুরি
const legalLinks = [
	{ label: 'Terms & Conditions', href: '/terms' },
	{ label: 'Privacy Policy', href: '/privacy-policy' },
	{ label: 'Return & Refund', href: '/return-refund' },
	{ label: 'Customs & Shipping Charge', href: '/shipping-charge' },
];

const cities = ['Dhaka', 'Chittagong (Chattogram)', 'Khulna', 'Rajshahi', 'Sylhet', 'Barisal', 'Mymensingh', 'Rangpur'];

// ⚠️ আগের কোডে এই URL গুলোতে literal space ছিল ("Brand Name.com.bd") — invalid URL,
// browser resolve করতে পারবে না। নিজের আসল domain বসিয়ে replace করে দাও।
const payments = [
	'https://www.brandname.com.bd/assets/images/payment/paypal.svg',
	'https://www.brandname.com.bd/assets/images/payment/visa.svg',
	'https://www.brandname.com.bd/assets/images/payment/mastercard.svg',
];

const shippingOptions = [
	{ title: 'Express Shipping', desc: 'Fast Delivery from China', icon: '⚡' },
	{ title: 'Standard Shipping', desc: '10+ Business Days', icon: '📦' },
];

function FooterHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
	return (
		<h3 className="flex items-center gap-2.5 pb-3 mb-4 border-b border-gray-100">
			<span className="flex items-center justify-center w-7 h-7 rounded-md bg-amber-50 text-amber-600 shrink-0">{icon}</span>
			<span className="text-[13px] font-semibold tracking-wider text-gray-800 uppercase">{children}</span>
		</h3>
	);
}

function FooterLinkList({ items }: { items: { label: string; href: string }[] }) {
	return (
		<ul className="space-y-3 text-[13px] text-gray-500">
			{items.map((item, i) => (
				<li key={i}>
					<Link href={item.href} className="inline-flex items-center gap-1 transition-colors hover:text-amber-600 group">
						<span>{item.label}</span>
					</Link>
				</li>
			))}
		</ul>
	);
}

export default function Footer() {
	return (
		<footer className="bg-white md:mt-16 mt-6 md:pb-0 pb-16 text-gray-600">
			{/* Main Footer */}
			<div className="container mx-auto px-4 md:px-6 pt-14 pb-10">
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
					{/* QUICK LINKS */}
					<div>
						<FooterHeading icon={<Compass size={15} strokeWidth={2.25} />}>Quick Links</FooterHeading>
						<FooterLinkList items={quickLinks} />
					</div>

					{/* LEGAL & POLICIES */}
					<div>
						<FooterHeading icon={<ShieldCheck size={15} strokeWidth={2.25} />}>Legal & Policies</FooterHeading>
						<FooterLinkList items={legalLinks} />
					</div>

					{/* PAYMENT */}
					<div>
						<FooterHeading icon={<CreditCard size={15} strokeWidth={2.25} />}>Payment</FooterHeading>
						<div className="flex flex-col gap-3">
							{payments.map((src, i) => (
								<div key={i} className="flex items-center h-8 px-3 py-1.5 border border-gray-100 rounded-md w-fit bg-gray-50/50">
									<img src={src} alt="Payment method" className="h-full w-auto object-contain" />
								</div>
							))}
						</div>
					</div>

					{/* SHIPPING */}
					<div>
						<FooterHeading icon={<Boxes size={15} strokeWidth={2.25} />}>Shipping</FooterHeading>
						<div className="space-y-4">
							{shippingOptions.map((item, i) => (
								<div key={i} className="flex gap-3">
									<div className="flex items-center justify-center w-9 h-9 text-lg rounded-lg bg-amber-50 shrink-0">{item.icon}</div>
									<div>
										<p className="text-[13px] font-medium text-gray-800">{item.title}</p>
										<p className="text-[12px] text-gray-500">{item.desc}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* CITIES */}
					<div>
						<FooterHeading icon={<MapPinCheck size={15} strokeWidth={2.25} />}>Cities Covered</FooterHeading>
						<ul className="space-y-3 text-[13px] text-gray-500">
							{cities.map((city, i) => (
								<li key={i}>{city}</li>
							))}
							<li>
								<Link
									href="/shipping-charge"
									className="inline-flex items-center gap-1 text-[13px] font-medium text-amber-600 hover:text-amber-700 hover:gap-1.5 transition-all"
								>
									View more cities
									<ChevronRight size={14} />
								</Link>
							</li>
						</ul>
					</div>

					{/* SUPPORT */}
					<div className="col-span-2 md:col-span-1">
						<FooterHeading icon={<Headset size={15} strokeWidth={2.25} />}>24/7 Support</FooterHeading>

						<div className="p-4 mb-5 border bg-amber-50/60 border-amber-100 rounded-xl">
							<div className="flex gap-3">
								<span className="text-xl leading-none">💬</span>
								<div>
									<p className="text-[13px] font-semibold text-gray-800">24/7 Customer Support</p>
									<p className="text-[12px] text-gray-500 mt-0.5">Get your texts and emails answered in your native language</p>
								</div>
							</div>
						</div>

						<div className="mb-5">
							<p className="text-[12px] text-gray-500 mb-1">Customer Services</p>
							<a href="tel:+8809638001086" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-amber-600 hover:text-amber-700">
								<Phone size={14} />
								+880 9638 001086
							</a>
						</div>

						<div>
							<p className="text-[12px] text-gray-500 mb-2">Download our app</p>
							<div className="grid grid-cols-2 gap-2">
								<div className="relative w-full h-9">
									<Image
										src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
										alt="Download on the App Store"
										fill
										className="object-contain object-left"
									/>
								</div>
								<div className="relative w-full h-9">
									<Image
										src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
										alt="Get it on Google Play"
										fill
										className="object-contain object-left"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Trust */}
			<div className="bg-gray-50/70 border-y border-gray-100">
				<div className="container mx-auto px-4 md:px-6 py-5 flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-6">
						<img src="https://www.brandname.com.bd/assets/images/pci-dss.png" alt="PCI-DSS certified" className="h-8 opacity-80" />
						<div className="flex items-center gap-2">
							<img src="https://www.brandname.com.bd/assets/images/iso.png" alt="ISO certified" className="h-8 opacity-80" />
							<span className="text-[12px] font-semibold text-gray-500">ISO 27001:2022</span>
						</div>
					</div>

					<div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
						<span className="text-base leading-none">🇧🇩</span>
						<span className="text-[13px] font-medium text-gray-700">Bangladesh</span>
					</div>
				</div>
			</div>

			{/* Bottom */}
			<div className="border-t border-gray-100">
				<div className="container mx-auto px-4 md:px-6 py-5 flex flex-col md:flex-row justify-between md:items-center gap-4 text-[12px] text-gray-400">
					<div>Copyright © 2026 Xianmart. All rights reserved.</div>

					<div className="flex flex-wrap gap-x-6 gap-y-2">
						{[
							{ label: 'Terms & Conditions', href: '/terms' },
							{ label: 'Privacy Policy', href: '/privacy-policy' },
							{ label: 'About Us', href: '/about' },
							{ label: 'Contact Us', href: '/contact' },
						].map((item, i) => (
							<Link key={i} href={item.href} className="hover:text-gray-600 transition-colors">
								{item.label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
