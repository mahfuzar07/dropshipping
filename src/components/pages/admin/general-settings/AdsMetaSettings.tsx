'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { useSettingsFormStore } from '@/z-store/admin/useSettingsFormStore';

export default function AdsMetaSettings() {
	const { formData, setField } = useSettingsFormStore();
	return (
		<Card className="shadow border-none">
			<CardHeader className="border-b !pb-3 font-hanken">
				<CardTitle>Google Ads & Meta Settings</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5 text-dashboard-muted">
				<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
					<div className="space-y-2">
						<Label>Google Analytics ID (GA4)</Label>
						<InputGroup>
							<InputGroupAddon side="left">
								<InputGroupText>G - </InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								placeholder="123456"
								className="pl-8"
								leftAddon
								value={formData.googleAnalyticsId}
								onChange={(e) => setField('googleAnalyticsId', e.target.value)}
							/>
						</InputGroup>
					</div>
					<div className="space-y-2">
						<Label>Google Ads Conversion ID</Label>
						<Input
							value={formData.googleAdsConversionId}
							onChange={(e) => setField('googleAdsConversionId', e.target.value)}
							placeholder="AW-1234567890"
						/>
					</div>
				</div>
				<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
					<div className="space-y-2">
						<Label>Facebook Pixel ID</Label>
						<Input value={formData.facebookPixelId} onChange={(e) => setField('facebookPixelId', e.target.value)} placeholder="1234567" />
					</div>
					<div className="space-y-2">
						<Label>Meta Pixel Token</Label>
						<Input value={formData.metaPixelToken} onChange={(e) => setField('metaPixelToken', e.target.value)} placeholder="EAAGxxxxxxxxxxxxxx" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
