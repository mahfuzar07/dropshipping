import { Phone, Mail, MessageCircle, MapPin, Clock, Send } from 'lucide-react';

const contactMethods = [
	{
		icon: Phone,
		title: 'হটলাইন',
		value: '+880 9638 001086',
		href: 'tel:+8809638001086',
		note: 'প্রতিদিন সকাল ৯টা - রাত ১১টা',
	},
	{
		icon: MessageCircle,
		title: 'হোয়াটসঅ্যাপ',
		value: '+880 1234 567890',
		href: 'https://wa.me/8801234567890',
		note: 'দ্রুততম রেসপন্স',
	},
	{
		icon: Mail,
		title: 'ইমেইল',
		value: 'support@xianmart.com.bd',
		href: 'mailto:support@xianmart.com.bd',
		note: '২৪ ঘণ্টার মধ্যে উত্তর',
	},
	{
		icon: MapPin,
		title: 'অফিস',
		value: 'ঢাকা, বাংলাদেশ',
		href: undefined,
		note: 'শুধুমাত্র অ্যাপয়েন্টমেন্টের ভিত্তিতে',
	},
];

const subjects = ['অর্ডার সংক্রান্ত জিজ্ঞাসা', 'শিপিং ও ডেলিভারি', 'রিফান্ড / রিটার্ন', 'পেমেন্ট সমস্যা', 'পণ্য সংক্রান্ত প্রশ্ন', 'অন্যান্য'];

export default function ContactPageContent() {
	return (
		<main className="bg-white">
			{/* Header */}
			<section className="bg-gradient-to-b from-amber-50/70 to-white border-b border-gray-100">
				<div className="container mx-auto px-4 md:px-6 py-14 text-center">
					<span className="inline-block px-3 py-1 mb-4 text-[12px] font-semibold tracking-wide text-amber-600 bg-amber-50 border border-amber-100 rounded-full">
						আমরা আপনার পাশে আছি
					</span>
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900">যোগাযোগ করুন</h1>
					<p className="max-w-xl mx-auto mt-3 text-[14px] text-gray-500">
						চীন থেকে পণ্য আনা, শিপিং ট্র্যাকিং কিংবা যেকোনো প্রয়োজনে — Xianmart টিম সবসময় আপনার প্রশ্নের উত্তর দিতে প্রস্তুত।
					</p>
				</div>
			</section>

			<div className="container mx-auto px-4 md:px-6 py-14">
				{/* Contact method cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
					{contactMethods.map((item, i) => {
						const Icon = item.icon;
						const Wrapper = item.href ? 'a' : 'div';
						return (
							<Wrapper
								key={i}
								{...(item.href ? { href: item.href } : {})}
								className="flex flex-col items-start p-5 border border-gray-100 rounded-xl hover:shadow-sm hover:border-amber-100 transition-all"
							>
								<div className="flex items-center justify-center w-10 h-10 mb-4 rounded-lg bg-amber-50 text-amber-600">
									<Icon size={18} strokeWidth={2.25} />
								</div>
								<p className="text-[13px] text-gray-500 mb-1">{item.title}</p>
								<p className="text-[15px] font-semibold text-gray-900 mb-1">{item.value}</p>
								<p className="text-[12px] text-gray-400">{item.note}</p>
							</Wrapper>
						);
					})}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
					{/* Form */}
					<div className="lg:col-span-3">
						<h2 className="text-xl font-bold text-gray-900 mb-1">মেসেজ পাঠান</h2>
						<p className="text-[13px] text-gray-500 mb-6">নিচের ফর্মটি পূরণ করুন, আমরা যত দ্রুত সম্ভব যোগাযোগ করব।</p>

						<form className="space-y-5">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
								<div>
									<label htmlFor="name" className="block text-[13px] font-medium text-gray-700 mb-1.5">
										আপনার নাম
									</label>
									<input
										id="name"
										name="name"
										type="text"
										required
										placeholder="যেমন: রাহিম উদ্দিন"
										className="w-full px-3.5 py-2.5 text-[14px] border border-gray-200 rounded-lg outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
									/>
								</div>
								<div>
									<label htmlFor="phone" className="block text-[13px] font-medium text-gray-700 mb-1.5">
										ফোন নম্বর
									</label>
									<input
										id="phone"
										name="phone"
										type="tel"
										required
										placeholder="01XXXXXXXXX"
										className="w-full px-3.5 py-2.5 text-[14px] border border-gray-200 rounded-lg outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
									/>
								</div>
							</div>

							<div>
								<label htmlFor="email" className="block text-[13px] font-medium text-gray-700 mb-1.5">
									ইমেইল
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									placeholder="you@example.com"
									className="w-full px-3.5 py-2.5 text-[14px] border border-gray-200 rounded-lg outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
								/>
							</div>

							<div>
								<label htmlFor="order-id" className="block text-[13px] font-medium text-gray-700 mb-1.5">
									অর্ডার আইডি <span className="text-gray-400 font-normal">(যদি থাকে)</span>
								</label>
								<input
									id="order-id"
									name="orderId"
									type="text"
									placeholder="যেমন: XM-2026-00123"
									className="w-full px-3.5 py-2.5 text-[14px] border border-gray-200 rounded-lg outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
								/>
							</div>

							<div>
								<label htmlFor="subject" className="block text-[13px] font-medium text-gray-700 mb-1.5">
									বিষয়
								</label>
								<select
									id="subject"
									name="subject"
									defaultValue=""
									required
									className="w-full px-3.5 py-2.5 text-[14px] border border-gray-200 rounded-lg outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 bg-white"
								>
									<option value="" disabled>
										একটি বিষয় নির্বাচন করুন
									</option>
									{subjects.map((s, i) => (
										<option key={i} value={s}>
											{s}
										</option>
									))}
								</select>
							</div>

							<div>
								<label htmlFor="message" className="block text-[13px] font-medium text-gray-700 mb-1.5">
									আপনার বার্তা
								</label>
								<textarea
									id="message"
									name="message"
									required
									rows={5}
									placeholder="বিস্তারিত লিখুন..."
									className="w-full px-3.5 py-2.5 text-[14px] border border-gray-200 rounded-lg outline-none resize-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
								/>
							</div>

							<button
								type="submit"
								className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
							>
								<Send size={16} />
								মেসেজ পাঠান
							</button>
						</form>
					</div>

					{/* Side info */}
					<div className="lg:col-span-2 space-y-6">
						<div className="p-6 border border-gray-100 rounded-xl bg-gray-50/50">
							<div className="flex items-center gap-2.5 mb-3">
								<Clock size={16} className="text-amber-600" />
								<h3 className="text-[14px] font-semibold text-gray-900">কর্মঘণ্টা</h3>
							</div>
							<ul className="space-y-1.5 text-[13px] text-gray-500">
								<li className="flex justify-between">
									<span>শনি - বৃহস্পতি</span>
									<span>সকাল ৯টা - রাত ১১টা</span>
								</li>
								<li className="flex justify-between">
									<span>শুক্রবার</span>
									<span>দুপুর ২টা - রাত ১১টা</span>
								</li>
								<li className="flex justify-between">
									<span>লাইভ চ্যাট</span>
									<span>২৪/৭ উপলব্ধ</span>
								</li>
							</ul>
						</div>

						<div className="p-6 border border-amber-100 rounded-xl bg-amber-50/60">
							<h3 className="text-[14px] font-semibold text-gray-900 mb-2">অর্ডার ট্র্যাক করতে চান?</h3>
							<p className="text-[13px] text-gray-600 mb-4">
								ফর্ম পূরণ না করে আপনি সরাসরি অর্ডার আইডি দিয়ে আপনার শিপমেন্টের সর্বশেষ অবস্থা দেখতে পারেন।
							</p>
							<a href="/track-order" className="inline-flex items-center text-[13px] font-semibold text-amber-600 hover:text-amber-700">
								Track Order পেজে যান →
							</a>
						</div>

						<div className="p-6 border border-gray-100 rounded-xl">
							<h3 className="text-[14px] font-semibold text-gray-900 mb-2">চীন থেকে সোর্সিং নিয়ে প্রশ্ন?</h3>
							<p className="text-[13px] text-gray-600">
								নির্দিষ্ট কোনো পণ্য খুঁজে না পেলে আমাদের হোয়াটসঅ্যাপে ছবি বা লিংক পাঠান — আমাদের সোর্সিং টিম যাচাই করে আপনাকে মূল্য ও ডেলিভারি সময়
								জানিয়ে দেবে।
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
