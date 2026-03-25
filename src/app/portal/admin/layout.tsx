'use client';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import AdminLayout from '@/components/common/layouts/AdminLayout';

export default function AdminSectionLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const pathname = usePathname();
	return <AdminLayout currentPath={pathname}>{children}</AdminLayout>;
}
