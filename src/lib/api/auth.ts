import { api } from '@/lib/axiosInstance';

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

/**
 * Register a new user account
 */

export const signupUser = async (payload: SignupPayload): Promise<SignupResponse> => {
	try {
		const response = await api.post('api/user/signup/', payload);
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
		const response = await api.post('api/user/otp-verified/', payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const sendOTP = async (payload: SendOTPPayload): Promise<SignupResponse> => {
	try {
		const response = await api.post('api/user/send-otp/', payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const passwordReset = async (payload: PasswordResetPayload): Promise<SignupResponse> => {
	try {
		const response = await api.post('api/user/reset-password/', payload);
		return response.data;
	} catch (error) {
		throw error;
	}
};

const authApi = {
	signupUser,
	verifyOTP,
	passwordReset,
};

export default authApi;
