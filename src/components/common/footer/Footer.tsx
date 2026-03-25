'use client';

import { MapPinHouse, Mail, Phone, Facebook, Twitter, Linkedin, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface LinkItem {
	title: string;
	path: string;
}

export default function Footer() {
	const navItem = [
		{ title: 'about us', url: '/about-us' },
		{ title: 'projects', url: '/leilmall' },
		{ title: 'blog', url: '/blogs' },
		{ title: 'testimonial', url: '/testimonial' },
		{ title: 'contact us', url: '/contact-us' },
	];

	const quickLinks: LinkItem[] = [
		{ title: 'About Us', path: '/about-us' },
		{ title: 'Team', path: '/team' },
		{ title: 'Blog', path: '/blogs' },
		{ title: 'Contact Us', path: '/contact-us' },
	];

	const customerService: LinkItem[] = [
		{ title: 'Track Order', path: '/' },
		{ title: 'Returns & Cancellations', path: '/' },
		{ title: 'FAQ', path: '/' },
	];

	const socialLinks = [
		{ Icon: Facebook, href: '#' },
		{ Icon: Send, href: '#' },
		{ Icon: Twitter, href: '#' },
		{ Icon: Linkedin, href: '#' },
	];

	return (
		<footer className="relative h-full bg-store-secondary-muted md:mt-20 mt-10">
			<div
				className="absolute w-full h-full -top-10  z-0 bg-store-secondary-muted"
				style={{
					WebkitMaskImage: "url('/assets/footer/wave-up.png')",
					WebkitMaskRepeat: 'no-repeat',
					WebkitMaskSize: 'contain',
					WebkitMaskPosition: 'top',
					maskImage: "url('/assets/footer/wave-up.png')",
					maskRepeat: 'no-repeat',
					maskSize: 'contain',
					maskPosition: 'top',
				}}
			/>

			<div className="max-w-7xl mx-auto px-5 py-8 relative">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:py-10 font-jost">
					{/* TWINKLE BUD Section */}
					<div className="md:col-span-2 max-w-md">
						<div className="relative w-40 h-14">
							<Link href="/">
								<Image src="/" fill alt="TWINKLE-BUD" className="w-full h-full object-contain object-left" />
							</Link>
						</div>
						<p className="text-gray-600 text-md my-2">
							TWINKLE-BUD stands for Life Evergreen International LLC. A multinational conglomerate of businesses registered in the U.S. state of
							Delaware with headquarters...
						</p>
						<p className="text-gray-600 text-md mt-1">
							<strong>Address:</strong> 16182 Coastal Hwy, Lewes, DE 19958...
						</p>
						<p className="text-gray-600 text-md">
							<strong>Phone:</strong> +1 302 504 4573
						</p>
						<p className="text-gray-600 text-md">
							<strong>Email:</strong> contact@twinklebud.com
						</p>
					</div>

					{/* Quick Links */}
					<div className="md:col-span-1">
						<h3 className="text-xl font-semibold mb-4 text-gray-800">Quick links</h3>
						<ul className="space-y-2 text-md">
							{quickLinks.map((link, index) => (
								<li key={index}>
									<a href={link.path} className="text-gray-600 hover:text-orange-600">
										{link.title}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Core Operations */}
					<div className="md:col-span-1">
						<h3 className="text-xl font-jost font-semibold mb-4 text-gray-800">Customer service</h3>
						<ul className="space-y-2 text-md">
							{customerService.map((link, index) => (
								<li key={index}>
									<a href={link.path} className="text-gray-600 hover:text-orange-600">
										{link.title}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Follow Us */}
					<div className="md:col-span-1">
						<h3 className="text-xl font-semibold capitalize mb-5 text-gray-800">Follow Us</h3>
						<div className="flex space-x-8">
							{socialLinks.map((link, index) => (
								<a
									key={index}
									href={link.href}
									className="text-white flex-shrink-0 text-twinkle-accent hover:text-white transition-all w-8 h-8 rounded-full bg-twinkle-accent shadow ring-12 ring-white flex items-center justify-center hover:bg-twinkle-accent transition-all"
								>
									<link.Icon size={14} className="" />
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Footer Bottom */}
				<div className="mt-10 pt-5 border-t border-gray-300 text-center flex md:flex-row flex-col gap-5 items-center justify-between">
					<p className="text-gray-600 text-xs">Copyright © 2025 TWINKLE BUD. All Rights Reserved.</p>
					<nav className="flex-1">
						<ul className="flex flex-wrap items-center md:justify-end justify-center space-x-5">
							{navItem.map((item, index) => (
								<li key={index}>
									<Link href={item.url} className="text-sm font-jost text-gray-800 font-semibold hover:text-orange-600 uppercase">
										{item.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</div>
		</footer>
	);
}
