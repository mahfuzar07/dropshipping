import { api, authApi } from '@/lib/axiosInstance';
import { apiEndpoint } from '../constants/apiEndpoint';

export interface CommonResponse {
	status: boolean;
	message: string;
	[key: string]: any;
}

export interface addToCardPayload {
	product_id: string;
	quantity: object;
	variant: object;
}

/**
 * Register a new user account
 */

export const addToCard = async (payload: addToCardPayload): Promise<CommonResponse> => {
	try {
		const response = await authApi.post(apiEndpoint.cart.ADD_TO_CART(), payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getCartData = async (): Promise<CommonResponse> => {
	try {
		const response = await authApi.get(apiEndpoint.cart.GET_CART());
		return response.data;
	} catch (error) {
		throw error;
	}
};

// const authApi = {
// 	signupUser,
// 	verifyOTP,
// 	passwordReset,
// };

// export default authApi;
