import { resolve } from 'path';

import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';

export default function (_: any, argv: { mode: string }) {
	const prod = argv.mode === 'production';

	/*
	 * Template Configurations
	 */

	return {
		name: 'server',
		target: 'node',
		context: resolve(__dirname, 'src'),
		entry: './Server.ts',

		output: {
			path: resolve(__dirname, 'dist'),
			filename: 'server.js',
		},

		resolve: {
			extensions: ['.ts', '.js'],
		},
		devtool: prod ? undefined : 'source-map',
		stats: 'minimal',

		plugins: [
			new ForkTsCheckerPlugin({
				typescript: { configFile: '../tsconfig.json' },
				eslint: { files: './**/*.{ts,ts}' },
			}),
		],

		module: {
			rules: [
				{
					test: /\.[t|j]s?$/,
					loader: 'babel-loader',
					options: {
						babelrc: false,
						cacheDirectory: true,
						presets: [
							[
								'@babel/preset-typescript',
								{
									allExtensions: true,
								},
							],
						],
					},
				},
			],
		},

		optimization: {
			usedExports: true,
		},
	};
}