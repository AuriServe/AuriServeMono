import { h, ComponentChildren, RefObject } from 'preact';
import { forwardRef } from 'preact/compat';
import { NavLink as Link } from 'react-router-dom';

import { mergeClasses } from 'common/util';

export interface Props {
	// Other attributes to be put on the container.
	[ key: string ]: any;

	icon?: string;
	label?: string;
	iconOnly?: boolean;

	style?: any;
	class?: string;
	highlightClass?: string;
	children?: ComponentChildren;
}

export default forwardRef(function Button(props: Props, ref?: RefObject<HTMLElement>) {
	const Tag = props.to ? Link : props.href ? 'a' : 'button';
	return (
		// @ts-ignore - Dynamically setting Link.to makes typescript mad.
		<Tag ref={ref} {...props}
			className={mergeClasses(
				'flex flex-shrink-0 place-items-center group relative p-[0.4375rem] rounded w-auto',
				'bg-neutral-50 dark:bg-neutral-700 border border-neutral-50 dark:border-neutral-700 font-medium',
				'active:border-neutral-400 dark:active:border-neutral-400 focus-visible:border-neutral-400 dark:focus-visible:border-neutral-400',
				'focus:outline-none transition duration-150 select-none',
				props.class)}
			onClick={props.onClick} type={Tag === 'button' && (props.type ?? 'button')}
			disabled={props.enabled ? !props.enabled : (props.disabled ?? false)}
			aria-label={props.iconOnly ? props.label : ''} title={props.iconOnly ? props.label : ''}>

			{props.icon && <img src={props.icon} alt='' role='presentation' width={32} height={32}
				class='w-8 h-8 dark:filter dark:invert dark:brightness-75 dark:contrast-200 dark:hue-rotate-180 pointer-events-none'/>}

			<div class={mergeClasses('absolute pointer-events-none -inset-px transform scale-75 rounded bg-neutral-500',
				'opacity-0 transition duration-150 group-hover:opacity-10 group-hover:scale-100 group-focus-visible:opacity-10',
				'group-focus-visible:scale-100', props.highlightClass)}/>

			{props.label && !props.iconOnly && <p class='px-2 mt-px -mb-px py-1 w-full text-center'>{props.label}</p>}

			{props.children}
		</Tag>
	);
});
