import { h } from 'preact';
import type { ComponentChildren } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { merge } from 'common';

interface Props {
	target?: string;
	threshold?: number;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

const identifier = 'base:float';

function Float(props: Props) {
	const [floating, setFloating] = useState<boolean>(false);

	useEffect(() => {
		const elem = document.querySelector(props.target ?? 'html');
		if (!elem) return;
		const eventTarget = ((props.target ?? 'html') === 'html' ? document : elem)!;

		let scrolled = true;

		const markScroll = () => (scrolled = true);

		const onScroll = () => {
			if (!scrolled) return;
			setFloating(elem.scrollTop > (props.threshold ?? 32));
			scrolled = false;
		};

		const interval = setInterval(onScroll, 50);
		onScroll();

		eventTarget.addEventListener('scroll', markScroll, { passive: true });

		return () => {
			window.clearInterval(interval);
			eventTarget.removeEventListener('scroll', markScroll);
		};
	}, [props.target, props.threshold]);

	return (
		<div class={merge(identifier, floating && 'floating', props.class)}>
			{/* <Static class='Float-Contents'>{props.children}</Static> */}
			<div class='children'>{props.children}</div>
		</div>
	);
}

// export const HydratedFloat = withHydration('Float', Float);

// export const server: ServerDefinition = { identifier: 'Float', element: HydratedFloat };

// export const client: ClientDefinition = { identifier: 'Float', element: Float };

export default { identifier, component: Float };