import React from 'react';
import { cn } from '@/lib/utils/utils';

type Align = 'left' | 'center' | 'right';

type TypoTitleProps = {
	tagTitle?: string;
	title: string;
	subtitle?: string | false;
	align?: Align;
	className?: string;
	tagClassName?: string;
	titleClassName?: string;
	subtitleClassName?: string;
};

export default function TypoTitle({
	tagTitle,
	tagClassName,
	title,
	subtitle,
	align = 'left',
	className,
	titleClassName,
	subtitleClassName,
}: TypoTitleProps) {
	const alignMap = {
		left: 'items-start text-left',
		center: 'items-center text-center',
		right: 'items-end text-right',
	};

	return (
		<div className={cn('relative w-full flex flex-col !font-emily', alignMap[align], className)}>
			{/* Tag title */}
			{tagTitle && <span className={cn('mb-1 text-sm font-medium  tracking-wide text-muted-foreground', tagClassName)}>{tagTitle}</span>}

			{/* Title */}
			<div className={cn('relative w-full h-[60px] flex items-center', align === 'center' && 'justify-center', align === 'right' && 'justify-end')}>
				<div
					className={cn('absolute w-full h-full -top-2 -left-5 z-0 bg-orange-100')}
					style={{
						WebkitMaskImage: "url('/assets/background/brush-bg.png')",
						WebkitMaskRepeat: 'no-repeat',
						WebkitMaskSize: 'contain',
						WebkitMaskPosition: align === 'center' ? 'center' : align === 'left' ? 'left' : 'right',
						maskImage: "url('/assets/background/brush-bg.png')",
						maskRepeat: 'no-repeat',
						maskSize: 'contain',
						maskPosition: align === 'center' ? 'center' : align === 'left' ? 'left' : 'right',
					}}
				/>

				<h2 className={cn('relative z-10 text-xl md:text-3xl font-semibold text-twinkle-accent', titleClassName)}>{title}</h2>
			</div>

			{/* Subtitle */}
			{subtitle && <p className={cn('mt-2 text-sm text-muted-foreground', subtitleClassName)}>{subtitle}</p>}
		</div>
	);
}
