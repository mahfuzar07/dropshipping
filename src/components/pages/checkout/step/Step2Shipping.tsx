import { ShippingInterface, useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoveLeft, MoveRight, Truck } from 'lucide-react';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';
import { useAppData } from '@/hooks/use-appdata';

export type ShipmentMethodType = {
	id: number;
	label: string;
	method: 'same_day' | string; // keep extensible if more methods come later
	price: number; // since API returns string ("300.00")
	estimated_days_min: number;
	estimated_days_max: number;
	icon: string;
	is_active: boolean;
	priority: number;
	created_at: string; // ISO datetime string
	updated_at: string; // ISO datetime string
};

// const SHIPPING_METHODS: ShippingInterface[] = [
// 	{ id: 1, method: 'std', label: 'Standard Delivery', duration: '5–7 business days', price: 60, icon: '📦' },
// 	{ id: 2, method: 'exp', label: 'Express Delivery', duration: '2–3 business days', price: 150, icon: '⚡' },
// 	{ id: 3, method: 'over', label: 'Overnight Delivery', duration: 'Next business day', price: 350, icon: '🚀' },
// ];

export default function Step2Shipping() {
	const { shipping, setShipping, nextStep, prevStep } = useCheckoutStore();
	const [error, setError] = useState('');

	const { data, isLoading } = useAppData<ShipmentMethodType, 'single'>({
		key: [QueriesKey.SHIPMENT_METHODS],
		api: apiEndpoint.orders.SHIPMENT_METHODS(),
		auth: true,
		responseType: 'single',
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to load cart'),
	});

	const SHIPPING_METHODS = data?.results;

	const handleNext = () => {
		if (!shipping) {
			setError('Please select a shipping method');
			return;
		}
		nextStep();
	};

	return (
		<div>
			<h1 className="text-md font-semibold text-foreground mb-5 flex items-center gap-1.5">
				<Truck size={16} className="shrink-0" />
				Choose your delivery speed
			</h1>

			<div className="space-y-2.5">
				{SHIPPING_METHODS &&
					SHIPPING_METHODS.map((infoObj) => {
						const sel = shipping?.id === infoObj.id;
						return (
							<button
								key={infoObj.id}
								onClick={() => {
									setShipping(infoObj);
									setError('');
								}}
								className={`
								w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left
								transition-all duration-200 border cursor-pointer overflow-hidden
								${sel ? 'border-orange-300 border-2 bg-orange-50/50 shadow-sm' : 'border-border border-2 bg-background hover:bg-muted/40'}
							`}
							>
								{/* <span className="text-2xl">{infoObj.icon}</span> */}
								<img src={infoObj.icon} alt={infoObj.label} className="w-8 h-8 object-contain" />
								<div className="flex-1">
									<p className={`text-sm font-semibold ${sel ? 'text-orange-400' : 'text-foreground'}`}>{infoObj.label}</p>
									<p className="text-xs text-muted-foreground mt-0.5">{infoObj.duration}</p>
								</div>
								<p className={`font-bold text-[15px] shrink-0 font-hanken ${sel ? 'text-orange-600' : 'text-foreground'}`}>৳{infoObj.price}</p>
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
