import { api } from '@/lib/axiosInstance';

import type { ProductDetails } from '@/components/pages/product-details/ProductDetailsPageContent';
import { apiEndpoint } from '../constants/apiEndpoint';

export const getProductDetails = async (productId: number): Promise<ProductDetails | null> => {
	try {
		const url = apiEndpoint.products.productsDetails.replace('{id}', String(productId));
		const response = await api.get(url);
		return response.data;
	} catch (error) {
		console.error('getProductDetails failed:', error);
		return null;
	}
};
