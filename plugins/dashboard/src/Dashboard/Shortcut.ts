import Cookie from 'js-cookie';
import { Location } from 'react-router-dom';

import { togglePalette } from './Component/ShortcutPalette';

import icon_home from '@res/icon/home.svg';
// import icon_file from '@res/icon/file.svg';
// import icon_media from '@res/icon/image.svg';
import icon_themes from '@res/icon/theme.svg';
import icon_logout from '@res/icon/logout.svg';
// import icon_plugins from '@res/icon/plugin.svg';
import icon_settings from '@res/icon/options.svg';
import icon_shortcut from '@res/icon/shortcut.svg';

export interface ShortcutContext {
	location: Location;
	navigate(path: string, options?: { replace?: boolean }): void;
}

export interface Shortcut {
	identifier: string;
	title: string;
	description?: string;
	aliases?: string[];
	icon?: string;

	action: (ctx: ShortcutContext) => void;
}

export const registeredShortcuts: Map<string, Shortcut> = new Map();

export function getShortcuts(): Map<string, Shortcut> {
	return registeredShortcuts;
}

export function getShortcut(identifier: string): Shortcut | undefined {
	return registeredShortcuts.get(identifier);
}

export function registerShortcut(shortcut: Shortcut) {
	registeredShortcuts.set(shortcut.identifier, shortcut);
}

export function unregisterShortcut(identifier: string): boolean {
	return registeredShortcuts.delete(identifier);
}

export function getQueryScore(str: string, query: string) {
	let score = 0;
	let lastPos = -1;
	const maxScore = 10 * query.length;

	for (let i = 0; i < query.length; i++) {
		const pos = str.indexOf(query[i], lastPos + 1);
		if (pos === -1) break;
		if (score === maxScore) break;

		score += Math.max(10 - (pos - lastPos), 0);
		lastPos = pos;
	}

	return score / maxScore;
}

export function searchShortcuts(query: string): Shortcut[] {
	return [...registeredShortcuts.values()]
		.map((s) => {
			const score = Math.max(
				getQueryScore(s.title.toLowerCase(), query),
				getQueryScore((s.description ?? '').toLowerCase(), query),
				...(s.aliases ?? []).map((a) => getQueryScore(a.toLowerCase(), query))
			);
			return [s, score] as [Shortcut, number];
		})
		.filter(([, score]) => score > 0.6)
		.sort(([, a], [, b]) => b - a)
		.map(([s]) => s)
		.slice(0, 7);
}

registerShortcut({
	identifier: 'dashboard:page_home',
	title: 'Go Home',
	aliases: ['view home', 'main'],
	description: 'Go to the AuriServe home.',
	icon: icon_home,
	action: ({ navigate }) => navigate('/'),
});

registerShortcut({
	identifier: 'dashboard:page_settings',
	title: 'Settings',
	aliases: [
		'go settings',
		'view settings',
		'view options',
		'view configuation',
		'options',
		'configuration',
	],
	description: 'Manage AuriServe settings.',
	icon: icon_settings,
	action: ({ navigate }) => navigate('/settings/'),
});

registerShortcut({
	identifier: 'dashboard:manage_overview',
	title: 'Manage Overview',
	aliases: [
		'overview settings',
		'site name',
		'name',
		'description',
		'favicon',
		'address',
	],
	description: 'Edit basic site appearance settings.',
	icon: icon_home,
	action: ({ navigate }) => navigate('/settings/overview/'),
});

registerShortcut({
	identifier: 'dashboard:shortcut_palette',
	title: 'Shortcut Palette',
	aliases: ['command palette'],
	description: 'Execute commands.',
	icon: icon_shortcut,
	action: () => {
		togglePalette();
	},
});

registerShortcut({
	identifier: 'dashboard:log_out',
	title: 'Log out',
	aliases: ['exit', 'close'],
	description: 'Log out of AuriServe.',
	icon: icon_logout,
	action: () => {
		Cookie.remove('tkn');
		window.location.href = '/dashboard/';
	},
});

registerShortcut({
	identifier: 'dashboard:toggle_dark_mode',
	title: 'Toggle Dark Mode',
	aliases: ['dark mode', 'light mode', 'color theme', 'theme'],
	description: 'Toggle between light and dark mode.',
	icon: icon_themes,
	action: () => {
		document.documentElement.classList.add('AS_TRANSITION_THEME');
		setTimeout(() => document.documentElement.classList.toggle('dark'), 50);
		setTimeout(
			() => document.documentElement.classList.remove('AS_TRANSITION_THEME'),
			300
		);
	},
});