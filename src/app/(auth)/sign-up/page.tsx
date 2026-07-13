import SignUpPageContent from '@/components/pages/auth/sign-up/SignUpPageContent';
import { Metadata } from 'next';
// Meta Data
export const metadata: Metadata = {
	title: 'Sign Up',
};
export default function SignUpPage() {
	return (
		<>
			<SignUpPageContent />
		</>
	);
}
