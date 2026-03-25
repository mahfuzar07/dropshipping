import { formatCurrency, CurrencyCode } from '@/lib/utils/formatCurrency';

type PriceProps = {
	amount: number;
	currency?: CurrencyCode;
	className?: string;
};

export function Price({ amount, currency = 'BDT', className }: PriceProps) {
	return <span className={`tabular-nums ${className ?? ''}`}>{formatCurrency(amount, currency)}</span>;
}
