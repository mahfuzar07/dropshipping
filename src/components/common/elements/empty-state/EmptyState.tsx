'use client';

import { motion } from 'framer-motion';

export default function EmptyState({
	title = 'No products found',
	subtitle = 'New items are coming soon. Stay tuned!',
}: {
	title?: string;
	subtitle?: string;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col items-center justify-center py-20 text-center"
		>
			<div className="mb-4 text-5xl">🧸</div>
			<h3 className="text-lg font-semibold">{title}</h3>
			<p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
		</motion.div>
	);
}
