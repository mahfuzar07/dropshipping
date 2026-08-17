'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HoverPopoverProps {
	trigger: ReactNode;
	children: ReactNode;
	className?: string;
	width?: string;
	align?: 'left' | 'right' | 'auto';
}

export default function HoverPopover({ trigger, children, className = '', width = 'min-w-50', align = 'auto' }: HoverPopoverProps) {
	const [open, setOpen] = useState(false);
	const [resolvedAlign, setResolvedAlign] = useState<'left' | 'right'>('left');
	const containerRef = useRef<HTMLDivElement>(null);
	const hoverRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (align !== 'auto') {
			setResolvedAlign(align);
			return;
		}
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const spaceOnRight = window.innerWidth - rect.left;
		setResolvedAlign(spaceOnRight < 220 ? 'right' : 'left');
	}, [open, align]);

	const openPopover = () => {
		if (hoverRef.current) clearTimeout(hoverRef.current);
		setOpen(true);
	};

	const scheduleClose = () => {
		hoverRef.current = setTimeout(() => setOpen(false), 150);
	};

	const handleClick = () => setOpen((prev) => !prev);

	useEffect(() => {
		if (!open) return;
		const handleOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleOutside);
		return () => document.removeEventListener('mousedown', handleOutside);
	}, [open]);

	useEffect(() => {
		return () => {
			if (hoverRef.current) clearTimeout(hoverRef.current);
		};
	}, []);

	return (
		<div ref={containerRef} className="relative h-full" onMouseEnter={openPopover} onMouseLeave={scheduleClose}>
			<div onClick={handleClick} className="cursor-pointer h-full border border-transparent">
				{trigger}
			</div>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						onMouseEnter={openPopover}
						onMouseLeave={scheduleClose}
						onClick={(e) => e.stopPropagation()}
						className={`
							absolute z-50 ${width}
							${resolvedAlign === 'right' ? 'right-0' : 'left-0'}
							rounded-b-md overflow-hidden bg-white shadow-lg
							${className}
						`}
						style={{ top: 'calc(100% - 2px)' }}
					>
						{/* 2px invisible bridge — gap থাকলেও mouse event miss হবে না */}
						<div className="absolute -top-0.5 inset-x-0 h-1" />
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
