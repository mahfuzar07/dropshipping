import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export function middleware(req: NextRequest) {
	const url = new URL(req.url);
	const pathname = url.pathname;
	const host = req.headers.get('host') || '';
	const isPortalDomain = host.startsWith('portal.');

	// Ignore Next.js internals
	if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/api')) {
		return NextResponse.next();
	}

	// Portal subdomain → only allow portal rolls
	const portalRolls = ['/portal/admin', '/portal/accounts', '/portal/deliveryman', '/portal/call-center', '/portal/auth'];
	const isPortalPath = portalRolls.some((roll) => pathname.startsWith(roll));

	if (isPortalDomain && !isPortalPath) {
		// redirect unknown paths to login
		return NextResponse.redirect(`http://${host}/portal/auth/login`);
	}

	// Public domain → block portal paths
	if (!isPortalDomain && isPortalPath) {
		return NextResponse.redirect(`http://${host}/`);
	}

	return NextResponse.next();
}
