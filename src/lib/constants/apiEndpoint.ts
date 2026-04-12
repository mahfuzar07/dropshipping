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
		DELIVERY_ADDRESS: () => '/api/user/delivery-addresses/',
		detail: (id: string | number) => `/users/${id}`,
		changePassword: (id: string | number) => `/users/${id}/change-password`,
		update: (id: string | number) => `/users/${id}`,
		remove: (id: string | number) => `/users/${id}`,
		create: '/users',
	},
	categories: {
		category: '/category',
		tree: '/category',
		detail: (id: string | number) => `/category/${id}`,
		delete: (id: string | number) => `/category/${id}`,
	},
	products: {
		list: '/products',
		detail: (id: string | number) => `/products/${id}`,
	},
};
