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

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
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

export async function loadSiteConfigs() {
	// const data = await getSiteSettings();
	// const settingsData = data?.payload ?? {};

	const storeConfig: StoreConfig = {
		storeName: '',
		storeLogo: '',
		storeIcon: '',
		contactPhone: '',
		contactEmail: '',
		address: '',
	};

	const metaConfig: MetaConfig = {
		metaTitle: 'Xianmart',
		metaTagline: 'Buy Products from China with Fast Delivery in Bangladesh',
		canonicalUrl: 'https://xianmart.com',
		metaKeywords: [
			'Xianmart',
			'China to Bangladesh',
			'China shopping',
			'Dropshipping Bangladesh',
			'Chinese products',
			'Import from China',
			'Online shopping Bangladesh',
			'Affordable products',
			'Fashion',
			'Electronics',
			'Home appliances',
			'Kitchen accessories',
			'Beauty products',
			'Mobile accessories',
			'Wholesale China',
			'Retail Bangladesh',
			'Ecommerce Bangladesh',
			'Chinese gadgets',
			'Fast delivery',
			'Secure online shopping',
			'Bangladesh online store',
		],
		metaDescription:
			'xianmart is a trusted China to Bangladesh online shopping and dropshipping platform. Shop quality products directly sourced from China with affordable prices, secure payments, and fast nationwide delivery.',
	};

	const googleMetaConfig: GoogleMetaConfig = {
		googleAnalyticsId: '',
		googleAdsConversionId: '',
		facebookPixelId: '',
		metaPixelToken: '',
	};

	const localizationConfig: LocalizationConfig = {
		country: '',
		language: '',
		currency: '',
		theme: '',
	};

	const socialLinkConfig: SocialLinkConfig = {
		facebookUrl: '',
		instagramUrl: '',
		youtubeUrl: '',
		xUrl: '',
		whatsappNumber: '',
	};

	return {
		storeConfig,
		metaConfig,
		googleMetaConfig,
		localizationConfig,
		socialLinkConfig,
		// raw: settingsData,
	};
}
