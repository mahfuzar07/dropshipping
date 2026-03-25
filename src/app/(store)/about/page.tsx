import AboutPageContent from '@/components/pages/about/AboutPageContent';
import { Metadata } from 'next';

// Meta Data
export const metadata: Metadata= {
	title: 'About Us',
};
export default function AboutPage() {
	return (
		<>
			<AboutPageContent />
		</>
	);
}
