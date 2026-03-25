// app/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Play, Hanken_Grotesk, Emilys_Candy } from 'next/font/google';

import '@/styles/globals.css';

import ReactQueryProvider from '@/providers/ReactQueryProvider';
import DrawerWrapper from '@/components/common/drawer/DrawerWrapper';
import ModalWrapper from '@/components/common/modal/ModalWrapper';
import { Toaster } from '@/components/ui/sonner';
import { GoogleAnalytics } from '@next/third-parties/google';

import { scripts } from '@/lib/script/Script';
import ClientAuthHydrator from '@/providers/ClientAuthHydrator';

// import { loadSiteConfigs } from '@/config/config';
import getFullImageUrl from '@/lib/utils/getFullImageUrl';

/* -------------------------------------------------------------------------- */
/*                                   FONTS                                    */
/* -------------------------------------------------------------------------- */

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const play = Play({
	variable: '--font-play',
	weight: ['400', '700'],
	subsets: ['latin'],
});

const hanken = Hanken_Grotesk({
	variable: '--font-hanken',
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const emily = Emilys_Candy({
	variable: '--font-emily',
	weight: '400',
	subsets: ['latin'],
	display: 'swap',
});

/* -------------------------------------------------------------------------- */
/*                              DYNAMIC METADATA                              */
/* -------------------------------------------------------------------------- */

// export async function generateMetadata(): Promise<Metadata> {
// 	try {
// 		const { metaConfig, storeConfig } = await loadSiteConfigs();

// 		return {
// 			title: {
// 				default: `${metaConfig.metaTitle || 'Twinkle Bud'} | ${metaConfig.metaTagline || 'Screen-Safe Learning & Creative Fun for Kids'}`,
// 				template: `%s | ${metaConfig.metaTitle || 'Twinkle Bud'}`,
// 			},
// 			description: metaConfig.metaDescription || '',
// 			keywords: metaConfig.metaKeywords || [],
// 			alternates: {
// 				canonical: metaConfig.canonicalUrl || undefined,
// 			},
// 			icons: storeConfig.storeIcon
// 				? { icon: [{ url: getFullImageUrl(storeConfig.storeIcon) }] }
// 				: undefined,
// 		};
// 	} catch (err) {
// 		console.error('[Metadata] loadSiteConfigs failed:', err);

// 		return {
// 			title: 'Twinkle Bud',
// 			description: '',
// 		};
// 	}
// }

/* -------------------------------------------------------------------------- */
/*                                 ROOT LAYOUT                                */
/* -------------------------------------------------------------------------- */

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	// const { googleMetaConfig } = await loadSiteConfigs();

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{scripts.map((fn, i) => (
					<script
						key={i}
						dangerouslySetInnerHTML={{
							__html: `(${fn.toString()})();`,
						}}
					/>
				))}
			</head>

			<body cz-shortcut-listen="true" className={`${play.variable} ${emily.variable} ${hanken.variable} antialiased`}>
				<ClientAuthHydrator />

				<ReactQueryProvider>
					{children}
					<DrawerWrapper />
					<ModalWrapper />
					<Toaster position="top-center" theme="light" className="bg-white" />
				</ReactQueryProvider>

				{/* {googleMetaConfig.googleAnalyticsId && <GoogleAnalytics gaId={googleMetaConfig.googleAnalyticsId} />} */}
			</body>
		</html>
	);
}
