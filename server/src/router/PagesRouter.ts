import mime from 'mime';
import jimp from 'jimp';
import path from 'path';
import Express from 'express';
import { promises as fs, constants as fsc } from 'fs';

import Router from './Router';
import Media from '../data/Media';
import { OUT_FILE } from '../data/Themes';

export default class PagesRouter extends Router {
	constructor(
		private dataPath: string,
		private app: Express.Application,
		private media: Media
	) {
		super();
	}

	init() {
		this.router.get('/media/:asset', async (req, res, next) => {
			const validImageExtensions = ['png', 'jpg'];
			const validResolutions = { preload: 32, thumbnail: 128 };

			const resolution: string = Object.keys(validResolutions).filter(
				(res) => (req.query.res || '') === res
			)[0];

			const matched: string = validImageExtensions.filter((ext) =>
				req.params.asset.endsWith(`.${ext}`)
			)[0];

			if (!resolution || !matched) {
				next();
				return;
			}

			const p = path.join(this.dataPath, 'media', req.params.asset);
			const destP = path.join(
				this.dataPath,
				'media',
				'.cache',
				`${req.params.asset}.${req.query.res}`
			);

			try {
				await fs.access(destP, fsc.R_OK);
			} catch {
				try {
					await fs.access(p, fsc.R_OK);
				} catch {
					next();
					return;
				}

				const image = await jimp.read(
					path.join(this.dataPath, 'media', req.params.asset)
				);
				const size = (validResolutions as any)[req.query.res as string];
				const width = image.bitmap.width;
				const height = image.bitmap.height;
				const factor = size / Math.max(width, height);
				image.resize(width * factor, height * factor);
				await image.writeAsync(destP);
			}

			res.contentType(mime.getType(matched) ?? '');
			res.sendFile(destP);
		});

		this.router.use('/media', Express.static(path.join(this.dataPath, 'media')));
		this.router.use('/styles.css', async (_, res) => {
			const filePath = path.join(this.dataPath, 'themes', OUT_FILE);
			const file = (await fs.readFile(filePath)).toString();
			res.header('Content-Type', 'text/css; charset=UTF-8').send(file);
		});

		// this.router.use('/plugin/:identifier/:file', async (req, res, next) => {
		// 	try {
		// 		let plugins = this.plugins.listEnabled().filter(p => p.identifier === req.params.identifier);
		// 		if (plugins.length === 0) throw `There is no loaded plugin with identifier ${req.params.identifier}.`;
		// 		Express.static(path.join(this.dataPath, 'plugins', req.params.identifier, req.params.file))(req, res, next);
		// 	}
		// 	catch (e) {
		// 		res.status(403).send(e);
		// 	}
		// });

		// this.router.get('/plugin/styles/:identifier.css', (req, res) => {
		// 	const plugins = this.plugins.listEnabled().filter(p => p.identifier === req.params.identifier);
		// 	if (plugins.length !== 1) { res.sendStatus(404); return; }
		// 	const plugin = plugins[0];

		// 	if (!plugin.entry.client?.style) { res.sendStatus(404); return; }
		// 	res.sendFile(path.join(this.dataPath, 'plugins', plugin.identifier, plugin.entry.client?.style));
		// });

		// this.router.get('*', async (req, res) => {
		// 	try { res.send(await this.pages.render(req.params[0], req.cookies)); }
		// 	catch (e: unknown) {
		// 		const error = e instanceof RenderError ? e :
		// 			new RenderError(`Encountered an error assembling file ${req.params[0]}.\n ${e}`, 500);
		// 		res.status(error.code).send(await this.pages.renderError(error));
		// 	}
		// });

		this.app.use(this.router);
	}
}
