import { Scale, TrendingUp, Package, Info } from 'lucide-react';

const factors = ['পণ্যের ক্যাটাগরি', 'অর্ডারের মূল্য (Order Value)', 'অর্ডারের পরিমাণ (Quantity)', 'পণ্যের প্রকৃত ওজন'];

export default function ShippingChargePageContent() {
	return (
		<main className="bg-white">
			<section className="bg-gradient-to-b from-amber-50/70 to-white border-b border-gray-100">
				<div className="container mx-auto px-4 md:px-6 py-14 text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900">Customs & Shipping Charge</h1>
					<p className="max-w-2xl mx-auto mt-3 text-sm text-gray-500">
						সর্বশেষ হালনাগাদ: ১১ আগস্ট, ২০২৬। চীন থেকে পণ্য আমদানির ক্ষেত্রে কাস্টমস ও শিপিং চার্জ কীভাবে কাজ করে, তা জেনে নিন।
					</p>
				</div>
			</section>

			<div className="container mx-auto px-4 md:px-6 py-14">
				<div className="">
					<p className="text-sm leading-7 text-gray-600 mb-12">
						যেহেতু Xianmart-এর পণ্য সরাসরি চীন থেকে আমদানি করা হয়, তাই পণ্যের মূল্যের পাশাপাশি{' '}
						<strong className="text-gray-800">কাস্টমস শুল্ক ও চীন-থেকে-বাংলাদেশ শিপিং চার্জ</strong> প্রযোজ্য হয়। অর্ডার করার সময় প্রতিটি পণ্যের
						পেজে আনুমানিক প্রতি কেজি শিপিং রেট দেখানো হয়, এবং পণ্য বাংলাদেশে পৌঁছানোর পর তার প্রকৃত ওজনের ভিত্তিতে চূড়ান্ত চার্জ নির্ধারণ করা হয়।
					</p>

					{/* How determined */}
					<div className="mb-14">
						<div className="flex items-center gap-2.5 mb-5">
							<TrendingUp size={18} className="text-amber-600" />
							<h2 className="text-lg font-bold text-gray-900">চার্জ কীভাবে নির্ধারিত হয়</h2>
						</div>
						<p className="text-sm leading-7 text-gray-600 mb-5">
							বিভিন্ন পণ্য মিশ্র আকারে (Mixed Cargo) একসাথে শিপমেন্ট হয় বলে প্রতিটি পণ্যের জন্য আলাদা করে সুনির্দিষ্ট চার্জ নির্ধারণ করা কঠিন। তাই
							আমরা প্রতিটি পণ্যের ক্যাটাগরি অনুযায়ী একটি <strong className="text-gray-800">গড় (Average) রেট</strong> নির্ধারণ করি, যা পণ্যের পেজে
							"Shipping Charge" কলামে প্রতি কেজি হিসেবে দেখানো থাকে।
						</p>
						<div className="grid grid-cols-2 gap-3 mb-5">
							{factors.map((f, i) => (
								<div key={i} className="flex items-center gap-2 px-4 py-3 text-[13px] text-gray-700 border border-gray-100 rounded-lg bg-gray-50/50">
									<span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
									{f}
								</div>
							))}
						</div>
						<div className="p-4 border border-amber-100 rounded-lg bg-amber-50/50 flex gap-3">
							<Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
							<p className="text-[13px] leading-6 text-gray-700">
								এয়ার ফ্রেইট ভাড়া ও অন্যান্য আন্তর্জাতিক খরচ প্রতিনিয়ত ওঠানামা করলেও, অর্ডার করার সময় আপনার সাইটে যে রেট প্রদর্শিত থাকবে, পণ্য
								পৌঁছানোর পর <strong>সেই একই রেট কার্যকর থাকবে</strong> — পরবর্তীতে রেট বাড়লেও আপনাকে অতিরিক্ত চার্জ দিতে হবে না।
							</p>
						</div>
					</div>

					{/* Weight calculation */}
					<div className="mb-14">
						<div className="flex items-center gap-2.5 mb-5">
							<Scale size={18} className="text-amber-600" />
							<h2 className="text-lg font-bold text-gray-900">ওজন হিসাবের পদ্ধতি</h2>
						</div>
						<div className="space-y-4 text-sm leading-7 text-gray-600">
							<p>
								চীনে পণ্যগুলো বড় কার্টনে একত্রে রি-প্যাকিং করে শিপমেন্ট করতে হয়, এবং এয়ার/শিপ ফ্রেইট ও কাস্টমসে টোটাল কার্টনের ওজনের উপর খরচ পরিশোধ
								করতে হয়। তবে Xianmart-এ আপনাকে পুরো কার্টনের ভাগ বহন করতে হয় না — প্রতিটি অর্ডার আলাদাভাবে ওজন করে হিসাব করা হয়।
							</p>
							<div className="p-5 border border-gray-100 rounded-xl bg-gray-50/50">
								<div className="flex items-center gap-2 mb-3">
									<Package size={16} className="text-gray-500" />
									<p className="text-[13px] font-semibold text-gray-800">উদাহরণ</p>
								</div>
								<p className="text-[13px] leading-6 text-gray-600">
									আপনার প্যাকেটের প্রকৃত ওজন যদি ৬২০ গ্রাম হয়, তাহলে শিপিং/কাস্টমস চার্জ ৬২০ গ্রামের ভিত্তিতেই গণনা হবে। একাধিক পণ্য বা একাধিক অর্ডার
									থাকলে প্রতিটি প্যাকেট আলাদাভাবে ওজন করে হিসাব করা হয় — একটির ওজন অন্যটির সাথে মিলিয়ে দেওয়া হয় না।
								</p>
							</div>
						</div>
					</div>

					{/* When charged */}
					<div className="mb-14">
						<h2 className="text-lg font-bold text-gray-900 mb-3">কখন চার্জ করা হয়</h2>
						<p className="text-sm leading-7 text-gray-600">
							প্রাথমিক অর্ডারের সময় পণ্যের মূল্যের সাথে আনুমানিক শিপিং/কাস্টমস চার্জ দেখানো হয়। পণ্য চীন থেকে বাংলাদেশে পৌঁছে প্রকৃত ওজন যাচাইয়ের
							পর, প্রাথমিক আনুমানিক চার্জ ও প্রকৃত চার্জের মধ্যে পার্থক্য থাকলে তা ডেলিভারির পূর্বে আপনাকে জানিয়ে দেওয়া হবে।
						</p>
					</div>

					<div className="p-5 border border-amber-100 rounded-xl bg-amber-50/60">
						<h3 className="text-sm font-semibold text-gray-900 mb-2">চার্জ নিয়ে বিভ্রান্তি?</h3>
						<p className="text-[13px] text-gray-600">
							নির্দিষ্ট কোনো পণ্যের শিপিং বা কাস্টমস চার্জ সম্পর্কে জানতে অর্ডার করার আগেই আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন — ইমেইল:
							support@xianmart.com.bd, হটলাইন: +880 9638 001086, অথবা{' '}
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
