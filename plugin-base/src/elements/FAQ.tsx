import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

import { withHydration } from '../Hydration';

import { mergeClasses } from 'common/util';
import { ServerDefinition, ClientDefinition } from 'common/definition';

import './FAQ.sss';

interface Entry {
	title: string;
	description: string;
}

export interface Props {
	entries: Entry[];

	class?: string;
	style?: Record<string, string>;
}

/**
 * Renders a list of FAQ items that can be collapsed or expanded.
 */

export function FAQ(props: Props) {
	const ref = useRef<HTMLDListElement>(null);
	const [ index, setIndex ] = useState<number | undefined>(undefined);
	const [ heights, setHeights ] = useState<number[] | undefined>(undefined);

	const handleActivate = (newIndex: number) => {
		setIndex(index === newIndex ? undefined : newIndex);
	};

	useEffect(() => {
		let heights: number[] = [];
		ref.current!.querySelectorAll('.FAQ-Item dd').forEach(elem => heights.push(elem.getBoundingClientRect().height));
		setHeights(heights);
	}, [ props.entries ]);

	console.log(heights);

	return (
		<dl class={mergeClasses('FAQ', props.class)} ref={ref}>
			{props.entries.map((entry, i) => <div
				class={mergeClasses('FAQ-Item', (!heights || index === i) && 'Active')}>
				<dt onClick={() => handleActivate(i)}>{entry.title}</dt>
				<dd
					style={{ height: heights ? index === i ? heights[i] : 0 : undefined }}
					dangerouslySetInnerHTML={{ __html: entry.description }}/>
			</div>)}
		</dl>
	);
}


export const HydratedFAQ = withHydration('FAQ', FAQ);

export const server: ClientDefinition = { identifier: 'FAQ', element: HydratedFAQ };

export const client: ServerDefinition = { identifier: 'FAQ', element: FAQ };
