// components/ui/input-group.tsx
import * as React from 'react';
import { cn } from '@/lib/utils/utils';
import { Input } from '@/components/ui/input';

// ─── Input Group ────────────────────────────────────────────────────────────────
const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('relative flex w-full items-stretch', className)} {...props} />
));
InputGroup.displayName = 'InputGroup';

// ─── Addon (left or right) ──────────────────────────────────────────────────────
const InputGroupAddon = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		side?: 'left' | 'right';
	}
>(({ className, side = 'left', ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'absolute inset-y-0 left-0 flex items-center px-3 text-dashboard-muted-foreground pointer-events-none',

			className,
		)}
		{...props}
	/>
));
InputGroupAddon.displayName = 'InputGroupAddon';

// ─── Input (with padding adjustment + controlled warning fix) ───────────────────
const InputGroupInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<typeof Input> & {
		leftAddon?: boolean;
		rightAddon?: boolean;
	}
>(({ className, leftAddon = false, rightAddon = false, value, onChange, ...props }, ref) => {
	// Fix React warning: "value without onChange"
	const isControlled = value !== undefined && value !== null;
	const safeOnChange = onChange || (isControlled ? () => {} : undefined);

	return (
		<Input
			ref={ref}
			value={value}
			onChange={safeOnChange}
			className={cn(
				'flex h-10 w-full rounded-md border border-input bg-background  pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50',
				className,
			)}
			{...props}
		/>
	);
});
InputGroupInput.displayName = 'InputGroupInput';

// ─── Helper text inside addon (optional) ────────────────────────────────────────
const InputGroupText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
	<span ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
InputGroupText.displayName = 'InputGroupText';

export { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText };
