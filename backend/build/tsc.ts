import * as ts from 'typescript';
// @ts-expect-error
import * as threads from 'threads/worker';


export const tsInterface = {
	typeCheck(files: string[]) {
		// run the typescript compiler
		const program = ts.createProgram(files, {noEmit: true});

		const diagnostics = ts.getPreEmitDiagnostics(program);
		diagnostics.forEach(diagnostic => {
			console.error(ts.formatDiagnostic(diagnostic, {
				getCanonicalFileName: fileName => fileName,
				getCurrentDirectory: ts.sys.getCurrentDirectory,
				getNewLine: () => ts.sys.newLine,
			}));
		});




	}
}

threads.expose(tsInterface);
