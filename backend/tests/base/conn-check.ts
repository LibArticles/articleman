import QUnit from "qunit";

export default QUnit.module('boot-up checks', () => {
	QUnit.test('is it on?', (assert) => {
		assert.ok(true);
	});
	QUnit.test('spreadsheet connectivity', (assert) => {
		const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
		const sheet = spreadsheet.getSheets()[0];

	});
});
