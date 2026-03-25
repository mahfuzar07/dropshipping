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
		list: '/users',
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
	workspace: {
		department: '/workspace/department',
		departmentDetail: (id: string | number) => `/workspace/department/${id}`,
		designation: '/workspace/designation',
		designationDetail: (id: string | number) => `/workspace/designation/${id}`,
		employee: '/employees/register',
		employeeDetail: (id: string | number) => `/workspace/employee/${id}`,
	},
	employee: {
		employeeUpsert: '/employees/register',
		getAllEmployees: '/employees',
		getAllEmployeesById: (id: string | number) => `/employees/${id}`,
		verifyEmployeeQRCode: (id: string | number) => `/employees/verify-employee-by-qr-code/${id}`,
	},
};
