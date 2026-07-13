import ProductsListPageContent from '@/components/pages/product/ProductsListPageContent';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Product List',
	};
}

export default function HomePage() {
	return (
		<>
			<ProductsListPageContent />
		</>
	);
}
