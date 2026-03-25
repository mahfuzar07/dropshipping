import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
	if (req.nextUrl.pathname.startsWith('/admin')) {
		const url = req.nextUrl.clone();
		url.pathname = `/portal${req.nextUrl.pathname}`;

		return NextResponse.rewrite(url);
	}
}
