'use client';

import React, { useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Option = {
	label: string;
	value: string;
};

interface SearchableSelectProps {
	options: Option[];
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyMessage?: string;
	className?: string;
	triggerClassName?: string;
	disabled?: boolean;
}

export function SearchableSelect({
	options,
	value,
	onChange,
	placeholder = 'Select option...',
	searchPlaceholder = 'Search item...',
	emptyMessage = 'No results found.',
	className,
	triggerClassName,
	disabled = false,
}: SearchableSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [search, setSearch] = React.useState('');
	const triggerRef = React.useRef<HTMLDivElement>(null);
	const contentRef = React.useRef<HTMLDivElement>(null);

	const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>(undefined);

	useEffect(() => {
		if (triggerRef.current) {
			setTriggerWidth(triggerRef.current.offsetWidth);
		}
	}, [open]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node) &&
				contentRef.current &&
				!contentRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		if (open) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [open]);

	// filter option
	const filteredOptions = React.useMemo(() => {
		if (!search.trim()) return options;
		const lowerSearch = search.toLowerCase();
		return options.filter((option) => option.label.toLowerCase().includes(lowerSearch) || option.value.toLowerCase().includes(lowerSearch));
	}, [options, search]);

	const selectedOption = options.find((opt) => opt.value === value);

	return (
		<div className={cn('relative w-full !text-dashboard-muted-foreground', className)}>
			{/* trigger */}
			<div ref={triggerRef}>
				<Button
					type="button"
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						'w-full h-10 justify-between text-left font-normal !bg-transparent',
						'border-input shadow-xs outline-none text-dashboard-muted hover:text-dashboard-muted',

						'focus-visible:border-ring/50 focus-visible:ring-ring/20 focus-visible:ring-[1px]',

						open && 'border-ring/50 ring-ring/20 ring-[1px]',
						'disabled:pointer-events-none disabled:opacity-50',
						!value && 'text-dashboard-muted',
						triggerClassName,
					)}
					onClick={() => !disabled && setOpen(!open)}
					disabled={disabled}
				>
					{selectedOption ? selectedOption.label : placeholder}
					<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</div>

			{/* option content */}
			{open && (
				<div
					ref={contentRef}
					className={cn('absolute z-20 mt-1 bg-white text-dashboard-muted border shadow rounded-md overflow-hidden', 'min-w-full')}
					style={{
						width: triggerWidth ? `${triggerWidth}px` : '100%',
					}}
				>
					{/* search input */}
					<div className="px-2 py-3 border-b">
						<div className="relative">
							<Input
								placeholder={searchPlaceholder}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="px-3 placeholder:text-dashboard-muted-foreground/60 placeholder:text-[13px]"
								autoFocus
							/>
							{/* <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div> */}
							{search && (
								<button
									type="button"
									onClick={() => setSearch('')}
									className="absolute inset-y-0 right-0 flex items-center pr-2 text-muted-foreground"
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</div>
					</div>

					{/* option Item*/}
					<div className="max-h-60 overflow-y-auto">
						{filteredOptions.length === 0 ? (
							<div className="py-6 text-center text-sm text-dashboard-muted-foreground">{emptyMessage}</div>
						) : (
							filteredOptions.map((option, index) => (
								<div
									key={`${option.value}-${index}`}
									className={cn(
										'relative flex cursor-pointer select-none items-center px-3 py-2.5 text-sm outline-none',
										'hover:bg-accent/40',
										value === option.value && 'bg-accent hover:bg-accent',
									)}
									onClick={() => {
										onChange?.(option.value);
										setOpen(false);
										setSearch('');
									}}
								>
									{option.label}
									{value === option.value && <Check className="absolute right-2 h-4 w-4" />}
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
}
