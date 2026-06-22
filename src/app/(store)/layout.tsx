import Footer from '@/components/common/footer/Footer';
import Header from '@/components/common/header/Header';
import FooterNavigation from '@/components/common/navigations/FooterNavigation';

export default function HomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			<main className="bg-gray-100 ">{children}</main>
			<Footer />
			<FooterNavigation />
		</>
	);
}
