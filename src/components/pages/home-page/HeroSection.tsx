import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const features = [
	{ icon: '/assets/icon/security.png', label: 'নিরাপদ ক্রয়' },
	{ icon: '/assets/icon/badge.png', label: 'নির্ভরযোগ্য সোর্সিং' },
	{ icon: '/assets/icon/delivery-truck.png', label: 'ফাস্ট শিপিং' },
	{ icon: '/assets/icon/box.png', label: 'বাংলাদেশ ডেলিভারি' },
];

export default function HeroSection() {
	return (
		<div className="w-full bg-white">
			<div className="container mx-auto">
				<div className="relative md:rounded-2xl overflow-hidden flex items-center w-full aspect-[10/16] md:aspect-[16/6] lg:aspect-[10/4] 2xl:aspect-[15/6]">
					{/* Background Image */}
					<Image src="/assets/hero/hero-bg.png" alt="Hero" fill className="object-cover object-center" priority />

					{/* Overlay */}
					<div className="absolute inset-0 bg-gradient-to-r from-[#fff3ec]/95 via-[#fff3ec]/80 to-transparent" />

					{/* Content */}
					<div className="relative z-10 w-full md:w-1/2 p-6 md:p-12">
						<h1 className="text-3xl md:text-6xl font-bold text-orange-500 leading-tight">চীন এখন</h1>

						<h2 className="text-2xl md:text-6xl font-bold text-gray-800 mt-2">আপনার হাতের মুঠোয়!</h2>

						<p className="text-gray-600 mt-4 max-w-md">আমরা চীন থেকে আপনার পণ্য নিরাপদে এনে দেই আপনার কাছে।</p>

						{/* Features */}
						<div className="flex flex-wrap gap-2 mt-5">
							{features.map((f) => (
								<div key={f.label} className="flex flex-col items-center gap-3 text-xs text-gray-600 bg-orange-50 py-3 px-5 rounded-md">
									<div
										className="w-12 h-12 bg-primary"
										style={{
											WebkitMaskImage: `url(${f.icon})`,
											WebkitMaskRepeat: 'no-repeat',
											WebkitMaskPosition: 'center',
											WebkitMaskSize: 'contain',
										}}
									></div>
									<span className="font-semibold">{f.label}</span>
								</div>
							))}
						</div>

						{/* Buttons */}
						<div className="flex gap-4 mt-8">
							<button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition flex items-center gap-2">
								পণ্য খুঁজুন
								<ArrowRight />
							</button>

							<button className="border border-orange-500 text-orange-500 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition flex items-center gap-2">
								আজই শুরু করুন
								<ArrowRight />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
