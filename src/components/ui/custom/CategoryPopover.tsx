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

export default function CategoryPopover({ trigger, children, className = '', width = 'min-w-[240px]', align = 'left' }: HoverPopoverProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
			{/* Trigger */}
			{trigger}

			{/* Hover bridge */}
			<div className="absolute top-full left-0 w-full h-4" />

			{/* Popover */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className={`
              absolute top-full mt-4 z-50 ${width}
              ${align === 'right' ? 'right-0' : 'left-0'}
              bg-transparent
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
