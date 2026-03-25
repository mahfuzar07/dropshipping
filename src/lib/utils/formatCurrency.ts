// money.ts
import { loadSiteConfigs } from '@/config/config';

/* -------------------------------------------------------------------------- */
/*                                TYPES & META                                */
/* -------------------------------------------------------------------------- */

export type CurrencyCode = 'BDT' | 'USD' | 'EUR';

const currencyMeta: Record<CurrencyCode, { symbol: string; locale: string }> = {
	BDT: { symbol: '৳', locale: 'en-BD' },
	USD: { symbol: '$', locale: 'en-US' },
	EUR: { symbol: '€', locale: 'de-DE' },
};

// FX rates
const fxRates: Record<CurrencyCode, number> = {
	BDT: 1,
	USD: 1 / 110,
	EUR: 1 / 120,
};

/* -------------------------------------------------------------------------- */
/*                               CURRENCY STATE                                */
/* -------------------------------------------------------------------------- */

let currentCurrency: CurrencyCode = 'BDT';

/**
 * Initialize currency from site config (call once on app start)
 */
export async function initCurrency() {
	try {
		const { localizationConfig } = await loadSiteConfigs();
		const code = localizationConfig?.currency as CurrencyCode;
		if (code && currencyMeta[code]) {
			currentCurrency = code;
		}
	} catch (err) {
		console.warn('Currency Failed to load site config, defaulting to BDT', err);
	}
}

/**
 * Get current currency code
 */
export function getCurrencyCode(): CurrencyCode {
	return currentCurrency;
}

/**
 * Get current currency symbol
 */
export function getCurrencySymbol(): string {
	return currencyMeta[currentCurrency].symbol;
}

/* -------------------------------------------------------------------------- */
/*                           CONVERSION & FORMATTING                           */
/* -------------------------------------------------------------------------- */

/**
 * Convert amount from BDT to target currency
 */
export function convertFromBDT(amountInTaka: number, currency: CurrencyCode = currentCurrency): number {
	const rate = fxRates[currency] ?? 1;
	return parseFloat((amountInTaka * rate).toFixed(2));
}

/**
 * Format amount with **symbol always first**
 */

export function formatCurrencyAmount(amountInTaka: number, currency: CurrencyCode = currentCurrency): string {
	const value = convertFromBDT(amountInTaka, currency);
	const { locale } = currencyMeta[currency];

	// format number only (thousands, decimals) according to locale
	const formattedNumber = new Intl.NumberFormat(locale, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);

	return `${formattedNumber}`;
}

export function formatCurrency(amountInTaka: number, currency: CurrencyCode = currentCurrency): string {
	const value = convertFromBDT(amountInTaka, currency);
	const { locale, symbol } = currencyMeta[currency];

	// format number only (thousands, decimals) according to locale
	const formattedNumber = new Intl.NumberFormat(locale, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);

	// prepend symbol first
	return `${symbol} ${formattedNumber}`;
}
