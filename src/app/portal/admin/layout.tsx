'use client';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/components/common/layouts/AdminLayout';
import UnauthenticatedSkeleton from '@/components/common/loader/UnauthenticatedSkeleton';

export default function PortalAdminLayout({ children }: { children: React.ReactNode }) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const pathname = usePathname();

	const isLoginPage = pathname === '/portal/admin/login' || pathname === '/admin/login';

	useEffect(() => {
		if (isLoginPage) return;

		if (status === 'unauthenticated') {
			router.replace('/admin/login');
		} else if (status === 'authenticated') {
			const user = session?.user as any;
			const role = user?.profile_data?.user_type || user?.user_type || user?.role;
			const isStaff = user?.profile_data?.is_staff || user?.is_staff;
			const isSuperuser = user?.profile_data?.is_superuser || user?.is_superuser;

			if (role !== 'ADMIN' && role !== 'STAFF' && !isStaff && !isSuperuser) {
				router.replace('/unauthorized');
			}
		}
	}, [status, session, router, isLoginPage]);

	if (isLoginPage) {
		return <>{children}</>;
	}

	if (status === 'loading') {
		return <UnauthenticatedSkeleton />;
	}

	if (status === 'unauthenticated') {
		return null;
	}

	const user = session?.user as any;
	const role = user?.profile_data?.user_type || user?.user_type || user?.role;
	const isStaff = user?.profile_data?.is_staff || user?.is_staff;
	const isSuperuser = user?.profile_data?.is_superuser || user?.is_superuser;

	if (role !== 'ADMIN' && role !== 'STAFF' && !isStaff && !isSuperuser) {
		return null;
	}

	return <AdminLayout>{children}</AdminLayout>;
}
