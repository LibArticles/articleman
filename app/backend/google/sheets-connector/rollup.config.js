import { babel } from '@rollup/plugin-babel';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import googleAppsScript from 'rollup-plugin-google-apps-script';
import commonjs from '@rollup/plugin-commonjs';
import ts from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { visualizer } from "rollup-plugin-visualizer";
import inject from '@rollup/plugin-inject';
import replace from '@rollup/plugin-replace';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: 'src/index.ts',
	output: {
		dir: 'build',
		format: 'umd',
		name: 'articleman',
		compact: true,
		generatedCode: {
			arrowFunctions: true,
			constBindings: true,
			objectShorthand: true,
			symbols: true,
		},

		inlineDynamicImports: true,
		interop: 'auto',
		banner: `/*
	@preserve ©️ ${new Date().getFullYear()} blue linden software.
	licensed under the GNU AGPL 3.0, all rights reserved.
	proprietary modifications are FORBIDDEN without a custom licensing plan. (https://articleman.org/license)
	this generated code is not meant to be modified in place, and it WILL be overwritten by Articleman's automatic updates and integrity verification. if you'd like to edit it, compile it yourself from https://github.com/bluelinden/articleman.
	compiled with rollup at ${new Date().getTime()}
*/

/* @preserve disclaimer: the following code may cause you to:
	* love your job
	* become more productive
	* have more fun

	if any of these happen to you, do not panic. Articleman is working as intended and these feelings will not subside.
*/`,
		footer: `/* @preserve thank you for using Articleman. you're awesome! */`,
		minifyInternalExports: true,
		validate: true,
	},
	treeshake: {
		preset: 'smallest',
		moduleSideEffects: [

		]
	},

	plugins: [
		// alias({
		// 	entries: [
		// 		{
		// 			find: './index.js',
		// 			replacement: './index.d.mts',
		// 		}
		// 	]
		// }),

		ts({
			tsconfig: 'tsconfig.json',
			checkJs: true,

			declaration: false,
			emitDecoratorMetadata: true,
			paths: {
				'@shelf/fast-chunk-string': ['@shelf/fast-chunk-string/lib/index.js'],
			},

		}),
		babel({
			babelHelpers: 'bundled',
			extensions: ['.mjs', '.js'],
			compact: true,
			minified: true,
			configFile: './babel.config.js',
		}),
		commonjs({
			esmExternals: [
				'@babel/runtime',
				'@babel/runtime/helpers',
				'@babel/runtime/regenerator/index.js',
				'tslib',
				'@abraham/reflection',
				'@shelf/fast-chunk-string',
			],


			requireReturnsDefault: 'auto',
			transformMixedEsModules: true,
		}),
		json({
			compact: true,
			preferConst: true
		}),
		tsConfigPaths(),

		inject({
			Reflect: ['@abraham/reflection', 'Reflection']
		}),




		nodeResolve({
			extensions: ['.ts', '.mts', '.mjs', '.js'],
		}),


		replace({
			'Object.defineProperty(exports, "__esModule", { value: true });': '',
			delimiters: ['\n', '\n']
		}),



		terser({
			compress: {
				unsafe: true,
				hoist_funs: true,
				hoist_props: true,
				passes: 3,
				arguments: true,
			},
			format: {
				ecma: 2023,
				max_line_len: 500
			}
		}),


		googleAppsScript(),
		visualizer({
			template: 'raw-data',
			filename: 'bundle.json',
			emitFile: true
		}),


	]
}

export default config;
