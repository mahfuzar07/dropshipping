import { useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';

export default function StepIndicator() {
	const { step, goTo } = useCheckoutStore();
	const steps = ['Address', 'Shipping', 'Payment'];

	return (
		<div className="flex items-center justify-center my-8 max-w-xl mx-auto">
			{steps.map((s, i) => {
				const n = i + 1;
				const done = step > n;
				const active = step === n;

				return (
					<div key={s} className="flex items-center flex-1 last:flex-none">
						<div className="flex flex-col items-center cursor-pointer" onClick={() => done && goTo(n)}>
							<div
								className={`
                  w-9 h-9 rounded-full flex items-center justify-center
                  font-semibold text-sm z-10 relative transition-all duration-300
                  ${done || active ? 'bg-orange-300 text-white shadow-[0_0_0_4px_rgba(255,165,0,0.15)]' : 'bg-orange-100 text-orange-300'}
                `}
							>
								{done ? (
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M5 12l5 5L19 7" />
									</svg>
								) : (
									n
								)}
							</div>
							<span
								className={`
                  text-xs mt-1.5 font-medium tracking-wide
                  ${active || done ? 'text-orange-400' : 'text-muted-foreground'}
                `}
							>
								{s}
							</span>
						</div>

						{i < 2 && (
							<div
								className={`
                  flex-1 h-0.5 mx-2 mb-5 transition-all duration-300 rounded-full
                  ${step > n ? 'bg-orange-300' : 'bg-orange-100'}
                `}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
