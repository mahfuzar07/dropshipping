'use client';

import Link from 'next/link';
import { Store, Star, Trophy, Headphones, Truck, ChevronRight } from 'lucide-react';

interface SellerInfoProps {
	seller?: {
		nick: string;
		shop_name: string;
		sid: string;
		title: string;
		zhuy: string;
	};
}

export default function SellerInfo({ seller }: SellerInfoProps) {
	const shopName = seller?.shop_name || seller?.nick || seller?.title || 'Seller Store';

	const shopUrl = seller?.zhuy;

	return (
		<div className="mb-2 rounded-xl bg-gray-50 p-4 md:p-6">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
				{/* Left */}
				<div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:text-left">
					{/* Store Icon */}
					<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-orange-300">
						<Store className="h-8 w-8 text-white" />
					</div>

					{/* Seller Info */}
					<div className="flex-1">
						<h3 className="text-lg font-bold uppercase tracking-wide text-gray-800">{shopName}</h3>

						<div className="mt-4 grid grid-cols-2 gap-3 lg:flex lg:flex-wrap">
							<Card icon={<Star className="h-4 w-4 fill-current text-teal-500" />} label="Product" value="4.7" />

							<Card icon={<Trophy className="h-4 w-4 text-teal-500" />} label="Level" value="4.7" />

							<Card icon={<Headphones className="h-4 w-4 text-teal-500" />} label="Service" value="3.5" />

							<Card icon={<Truck className="h-4 w-4 text-teal-500" />} label="Delivery" value="2.5" />
						</div>
					</div>
				</div>

				{/* Button */}
				<div className="w-full lg:w-auto">
					{shopUrl ? (
						<Link
							href={shopUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-300 px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-orange-400 lg:w-auto"
						>
							Visit Store
							<ChevronRight className="h-4 w-4" />
						</Link>
					) : (
						<button className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-300 px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-orange-400 lg:w-auto">
							Visit Store
							<ChevronRight className="h-4 w-4" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

function Card({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
	return (
		<div className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 md:justify-start">
			{icon}
			<span className="text-sm text-gray-700">
				{label} <strong>{value}</strong>
			</span>
		</div>
	);
}
