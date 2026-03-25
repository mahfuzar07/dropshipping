import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PORTAL_ROUTES = ['admin', 'auth'];

export function middleware(req: NextRequest) {
	const url = req.nextUrl.clone();
	const host = req.headers.get('host') || '';
	const { pathname } = url;

	const isPortalHost = host.startsWith('portal.');
	const isPortalPath = pathname.startsWith('/portal');
	const isAuthPath = pathname.startsWith('/auth') || pathname.startsWith('/portal/auth');

	const hasAuth = req.cookies.get('accessToken') || req.cookies.get('session');

	// =========================
	// 1. Root handling on portal subdomain
	// =========================
	if (isPortalHost && pathname === '/') {
		url.pathname = hasAuth ? '/admin/dashboard' : '/auth/login';
		return NextResponse.redirect(url);
	}

	// =========================
	// 2. Auth protection on portal subdomain
	// =========================
	if (isPortalHost && !hasAuth && !isAuthPath) {
		url.pathname = '/auth/login';
		return NextResponse.redirect(url);
	}

	// =========================
	// 3. BLOCK /portal on NON-portal host
	// =========================
	if (isPortalPath && !isPortalHost) {
		url.pathname = '/'; // or custom 404
		return NextResponse.redirect(url);
	}

	// =========================
	// 4. Allow direct /portal ONLY on portal host
	// =========================
	if (isPortalPath && isPortalHost) {
		return NextResponse.next();
	}
	// =========================
	// 5. Clean URL → internal /portal rewrite
	// =========================
	if (isPortalHost) {
		const [first] = pathname.split('/').filter(Boolean);

		if (first && PORTAL_ROUTES.includes(first)) {
			url.pathname = `/portal${pathname}`;
			return NextResponse.rewrite(url);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next|favicon.ico|api).*)'],
};
