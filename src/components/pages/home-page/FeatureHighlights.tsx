import { BadgeDollarSign, ShieldCheck, Award, Plane, PackageCheck } from 'lucide-react';

const features = [
	{ icon: '/assets/icon/category.png', label: 'Categories', href: '#category' },
	{ icon: '/assets/icon/bolt.png', label: 'Flash Deals', subTitle: 'Free Delivery on orders over Tk.2000', href: '#flash-deals' },
	{ icon: '/assets/icon/danger.png', label: 'Top Selling', subTitle: '14 days easy return policy', href: '#top-selling' },
	{ icon: '/assets/icon/new.png', label: 'New Arrivals', subTitle: '100% Secure Payment', href: '#new-arrivals' },
];

export default function FeatureHighlights() {
	return (
		<section className="w-full md:hidden block">
			<div className="container mx-auto p-2 shadow">
				<div className="grid grid-cols-4 gap-1">
					{features.map((f, index) => {
						return (
							<div key={index} className="flex rounded shadow py-2 items-center justify-center gap-1 bg-white">
								<div
									className="w-4 h-4 bg-primary shrink-0"
									style={{
										WebkitMaskImage: `url(${f.icon})`,
										WebkitMaskRepeat: 'no-repeat',
										WebkitMaskPosition: 'center',
										WebkitMaskSize: 'contain',
									}}
								></div>

								<p className="text-[10px] font-semibold tracking-tighter">{f.label}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
