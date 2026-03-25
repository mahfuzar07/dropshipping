// 01 January 2026
export const formatDate = (date?: string | Date) => {
	if (!date) return '-';

	return new Date(date).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
};

// 01 Jan 2026
export const formatShortDate = (date?: string | Date) => {
	if (!date) return '-';

	return new Date(date).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
};

// 01/01/2026
export const formatNumericDate = (date?: string | Date) => {
	if (!date) return '-';

	return new Date(date).toLocaleDateString('en-GB');
};

// January 2026
export const formatMonthYear = (date?: string | Date) => {
	if (!date) return '-';

	return new Date(date).toLocaleDateString('en-GB', {
		month: 'long',
		year: 'numeric',
	});
};

// Jan 1
export const formatMonthDay = (date?: string | Date) => {
	if (!date) return '-';

	return new Date(date).toLocaleDateString('en-GB', {
		month: 'short',
		day: 'numeric',
	});
};

// 1 January 2026, 10:30 AM
export const formatDateTime = (date?: string | Date) => {
	if (!date) return '-';

	return new Date(date).toLocaleString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

// 10:30 AM
export const formatTime = (date?: string | Date) => {
	if (!date) return '-';

	return new Date(date).toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
	});
};

// 2026
export const formatYear = (date?: string | Date) => {
	if (!date) return '-';

	return new Date(date).getFullYear();
};
