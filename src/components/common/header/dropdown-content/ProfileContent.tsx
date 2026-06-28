import { Button } from '@/components/ui/button';
import { User, ShoppingBag, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import React from 'react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

type Props = {
	isAuthenticated: boolean;
	user: { phone: string; name?: string } | null;
	logout: () => void;
};

function getInitials(name?: string) {
	if (!name) return 'U';
	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

const menuItems = [
	{ label: 'My Profile', icon: User, href: '/customer/profile' },
	{ label: 'My Orders', icon: ShoppingBag, href: '/customer/orders', badge: 3 },
	{ label: 'Wishlist', icon: Heart, href: '/customer/wishlist' },
	{ label: 'Addresses', icon: MapPin, href: '/customer/addresses' },
	{ label: 'Settings', icon: Settings, href: '/customer/settings' },
];

export default function ProfileContent({ isAuthenticated, user, logout }: Props) {
	const router = useRouter();

	const handleLogout = () => {
		logout();
		router.push('/');
		router.refresh();
	};

	if (isAuthenticated && user) {
		return (
			<div className="w-full overflow-y-auto overflow-x-hidden flex flex-col h-full font-fredoka">
				{/* ── Header ─────────────────────────── */}
				<div className="relative px-4 border-b overflow-hidden">
					<div className="flex h-16 items-center gap-3 relative z-10 ">
						{/* Avatar */}
						<div className="w-11 h-11 rounded-xl bg-black/5  flex items-center justify-center flex-shrink-0">
							<span className="text-sm font-semibold text-foreground tracking-wide font-serif">{getInitials(user?.name)}</span>
						</div>

						<div className="min-w-0">
							<p className="text-sm font-medium text-foreground truncate">{user?.name ?? 'My Account'}</p>
							<p className="text-xs text-muted-foreground mt-0.5 font-quicksand">{user?.phone}</p>
						</div>
					</div>
				</div>

				{/* ── Menu ───────────────────────────── */}
				<nav className="flex-1 p-2">
					<p className="text-[11px] tracking-[0.12em] uppercase text-[#2e2e38] font-medium px-3 pt-2 pb-1">Account</p>

					{menuItems.map(({ label, icon: Icon, href, badge }) => (
						<button
							key={href}
							onClick={() => {
								router.push(href);
							}}
							className="group w-full flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
						>
							<span className="w-8 h-8 rounded-lg bg-black/10 border border-slate-100 flex items-center justify-center flex-shrink-0 transition-colors">
								<Icon size={15} className="text-muted-foreground group-hover:text-twinkle-teal" />
							</span>
							<span className="flex-1 text-[14px] text-left text-muted-foreground group-hover:text-twinkle-teal transition-colors">{label}</span>
							{badge && <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-twinkle-teal text-white border">{badge}</span>}
						</button>
					))}
				</nav>

				{/* ── Logout ─────────────────────────── */}
				<div className="border-t px-5 py-2 bg-twinkle-gold/20">
					<button
						onClick={handleLogout}
						className="flex items-center gap-3 text-[#7a2e50] hover:text-[#c0527a] font-semibold transition-colors cursor-pointer font-fredoka"
					>
						<span className="w-8 h-8 rounded-lg bg-black/10 border border-slate-100 flex items-center justify-center flex-shrink-0 transition-colors">
							<LogOut size={15} className="text-muted-foreground group-hover:text-twinkle-teal" />
						</span>

						<span className="text-[14px]">Log out</span>
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			{/* Guest header */}
			<div className="flex flex-col items-center gap-2 px-4 py-4 border-b border-border/50 text-center">
				<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border border-border/50">
					<User className="h-5 w-5 text-muted-foreground" />
				</div>
				<div>
					<p className="text-sm font-medium">Welcome back 👋</p>
					<p className="text-xs text-muted-foreground mt-0.5">Sign in to your account</p>
				</div>
			</div>

			{/* Auth buttons */}
			<div className="flex flex-col gap-2 p-4">
				<Button onClick={() => router.push('/sign-in')} className="w-full h-10 text-sm bg-primary hover:bg-primary/80">
					Sign in
				</Button>
				<Button onClick={() => router.push('/sign-up')} variant="outline" className="w-full h-10 text-sm ">
					Create account
				</Button>
			</div>

			<p className="text-[11px] text-muted-foreground text-center pb-3">New here? Registration is free &amp; fast.</p>
		</div>
	);
}
