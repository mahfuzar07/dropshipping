import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const features = [
	{ icon: '/assets/icon/security.png', label: 'নিরাপদ ক্রয়' },
	{ icon: '/assets/icon/delivery-truck.png', label: 'ফাস্ট শিপিং' },
	{ icon: '/assets/icon/badge.png', label: 'নির্ভরযোগ্য সোর্সিং' },

];

export default function HeroSection() {
	return (
		<div className="w-full">
			<div className="container mx-auto">
				<div className="relative md:rounded-2xl overflow-hidden flex items-center w-full aspect-[8/5] md:aspect-[16/6] lg:aspect-[10/4] 2xl:aspect-[15/6]">
					{/* Background Image */}
					<Image src="/assets/hero/hero-bg.png" alt="Hero" fill className="object-cover object-center" priority />

					{/* Overlay */}
					<div className="absolute inset-0 bg-gradient-to-r from-[#fff3ec]/95 via-[#fff3ec]/80 to-transparent" />

					{/* Content */}
					<div className="relative z-10 w-full md:w-1/2 px-3 md:p-8">
						<h1 className="text-2xl md:text-6xl font-bold text-orange-500 leading-tight">চীন এখন</h1>

						<h2 className="text-2xl md:text-6xl font-bold text-gray-800 mt-0 md:mb-5">আপনার হাতের মুঠোয়!</h2>

						<p className="text-gray-600 md:text-xl text-xs mt-2 md:max-w-md max-w-xs">আমরা চীন থেকে আপনার পণ্য নিরাপদে এনে দেই আপনার কাছে।</p>

						{/* Features */}
						<div className="flex items-center gap-3 md:gap-8 mt-2">
							{features.map((f) => (
								<div key={f.label} className="flex flex-col items-center gap-2 text-xs text-gray-600 py-2 rounded-md">
									<div
										className="w-6 h-6 md:w-12 md:h-12 bg-primary"
										style={{
											WebkitMaskImage: `url(${f.icon})`,
											WebkitMaskRepeat: 'no-repeat',
											WebkitMaskPosition: 'center',
											WebkitMaskSize: 'contain',
										}}
									></div>
									<span className="font-semibold md:text-lg text-[10px]">{f.label}</span>
								</div>
							))}
						</div>

						{/* Buttons */}
						<div className="flex gap-4 mt-3 md:mt-8">
							<button className="bg-orange-500 text-white md:px-5 px-3 py-2 rounded-lg font-medium hover:bg-orange-600 transition flex items-center gap-1 text-[10px] md:text-sm">
								এখনই কেনাকাটা করুন
								<ArrowRight size={11} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
