'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrayInput } from '@/components/ui/custom/array-input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { useSettingsFormStore } from '@/z-store/admin/useSettingsFormStore';

export default function MetaSettings() {
	const { formData, setField } = useSettingsFormStore();
	return (
		<Card className="shadow border-none">
			<CardHeader className="border-b !pb-3 font-hanken">
				<CardTitle>Meta Settings</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5 text-dashboard-muted">
				<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
					<div className="space-y-2">
						<Label>Meta Title</Label>
						<Input value={formData.metaTitle} onChange={(e) => setField('metaTitle', e.target.value)} placeholder="Enter meta title" />
					</div>
					<div className="space-y-2">
						<Label>Meta Tagline</Label>
						<Input value={formData.metaTagline} onChange={(e) => setField('metaTagline', e.target.value)} placeholder="Enter meta tagline" />
					</div>
				</div>
				<div className="grid gap-5 grid-cols-1 md:grid-cols-1">
					<div className="space-y-2">
						<Label>Canonical URL</Label>
						<InputGroup>
							<InputGroupAddon side="left">
								<InputGroupText>https://</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								placeholder="yourdomain.com"
								className="pl-16"
								leftAddon
								value={formData.canonicalUrl}
								onChange={(e) => setField('canonicalUrl', e.target.value)}
							/>
						</InputGroup>
					</div>
				</div>

				<div className="space-y-3">
					<Label>Meta Keywords</Label>
					<ArrayInput placeholder="Type keyword & press Enter" value={formData.metaKeywords} onChange={(value) => setField('metaKeywords', value)} />
				</div>

				<div className="space-y-2">
					<Label>Meta Description</Label>
					<Textarea
						placeholder="Type meta description..."
						value={formData.metaDescription}
						onChange={(e) => setField('metaDescription', e.target.value)}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
