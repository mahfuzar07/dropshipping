'use client';

import { useState } from 'react';
import { Search, Truck, Clock3, ClipboardCheck, PackageCheck, RefreshCcw, CheckCircle2, XCircle, RotateCcw, AlertTriangle, X } from 'lucide-react';
import OrderTimeline from './OrderTimeline';
import { AnimatePresence, motion } from 'framer-motion';
/* =========================================================
   ORDER STATUS TYPES
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

type OrderStatus = keyof typeof ORDER_STATUSES;

interface HistoryItem {
	status: string;
	date: string;
}

/* =========================================================
   MOCK DATA
========================================================= */

interface MockOrder {
	status: OrderStatus;
	product: string;

	recipient: string;
	phone: string;
	address: string;
	courier: string;
	estDelivery: string;
	history: HistoryItem[];
}

const mockOrders: Record<string, MockOrder> = {
	'ORD-2025-9871': {
		status: 'SHIPPED',
		product: 'Sony WH-1000XM5 Headphones',

		recipient: 'Rahim Ahmed',
		phone: '+880 1711-234567',
		address: 'House 12, Road 4, Block C, Bashundhara R/A, Dhaka 1229',
		courier: 'Pathao Courier',
		estDelivery: 'Today, 4–6 PM',
		history: [
			{ status: 'PENDING', date: 'May 1 · 9:00 AM' },
			{ status: 'CONFIRMED', date: 'May 1 · 10:22 AM' },
			{ status: 'PROCESSING', date: 'May 2 · 1:45 PM' },
			{ status: 'SHIPPED', date: 'May 3 · 9:00 AM' },
		],
	},
	'ORD-2025-3344': {
		status: 'PROCESSING',
		product: 'Nike Air Max Sneakers',

		recipient: 'Nusrat Jahan',
		phone: '+880 1822-345678',
		address: 'Flat 5B, House 9, Road 2, Dhanmondi, Dhaka 1205',
		courier: 'Sundarban Courier',
		estDelivery: 'May 6, 2–5 PM',
		history: [
			{ status: 'PENDING', date: 'May 2 · 11:00 AM' },
			{ status: 'CONFIRMED', date: 'May 2 · 12:30 PM' },
			{ status: 'PROCESSING', date: 'May 3 · 8:00 AM' },
		],
	},
	'ORD-2025-1102': {
		status: 'COMPLETED',
		product: 'Apple Watch Series 9',

		recipient: 'Karim Hossain',
		phone: '+880 1933-456789',
		address: 'House 3, Road 7, Uttara Sector 11, Dhaka 1230',
		courier: 'SA Paribahan',
		estDelivery: 'Delivered',
		history: [
			{ status: 'PENDING', date: 'Apr 28 · 10:00 AM' },
			{ status: 'CONFIRMED', date: 'Apr 28 · 11:15 AM' },
			{ status: 'PROCESSING', date: 'Apr 29 · 9:30 AM' },
			{ status: 'SHIPPED', date: 'Apr 30 · 8:00 AM' },
			{ status: 'COMPLETED', date: 'May 1 · 3:45 PM' },
		],
	},
	'ORD-2025-0077': {
		status: 'CANCELLED',
		product: 'Samsung Galaxy Tab S9',

		recipient: 'Fatema Begum',
		phone: '+880 1644-567890',
		address: 'House 22, Road 1, Mirpur DOHS, Dhaka 1216',
		courier: '—',
		estDelivery: '—',
		history: [
			{ status: 'PENDING', date: 'May 2 · 2:00 PM' },
			{ status: 'CONFIRMED', date: 'May 2 · 3:00 PM' },
		],
	},
};

/* =========================================================
   STATUS BADGE COLOR MAP
========================================================= */

const statusBadge: Record<OrderStatus, string> = {
	PENDING: 'text-slate-600   bg-slate-50   border-slate-200',
	CONFIRMED: 'text-sky-600     bg-sky-50     border-sky-200',
	PROCESSING: 'text-amber-600   bg-amber-50   border-amber-200',
	SHIPPED: 'text-violet-600  bg-violet-50  border-violet-200',
	RESCHEDULED: 'text-orange-600  bg-orange-50  border-orange-200',
	COMPLETED: 'text-emerald-600 bg-emerald-50 border-emerald-200',
	CANCELLED: 'text-red-600     bg-red-50     border-red-200',
	REFUNDED: 'text-sky-600     bg-sky-50     border-sky-200',
	FAILED: 'text-orange-600  bg-orange-50  border-orange-200',
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function TrackOrderPageContent() {
	const [inputValue, setInputValue] = useState('ORD-2025-9871');
	const [activeOrder, setActiveOrder] = useState<string | null>(null);
	const [recentIds, setRecentIds] = useState<string[]>([]);
	const [error, setError] = useState('');

	const order = activeOrder ? mockOrders[activeOrder] : null;

	const handleTrack = (id?: string) => {
		const val = (id ?? inputValue).trim().toUpperCase();
		if (!val) {
			setError('Please enter an order ID');
			return;
		}

		if (mockOrders[val]) {
			setActiveOrder(val);
			setRecentIds((prev) => {
				const filtered = prev.filter((r) => r !== val);
				return [val, ...filtered].slice(0, 3);
			});
			setInputValue('');
			setError('');
		} else {
			setError(`"${val}" not found. Try: ORD-2025-9871`);
		}
	};

	const handleChipClick = (id: string) => {
		if (mockOrders[id]) {
			setActiveOrder(id);
			setRecentIds((prev) => {
				const filtered = prev.filter((r) => r !== id);
				return [id, ...filtered].slice(0, 3);
			});
			setInputValue('');
			setError('');
		}
	};

	const removeChip = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setRecentIds((prev) => prev.filter((r) => r !== id));
		if (activeOrder === id) setActiveOrder(null);
	};

	return (
		<div className="min-h-screen container max-w-6xl mx-auto space-y-5">
			<div className="text-center mb-6 md:mb-10">
				<h1 className="text-2xl md:text-4xl font-semibold tracking-tight">Track your order</h1>
				<p className="text-[10px] md:text-xs text-muted-foreground mt-1 tracking-wider uppercase">
					Enter your order ID to see real-time delivery status
				</p>
			</div>
			{/* ── Search Card ── */}
			<div className=" bg-white backdrop-blur-xl  p-6 rounded-xl">
				<div className=" max-w-2xl mx-auto">
					<div className="rounded-full flex items-center pl-4 pr-1 py-1 gap-3 border">
						<input
							type="text"
							value={inputValue}
							onChange={(e) => {
								setInputValue(e.target.value);
								setError('');
							}}
							onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
							placeholder="e.g. ORD-2025-9871"
							className="flex-1 outline-none text-sm md:text-base text-foreground placeholder:text-slate-300 bg-transparent"
						/>

						<motion.button
							whileTap={{ scale: 1 }}
							whileHover={{ scale: 0.95 }}
							onClick={() => handleTrack()}
							className="flex gap-1 shadow items-center justify-center bg-orange-300 text-white  rounded-full py-2 px-5 font-fredoka font-medium cursor-pointer"
						>
							<Search className="w-5 h-5" />
							<span className="hidden md:block"> Track</span>
						</motion.button>
					</div>

					{error && <p className="text-xs text-rose-500 mt-2">{error}</p>}

					{/* last 3 searched chips */}
					{recentIds.length > 0 && (
						<div className="mt-4 flex items-center gap-2 flex-wrap">
							<span className="text-xs text-slate-400">Recent:</span>
							{recentIds.map((id) => (
								<button
									key={id}
									onClick={() => handleChipClick(id)}
									className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-all ${
										activeOrder === id
											? 'bg-twinkle-teal/5 text-twinkle-teal border-twinkle-teal/50'
											: 'bg-slate-50 text-foreground border-slate-200 hover:border-slate-400'
									}`}
								>
									<span>{id}</span>
									<span
										role="button"
										aria-label={`Remove ${id}`}
										onClick={(e) => removeChip(id, e)}
										className={`ml-0.5 cursor-pointer transition-colors ${activeOrder === id ? 'text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}
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
			{order && activeOrder && (
				<>
					{/* 2-column grid: timeline | delivery details */}
					<div className="grid grid-cols-1 md:grid-cols-5 gap-3">
						{/* timeline */}
						<div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
							<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Delivery Timeline</p>
							<OrderTimeline direction="column" status={order.status} history={order.history} />
						</div>

						{/* delivery details */}
						<div className="md:col-span-3 space-y-2">
							<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
								<div className="flex items-center gap-4">
									<div className="flex-1 min-w-0">
										<p className="font-medium text-slate-800 text-sm truncate">{order.product}</p>
										<p className="text-xs text-slate-400 mt-0.5">{activeOrder}</p>
									</div>
									<span className={`text-xs font-medium px-3 py-1.5 rounded-full border flex-shrink-0 ${statusBadge[order.status]}`}>
										{order.status.charAt(0) + order.status.slice(1).toLowerCase()}
									</span>
								</div>
							</div>
							<div className=" bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
								<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Delivery Details</p>
								<div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
									<div>
										<p className="text-xs text-slate-400 mb-0.5">Recipient</p>
										<p className="text-slate-700 font-medium">{order.recipient}</p>
									</div>
									<div>
										<p className="text-xs text-slate-400 mb-0.5">Phone</p>
										<p className="text-slate-700">{order.phone}</p>
									</div>
									<div className="col-span-2">
										<p className="text-xs text-slate-400 mb-0.5">Address</p>
										<p className="text-slate-700">{order.address}</p>
									</div>
									<div>
										<p className="text-xs text-slate-400 mb-0.5">Courier</p>
										<p className="text-slate-700">{order.courier}</p>
									</div>
									<div>
										<p className="text-xs text-slate-400 mb-0.5">Est. Delivery</p>
										<p className="text-slate-700">{order.estDelivery}</p>
									</div>
								</div>
							</div>
							{/* help bar — full width */}
							<div className="rounded-2xl bg-white shadow p-6 flex items-center justify-between gap-4">
								<div>
									<p className=" text-sm font-medium">Need help with this order?</p>
									<p className="text-slate-400 text-xs mt-0.5">Contact our support team anytime</p>
								</div>
								<button className="flex-shrink-0 text-sm shadow bg-white text-slate-900 font-medium px-4 py-2 rounded-xl hover:bg-slate-100 active:scale-95 transition-all">
									Contact Us
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
