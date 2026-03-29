'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HoverPopoverProps {
	trigger: ReactNode;
	children: ReactNode;
	className?: string;
	width?: string;
	align?: 'left' | 'right';
}

export default function HoverPopover({ trigger, children, className = '', width = 'min-w-64', align = 'right' }: HoverPopoverProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
			{/* Trigger */}
			{trigger}

			{/* Invisible bridge (flicker fix) */}
			<div className="absolute top-full left-0 w-full h-5" />

			{/* Popover */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.3, ease: 'easeOut' }}
						className={`
              absolute top-full mt-5 -z-1 ${width}
              ${align === 'right' ? 'right-0' : 'left-0'}
              rounded-b-xl bg-white shadow
              ${className}
            `}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
