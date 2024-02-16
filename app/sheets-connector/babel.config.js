export default {
	"presets": ["@babel/env", "@babel/preset-typescript"],
	"plugins": [
		[
			"babel-plugin-tsconfig-paths",
			{
				"relative": true,
				"extensions": [
					".js",
					".jsx",
					".ts",
					".d.ts",
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
					"require.requireActual",
					"require.requireMock"
				]
			}
		],
		['babel-plugin-cjs-esm-interop', { format: 'mjs' }],
		["inline-json-import"],
		// [
		// 	"@babel/plugin-transform-typescript",
		// 	{
		// 		"dts": false,

		// 		"optimizeConstEnums": true,
		// 		"importHelpers": true
		// 	}
		// ],
		// [
		// 	"@babel/plugin-transform-runtime",
		// 	{
		// 		"absoluteRuntime": true,
		// 		"corejs": false,
		// 		"helpers": true,
		// 		"regenerator": true
		// 	}
		// ],
		["minify-dead-code-elimination"],
		["babel-plugin-transform-typescript-metadata"],
		["@babel/plugin-proposal-decorators", { "version": "legacy" }],
		[
			"import",
			{
				"libraryName": "lodash-es",
				"libraryDirectory": "",
				"camel2DashComponentName": false
			}
		]
	]
}
