'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { User, Phone, MapPin, Building2, Calendar, Check, Loader2, Camera } from 'lucide-react';

export default function AdminProfilePage() {
	const { data: profileData, update: updateProfile, isLoading } = useAppData<any, 'single'>({
		key: [QueriesKey.USER_PROFILE],
		api: apiEndpoint.users.PROFILE(),
		auth: true,
		responseType: 'single',
	});

	// Photo upload states
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState('');
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	// Personal profile details states
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phone, setPhone] = useState('');
	const [gender, setGender] = useState('');
	const [dob, setDob] = useState('');

	// Address states
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [country, setCountry] = useState('');

	// Company states
	const [companyName, setCompanyName] = useState('');
	const [storeName, setStoreName] = useState('');

	// Sync local states when profileData loads
	useEffect(() => {
		if (profileData) {
			setFirstName(profileData.first_name || '');
			setLastName(profileData.last_name || '');
			setPhone(profileData.phone || '');
			setGender(profileData.gender || '');
			setDob(profileData.date_of_birth || '');
			setAddress(profileData.address || '');
			setCity(profileData.city || '');
			setState(profileData.state || '');
			setPostalCode(profileData.postal_code || '');
			setCountry(profileData.country || '');
			setCompanyName(profileData.company_name || '');
			setStoreName(profileData.store_name || '');
			if (profileData.photo) {
				setPreviewUrl(profileData.photo);
			}
		}
	}, [profileData]);

	const [isSaving, setIsSaving] = useState(false);

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPhotoFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handlePhotoClick = () => {
		fileInputRef.current?.click();
	};

	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		try {
			const fd = new FormData();
			if (photoFile) {
				fd.append('photo', photoFile);
			}
			fd.append('first_name', firstName);
			fd.append('last_name', lastName);
			fd.append('phone', phone);
			fd.append('gender', gender);
			fd.append('date_of_birth', dob || '');
			fd.append('address', address);
			fd.append('city', city);
			fd.append('state', state);
			fd.append('postal_code', postalCode);
			fd.append('country', country);
			fd.append('company_name', companyName);
			fd.append('store_name', storeName);

			await updateProfile({
				payload: fd,
			});
			toast.success('Admin profile credentials updated successfully!');
		} catch (error: any) {
			toast.error(error?.response?.data?.message || 'Failed to save admin profile preferences.');
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-[50vh] w-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-[#F16A38]" />
			</div>
		);
	}

	return (
		<div className="space-y-6 font-play max-w-4xl mx-auto">
			<div className="bg-white p-5 rounded-xl border shadow-sm">
				<h2 className="text-xl font-bold text-slate-800">Admin Account Profile</h2>
				<p className="text-xs text-slate-400 font-medium">Manage your personal credentials, contact details, and organization settings.</p>
			</div>

			<form onSubmit={handleSaveProfile} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Sidebar Profile Card */}
					<div className="md:col-span-1">
						<Card className="shadow-sm bg-white">
							<CardContent className="pt-6 text-center space-y-4">
								<div 
									onClick={handlePhotoClick} 
									className="relative w-24 h-24 rounded-full mx-auto border-2 border-orange-100 overflow-hidden cursor-pointer group shadow-inner bg-slate-50 flex items-center justify-center"
								>
									{previewUrl ? (
										<img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
									) : (
										<User className="w-12 h-12 text-[#F16A38]" />
									)}
									<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
										<Camera className="w-6 h-6 text-white" />
									</div>
								</div>
								<input 
									type="file" 
									ref={fileInputRef} 
									onChange={handlePhotoChange} 
									className="hidden" 
									accept="image/*" 
								/>
								<Button 
									type="button" 
									variant="outline" 
									onClick={handlePhotoClick} 
									className="text-xs h-8 border-orange-200 text-[#F16A38] hover:bg-orange-50 font-semibold"
								>
									Choose Photo
								</Button>
								<div className="space-y-1">
									<h3 className="font-bold text-sm text-slate-800">
										{firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Admin User'}
									</h3>
									<p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{profileData?.user_type || 'ADMIN'}</p>
									<p className="text-xs text-slate-500 font-medium">{profileData?.email || 'admin@updatetech.com'}</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Personal Details */}
					<div className="md:col-span-2 space-y-6">
						<Card className="shadow-sm bg-white">
							<CardHeader>
								<CardTitle className="text-base font-bold text-slate-800 flex items-center gap-1.5">
									<User className="w-4 h-4 text-[#F16A38]" /> Personal Credentials
								</CardTitle>
								<CardDescription>Configure your primary public identity parameters</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">First Name</label>
										<Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required />
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Last Name</label>
										<Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required />
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Gender</label>
										<select
											value={gender}
											onChange={(e) => setGender(e.target.value)}
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F16A38] disabled:cursor-not-allowed disabled:opacity-50 text-slate-800"
										>
											<option value="">Select Gender</option>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
											<option value="Other">Other</option>
										</select>
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase flex items-center gap-1">
											<Calendar className="w-3 h-3 text-[#F16A38]" /> Date of Birth
										</label>
										<Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Contact & Location Info */}
						<Card className="shadow-sm bg-white">
							<CardHeader>
								<CardTitle className="text-base font-bold text-slate-800 flex items-center gap-1.5">
									<MapPin className="w-4 h-4 text-[#F16A38]" /> Address & Location
								</CardTitle>
								<CardDescription>Verify your shipping and billing physical properties</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="col-span-2">
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Street Address</label>
										<Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, Road, Area..." />
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
										<div className="relative">
											<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
											<Input className="pl-9" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="017xxxxxxxx" />
										</div>
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">City</label>
										<Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dhaka, Chittagong..." />
									</div>
								</div>

								<div className="grid grid-cols-3 gap-4">
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">State / Division</label>
										<Input value={state} onChange={(e) => setState(e.target.value)} placeholder="Dhaka" />
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Postal Code</label>
										<Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="1212" />
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Country</label>
										<Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Bangladesh" />
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Corporate Credentials */}
						<Card className="shadow-sm bg-white">
							<CardHeader>
								<CardTitle className="text-base font-bold text-slate-800 flex items-center gap-1.5">
									<Building2 className="w-4 h-4 text-[#F16A38]" /> Organization & Store Setup
								</CardTitle>
								<CardDescription>Setup dropship agency organization credentials</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Company Name</label>
										<Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Update Tech Ltd." />
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Store Public Name</label>
										<Input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Update Dropshipping" />
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Actions */}
						<div className="flex justify-end pt-3">
							<Button type="submit" disabled={isSaving} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-2 shadow-sm transition duration-200">
								{isSaving ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" /> Saving...
									</>
								) : (
									<>
										<Check className="w-4 h-4" /> Save Profile Preferences
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
