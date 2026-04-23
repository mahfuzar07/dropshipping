import { api, authApi } from '@/lib/axiosInstance';
import { apiEndpoint } from '../constants/apiEndpoint';

export interface CommonResponse {
	status: boolean;
	message: string;
	[key: string]: any;
}

export interface SignupPayload {
	email: string;
	password: string;
	user_type: string;
	first_name: string;
	is_staff: boolean;
}

export interface SignupResponse {
	status: boolean;
	message: string;
	[key: string]: any;
}

export interface OTPVerifyPayload {
	otp_identifier: string; // email
	otp: string;
	otp_type: string; // 'registration' or 'password_reset'
}

export interface OTPVerifyResponse {
	status: boolean;
	message: string;
	[key: string]: any;
}

export interface PasswordResetPayload {
	reset_identifier: string;
	password: string;
	confirm_password: string;
}

export interface SendOTPPayload {
	otp_identifier: string;
}

export interface UserProfile {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	state?: string;
	postal_code?: string;
	country: string;
	dob?: string;
	gender?: string;
}

export interface ChangePasswordPayload {
	old_password: number;
	new_password: string;
	confrim_password: string;
}

export interface DeliveryAddress {
	full_name: number;
	province: string;
	city: string;
	zone: string;
	address: string;
	address_type: string;
}

/**
 * Register a new user account
 */

export const signupUser = async (payload: SignupPayload): Promise<SignupResponse> => {
	try {
		const response = await api.post(apiEndpoint.users.SIGN_UP(), payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

/**
 * Verify OTP for user registration
 */
export const verifyOTP = async (payload: OTPVerifyPayload): Promise<OTPVerifyResponse> => {
	try {
		const response = await api.post(apiEndpoint.users.OTP_verify(), payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const sendOTP = async (payload: SendOTPPayload): Promise<CommonResponse> => {
	try {
		const response = await api.post(apiEndpoint.users.OTP_SEND(), payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const passwordReset = async (payload: PasswordResetPayload): Promise<CommonResponse> => {
	try {
		const response = await api.post(apiEndpoint.users.PASSWORD_RESET(), payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const updateProfile = async (payload: Omit<UserProfile, 'id'>): Promise<CommonResponse> => {
	try {
		const response = await authApi.put(apiEndpoint.users.PROFILE(), payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getProfile = async (): Promise<UserProfile> => {
	try {
		const response = await authApi.get(apiEndpoint.users.PROFILE());
		return response.data;
	} catch (error) {
		throw error;
	}
};
