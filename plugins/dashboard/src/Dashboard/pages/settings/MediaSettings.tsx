import { h } from 'preact';
import { formatBytes } from 'common';

import Card from '../../Card';
import { tw } from '../../twind';
import { Form, FormSchema, Input } from '../../Form';

import { useData, QUERY_MEDIA, QUERY_QUOTAS } from '../../Graph';

import icon_media from '@res/icon/image.svg';

const FORM_SCHEMA: FormSchema = {
	fields: {
		thumbnails: {
			type: 'toggle',
			label: 'Generate Thumbnails',
			description:
				'Generate smaller versions of uploaded images to improve page load speed. ' +
				'These images are cached on the server, so enabling this option will consume more storage space.',
			default: false,
		},
		format: {
			type: 'toggle',
			label: 'Convert to Modern Formats',
			description:
				'Convert certain media items to more efficient, modern formats. ' +
				'The original images are saved for older browsers, so enabling this option will consume more storage space.',
			default: true,
		},
	},
};

export default function MediaSettings() {
	const [{ media, quotas }] = useData([QUERY_MEDIA, QUERY_QUOTAS], []);

	return (
		<Card>
			<Card.Header
				icon={icon_media}
				title='Media'
				subtitle='Manage media storage and caching settings.'
			/>
			<Card.Body class={tw`py-6 pl-6`}>
				<p class={tw`text-gray-200`}>
					This site contains{' '}
					<span class={tw`font-medium text-gray-100`}>{(media ?? []).length} </span>
					media items occupying a total of
					<span class={tw`font-medium text-gray-100`}>
						{' '}
						{formatBytes(quotas?.storage.used ?? 0)}{' '}
					</span>
					of storage.
				</p>

				<p class={tw`mb-6 text-gray-200`}>
					Media represents{' '}
					<span class={tw`font-medium text-gray-100`}>
						{Math.round(
							((quotas?.storage.used ?? 0) / (quotas?.storage.allocated ?? 0)) * 100
						)}
						%{' '}
					</span>
					of the allocated{' '}
					<span class={tw`font-medium text-gray-100`}>
						{formatBytes(quotas?.storage.allocated ?? 0)}
					</span>{' '}
					of storage space.
				</p>

				<Form schema={FORM_SCHEMA} class={tw`space-y-4`}>
					<Input for='thumbnails' toggleLeft />
					<Input for='format' toggleLeft />
				</Form>

				{/* <SaveConfirmationModal active={isDirty} onSave={handleSave} onReset={handleReset} />*/}
			</Card.Body>
		</Card>
	);
}