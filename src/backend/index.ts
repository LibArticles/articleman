
// @ts-ignore
global.onOpen = function onOpen() {
  // start the user interface as a dialog in google sheets
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.getUi()
  .createMenu('Articleman')
    .addItem('Open Articleman...', 'showSidebar')
    .addToUi();
}

// @ts-ignore
global.showSidebar = () => {
SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutputFromFile('frontend').setTitle('Articleman')); // @ts-ignore
}