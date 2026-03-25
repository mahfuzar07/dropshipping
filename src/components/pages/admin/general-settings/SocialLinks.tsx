'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { useSettingsFormStore } from '@/z-store/admin/useSettingsFormStore';

export default function SocialLinks() {
	const { formData, setField } = useSettingsFormStore();
	return (
		<Card className="shadow border-none">
			<CardHeader className="border-b !pb-3 font-hanken">
				<CardTitle>Social Links</CardTitle>
			</CardHeader>
			<CardContent className="text-dashboard-muted space-y-5">
				<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
					<div className="space-y-2">
						<Label className="">Facebook Page*</Label>
						<InputGroup>
							<InputGroupAddon side="left">
								<InputGroupText>URL:</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput className="pl-11" leftAddon value={formData.facebookUrl} onChange={(e) => setField('facebookUrl', e.target.value)} />
						</InputGroup>
					</div>
					<div className="space-y-2">
						<Label className="">Instagram URL *</Label>
						<InputGroup>
							<InputGroupAddon side="left">
								<InputGroupText>URL:</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput className="pl-11" leftAddon value={formData.instagramUrl} onChange={(e) => setField('instagramUrl', e.target.value)} />
						</InputGroup>
					</div>
				</div>
				<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
					<div className="space-y-2">
						<Label className="">Youtube URL *</Label>
						<InputGroup>
							<InputGroupAddon side="left">
								<InputGroupText>URL:</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput className="pl-11" leftAddon value={formData.youtubeUrl} onChange={(e) => setField('youtubeUrl', e.target.value)} />
						</InputGroup>
					</div>
					<div className="space-y-2">
						<Label className="">X URL*</Label>
						<InputGroup>
							<InputGroupAddon side="left">
								<InputGroupText>URL:</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput className="pl-11" leftAddon value={formData.xUrl} onChange={(e) => setField('xUrl', e.target.value)} />
						</InputGroup>
					</div>
				</div>
				<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
					<div className="space-y-2">
						<Label className="">Whatsapp Number *</Label>
						<InputGroup>
							<InputGroupAddon side="left">
								<InputGroupText>+88</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								className="pl-10"
								leftAddon
								value={formData.whatsappNumber}
								onChange={(e) => setField('whatsappNumber', e.target.value)}
							/>
						</InputGroup>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
