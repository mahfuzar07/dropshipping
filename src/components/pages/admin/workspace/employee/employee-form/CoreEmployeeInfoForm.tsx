'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/custom/searchable-select';
import { DragUploadInput } from '@/components/ui/custom/DragUploadInput';
import { useAppData } from '@/hooks/use-appdata';
import { useEmployeeFormStore, RoleType } from '@/z-store/admin/useEmployeeFormStore';
import { Eye, EyeOff } from 'lucide-react';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { APIResponse } from '@/types/types';
import { Department } from '../../department/DepartmentDesignationPanel';
import { DatePicker } from '@/components/ui/custom/DatePicker';
import getFullImageUrl from '@/lib/utils/getFullImageUrl';

const genderOptions = [
	{ value: 'MALE', label: 'Male' },
	{ value: 'FEMALE', label: 'Female' },
];

const roleOptions = [
	{ value: 'SUPER_ADMIN', label: 'Super Admin' },
	{ value: 'HR_ADMIN', label: 'HR Admin' },
	{ value: 'DEPARTMENT_LEAD', label: 'Department Lead' },
	{ value: 'STAFF', label: 'Staff' },
	{ value: 'ACCOUNTS', label: 'Accounts' },
	{ value: 'CALL_CENTER', label: 'Call Center' },
	{ value: 'PACKER', label: 'Packer' },
	{ value: 'DELIVERY', label: 'Delivery' },
];

export default function CoreEmployeeInfoForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { formData, setField, setImage, removeImage, resetForm, errors, validateForm, clearErrors, hasExistingData, setHasExistingData } =
		useEmployeeFormStore();

	/* ---------------- Fetch Departments ---------------- */
	const { data: departmentsData } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DEPARTMENT_GET],
		api: apiEndpoint.workspace.department,
		auth: true,
		responseType: 'single',
	});

	const departments: Department[] = departmentsData?.payload || [];

	return (
		<div className="text-dashboard-muted font-play space-y-5">
			{/* Avatar */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<div className="space-y-3">
					<Label>Avatar *</Label>

					<DragUploadInput
						value={formData.avatarFile ? formData.avatar : formData.avatar ? getFullImageUrl(formData.avatar) : undefined}
						onChange={(file, preview) => file && setImage('avatar', file, preview)}
						onRemove={() => removeImage('avatar')}
					/>

					{errors.avatar && <p className="text-red-600 text-sm">{errors.avatar}</p>}
				</div>
			</div>

			{/* Email + Phone */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<div className="space-y-2">
					<Label>Official Email *</Label>
					<Input
						autoComplete="new-email"
						value={formData.officialEmail}
						onChange={(e) => setField('officialEmail', e.target.value)}
						placeholder="Enter Official Email"
					/>
					{errors.officialEmail && <p className="text-red-600 text-sm">{errors.officialEmail}</p>}
				</div>

				<div className="space-y-2">
					<Label>Official Phone *</Label>
					<Input value={formData.officialPhone} onChange={(e) => setField('officialPhone', e.target.value)} placeholder="Enter Official Phone" />
					{errors.officialPhone && <p className="text-red-600 text-sm">{errors.officialPhone}</p>}
				</div>
			</div>

			{/* Full Name */}
			<div className="space-y-2">
				<Label>Full Name *</Label>

				<Input value={formData.fullName} onChange={(e) => setField('fullName', e.target.value)} placeholder="Enter Full Name" />

				{errors.fullName && <p className="text-red-600 text-sm">{errors.fullName}</p>}
			</div>

			{/* Gender + Role */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<div className="space-y-2">
					<Label>Gender *</Label>

					<SearchableSelect options={genderOptions} value={formData.gender} onChange={(v) => setField('gender', v)} />
				</div>

				<div className="space-y-2">
					<Label>Role Permission *</Label>

					<SearchableSelect options={roleOptions} value={formData.role} onChange={(v) => setField('role', v as RoleType)} />
				</div>
			</div>
			{/* Department & Designation */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<div className="space-y-2">
					<Label>Department *</Label>

					<SearchableSelect
						options={departments.map((d) => ({ value: d.id, label: d.name }))}
						value={formData.departmentId}
						onChange={(v) => {
							setField('departmentId', v);
							// reset designation when department changes
							setField('designationId', '');
						}}
					/>
					{errors.departmentId && <p className="text-red-600 text-sm">{errors.departmentId}</p>}
				</div>

				<div className="space-y-2">
					<Label>Designation *</Label>

					<SearchableSelect
						options={
							formData.departmentId
								? departments.find((d) => d.id === formData.departmentId)?.designations.map((des) => ({ value: des.id, label: des.title })) || []
								: []
						}
						value={formData.designationId}
						onChange={(v) => setField('designationId', v)}
					/>
					{errors.designationId && <p className="text-red-600 text-sm">{errors.designationId}</p>}
				</div>
			</div>

			{/* Dates */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				<div className="space-y-2">
					<Label>Date Of Birth *</Label>

					<DatePicker
						value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
						onChange={(date) => {
							if (!date) return setField('dateOfBirth', '');
							const year = date.getFullYear();
							const month = String(date.getMonth() + 1).padStart(2, '0');
							const day = String(date.getDate()).padStart(2, '0');
							setField('dateOfBirth', `${year}-${month}-${day}`);
						}}
						placeholder="Select Date of Birth"
					/>
				</div>

				<div className="space-y-2">
					<Label>Joining Date *</Label>

					<DatePicker
						value={formData.joiningDate ? new Date(formData.joiningDate) : undefined}
						onChange={(date) => {
							if (!date) return setField('joiningDate', '');
							const year = date.getFullYear();
							const month = String(date.getMonth() + 1).padStart(2, '0'); // JS months are 0-based
							const day = String(date.getDate()).padStart(2, '0');
							setField('joiningDate', `${year}-${month}-${day}`);
						}}
						placeholder="Select Joining Date"
					/>
				</div>
			</div>

			{/* Password */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				{/* Password */}
				<div className="space-y-2">
					<Label>Password *</Label>

					<div className="relative">
						<Input
							type={showPassword ? 'text' : 'password'}
							value={formData.password}
							onChange={(e) => setField('password', e.target.value)}
							placeholder="Enter Password"
							className="pr-10"
						/>

						<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
							{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</div>

					{errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
				</div>

				{/* Confirm Password */}
				<div className="space-y-2">
					<Label>Confirm Password *</Label>

					<div className="relative">
						<Input
							autoComplete="new-password"
							type={showConfirmPassword ? 'text' : 'password'}
							value={formData.confirmPassword}
							onChange={(e) => setField('confirmPassword', e.target.value)}
							placeholder="Confirm Password"
							className="pr-10"
						/>

						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
						>
							{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</div>

					{errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
				</div>
			</div>
		</div>
	);
}
