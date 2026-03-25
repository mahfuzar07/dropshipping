// import Footer from '@/components/common/footer/Footer';
import StoreHeader from '@/components/common/header/StoreHeader';
import FooterNavigation from '@/components/common/navigations/FooterNavigation';

export default function HomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<StoreHeader />
			<main className="">{children}</main>
			{/* <Footer/> */}
			<FooterNavigation/>
		</>
	);
}
