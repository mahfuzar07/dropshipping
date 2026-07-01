import { BadgeDollarSign, ShieldCheck, Award, Plane, PackageCheck } from 'lucide-react';

const features = [
	{ icon: '/assets/icon/security.png', label: '100% Original products', subTitle: 'Authentic & Quality Products' },
	{ icon: '/assets/icon/delivery-truck.png', label: 'Fast & Free Delivery', subTitle: 'Free Delivery on orders over Tk.2000' },
	{ icon: '/assets/icon/return-box.png', label: 'Easy Returns', subTitle: '14 days easy return policy' },
	{ icon: '/assets/icon/payment.png', label: 'Secure Payment', subTitle: '100% Secure Payment' },
];

export default function FeatureHighlights() {
	return (
		<section className="w-full bg-white md:py-5">
			<div className="container mx-auto px-4 py-8 md:border border-border/50 rounded-md md:shadow">
				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 sm:divide-x divide-gray-200">
					{features.map((f, index) => {
						return (
							<div key={index} className="flex md:flex-row flex-col items-center justify-center gap-3 text-xs">
								<div
									className="w-12 h-12 bg-primary shrink-0"
									style={{
										WebkitMaskImage: `url(${f.icon})`,
										WebkitMaskRepeat: 'no-repeat',
										WebkitMaskPosition: 'center',
										WebkitMaskSize: 'contain',
									}}
								></div>
								<div className='text-center md:text-start'>
									<h2 className="font-semibold text-sm md:text-base">{f.label}</h2>
									<h5 className="text-muted-foreground md:text-sm text-[10px]">{f.subTitle}</h5>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
