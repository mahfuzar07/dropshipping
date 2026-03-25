import PortfolioContent from '@/components/pages/portfolio/PortfolioContent';
import { Metadata } from 'next';

// Meta Data
export const metadata: Metadata = {
	title: 'Portfolio',
};

export default function PortfolioPage() {
	return (
		<>
			<PortfolioContent />
		</>
	);
}
