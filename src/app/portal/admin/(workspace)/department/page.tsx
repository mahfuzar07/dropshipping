import CategoryList from '@/components/pages/admin/category/CategoryList';
import DashboardPageContent from '@/components/pages/admin/dashboard/DashboardPageContent';
import DepartmentDesignationPanel from '@/components/pages/admin/workspace/department/DepartmentDesignationPanel';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

// Meta Data
export const metadata: Metadata = {
	title: 'Department - Admin Dashboard',
	description: 'Manage departments and designations',
};

export default function CategoryPage() {
	return (
		<div className="">
			<DepartmentDesignationPanel />
		</div>
	);
}
