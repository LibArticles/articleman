// Generated using webpack-cli https://github.com/webpack/webpack-cli


// import path from 'node:path';
const path = require('node:path')
// import GasPlugin from 'gas-webpack-plugin';
const GasPlugin = require('gas-webpack-plugin')
// import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
// import LodashWebpackPlugin from 'lodash-webpack-plugin';
const LodashWebpackPlugin = require('lodash-webpack-plugin')
// import Plugins from 'webpack';
const Plugins = require('webpack')
// import { cwd } from 'node:process';
const { cwd } = require('node:process')

const TerserPlugin = require('terser-webpack-plugin');

const CircularDependencyPlugin = require('circular-dependency-plugin');


const progressHandler = (
	percentage, message, ...args
) => {
	// e.g. Output each progress message directly to the console:
	console.info('webpack', percentage, message, ...args);
};

const isProduction = process.env.NODE_ENV == 'production';


const ProgressPlugin = Plugins.ProgressPlugin;


const backEndConfig = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(cwd(), 'dist'),
		filename: 'articleman-backend.js',
	},
	plugins: [
		new GasPlugin(),
		// new ProgressPlugin(progressHandler),

		new LodashWebpackPlugin(),
		new CircularDependencyPlugin({
			// exclude detection of files based on a RegExp
			exclude: /a\.js|node_modules/,
			// include specific files based on a RegExp
			include: /src\/.+\.(j|t)sx?$/,
			// add errors to webpack instead of warnings
			failOnError: true,
			// allow import cycles that include an asyncronous import,
			// e.g. via import(/* webpackMode: "weak" */ './file.js')
			allowAsyncCycles: false,
			// set the current working directory for displaying module paths
			cwd: cwd(),
		})
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					keep_classnames: true,
					keep_fnames: true,
					mangle: true,
				},
				parallel: true,
				extractComments: false,
				// minify: TerserPlugin.esbuildMinify
			})
		]
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				loader: 'babel-loader',
				options: {
					"presets": ["@babel/env", "@babel/preset-typescript"],
					"plugins": [
						["babel-plugin-tsconfig-paths",
							{
								"relative": true,
								"extensions": [
									".js",
									".jsx",
									".ts",
									".tsx",
									".es",
									".es6",
									".mjs"
								],
								"rootDir": ".",
								"tsconfig": "tsconfig.json",
								"transformFunctions": [
									"require",
									"require.resolve",
									"import",
									"System.import",
									"jest.genMockFromModule",
									"jest.mock",
									"jest.unmock",
									"jest.doMock",
									"jest.dontMock",
									"jest.setMock",
									"require.requireActual",
									"require.requireMock"
								]
							}],
						["inline-json-import"],
						["@babel/plugin-transform-typescript", {
							dts: false,
							optimizeConstEnums: true,

						}],
						["babel-plugin-transform-typescript-metadata"],
						["@babel/plugin-proposal-decorators", { "version": "legacy" }],
						["import", {
							"libraryName": "lodash",
							"libraryDirectory": "",
							"camel2DashComponentName": false,
						}]
					]
				},
				exclude: ['/node_modules/'],
			},
		],
	},
	devtool: false,
	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
		extensionAlias: {
			'.js': ['.ts', '.js'],
			'.mjs': ['.mts', '.mjs'],
		},
		plugins: [
			new TsconfigPathsPlugin({
				configFile: './tsconfig.json',
			}),
		]
	},
	mode: 'development',
};

module.exports = () => {
	if (isProduction) {
		backEndConfig.mode = 'production';
	} else {
		backEndConfig.mode = 'development';
	}
	return backEndConfig;
};
