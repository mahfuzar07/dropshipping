'use client';
import { useEffect, type ReactNode } from 'react';

export default function UnauthorizedPageLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return <>{children}</>;
}
