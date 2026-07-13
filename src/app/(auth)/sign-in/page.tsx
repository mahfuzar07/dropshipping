import SignInPageContent from '@/components/pages/auth/sign-in/SignInPageContent';
import { Metadata } from 'next';
// Meta Data
export const metadata: Metadata = {
	title: 'Sign In',
};
export default function SignInPage() {
	return (
		<>
			<SignInPageContent />
		</>
	);
}
