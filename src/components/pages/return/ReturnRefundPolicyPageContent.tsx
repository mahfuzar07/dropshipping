import { CheckCircle2, XCircle, PackageSearch, Clock3 } from 'lucide-react';

const eligible = [
	'পণ্য ভাঙা বা ক্ষতিগ্রস্ত অবস্থায় পৌঁছেছে',
	'ভুল পণ্য বা ভুল ভ্যারিয়েন্ট (রং/সাইজ) পাঠানো হয়েছে',
	'পণ্য উল্লেখযোগ্যভাবে ওয়েবসাইটের বিবরণ থেকে ভিন্ন',
	'প্যাকেজে কোনো আইটেম কম পাঠানো হয়েছে',
];

const notEligible = [
	'শুধু "পছন্দ হয়নি" বা মন পরিবর্তনের কারণে রিটার্ন',
	'আনবক্সিং ভিডিও ছাড়া অভিযোগ',
	'ব্যবহৃত, ধোয়া বা মেয়াদোত্তীর্ণ সময়ে রিপোর্ট করা পণ্য',
	'কসমেটিকস, অন্তর্বাস বা হাইজিন-সংবেদনশীল পণ্য (স্বাস্থ্যবিধি কারণে)',
	'কাস্টম-মেড বা বিশেষ অনুরোধে আনা পণ্য',
];

const steps = [
	{ title: '১. যোগাযোগ করুন', desc: 'পণ্য হাতে পাওয়ার ৭২ ঘণ্টার মধ্যে Order ID ও আনবক্সিং ভিডিও/ছবিসহ কাস্টমার সাপোর্টে জানান।' },
	{ title: '২. যাচাই', desc: 'আমাদের টিম প্রমাণ পর্যালোচনা করে ২৪-৪৮ কার্যঘণ্টার মধ্যে সিদ্ধান্ত জানাবে।' },
	{ title: '৩. পিকআপ/রিটার্ন', desc: 'অনুমোদিত হলে পণ্যটি নির্ধারিত কুরিয়ারের মাধ্যমে ফেরত সংগ্রহ করা হবে অথবা নিকটস্থ পয়েন্টে জমা দিতে বলা হবে।' },
	{ title: '৪. রিফান্ড/রিপ্লেসমেন্ট', desc: 'পণ্য পরিদর্শনের পর রিফান্ড অথবা রিপ্লেসমেন্ট প্রসেস করা হবে।' },
];

export default function ReturnRefundPolicyPageContent() {
	return (
		<main className="bg-white">
			<section className="bg-gradient-to-b from-amber-50/70 to-white border-b border-gray-100">
				<div className="container mx-auto px-4 md:px-6 py-14 text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900">Return & Refund Policy</h1>
					<p className="max-w-2xl mx-auto mt-3 text-[14px] text-gray-500">
						সর্বশেষ হালনাগাদ: ১১ আগস্ট, ২০২৬। আন্তর্জাতিক সোর্সিং হওয়ায় আমাদের রিটার্ন প্রক্রিয়া কিছুটা ভিন্ন — অনুগ্রহ করে বিস্তারিত পড়ুন।
					</p>
				</div>
			</section>

			<div className="container mx-auto px-4 md:px-6 py-14">
				<div>
					<p className="text-sm leading-7 text-gray-600 mb-10">
						Xianmart-এর অধিকাংশ পণ্য চীন থেকে সরাসরি সংগ্রহ করে আপনার কাছে পাঠানো হয় (Dropshipping মডেল)। এই কারণে দেশীয় ই-কমার্সের মতো "যেকোনো
						কারণে রিটার্ন" সুবিধা এখানে প্রযোজ্য নয় — তবে পণ্যে ত্রুটি, ক্ষতি বা ভুল ডেলিভারির ক্ষেত্রে আমরা পূর্ণ দায়িত্ব নিয়ে সমাধান করি।
					</p>

					{/* Eligible / Not eligible */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
						<div className="p-6 border border-green-100 rounded-xl bg-green-50/40">
							<div className="flex items-center gap-2 mb-4">
								<CheckCircle2 size={18} className="text-green-600" />
								<h2 className="text-[15px] font-semibold text-gray-900">রিটার্নযোগ্য</h2>
							</div>
							<ul className="space-y-2.5 text-[13px] text-gray-600">
								{eligible.map((item, i) => (
									<li key={i} className="flex gap-2">
										<span className="text-green-600">•</span>
										{item}
									</li>
								))}
							</ul>
						</div>

						<div className="p-6 border border-red-100 rounded-xl bg-red-50/30">
							<div className="flex items-center gap-2 mb-4">
								<XCircle size={18} className="text-red-500" />
								<h2 className="text-[15px] font-semibold text-gray-900">রিটার্নযোগ্য নয়</h2>
							</div>
							<ul className="space-y-2.5 text-[13px] text-gray-600">
								{notEligible.map((item, i) => (
									<li key={i} className="flex gap-2">
										<span className="text-red-500">•</span>
										{item}
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Process */}
					<div className="mb-14">
						<div className="flex items-center gap-2.5 mb-6">
							<PackageSearch size={18} className="text-amber-600" />
							<h2 className="text-lg font-bold text-gray-900">রিটার্ন প্রক্রিয়া</h2>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							{steps.map((step, i) => (
								<div key={i} className="p-5 border border-gray-100 rounded-xl">
									<p className="text-sm font-semibold text-gray-900 mb-1.5">{step.title}</p>
									<p className="text-[13px] leading-6 text-gray-500">{step.desc}</p>
								</div>
							))}
						</div>
					</div>

					{/* Refund timeline */}
					<div className="mb-14">
						<div className="flex items-center gap-2.5 mb-6">
							<Clock3 size={18} className="text-amber-600" />
							<h2 className="text-lg font-bold text-gray-900">রিফান্ডের সময়সীমা ও পদ্ধতি</h2>
						</div>
						<div className="space-y-3 text-sm leading-7 text-gray-600">
							<p>
								অনুমোদিত রিফান্ড মূল পেমেন্ট মাধ্যমে (bKash/Nagad/Card) অথবা Xianmart Wallet Credit হিসেবে প্রদান করা হয়। মূল পেমেন্ট মাধ্যমে রিফান্ড
								হতে ৫-৭ কার্যদিবস এবং Wallet Credit সাধারণত ২৪ ঘণ্টার মধ্যে যুক্ত হয়ে যায়।
							</p>
							<p>
								রিফান্ডের ক্ষেত্রে পণ্যের মূল্য ফেরত দেওয়া হয়। যদি শিপিং/কাস্টমস চার্জ আলাদাভাবে পরিশোধ করা হয়ে থাকে এবং পণ্যটি ইতিমধ্যে চীন থেকে
								পাঠানো হয়ে থাকে, সেক্ষেত্রে সেই চার্জ আংশিক বা সম্পূর্ণ অ-ফেরতযোগ্য হতে পারে — নির্দিষ্ট কেস অনুযায়ী তা সাপোর্ট টিম জানিয়ে দেবে।
							</p>
						</div>
					</div>

					{/* Exchange */}
					<div className="mb-14">
						<h2 className="text-lg font-bold text-gray-900 mb-3">এক্সচেঞ্জ (Exchange)</h2>
						<p className="text-sm leading-7 text-gray-600">
							ভুল সাইজ বা ভুল ভ্যারিয়েন্ট পাঠানো হলে আমরা সাধারণত রিফান্ডের বদলে সঠিক পণ্যের রিপ্লেসমেন্ট অগ্রাধিকার দিই, যদি সেই পণ্য পুনরায় সোর্স
							করা সম্ভব হয়। রিপ্লেসমেন্টের ক্ষেত্রে যেহেতু পণ্য পুনরায় চীন থেকে আনতে হয়, তাই স্বাভাবিক ডেলিভারি সময় প্রযোজ্য হবে।
						</p>
					</div>

					<div className="p-5 border border-amber-100 rounded-xl bg-amber-50/60">
						<h3 className="text-sm font-semibold text-gray-900 mb-2">সাহায্য দরকার?</h3>
						<p className="text-[13px] text-gray-600">
							রিটার্ন বা রিফান্ড সংক্রান্ত যেকোনো প্রশ্নে যোগাযোগ করুন — ইমেইল: support@xianmart.com.bd, হটলাইন: +880 9638 001086, অথবা{' '}
							<a href="/contact" className="font-medium text-amber-600 hover:text-amber-700">
								Contact Us
							</a>{' '}
							পেজের মাধ্যমে।
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
