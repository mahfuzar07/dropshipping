import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SingleDatePickerProps {
	value?: Date | string | null; // string (ISO) ও allow করা যাবে
	onChange: (date: Date | undefined) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

export function DatePicker({ value, onChange, placeholder = 'Select date', className, disabled = false }: SingleDatePickerProps) {
	// Normalize incoming value → date-only (midnight local time)
	const selectedDate = React.useMemo(() => {
		if (!value) return undefined;

		const date = typeof value === 'string' ? new Date(value) : value;
		if (isNaN(date.getTime())) return undefined;

		// Timezone-safe: year-month-day only
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}, [value]);

	return (
		<Popover>
			<PopoverTrigger asChild disabled={disabled}>
				<Button
					variant="outline"
					className={cn(
						'w-full h-10 justify-start text-left font-normal bg-transparent hover:bg-dashboard-background',
						!selectedDate && 'text-muted-foreground',
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{selectedDate ? format(selectedDate, 'MMM dd, yyyy') : placeholder}
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={(date) => {
						if (!date) {
							onChange(undefined);
							return;
						}

						// Always normalize to local midnight date-only
						const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
						onChange(normalized);
					}}
					initialFocus
					captionLayout="dropdown"
					defaultMonth={selectedDate ?? new Date()}
					disabled={disabled}
				/>
			</PopoverContent>
		</Popover>
	);
}
