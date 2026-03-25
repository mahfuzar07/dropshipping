import ProductsTable from '@/components/pages/admin/products/ProductsTable';
import { Metadata } from 'next';

// Meta Data
export const metadata: Metadata = {
	title: 'Products - Admin Dashboard',
	description: 'Manage product categories',
};

export type Product = {
	title: string;
	category?: string;
	price?: string;
	discount?: number;
	stock: string;
	status: 'Draft' | 'Inactive' | 'Active' | 'Out Of Stock';
};

export default function ProductsPage() {
	const ordersData: Product[] = [
		{
			title: 'Black T-shirt',
			category: 'Category',
			price: '$145',
			discount: 10,
			stock: 'Normal',

			status: 'Active',
		},
		{
			title: 'Black T-shirt',
			category: 'Category',
			price: '$145',
			discount: 15,
			stock: 'Normal',

			status: 'Active',
		},
		{
			title: 'lorem text',
			category: 'Category',
			price: '$145',
			stock: 'Normal',
			discount: 15,
			status: 'Active',
		},
	];
	return (
		<>
			<ProductsTable data={ordersData} />
		</>
	);
}
