import { BadgeDollarSign, ShieldCheck, Award, Plane, PackageCheck } from 'lucide-react';

const features = [
	{ icon: '/assets/icon/security.png', label: 'Categories', subTitle: 'Authentic & Quality Products' },
	{ icon: '/assets/icon/delivery-truck.png', label: 'Flash Deals', subTitle: 'Free Delivery on orders over Tk.2000' },
	{ icon: '/assets/icon/return-box.png', label: 'Top Selling', subTitle: '14 days easy return policy' },
	{ icon: '/assets/icon/payment.png', label: 'New Arrivals', subTitle: '100% Secure Payment' },
];

export default function FeatureHighlights() {
	return (
		<section className="w-full bg-white">
			<div className="container mx-auto p-2 shadow">
				<div className="grid grid-cols-4 gap-1">
					{features.map((f, index) => {
						return (
							<div key={index} className="flex rounded shadow py-1 items-center justify-center gap-1">
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
