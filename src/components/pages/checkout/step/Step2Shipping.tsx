import { useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoveLeft, MoveRight, Truck } from 'lucide-react';

const SHIPPING_METHODS = [
	{
		id: 'std',
		label: 'Standard Delivery',
		duration: '5–7 business days',
		price: 60,
		icon: '📦',
	},
	{
		id: 'exp',
		label: 'Express Delivery',
		duration: '2–3 business days',
		price: 150,
		icon: '⚡',
	},
	{
		id: 'ovn',
		label: 'Overnight Delivery',
		duration: 'Next business day',
		price: 350,
		icon: '🚀',
	},
];

export default function Step2Shipping() {
	const { shipping, setShipping, nextStep, prevStep } = useCheckoutStore();
	const [error, setError] = useState('');

	const handleNext = () => {
		if (!shipping.method) {
			setError('Please select a shipping method');
			return;
		}
		nextStep();
	};

	return (
		<div>
			<h1 className="text-md font-semibold text-foreground mb-5 flex items-center gap-1.5">
				<Truck size={16} className=" shrink-0" />
				Choose your delivery speed
			</h1>

			<div className="space-y-2.5">
				{SHIPPING_METHODS.map((m) => {
					const sel = shipping.method === m.id;
					return (
						<button
							key={m.id}
							onClick={() => {
								setShipping({ method: m.id });
								setError('');
							}}
							className={`
                w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left
                transition-all duration-200 border cursor-pointer overflow-hidden
                ${sel ? 'border-orange-300 border-2 bg-orange-50/50 shadow-sm' : 'border-border border-2 bg-background hover:bg-muted/40'}
              `}
						>
							<span className="text-2xl">{m.icon}</span>
							<div className="flex-1">
								<p className={`text-sm font-semibold ${sel ? 'text-orange-400' : 'text-foreground'}`}>{m.label}</p>
								<p className="text-xs text-muted-foreground mt-0.5">{m.duration}</p>
							</div>
							<p className={`font-bold text-[15px] shrink-0 font-hanken ${sel ? 'text-orange-600' : 'text-foreground'}`}>৳{m.price}</p>
							<div
								className={`
                  w-5 h-5 rounded-full shrink-0 transition-all duration-200 bg-white
                  ${sel ? 'border-[6px] border-orange-300' : 'border-2 border-muted-foreground/30'}
                `}
							/>
						</button>
					);
				})}
			</div>

			{error && <p className="text-[12px] text-red-500 mt-2.5">{error}</p>}

			<div className="flex gap-2.5 mt-6">
				<Button variant="outline" className="flex-1 h-12" onClick={prevStep}>
					<MoveLeft /> Back
				</Button>
				<Button className="flex-[2] h-12 rounded-xl bg-orange-300 hover:bg-orange-500 text-white font-semibold tracking-wide" onClick={handleNext}>
					Continue to Payment
					<MoveRight />
				</Button>
			</div>
		</div>
	);
}
