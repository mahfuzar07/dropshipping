'use client';

import * as React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

type CheckboxProps = {
	checked: boolean;
	indeterminate?: boolean;
	onChange: (checked: boolean) => void;
	className?: string;
	disabled?: boolean;
};

export default function TableCheckbox({ checked, indeterminate = false, onChange, className, disabled }: CheckboxProps) {
	const ref = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (ref.current) {
			ref.current.indeterminate = indeterminate;
		}
	}, [indeterminate]);

	const showCheck = checked && !indeterminate;
	const showMinus = indeterminate;

	return (
		<label className={cn('relative flex items-center justify-center cursor-pointer', disabled && 'cursor-not-allowed opacity-60')}>
			<input
				ref={ref}
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				disabled={disabled}
				className={cn(
					'peer h-4 w-4 appearance-none cursor-pointer rounded-[4px] border border-slate-300 bg-white',
					'checked:bg-orange-500 checked:border-orange-500',
					'indeterminate:bg-orange-500 indeterminate:border-orange-500',
					'focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:ring-offset-0.5',
					'transition-colors duration-150',
					disabled && 'opacity-50 cursor-not-allowed',
					className,
				)}
			/>

			<Check
				className={cn(
					'pointer-events-none absolute h-3.5 w-3.5 text-white stroke-[3]',
					showCheck ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
					'transition-all duration-150',
				)}
			/>

			<Minus
				className={cn(
					'pointer-events-none absolute h-3.5 w-3.5 text-white stroke-[3]',
					showMinus ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
					'transition-all duration-150',
				)}
			/>
		</label>
	);
}
