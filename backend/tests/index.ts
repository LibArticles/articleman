import QUnit from "qunit";

// TESTS
import connectionChecks from "./base/conn-check.js";

export default function runTests() {

	QUnit.config.autostart = false;


	const testData: {
		module: string;
		passed: number;
		failed: number;
		total: number;
		runtime: number;
		data: {
			name: string;
			failed: number;
			passed: number;
			total: number;
			runtime: number;
		}[]
	}[] = []

	const logData: {
		result: boolean;
		actual: any;
		expected: any;
		message: string;
		source: string;
		module: string;
		name: string;
		runtime: number;
	}[] = []

	// Add every test to an array once it finishes
	QUnit.testDone((details: QUnit.TestDoneDetails) => {
		// if the test is of the same module as the previous test, add it to the same module array. Otherwise, add it to a new module array
		if (details.module === testData[testData.length - 1].module) {
			testData[testData.length - 1].data.push({
					name: details.name,
					failed: details.failed,
					passed: details.passed,
					total: details.total,
					runtime: details.runtime,
				}
			);
			testData[testData.length - 1].passed += details.passed;
			testData[testData.length - 1].failed += details.failed;
			testData[testData.length - 1].total += details.total;
			testData[testData.length - 1].runtime += details.runtime;
		} else {
			testData.push({
				module: details.module,
				passed: details.passed,
				failed: details.failed,
				total: details.total,
				runtime: details.runtime,
				data: [{
					name: details.name,
					failed: details.failed,
					passed: details.passed,
					total: details.total,
					runtime: details.runtime,
				}]
			});
		}
	});

	QUnit.log((details: QUnit.LogDetails) => {
		logData.push({
			result: details.result,
			actual: details.actual,
			expected: details.expected,
			message: details.message,
			source: details.source,
			module: details.module,
			name: details.name,
			runtime: details.runtime,
		});
		console.log(`AM-TEST: ${details.result ? "pass" : "FAIL"} test '${details.name}' of '${details.module}' in ${details.runtime}ms with (${strify(details.actual)} == ${strify(details.expected)})`);
	})

}

function strify(logData: any) {
	return JSON.stringify(logData, null, 2);
}
