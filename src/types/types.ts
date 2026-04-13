export interface SettingsFormData {
	// Basic Info
	storeName?: string;
	storeLogo?: string;
	storeIcon?: string;
	storeLogoFile?: File | null;
	storeIconFile?: File | null;
	removeStoreLogo?: boolean;
	removeStoreIcon?: boolean;
	contactPhone?: string;
	contactEmail?: string;
	address?: string;

	// Meta / SEO
	metaTitle?: string;
	metaTagline?: string;
	canonicalUrl?: string;
	metaKeywords?: string[];
	metaDescription?: string;

	// Social Links
	facebookUrl?: string;
	instagramUrl?: string;
	youtubeUrl?: string;
	xUrl?: string;
	whatsappNumber?: string;

	// Tracking / Ads
	googleAnalyticsId?: string;
	googleAdsConversionId?: string;
	facebookPixelId?: string;
	metaPixelToken?: string;

	// Localization
	country: string;
	language: string;
	currency: string;
	theme: string;
}
export interface CategoryFormData {
	name: string;
	icon: string;
	banner?: string;
	iconFile: File | null;
	bannerFile?: File | null;
	removeIcon: boolean;
	removeBanner?: boolean;

	parent: null;
	status: 'ACTIVE';
	scope: 'PRODUCT';
}

export interface OptionsSettings {
	value: string;
	label: string;
}

export interface APIResponse {
	payload: any;
	status: string;
	message: string;
	results?: [];
}

export type CustomerProfile = {
	id: string;
	userId: string;
	name: string;
	avatar: string | null;
};

export type Customers = {
	name: string;
	email: string;
	phone: string;
	orders: string;
	address: string;
	total: string;
	status: 'Active' | 'Blocked';
	customer: CustomerProfile;
};

export type RoleType = 'SUPER_ADMIN' | 'HR_ADMIN' | 'DEPARTMENT_LEAD' | 'ACCOUNTS' | 'CALL_CENTER' | 'PACKER' | 'DELIVERY' | 'STAFF';

export type Employee = {
	id: string;

	officialEmail: string;
	officialPhone: string;

	fullName: string;
	avatar?: string | null;

	role: RoleType;
	status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'RESIGNED';
	gender: 'MALE' | 'FEMALE' | 'OTHER';

	dateOfBirth: string;
	joiningDate: string;
	lastWorkingDay?: string | null;

	experience?: number | null;
	bio?: string | null;

	alternativePhone?: string | null;
	alternativeEmail?: string | null;
	address?: string | null;
	emergencyContact?: string | null;

	employeeIDCard: string;

	departmentId: string;
	designationId: string;

	department?: {
		id: string;
		name: string;
		code?: string;
	};

	designation?: {
		id: string;
		title: string;
	};

	createdAt: string;
	updatedAt: string;
};
