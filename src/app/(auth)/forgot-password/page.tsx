import ForgotPasswordPageContent from '@/components/pages/auth/forgot-password/ForgotPasswordPageContent';
import { Metadata } from 'next';
// Meta Data
export const metadata: Metadata = {
	title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
	return (
		<>
			<ForgotPasswordPageContent />
		</>
	);
}
