import SettingsForm from '@/components/pages/admin/general-settings/SettingsForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Settings - Admin Dashboard',
};

export default function SettingCreatePage() {
	return (
		<div className="">
			<SettingsForm />
		</div>
	);
}
