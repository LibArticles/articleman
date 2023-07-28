import * as esbuild from 'esbuild';
import * as TypeScript from 'typescript';
import * as fs from 'fs';

import type { tsInterface } from './tsc.js'
import type { esbInterface } from './esbuild.js';

import * as threads from 'threadsfixed';

export function loggy(level: 'error' | 'warn' | 'info' | 'debug', message: string) {
	const date = new Date();
	switch (level) {
		case 'error':
			console.error(`Artsy Build System: ${date.toLocaleTimeString()}, ${message}`);
			break;
		case 'warn':
			console.warn(`Artsy Build System: ${date.toLocaleTimeString()}, ${message}`);
			break;
		case 'info':
			console.info(`Artsy Build System: ${date.toLocaleTimeString()}, ${message}`);
			break;
		case 'debug':
			console.debug(`Artsy Build System: ${date.toLocaleTimeString()}, ${message}`);
		default:
			console.log(`Artsy Build System: ${date.toLocaleTimeString()}, ${message}`);
	}
}

// get the first argument
const arg = process.argv.slice(2);

const esb = threads.spawn<typeof esbInterface>(new threads.Worker('esbuild.ts'));
const tsc = threads.spawn<typeof tsInterface>(new threads.Worker('tsc.ts'));

const tsConfig = JSON.parse(fs.readFileSync('../tsconfig.json').toString('utf8'));

// if the esb is successful, keep the result, but wait for the tsc to finish before saving it to disk
esb.then((esbStarter) => {
	esbStarter.build({
		files: {
			tsConfig,
			entries: '../src/index.ts',

		}
	})
});

