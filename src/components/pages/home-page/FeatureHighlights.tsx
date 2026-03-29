import { BadgeDollarSign, ShieldCheck, Award, Plane, PackageCheck } from 'lucide-react';

const features = [
	{
		icon: ShieldCheck,
		title: '100% Money Back Guarantee',
	},
	{
		icon: BadgeDollarSign,
		title: 'Lowest Overall Order Cost',
	},
	{
		icon: Award,
		title: 'Premium & Luxury Brands',
	},
	{
		icon: Plane,
		title: 'Worldwide Shipping',
	},
	{
		icon: PackageCheck,
		title: '300M+ International Products',
	},
];

export default function FeatureHighlights() {
	return (
		<section className="w-full bg-gray-50 py-10">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div key={index} className="flex flex-col items-center justify-center text-center px-6 py-6 transition duration-300">
								<div className="mb-5">
									<Icon className="md:w-14 md:h-14 w-8 h-8 text-orange-300" />
								</div>
								<p className="md:text-md text-sm text-gray-600">{feature.title}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
