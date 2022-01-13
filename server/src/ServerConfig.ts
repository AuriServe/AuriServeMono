export interface Config {
	data?: string;
	port?: number;
	https?: {
		port?: number;
		cert?: string;
		key?: string;
	};
	db?: string;
	super?: boolean;
	verbose?: boolean;
	logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'off';
}

const props: string[] = ['db', 'data', 'port', 'super', 'verbose', 'logLevel'];

export function mergeConfig(confA: Config, confB: Config): Config {
	const mConfA = JSON.parse(JSON.stringify(confA));
	const mConfB = JSON.parse(JSON.stringify(confB));

	for (const prop of props) if (mConfB[prop]) mConfA[prop] = mConfB[prop];

	return mConfA;
}
