import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { APIResponse, SettingsFormData } from '@/types/types';

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type StoreConfig = {
	storeName: string;
	storeLogo: string;
	storeIcon: string;
	contactPhone: string;
	contactEmail: string;
	address: string;
};

export type MetaConfig = {
	metaTitle: string;
	metaTagline: string;
	canonicalUrl: string;
	metaKeywords: string[];
	metaDescription: string;
};

export type GoogleMetaConfig = {
	googleAnalyticsId: string;
	googleAdsConversionId: string;
	facebookPixelId: string;
	metaPixelToken: string;
};

export type LocalizationConfig = {
	country: string;
	language: string;
	currency: string;
	theme: string;
};

export type SocialLinkConfig = {
	facebookUrl: string;
	instagramUrl: string;
	youtubeUrl: string;
	xUrl: string;
	whatsappNumber: string;
};

/* -------------------------------------------------------------------------- */
/*                               APP CONSTANTS                                */
/* -------------------------------------------------------------------------- */

export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

export const FULL_BASE_API_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}` : '';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
/* -------------------------------------------------------------------------- */
/*                               API FUNCTIONS                                */
/* -------------------------------------------------------------------------- */

// async function getSiteSettings(): Promise<APIResponse> {
// 	if (!FULL_BASE_API_URL) {
// 		throw new Error('NEXT_PUBLIC_API_URL is not defined');
// 	}

// 	const url = `${FULL_BASE_API_URL}${apiEndpoint.settings.siteSettings}`;

// 	console.log('[SiteSettings] Fetching:', url);

// 	const res = await fetch(url, {
// 		cache: 'no-store',
// 	});

// 	if (!res.ok) {
// 		const text = await res.text();
// 		console.error('[SiteSettings] API Error:', res.status, text);
// 		throw new Error('Failed to fetch site settings');
// 	}

// 	return res.json();
// }

/* -------------------------------------------------------------------------- */
/*                           PUBLIC LOADER FUNCTION                            */
/* -------------------------------------------------------------------------- */

// export async function loadSiteConfigs() {
// 	const data = await getSiteSettings();
// 	const settingsData = data?.payload ?? {};

// 	const storeConfig: StoreConfig = {
// 		storeName: settingsData?.storeName ?? '',
// 		storeLogo: settingsData?.storeLogo ?? '',
// 		storeIcon: settingsData?.storeIcon ?? '',
// 		contactPhone: settingsData?.contactPhone ?? '',
// 		contactEmail: settingsData?.contactEmail ?? '',
// 		address: settingsData?.address ?? '',
// 	};

// 	const metaConfig: MetaConfig = {
// 		metaTitle: settingsData?.metaTitle ?? '',
// 		metaTagline: settingsData?.metaTagline ?? '',
// 		canonicalUrl: settingsData?.canonicalUrl ?? '',
// 		metaKeywords: Array.isArray(settingsData?.metaKeywords) ? settingsData.metaKeywords : [],
// 		metaDescription: settingsData?.metaDescription ?? '',
// 	};

// 	const googleMetaConfig: GoogleMetaConfig = {
// 		googleAnalyticsId: settingsData?.googleAnalyticsId ?? '',
// 		googleAdsConversionId: settingsData?.googleAdsConversionId ?? '',
// 		facebookPixelId: settingsData?.facebookPixelId ?? '',
// 		metaPixelToken: settingsData?.metaPixelToken ?? '',
// 	};

// 	const localizationConfig: LocalizationConfig = {
// 		country: settingsData?.country ?? '',
// 		language: settingsData?.language ?? '',
// 		currency: settingsData?.currency ?? '',
// 		theme: settingsData?.theme ?? '',
// 	};

// 	const socialLinkConfig: SocialLinkConfig = {
// 		facebookUrl: settingsData?.facebookUrl ?? '',
// 		instagramUrl: settingsData?.instagramUrl ?? '',
// 		youtubeUrl: settingsData?.youtubeUrl ?? '',
// 		xUrl: settingsData?.xUrl ?? '',
// 		whatsappNumber: settingsData?.whatsappNumber ?? '',
// 	};

// 	return {
// 		storeConfig,
// 		metaConfig,
// 		googleMetaConfig,
// 		localizationConfig,
// 		socialLinkConfig,
// 		raw: settingsData,
// 	};
// }
