import CategoryList from '@/components/pages/admin/category/CategoryList';
import DashboardPageContent from '@/components/pages/admin/dashboard/DashboardPageContent';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

// Meta Data
export const metadata: Metadata = {
	title: 'Categories - Admin Dashboard',
	description: 'Manage product categories',
};

export default function CategoryPage() {
	return (
		<div className="">
			<CategoryList />
		</div>
	);
}
