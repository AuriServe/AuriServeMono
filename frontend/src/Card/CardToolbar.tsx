import { h, RefObject } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

import { merge } from 'common/util';

interface Props {
	// Any default section properties.
	[key: string]: any;

	/** If false, the header won't be sticky. */
	sticky?: boolean;

	style?: any;
	class?: string;
	children?: any;
	refObj?: RefObject<HTMLDivElement>;
}

/**
 * A sticky card toolbar.
 * Good for putting buttons inside.
 */

export default function CardToolbar(props: Props) {
	const ref = useRef<HTMLDivElement | null>(null);
	const staticOffset = useRef<number | null>(null);
	const [isSticky, setIsSticky] = useState<boolean>(false);

	const handleSetRef = (elem: HTMLDivElement) => {
		if (elem) {
			elem.style.position = 'static';
			staticOffset.current = elem.offsetTop;
			elem.style.position = '';
		} else staticOffset.current = null;

		if (props.refObj) props.refObj.current = elem;
		ref.current = elem as any;
	};

	useEffect(() => {
		if (props.sticky === false || !ref.current) return undefined;

		let scrolled = false;
		const onScroll = () => (scrolled = true);
		window.addEventListener('scroll', onScroll);

		const interval = setInterval(() => {
			if (!scrolled) return;
			scrolled = false;

			const offset = ref.current!.offsetTop;
			setIsSticky(offset > staticOffset.current!);
		}, 100);

		return () => {
			window.removeEventListener('scroll', onScroll);
			clearInterval(interval);
		};
	}, [props.sticky]);

	const passedProps = { ...props } as any;

	delete passedProps.sticky;
	delete passedProps.children;

	return (
		<div
			{...passedProps}
			ref={handleSetRef}
			class={merge(
				'flex gap-2 top-0 py-3 -mt-4 px-4 bg-white dark:bg-neutral-750 z-10 transition-shadow',
				props.sticky !== false ? 'sticky' : '',
				isSticky && 'shadow-md',
				props.class
			)}>
			{props.children}
		</div>
	);
}

CardToolbar.Spacer = function Spacer() {
	return <div class='flex-grow' />;
};

CardToolbar.Divider = function Divider() {
	return <div class='bg-neutral-300 dark:bg-neutral-500 w-0.5 my-2 rounded justify-stretch' />;
};
