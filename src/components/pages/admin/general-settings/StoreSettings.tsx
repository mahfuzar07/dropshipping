'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DragUploadInput } from '@/components/ui/custom/DragUploadInput';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import getFullImageUrl from '@/lib/utils/getFullImageUrl';
import { useSettingsFormStore } from '@/z-store/admin/useSettingsFormStore';

export default function StoreSettings() {
	const { formData, setField, setImage, removeImage } = useSettingsFormStore();
	return (
		<Card className="shadow border-none">
			<CardHeader className="border-b !pb-3 font-hanken">
				<CardTitle>Store Settings</CardTitle>
			</CardHeader>
			<CardContent className="text-dashboard-muted space-y-5">
				<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
					<div className="space-y-3">
						<Label className="">Store Logo *</Label>
						<DragUploadInput
							value={formData.storeLogoFile ? formData.storeLogo : formData.storeLogo ? getFullImageUrl(formData.storeLogo) : undefined}
							onChange={(file, preview) => file && setImage('storeLogo', file, preview)}
							onRemove={() => removeImage('storeLogo')}
						/>
					</div>

					<div className="space-y-3">
						<Label className="">Store Icon *</Label>

						<DragUploadInput
							value={formData.storeIconFile ? formData.storeIcon : formData.storeIcon ? getFullImageUrl(formData.storeIcon) : undefined}
							onChange={(file, preview) => file && setImage('storeIcon', file, preview)}
							onRemove={() => removeImage('storeIcon')}
						/>
					</div>
				</div>

				<div className="grid gap-5 grid-cols-1 md:grid-cols-1">
					<div className="space-y-2">
						<Label className="">Store Name *</Label>
						<Input value={formData.storeName} onChange={(e) => setField('storeName', e.target.value)} placeholder="Enter store name" />
					</div>
				</div>

				<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
					<div className="space-y-2">
						<Label className="">Contact Number *</Label>
						<InputGroup>
							<InputGroupAddon side="left">
								<InputGroupText>+88</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								placeholder="0123456789"
								className="pl-10"
								leftAddon
								value={formData.contactPhone}
								onChange={(e) => setField('contactPhone', e.target.value)}
							/>
						</InputGroup>
					</div>
					<div className="space-y-2">
						<Label className="">Contact Email *</Label>
						<Input value={formData.contactEmail} onChange={(e) => setField('contactEmail', e.target.value)} placeholder="example@email.com" />
					</div>
				</div>

				<div className="space-y-2">
					<Label>Full Address</Label>
					<Textarea value={formData.address} onChange={(e) => setField('address', e.target.value)} placeholder="Type store full address..." />
				</div>
			</CardContent>
		</Card>
	);
}
