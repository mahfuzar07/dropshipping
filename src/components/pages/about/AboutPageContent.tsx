import { Globe2, ShieldCheck, Truck, Users, Sparkles } from 'lucide-react';

const values = [
	{
		icon: Globe2,
		title: 'সরাসরি সোর্সিং',
		desc: 'মধ্যস্বত্বভোগী ছাড়া চীনের যাচাইকৃত সাপ্লায়ার থেকে সরাসরি পণ্য সংগ্রহ করি, যাতে আপনি ন্যায্য মূল্যে প্রকৃত পণ্য পান।',
	},
	{
		icon: ShieldCheck,
		title: 'নির্ভরযোগ্যতা',
		desc: 'প্রতিটি সাপ্লায়ার যাচাই করে নেওয়া হয় এবং প্রতিটি অর্ডার ট্র্যাকিং আইডির মাধ্যমে সম্পূর্ণ স্বচ্ছভাবে পরিচালিত হয়।',
	},
	{
		icon: Truck,
		title: 'নিরবচ্ছিন্ন শিপিং',
		desc: 'চীন থেকে বাংলাদেশ পর্যন্ত সম্পূর্ণ শিপিং, কাস্টমস ক্লিয়ারেন্স ও লাস্ট-মাইল ডেলিভারি আমরাই সমন্বয় করি।',
	},
	{
		icon: Users,
		title: 'গ্রাহকের পাশে',
		desc: '২৪/৭ কাস্টমার সাপোর্ট টিম আপনার প্রতিটি প্রশ্ন ও সমস্যার সমাধানে সবসময় প্রস্তুত।',
	},
];

const stats = [
	{ value: '৮+', label: 'বিভাগীয় শহর কভারেজ' },
	{ value: '১০,০০০+', label: 'সফলভাবে ডেলিভারিকৃত অর্ডার' },
	{ value: '২৪/৭', label: 'কাস্টমার সাপোর্ট' },
];

export default function AboutPageContent() {
	return (
		<main className="bg-white">
			{/* Hero */}
			<section className="bg-gradient-to-b from-amber-50/70 to-white border-b border-gray-100">
				<div className="container mx-auto px-4 md:px-6 py-16 text-center">
					<span className="inline-block px-3 py-1 mb-4 text-[12px] font-semibold tracking-wide text-amber-600 bg-amber-50 border border-amber-100 rounded-full">
						চীন এখন আপনার হাতের মুঠোয়
					</span>
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900">Xianmart সম্পর্কে</h1>
					<p className="max-w-2xl mx-auto mt-4 text-[15px] leading-7 text-gray-500">
						আমরা চীনের বিশাল পণ্য-বাজারকে বাংলাদেশের প্রতিটি ক্রেতার হাতের কাছে নিয়ে এসেছি — সহজ, নিরাপদ এবং স্বচ্ছভাবে।
					</p>
				</div>
			</section>

			{/* Story */}
			<section className="container mx-auto px-4 md:px-6 py-16">
				<div className="space-y-5 text-sm leading-7 text-gray-600">
					<h2 className="text-xl font-bold text-gray-900 mb-2">আমাদের গল্প</h2>
					<p>
						চীন থেকে পছন্দের পণ্য আনতে গিয়ে ভাষার জটিলতা, অবিশ্বস্ত মধ্যস্বত্বভোগী এবং অনিশ্চিত শিপিং সময়ের কারণে অনেক গ্রাহককেই হয়রানির মুখে পড়তে
						হয় — এই সমস্যা সমাধানের লক্ষ্য নিয়েই Xianmart-এর যাত্রা শুরু।
					</p>
					<p>
						আমরা একটি সম্পূর্ণ dropshipping মডেলে কাজ করি — অর্থাৎ পণ্য মজুদ না রেখে, প্রতিটি অর্ডার সরাসরি চীনের যাচাইকৃত সাপ্লায়ারের কাছে পাঠিয়ে,
						সেখান থেকে পণ্য সংগ্রহ করে বাংলাদেশে আপনার ঠিকানায় পৌঁছে দিই। এতে করে আপনি ফ্যাশন, ইলেকট্রনিক্স, হোম ও লাইফস্টাইল — বিভিন্ন ক্যাটাগরির
						হাজারো পণ্যের মধ্যে থেকে বেছে নেওয়ার সুযোগ পান, যা আগে সহজে সম্ভব ছিল না।
					</p>
					<p>
						আমাদের লক্ষ্য শুধু পণ্য পৌঁছে দেওয়া নয় — বরং প্রতিটি ধাপে (অর্ডার, পেমেন্ট, শিপিং, কাস্টমস, ডেলিভারি) সম্পূর্ণ স্বচ্ছতা ও নির্ভরযোগ্যতা
						নিশ্চিত করা।
					</p>
				</div>
			</section>

			{/* Stats */}
			<section className="border-y border-gray-100 bg-gray-50/50">
				<div className="container mx-auto px-4 md:px-6 py-12">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
						{stats.map((stat, i) => (
							<div key={i}>
								<p className="text-3xl font-bold text-amber-600">{stat.value}</p>
								<p className="mt-1 text-[13px] text-gray-500">{stat.label}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Values */}
			<section className="container mx-auto px-4 md:px-6 py-16">
				<div className="text-center max-w-xl mx-auto mb-12">
					<h2 className="text-xl font-bold text-gray-900 mb-2">আমরা যা বিশ্বাস করি</h2>
					<p className="text-[14px] text-gray-500">প্রতিটি সিদ্ধান্তের মূলে থাকে এই চারটি নীতি</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{values.map((item, i) => {
						const Icon = item.icon;
						return (
							<div key={i} className="p-6 border border-gray-100 rounded-xl hover:border-amber-100 hover:shadow-sm transition-all">
								<div className="flex items-center justify-center w-10 h-10 mb-4 rounded-lg bg-amber-50 text-amber-600">
									<Icon size={18} strokeWidth={2.25} />
								</div>
								<h3 className="text-[14px] font-semibold text-gray-900 mb-1.5">{item.title}</h3>
								<p className="text-[13px] leading-6 text-gray-500">{item.desc}</p>
							</div>
						);
					})}
				</div>
			</section>

			{/* Vision / CTA */}
			<section className="bg-amber-50/60 border-t border-amber-100">
				<div className="container mx-auto px-4 md:px-6 py-14 text-center">
					<Sparkles size={22} className="mx-auto mb-4 text-amber-600" />
					<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">আমাদের ভবিষ্যৎ পরিকল্পনা</h2>
					<p className="max-w-xl mx-auto text-[14px] leading-7 text-gray-600 mb-8">
						আমরা ধীরে ধীরে আমাদের সোর্সিং নেটওয়ার্ক বিস্তৃত করে বাংলাদেশের ছোট ব্যবসায়ী ও উদ্যোক্তাদের জন্য পাইকারি (wholesale) সোর্সিং সুবিধাও চালু
						করার পরিকল্পনা করছি, যাতে যে কেউ সহজেই চীন থেকে ব্যবসায়িক পণ্য আমদানি করতে পারেন।
					</p>
					<a
						href="/contact"
						className="inline-flex items-center px-6 py-3 text-[14px] font-semibold text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
					>
						আমাদের সাথে যোগাযোগ করুন
					</a>
				</div>
			</section>
		</main>
	);
}
