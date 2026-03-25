import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type DateRangeValue = {
	from?: Date;
	to?: Date;
};

interface DateRangePickerProps {
	value: DateRangeValue;
	onChange: (value: DateRangeValue) => void;
	placeholder?: string;
	className?: string;
}

// Converts optional DateRangeValue to Calendar's range type or undefined
function toCalendarRange(value: DateRangeValue) {
	if (value.from && value.to) {
		return { from: value.from, to: value.to };
	}
	return undefined;
}

// Converts Calendar's range type back to DateRangeValue
function fromCalendarRange(value?: { from: Date; to: Date }) {
	if (!value) return { from: undefined, to: undefined };
	return { from: value.from, to: value.to };
}

export function DateRangePicker({ value, onChange, placeholder = 'Select date range', className }: DateRangePickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'w-full h-10 bg-dashboard-background hover:bg-dashboard-background justify-start text-left font-normal',
						!value?.from && 'text-muted-foreground hover:text-muted-foreground',
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />

					{value?.from ? (
						value.to ? (
							<>
								{format(value.from, 'LLL dd, y')} - {format(value.to, 'LLL dd, y')}
							</>
						) : (
							format(value.from, 'LLL dd, y')
						)
					) : (
						<span>{placeholder}</span>
					)}
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					initialFocus
					mode="range"
					required={false}
					captionLayout="dropdown"
					defaultMonth={value?.from}
					selected={value.from && value.to ? { from: value.from, to: value.to } : undefined}
					onSelect={(range) => {
						if (!range) {
							onChange({ from: undefined, to: undefined });
							return;
						}

						onChange({ from: range.from, to: range.to });
					}}
					numberOfMonths={2}
				/>
			</PopoverContent>
		</Popover>
	);
}
