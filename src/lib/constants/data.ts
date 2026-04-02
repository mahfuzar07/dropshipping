import { Key, User, LucideIcon } from 'lucide-react';

export const NAV_ITEMS = [
	{ label: 'Category', href: '/shop', megaKey: 'products' },
	{ label: 'Services', href: '/services', megaKey: 'services' },
];

export interface CustomerNavigationLink {
	title: string;
	icon: LucideIcon;
	url: string;
}

export const customerNavigaLink: CustomerNavigationLink[] = [
	{ title: 'My Profile', icon: User, url: '/customer/profile' },
	{ title: 'Change Password', icon: Key, url: '/customer/change-password' },
	{ title: 'Order History', icon: User, url: '/customer/orders' },
	{ title: 'My Wishlist', icon: User, url: '/customer/wishlist' },
	{ title: 'Address Book', icon: User, url: '/customer/address-book' },
];
