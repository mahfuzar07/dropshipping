import { profile } from 'node:console';

export const apiEndpoint = {
	auth: {
		customer: {
			register: '/auth/customer/request-otp',
			verifyOtp: '/auth/customer/verify-otp',
			signIn: '/auth/customer/login',
			resendOtp: '/auth/resend-otp',
		},

		verifyMe: '/auth/verify-me',
		signOut: '/auth/logout',
		refreshToken: '/auth/refresh-token',
	},
	settings: {
		siteSettings: '/settings/site-settings',
	},
	users: {
		SIGN_UP: () => `/api/user/signup/`,
		SIGN_IN: () => `/api/user/login/`,
		OTP_verify: () => `api/user/otp-verified/`,
		OTP_SEND: () => `api/user/send-otp/`,
		PASSWORD_RESET: () => `api/user/reset-password/`,
		PROFILE: () => '/api/user/profile/',
		CHANGE_PASSWORD: () => '/api/user/change-password/',
		DELIVERY_ADDRESS: '/api/user/delivery-addresses',
		DELIVERY_ADDRESS_SET_DEFAULT: (id: string | number) => `/api/user/delivery-addresses/${id}/set_default/`,
		detail: (id: string | number) => `/users/${id}`,
		changePassword: (id: string | number) => `/users/${id}/change-password`,
		update: (id: string | number) => `/users/${id}`,
		remove: (id: string | number) => `/users/${id}`,
		create: '/users',
	},
	coupons: {
		COUPONS: () => `/api/order/coupons/`,
		COUPON_DETAIL: (id: string | number) => `/api/order/coupons/${id}/`,
	},
	customers: {
		LIST: () => `/api/user/users/`,
		DETAIL: (id: string | number) => `/api/user/users/${id}/`,
	},
	orders: {
		ORDERS: () => `/api/order/orders/`,
		ORDERS_CREATE: () => `/api/order/orders/`,
		ORDERS_DETAILS: (id: string | number) => `/api/order/orders/${id}/`,
		SHIPMENT_METHODS: () => `/api/order/shipment-method/`,
		SHIPMENT_TRACKING: () => `/api/order/shipments/track/`,
	},
	categories: {
		category: '/api/products/categories',

		detail: (id: string | number) => `/api/products/categories/${id}`,
		delete: (id: string | number) => `/api/products/categories/${id}`,
	},
	products: {
		publicProducts: '/api/products/product-from-1688',
		imageSearch: '/api/products/item-search-img',
		productsDetails: '/api/products/product-from-1688/{id}',
		TOP_PRODUCTS: (QUERY: any) => `/api/products/product-from-1688/?${QUERY}`,
		// PRODUCTS_FILTER: (QUERY: any) => `/api/products/product-from-1688/?${QUERY}`,
		LATEST_PRODUCTS: () => `/api/products/product-from-1688/?page=1&limit=12`,
		NEW_LAUNCH_PRODUCTS: '/api/products/product-from-1688/?page=1&limit=12',
		GIFT_DEEAS_PRODUCTS: () => `/api/products/product-from-1688/?page=1&limit=2`,
		CATEGORIES: () => `/api/products/categories/`,
		DETAILS: (id: string | number) => `/api/products/product-from-1688/${id}/`,
		SEARCH_PRODUCTS: (key: string) => `/api/products/product-from-1688?search=${key}&page=1&limit=12`,
		list: '/products',
		detail: (id: string | number) => `/products/${id}`,
	},
	cart: {
		ADD_TO_CART: () => '/api/cart/',
		GET_CART: () => '/api/cart/',
		REMOVE_FROM_CART: (id: string | number) => `/api/cart/${id}/`,
		UPDATE_CART: (id: string | number) => `/api/cart/${id}/`,
	},
};
