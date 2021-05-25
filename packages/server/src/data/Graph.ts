import { ObjectID } from 'mongodb';
import { buildSchema } from 'graphql';
import { SCHEMA } from 'common/graph';

import Media from './Media';
import Themes from './Themes';
import Plugins from './Plugins';

import * as Auth from './Auth';
import Theme from './theme/Theme';
import Plugin from './plugin/Plugin';
import { IUser } from './model/User';
import { IMedia } from './model/Media';
import Properties from './model/Properties';
import RoleModel, { IRole } from './model/Role';

export const Schema = buildSchema(SCHEMA);

export interface Context {
	media: Media;
	themes: Themes;
	plugins: Plugins;
}

const InfoResolver = {
	name:			 	 async () => (await Properties.findOne({}))!.info.name,
	domain:			 async () => (await Properties.findOne({}))!.info.domain,
	favicon:		 async () => (await Properties.findOne({}))!.info.favicon,
	description: async () => (await Properties.findOne({}))!.info.description
};
 
const QuotasResolver = {
	storage: async () => {
		let usage = (await Properties.findOne({}))!.usage;
		return { used: usage.media_used, allocated: usage.media_allocated };
	}
};

function UserResolver(user: IUser) {
	return {
		id: user._id.toString(),
		username: user.username,
		emails: user.emails,
		roles: user.roles
	};
}

const LayoutResolver = (identifier: string, html: string) => ({ identifier, html });

class ThemeResolver {
	constructor(private theme: Theme) {}

	// TODO: id, user, created

	enabled = () => this.theme.isEnabled();

	name 				= () => this.theme.config.name;
	identifier  = () => this.theme.config.identifier;
	description = () => this.theme.config.description;
	author			= () => this.theme.config.author;
	// TODO: coverPath

	layouts = () => {
		const layouts = this.theme.getLayouts();
		return [ ...layouts.keys() ].map(l => LayoutResolver(l, layouts.get(l)!));
	};
	layout = ({ identifier }: { identifier: string }) => {
		const layout = this.theme.getLayouts().get(identifier);
		return layout ? LayoutResolver(identifier, layout) : undefined;
	};
	format = () => this.theme.config.preprocessor.toUpperCase();
};

class PluginResolver {
	constructor(private plugin: Plugin) {}

	// TODO: id, user, created

	enabled     = () => this.plugin.isEnabled();

	name 				= () => this.plugin.config.name;
	identifier  = () => this.plugin.config.identifier;
	description = () => this.plugin.config.description;
	author			= () => this.plugin.config.author;
	// TODO: coverPath
};

class MediaResolver {
	constructor(private media: IMedia) {}

	id  				= () => this.media._id.toString();
	user 				= () => this.media.uploader;
	created 		= () => this.media._id.getTimestamp();
	// TODO: lastModified, lastModifier

	name 				= () => this.media.name;
	description = () => this.media.description;

	bytes       = () => this.media.bytes;
	extension   = () => this.media.extension;
	path				= () => this.media.fileName;
	url         = () => '/media/' + this.media.fileName + '.' + this.media.extension;
	
	size = () => {
		let size = this.media.size;
		if (!size) return null;
		return { x: size.width, y: size.height };
	};
}

export class RoleResolver {
	constructor(private role: IRole) {}

	id  				= () => this.role._id.toString();
	user 				= () => this.role.creator;
	created 		= () => this.role._id.getTimestamp();

	// TODO: lastModified, lastModifier

	name				= () => this.role.name;
	color 			= () => this.role.color;
	abilities		= () => this.role.abilities;
};

export const Resolver = {
	info: async ({ info }: any) => {
		if (info) {
			let $set: any = {};
			for (let k of Object.keys(info)) $set['info.' + k] = info[k];
			await Properties.updateOne({}, { $set });
		}
		return InfoResolver;
	},
	quotas: QuotasResolver,

	users: async () => (await Auth.listUsers()).map(u => UserResolver(u)),
	themes: (_: any, ctx: Context) => ctx.themes.listAll().map(t => new ThemeResolver(t)),
	plugins: (_: any, ctx: Context) => ctx.plugins.listAll().map(p => new PluginResolver(p)),
	media: async (_: any, ctx: Context) => (await ctx.media.listMedia()).map(m => new MediaResolver(m)),
	roles: async () => (await RoleModel.find({})).map((r: IRole) => new RoleResolver(r)),

	user: async ({ id }: { id: string }) => {
		const u = await Auth.getUser(new ObjectID(id));
		return u ? UserResolver(u) : undefined;
	},
	theme: ({ identifier }: { identifier: string }, ctx: Context) => {
		const t = ctx.themes.get(identifier);
		return t ? new ThemeResolver(t) : undefined;
	},
	plugin: ({ identifier }: { identifier: string }, ctx: Context) => {
		const p = ctx.plugins.get(identifier);
		return p ? new PluginResolver(p) : undefined;
	},

	enabled_themes: ({ enabled }: any, ctx: Context) => ctx.themes.setEnabled(enabled),
	enabled_plugins: ({ enabled }: any, ctx: Context) => ctx.plugins.setEnabled(enabled),
	delete_media: ({ media }: any, ctx: Context) => {
		try { Promise.all(media.map((id: ObjectID) => ctx.media.removeMedia(id))); return true; }
		catch (e) { return false; }
	}
};