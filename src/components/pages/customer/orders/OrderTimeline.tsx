'use client';

import React from 'react';
import { Clock3, CheckCircle2, PackageCheck, Truck, RefreshCcw, XCircle, RotateCcw, AlertTriangle, ClipboardCheck } from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

export const ORDER_STATUSES = {
	PENDING: 'PENDING',
	CONFIRMED: 'CONFIRMED',
	PROCESSING: 'PROCESSING',
	SHIPPED: 'SHIPPED',
	RESCHEDULED: 'RESCHEDULED',
	COMPLETED: 'COMPLETED',
	CANCELLED: 'CANCELLED',
	REFUNDED: 'REFUNDED',
	FAILED: 'FAILED',
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;

export interface HistoryItem {
	status: string;
	date: string;
}

export interface OrderTimelineProps {
	status: OrderStatus;
	history?: HistoryItem[];
	/**
	 * 'row'    → horizontal stepper (desktop default)
	 * 'column' → vertical stepper (mobile / sidebar)
	 */
	direction?: 'row' | 'column';
}

/* =========================================================
   CONFIG
========================================================= */

const timelineConfig = [
	{ key: ORDER_STATUSES.PENDING, label: 'Pending', subtitle: 'Waiting for seller confirmation', icon: Clock3 },
	{ key: ORDER_STATUSES.CONFIRMED, label: 'Confirmed', subtitle: 'Your order has been placed successfully', icon: ClipboardCheck },
	{ key: ORDER_STATUSES.PROCESSING, label: 'Processing', subtitle: 'Seller is preparing your items', icon: PackageCheck },
	{ key: ORDER_STATUSES.SHIPPED, label: 'Shipped', subtitle: 'Package picked up by courier', icon: Truck },
	{ key: ORDER_STATUSES.RESCHEDULED, label: 'Rescheduled', subtitle: 'Delivery has been rescheduled', icon: RefreshCcw },
	{ key: ORDER_STATUSES.COMPLETED, label: 'Completed', subtitle: 'Order delivered successfully', icon: CheckCircle2 },
] as const;

const specialStatusConfig = {
	CANCELLED: {
		label: 'Order Cancelled',
		icon: XCircle,
		wrapClass: 'bg-red-50 border-red-200 text-red-700',
		iconClass: 'bg-red-500 text-white',
	},
	REFUNDED: {
		label: 'Refund Completed',
		icon: RotateCcw,
		wrapClass: 'bg-sky-50 border-sky-200 text-sky-700',
		iconClass: 'bg-sky-500 text-white',
	},
	FAILED: {
		label: 'Order Failed',
		icon: AlertTriangle,
		wrapClass: 'bg-orange-50 border-orange-200 text-orange-700',
		iconClass: 'bg-orange-500 text-white',
	},
} as const;

/* =========================================================
   SPECIAL BANNER (cancelled / refunded / failed)
========================================================= */

function SpecialBanner({ status }: { status: 'CANCELLED' | 'REFUNDED' | 'FAILED' }) {
	const cfg = specialStatusConfig[status];
	const Icon = cfg.icon;

	return (
		<div className={`rounded-3xl border p-8 ${cfg.wrapClass}`}>
			<div className="flex flex-col sm:flex-row items-center gap-5">
				<div className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.iconClass}`}>
					<Icon className="w-10 h-10" />
				</div>
				<div>
					<h2 className="text-2xl font-bold">{cfg.label}</h2>
					<p className="mt-1 opacity-80">
						Current order status: <span className="font-semibold">{status}</span>
					</p>
				</div>
			</div>
		</div>
	);
}

/* =========================================================
   ROW LAYOUT (horizontal stepper)
========================================================= */

function RowTimeline({ activeIndex, history }: { activeIndex: number; history: HistoryItem[] }) {
	const progress = (activeIndex / (timelineConfig.length - 1)) * 100;

	return (
		<div className="rounded-3xl border border-border bg-background p-6 md:p-8 overflow-hidden mb-5">
			<div className="relative">
				{/* Desktop Timeline Line */}
				<div className="hidden md:block absolute top-7 left-0 right-0 h-0.5 bg-muted rounded-full" />

				{/* Progress Line */}
				<div
					className="hidden md:block absolute top-7 left-0 h-0.5 rounded-full bg-orange-400 from-amber-300 via-orange-400 to-orange-500 transition-all duration-700 ease-out"
					style={{ width: `${progress}%` }}
				/>

				{/* Timeline Items */}
				<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 md:gap-3 relative z-10">
					{timelineConfig.map((step, index) => {
						const Icon = step.icon;

						const isCompleted = index <= activeIndex;
						const isActive = index === activeIndex;

						const historyItem = history.find((h) => h.status === step.key);

						return (
							<div
								key={step.key}
								className={`
									flex md:flex-col items-center gap-4 md:gap-3
									${index === 0 ? 'md:items-start' : ''}
									${index === timelineConfig.length - 1 ? 'md:items-end' : ''}
									${index !== 0 && index !== timelineConfig.length - 1 ? 'md:items-center' : ''}
								`}
							>
								{/* Mobile Vertical Line */}
								{index !== timelineConfig.length - 1 && (
									<div
										className={`
											md:hidden absolute left-[23px] mt-14 w-[2px] h-16
											${isCompleted ? 'bg-orange-400' : 'bg-muted'}
										`}
									/>
								)}

								{/* Icon Bubble */}
								<div
									className={[
										'relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-full',
										'flex items-center justify-center border-[3px]',
										'transition-all duration-300 flex-shrink-0',
										isCompleted
											? 'bg-gradient-to-br from-amber-400 to-orange-500 border-orange-200 text-white shadow-lg shadow-orange-200/50'
											: 'bg-background border-muted text-muted-foreground',
										isActive ? 'ring-3 ring-orange-100' : '',
									].join(' ')}
								>
									<Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'animate-pulse' : ''}`} />
								</div>

								{/* Content */}
								<div
									className={`
										flex flex-col whitespace-nowrap
										md:w-max
										${index === 0 ? 'md:text-left' : ''}
										${index === timelineConfig.length - 1 ? 'md:text-right' : ''}
										${index !== 0 && index !== timelineConfig.length - 1 ? 'md:text-center' : ''}
									`}
								>
									<p className={`font-semibold text-sm leading-tight ${isCompleted ? 'text-amber-600' : 'text-muted-foreground'}`}>{step.label}</p>

									<p className="text-xs text-muted-foreground mt-1">{historyItem?.date || (isCompleted ? 'Completed' : 'Waiting')}</p>

									{isActive && (
										<div className="mt-2">
											<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-medium">
												<span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
												Current Status
											</span>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

/* =========================================================
   COLUMN LAYOUT (vertical stepper)
========================================================= */

function ColumnTimeline({ activeIndex, history }: { activeIndex: number; history: HistoryItem[] }) {
	return (
		<div className="rounded-2xl border border-border p-6 overflow-hidden mb-5">
			<div className="flex flex-col gap-0">
				{timelineConfig.map((step, index) => {
					const Icon = step.icon;
					const isCompleted = index <= activeIndex;
					const isActive = index === activeIndex;
					const isLast = index === timelineConfig.length - 1;
					const historyItem = history.find((h) => h.status === step.key);

					return (
						<div key={step.key} className="flex gap-4">
							{/* left: icon + connector */}
							<div className="flex flex-col items-center">
								<div
									className={[
										'w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0',
										'border-[3px] transition-all duration-300',
										isCompleted
											? 'bg-gradient-to-br from-amber-400 to-orange-500 border-orange-300 text-white shadow-md'
											: 'bg-background border-muted text-muted-foreground',
										isActive ? 'ring-3 ring-orange-100' : '',
									].join(' ')}
								>
									<Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
								</div>

								{/* vertical connector */}
								{!isLast && (
									<div className="relative w-px flex-1 min-h-[28px] my-1">
										{/* grey base */}
										<div className="absolute inset-0 bg-muted rounded-full" />
										{/* filled portion */}
										{isCompleted && <div className="absolute inset-0 bg-gradient-to-b from-orange-400 to-orange-300 rounded-full" />}
									</div>
								)}
							</div>

							{/* right: text */}
							<div className={`flex-1 pb-6 ${isLast ? 'pb-1' : ''}`}>
								<div className="flex items-start justify-between gap-3 pt-1">
									{/* label + subtitle */}
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 flex-wrap">
											<p className={`font-semibold text-sm leading-tight ${isCompleted ? 'text-amber-600' : 'text-muted-foreground'}`}>
												{step.label}
											</p>
											{isActive && (
												<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-medium whitespace-nowrap">
													<span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
													Current
												</span>
											)}
										</div>
										<p className={`text-xs mt-0.5 leading-snug ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
											{step.subtitle}
										</p>
									</div>

									{/* date — right aligned */}
									{(historyItem?.date || (isCompleted && !isActive)) && (
										<p className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0 pt-0.5">{historyItem?.date || 'Completed'}</p>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

/* =========================================================
   MAIN EXPORT
========================================================= */

const OrderTimeline = ({ status, history = [], direction = 'row' }: OrderTimelineProps) => {
	// terminal special states
	if (status === ORDER_STATUSES.CANCELLED || status === ORDER_STATUSES.REFUNDED || status === ORDER_STATUSES.FAILED) {
		return <SpecialBanner status={status as 'CANCELLED' | 'REFUNDED' | 'FAILED'} />;
	}

	const activeIndex = timelineConfig.findIndex((item) => item.key === status);

	if (direction === 'column') {
		return <ColumnTimeline activeIndex={activeIndex} history={history} />;
	}

	return <RowTimeline activeIndex={activeIndex} history={history} />;
};

export default OrderTimeline;
