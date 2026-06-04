'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import OrderTimeline, { HistoryItem } from './OrderTimeline';
import { motion } from 'framer-motion';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';
import { APIResponse } from '@/types/types';

/* =========================================================
   ORDER STATUS TYPES
========================================================= */

export const ORDER_STATUSES = {
	PENDING: 'PENDING',
	CONFIRMED: 'CONFIRMED',
	PROCESSING: 'PROCESSING',
	SHIPPED: 'SHIPPED',
	DELIVERED: 'DELIVERED',
	RESCHEDULED: 'RESCHEDULED',
	COMPLETED: 'COMPLETED',
	CANCELLED: 'CANCELLED',
	RETURNED: 'RETURNED',
	REFUNDED: 'REFUNDED',
	FAILED: 'FAILED',
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;

/* =========================================================
   TYPES
========================================================= */

interface TrackingAddress {
	id: number;
	full_name: string;
	phone: string;
	address: string;
	address_line2?: string;
	city: string;
	district: string;
	postal_code: string;
	is_default: boolean;
	created_at: string;
	updated_at: string;
	user: number;
}

interface TrackingData {
	id: string;
	order: string;
	order_number: string;
	carrier: string;
	tracking_number: string;
	tracking_url: string;
	estimated_delivery: string;
	status: string;
	shipped_at: string;
	address: TrackingAddress;
}

/* =========================================================
   STATUS BADGE COLOR MAP
========================================================= */

const statusBadge: Record<OrderStatus, string> = {
	PENDING: 'text-slate-600   bg-slate-50   border-slate-200',
	CONFIRMED: 'text-sky-600     bg-sky-50     border-sky-200',
	PROCESSING: 'text-amber-600   bg-amber-50   border-amber-200',
	SHIPPED: 'text-violet-600  bg-violet-50  border-violet-200',
	DELIVERED: 'text-blue-600    bg-blue-50    border-blue-200',
	RESCHEDULED: 'text-orange-600  bg-orange-50  border-orange-200',
	COMPLETED: 'text-emerald-600 bg-emerald-50 border-emerald-200',
	CANCELLED: 'text-red-600     bg-red-50     border-red-200',
	RETURNED: 'text-rose-600    bg-rose-50    border-rose-200',
	REFUNDED: 'text-sky-600     bg-sky-50     border-sky-200',
	FAILED: 'text-orange-600  bg-orange-50  border-orange-200',
};

/* =========================================================
   HELPERS
========================================================= */

const normalizeStatus = (raw: string): OrderStatus => {
	const upper = raw.toUpperCase() as OrderStatus;
	return upper in ORDER_STATUSES ? upper : 'PENDING';
};

function formatDate(dateStr: string) {
	if (!dateStr) return '';
	return new Date(dateStr).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}

// status
const STATUS_PROGRESS: Record<OrderStatus, number> = {
	PENDING: 1,
	CONFIRMED: 2,
	PROCESSING: 3,
	SHIPPED: 4,
	DELIVERED: 5,
	RESCHEDULED: 4,
	COMPLETED: 6,
	CANCELLED: 0,
	RETURNED: 0,
	REFUNDED: 0,
	FAILED: 0,
};

function buildHistory(data: TrackingData, status: OrderStatus): HistoryItem[] {
	const progress = STATUS_PROGRESS[status] ?? 1;

	const steps: { status: OrderStatus; getDate: () => string }[] = [
		{ status: 'PENDING', getDate: () => '' },
		{ status: 'CONFIRMED', getDate: () => '' },
		{ status: 'PROCESSING', getDate: () => '' },
		{ status: 'SHIPPED', getDate: () => (data.shipped_at ? formatDate(data.shipped_at) : '') },
		{ status: 'DELIVERED', getDate: () => '' },
		{ status: 'COMPLETED', getDate: () => (data.estimated_delivery ? formatDate(data.estimated_delivery) : '') },
	];

	return steps.slice(0, progress).map((s) => ({ status: s.status, date: s.getDate() }));
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function TrackOrderPageContent() {
	const [inputValue, setInputValue] = useState('');
	const [error, setError] = useState('');
	const [recentIds, setRecentIds] = useState<string[]>([]);
	const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
	const [activeId, setActiveId] = useState<string | null>(null);

	const { create: submitTrackNumber } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.SHIPMENT_TRACKING],
		api: apiEndpoint.orders.SHIPMENT_TRACKING(),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Tracking number not found');
		},
	});

	const doTrack = async (trackingNumber: string) => {
		const val = trackingNumber.trim().toUpperCase();
		if (!val) {
			setError('Please enter a tracking number');
			return;
		}

		const form = new FormData();
		form.append('tracking_number', val);

		try {
			const response = (await submitTrackNumber(form)) as any;
			const data: TrackingData = response?.data ?? response;

			if (data?.tracking_number) {
				setTrackingData(data);
				setActiveId(val);
				setRecentIds((prev) => [val, ...prev.filter((r) => r !== val)].slice(0, 3));
				setInputValue('');
				setError('');
			} else {
				setError(`No tracking info found for "${val}"`);
			}
		} catch {
			setError(`No tracking info found for "${val}"`);
		}
	};

	const handleTrack = () => doTrack(inputValue);
	const handleChipClick = (id: string) => doTrack(id);

	const removeChip = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setRecentIds((prev) => prev.filter((r) => r !== id));
		if (activeId === id) {
			setTrackingData(null);
			setActiveId(null);
		}
	};

	const status = trackingData ? normalizeStatus(trackingData.status) : ('PENDING' as OrderStatus);
	const history = trackingData ? buildHistory(trackingData, status) : [];

	const fullAddress = trackingData?.address
		? [
				trackingData.address.address,
				trackingData.address.address_line2,
				trackingData.address.city,
				trackingData.address.district,
				trackingData.address.postal_code,
			]
				.filter(Boolean)
				.join(', ')
		: '—';

	return (
		<div className="min-h-screen container max-w-6xl mx-auto space-y-5">
			<div className="text-center mb-6 md:mb-10">
				<h1 className="text-2xl md:text-4xl font-semibold tracking-tight">Track your order</h1>
				<p className="text-[10px] md:text-xs text-muted-foreground mt-1 tracking-wider uppercase">
					Enter your tracking number to see real-time delivery status
				</p>
			</div>

			{/* ── Search Card ── */}
			<div className="bg-white backdrop-blur-xl p-6 rounded-xl">
				<div className="max-w-2xl mx-auto">
					<div className="rounded-full flex items-center pl-4 pr-1 py-1 gap-3 border">
						<input
							type="text"
							value={inputValue}
							onChange={(e) => {
								setInputValue(e.target.value);
								setError('');
							}}
							onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
							placeholder="e.g. TRK0B4D6RATH"
							className="flex-1 outline-none text-sm md:text-base text-foreground placeholder:text-slate-300 bg-transparent"
						/>
						<motion.button
							whileTap={{ scale: 1 }}
							whileHover={{ scale: 0.95 }}
							onClick={handleTrack}
							className="flex gap-1 shadow items-center justify-center bg-orange-300 text-white rounded-full py-2 px-5 font-fredoka font-medium cursor-pointer"
						>
							<Search className="w-5 h-5" />
							<span className="hidden md:block">Track</span>
						</motion.button>
					</div>

					{error && <p className="text-xs text-rose-500 mt-2">{error}</p>}

					{recentIds.length > 0 && (
						<div className="mt-4 flex items-center gap-2 flex-wrap">
							<span className="text-xs text-slate-400">Recent:</span>
							{recentIds.map((id) => (
								<button
									key={id}
									onClick={() => handleChipClick(id)}
									className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-all ${
										activeId === id
											? 'bg-twinkle-teal/5 text-twinkle-teal border-twinkle-teal/50'
											: 'bg-slate-50 text-foreground border-slate-200 hover:border-slate-400'
									}`}
								>
									<span>{id}</span>
									<span
										role="button"
										aria-label={`Remove ${id}`}
										onClick={(e) => removeChip(id, e)}
										className="ml-0.5 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
									>
										<X className="w-3 h-3" />
									</span>
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* ── Order Details ── */}
			{trackingData && activeId && (
				<div className="grid grid-cols-1 md:grid-cols-5 gap-3">
					{/* Timeline */}
					<div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
						<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Delivery Timeline</p>
						<OrderTimeline direction="column" status={status as any} history={history} />
					</div>

					{/* Details */}
					<div className="md:col-span-3 space-y-2">
						{/* Order header */}
						<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
							<div className="flex items-center gap-4">
								<div className="flex-1 min-w-0">
									<p className="font-medium text-slate-800 text-sm truncate">{trackingData.order_number}</p>
									<p className="text-xs text-slate-400 mt-0.5">Tracking: {trackingData.tracking_number}</p>
								</div>
								<span className={`text-xs font-medium px-3 py-1.5 rounded-full border flex-shrink-0 ${statusBadge[status]}`}>
									{status.charAt(0) + status.slice(1).toLowerCase()}
								</span>
							</div>
						</div>

						{/* Delivery details */}
						<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
							<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Delivery Details</p>
							<div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
								<div>
									<p className="text-xs text-slate-400 mb-0.5">Recipient</p>
									<p className="text-slate-700 font-medium">{trackingData.address.full_name}</p>
								</div>
								<div>
									<p className="text-xs text-slate-400 mb-0.5">Phone</p>
									<p className="text-slate-700">{trackingData.address.phone}</p>
								</div>
								<div className="col-span-2">
									<p className="text-xs text-slate-400 mb-0.5">Address</p>
									<p className="text-slate-700">{fullAddress}</p>
								</div>
								<div>
									<p className="text-xs text-slate-400 mb-0.5">Carrier</p>
									<p className="text-slate-700">{trackingData.carrier || '—'}</p>
								</div>
								<div>
									<p className="text-xs text-slate-400 mb-0.5">Est. Delivery</p>
									<p className="text-slate-700">{trackingData.estimated_delivery ? formatDate(trackingData.estimated_delivery) : '—'}</p>
								</div>
								{trackingData.tracking_url && (
									<div className="col-span-2">
										<p className="text-xs text-slate-400 mb-0.5">Tracking URL</p>
										<a
											href={trackingData.tracking_url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sky-500 hover:underline text-xs break-all"
										>
											{trackingData.tracking_url}
										</a>
									</div>
								)}
							</div>
						</div>

						{/* Help bar */}
						<div className="rounded-2xl bg-white shadow p-6 flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium">Need help with this order?</p>
								<p className="text-slate-400 text-xs mt-0.5">Contact our support team anytime</p>
							</div>
							<button className="flex-shrink-0 text-sm shadow bg-white text-slate-900 font-medium px-4 py-2 rounded-xl hover:bg-slate-100 active:scale-95 transition-all">
								Contact Us
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
