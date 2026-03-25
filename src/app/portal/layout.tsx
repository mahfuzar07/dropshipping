'use client';
import { useEffect, type ReactNode } from 'react';

export default function PortalLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return <>{children}</>;
}
