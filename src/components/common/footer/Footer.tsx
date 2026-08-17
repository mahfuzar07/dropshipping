"use client";
import { Boxes, ShieldCheck, MapPinCheck, Compass, ChevronRight, Phone, Mail, MapPin, Plane, Ship } from 'lucide-react';
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
];

// Legal & Policies
const legalLinks = [
	{ label: 'Terms & Conditions', href: '/terms' },
	{ label: 'Privacy Policy', href: '/privacy-policy' },
	{ label: 'Return & Refund', href: '/return-refund-policy' },
	{ label: 'Customs & Shipping Charge', href: '/shipping-charge' },
];

const cities = ['Dhaka', 'Chittagong (Chattogram)', 'Khulna', 'Rajshahi', 'Sylhet', 'Barisal'];

const shippingOptions = [
	{ title: 'Ship by Air', desc: 'Fast Delivery from China', icon: Plane },
	{ title: 'Ship by Sea', desc: '10+ Business Days', icon: Ship },
];

// পেমেন্ট মেথড লোগো — src গুলো placeholder, নিজের আসল লোগো ফাইল/URL বসিয়ে দাও
// পরামর্শ: প্রতিটা লোগো একই aspect ratio-তে (যেমন সাদা ব্যাকগ্রাউন্ডে PNG/SVG, ট্রান্সপারেন্ট) রাখলে গ্রিডটা সবচেয়ে পরিষ্কার দেখাবে
const paymentMethods = [
	{ name: 'Visa', src: '/images/payments/visa.svg' },
	{ name: 'Mastercard', src: '/images/payments/mastercard.svg' },
	{ name: 'American Express', src: '/images/payments/amex.svg' },
	{ name: 'bKash', src: '/images/payments/bkash.svg' },
	{ name: 'Nagad', src: '/images/payments/nagad.svg' },
	{ name: 'Rocket', src: '/images/payments/rocket.svg' },
	{ name: 'Upay', src: '/images/payments/upay.svg' },
	{ name: 'Dutch-Bangla Bank', src: '/images/payments/dbbl.svg' },
];

function FooterHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
	return (
		<h3 className="flex items-center gap-2.5 pb-3.5 mb-5 border-b border-gray-100">
			<span className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600 shrink-0">{icon}</span>
			<span className="text-sm font-bold tracking-wide text-gray-800 uppercase">{children}</span>
		</h3>
	);
}

function FooterLinkList({ items }: { items: { label: string; href: string }[] }) {
	return (
		<ul className="space-y-3.5 text-sm text-gray-500">
			{items.map((item, i) => (
				<li key={i}>
					<Link href={item.href} className="inline-flex items-center gap-1.5 transition-colors hover:text-amber-600 group">
						<ChevronRight size={13} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
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
			<div className="container mx-auto px-4 md:px-6 pt-16 pb-10">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
					{/* QUICK LINKS */}
					<div>
						<FooterHeading icon={<Compass size={16} strokeWidth={2.25} />}>Quick Links</FooterHeading>
						<FooterLinkList items={quickLinks} />
					</div>

					{/* LEGAL & POLICIES */}
					<div>
						<FooterHeading icon={<ShieldCheck size={16} strokeWidth={2.25} />}>Legal & Policies</FooterHeading>
						<FooterLinkList items={legalLinks} />
					</div>

					{/* SHIPPING */}
					<div>
						<FooterHeading icon={<Boxes size={16} strokeWidth={2.25} />}>Shipping</FooterHeading>
						<div className="space-y-5">
							{shippingOptions.map((item, i) => {
								const Icon = item.icon;
								return (
									<div key={i} className="flex gap-3">
										<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 shrink-0">
											<Icon size={18} strokeWidth={2.25} />
										</div>
										<div>
											<p className="text-sm font-semibold text-gray-800">{item.title}</p>
											<p className="text-[13px] text-gray-500">{item.desc}</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* CITIES */}
					<div>
						<FooterHeading icon={<MapPinCheck size={16} strokeWidth={2.25} />}>Cities Covered</FooterHeading>
						<ul className="space-y-3.5 text-sm text-gray-500">
							{cities.map((city, i) => (
								<li key={i}>{city}</li>
							))}
							<li>
								<Link
									href="/shipping-charge"
									className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700 hover:gap-1.5 transition-all"
								>
									View more cities
									<ChevronRight size={15} />
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Company / Support / Payment strip */}
			<div className="border-t border-gray-100 bg-gray-50/60">
				<div className="container mx-auto px-4 md:px-6 py-14">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
						{/* Company info */}
						<div>
							<div
								className={`
								relative overflow-hidden rounded-xl
								transition-all duration-300 ease-in-out h-20 w-50

							`}
								onClick={() => {
									window.location.href = '/';
								}}
							>
								<Image
									src="/assets/brand.png"
									alt="brand"
									fill
									className="
		object-contain
		py-2 mb-2
		transition-transform duration-300
		group-hover:scale-105
		brightness-0
		[filter:invert(60%)_sepia(95%)_saturate(1800%)_hue-rotate(355deg)_brightness(100%)_contrast(100%)]
	"
								/>
							</div>
							<div className="space-y-3.5 text-sm text-gray-500">
								{/* ⚠️ আসল অফিসের ঠিকানা দিয়ে replace করে দাও */}
								<div className="flex items-start gap-2.5">
									<MapPin size={16} className="text-amber-600 shrink-0 mt-0.5" />
									<span>House 12, Road 5, Sector 9, Uttara, Dhaka 1230</span>
								</div>
								<div className="flex items-center gap-2.5">
									<Mail size={16} className="text-amber-600 shrink-0" />
									<a href="mailto:support@xianmart.com.bd" className="hover:text-amber-600 transition-colors">
										support@xianmart.com.bd
									</a>
								</div>
							</div>
						</div>

						{/* 24/7 Support */}
						<div>
							<p className="text-sm font-bold text-gray-800 mb-4">24/7 Support</p>
							<p className="flex items-center gap-2 text-sm text-gray-500 mb-4 leading-relaxed">
								<span className="text-base leading-none">⏱️</span>
								We&apos;re here for you 24/7, around the clock.
							</p>
							<a href="tel:+8809638001086" className="inline-flex items-center gap-2 text-base font-bold text-amber-600 hover:text-amber-700">
								<Phone size={18} />
								+880 9638 001086
							</a>
						</div>

						{/* Payment methods */}
						<div>
							<p className="text-sm font-bold text-gray-800 mb-4">Payment Method We Accept</p>
							<div className="grid grid-cols-4 gap-2.5">
								{paymentMethods.map((p, i) => (
									<div
										key={i}
										className="relative flex items-center justify-center h-12 px-2.5 bg-white border border-gray-200 rounded-lg"
										title={p.name}
									>
										{/* ⚠️ src placeholder — নিজের পেমেন্ট লোগোর আসল URL/পাথ বসিয়ে দাও */}
										<Image src={p.src} alt={p.name} fill sizes="80px" className="object-contain p-2" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Trust badges */}
			<div className="bg-gray-50/70 border-y border-gray-100">
				<div className="container mx-auto px-4 md:px-6 py-6 flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-6">
						<img src="https://www.brandname.com.bd/assets/images/pci-dss.png" alt="PCI-DSS certified" className="h-9 opacity-80" />
						<div className="flex items-center gap-2">
							<img src="https://www.brandname.com.bd/assets/images/iso.png" alt="ISO certified" className="h-9 opacity-80" />
							<span className="text-[13px] font-semibold text-gray-500">ISO 27001:2022</span>
						</div>
					</div>

					<div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
						<span className="text-lg leading-none">🇧🇩</span>
						<span className="text-sm font-medium text-gray-700">Bangladesh</span>
					</div>
				</div>
			</div>

			{/* Bottom */}
			<div className="border-t border-gray-100">
				<div className="container mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row justify-between md:items-center gap-4 text-[13px] text-gray-400">
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
