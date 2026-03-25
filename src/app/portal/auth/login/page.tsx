import PortalLoginForm from '@/components/pages/portal/auth/PortalLoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Portal Login',
};

export default function PortalLoginPage() {
	return (
		<div>
			<PortalLoginForm />
		</div>
	);
}
