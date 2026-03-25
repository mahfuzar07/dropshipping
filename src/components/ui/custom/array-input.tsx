'use client';

import { useState, KeyboardEvent } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/utils';

interface ArrayInputProps {
	label?: string;
	placeholder?: string;
	value?: string[];
	onChange: (tags: string[]) => void;
	className?: string;
}

export function ArrayInput({ placeholder = 'Type and press Enter to add tags', value = [], onChange, className }: ArrayInputProps) {
	const [input, setInput] = useState('');

	const addTag = () => {
		const newTag = input.trim();
		if (newTag && !value.includes(newTag)) {
			onChange([newTag, ...value]);
		}
		setInput('');
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag();
		}
	};

	const removeTag = (tagToRemove: string) => {
		onChange(value.filter((tag) => tag !== tagToRemove));
	};

	return (
		<div className={cn('w-full', className)}>
			<div className="rounded-lg bg-background ">
				<div className="flex gap-x-2 overflow-x-scroll  w-full">
					{value.map((tag) => (
						<div
							key={tag}
							className="inline-flex shrink-0 items-center gap-2 bg-dashboard-primary text-white pl-2 pr-1 py-1 rounded-md text-xs font-medium mb-2"
						>
							{tag}
							<button
								onClick={() => removeTag(tag)}
								className="border-l pl-1 border-orange-300 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-600"
								aria-label={`Remove ${tag}`}
							>
								<X size={13} className="text-slate-100" />
							</button>
						</div>
					))}
				</div>

				<div className="relative mt-2">
					<Input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						className={cn(
							'file:text-foreground placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
							'focus-visible:border-ring/50 focus-visible:ring-ring/20 focus-visible:ring-[1px]',
							'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pr-12',
							className,
						)}
					/>

					{/* Absolute ArrowUp */}
					<button
						type="button"
						onClick={addTag}
						className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded bg-dashboard-background cursor-pointer hover:bg-slate-200"
						aria-label="Add Tag"
					>
						<ArrowUp />
					</button>
				</div>
			</div>
		</div>
	);
}
