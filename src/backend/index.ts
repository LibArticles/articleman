// start the user interface as a dialog in google sheets
let sheet = SpreadsheetApp.getActiveSpreadsheet();
let ui = SpreadsheetApp.getUi();
ui.createModalSidebar(sheet, "Articleman").show();