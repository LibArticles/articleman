// @ts-ignore
function onOpen() {
}
// @ts-ignore
function setSettings() {
}
// @ts-ignore
function getSettings() {
}
// @ts-ignore
function onSelectionChange() {
}
// @ts-ignore
function showSidebar() {
}
// @ts-ignore
function showHelp() {
}/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/backend/comms/getSettings.ts":
/*!******************************************!*\
  !*** ./src/backend/comms/getSettings.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getSettings": () => (/* binding */ getSettings),
/* harmony export */   "setSettings": () => (/* binding */ setSettings)
/* harmony export */ });
function getSettings() {
    return {
        document: JSON.parse(PropertiesService.getDocumentProperties().getProperty('articleman-settings')),
        user: JSON.parse(PropertiesService.getUserProperties().getProperty('articleman-settings')),
        global: JSON.parse(PropertiesService.getScriptProperties().getProperty('articleman-settings')),
    };
}
function mergeSettings(obj1, obj2) {
    return Object.assign({}, obj1, Object.fromEntries(Object.entries(obj2).filter(([key]) => !obj1.hasOwnProperty(key))));
}
function setSettings(settings) {
    const document = mergeSettings(getSettings().document, settings.document);
    const user = mergeSettings(getSettings().user, settings.user);
    const global = mergeSettings(getSettings().global, settings.global);
    PropertiesService.getDocumentProperties().setProperty('articleman-settings', JSON.stringify(document));
    PropertiesService.getUserProperties().setProperty('articleman-settings', JSON.stringify(user));
    PropertiesService.getScriptProperties().setProperty('articleman-settings', JSON.stringify(global));
}


/***/ }),

/***/ "./src/frontend/config.json":
/*!**********************************!*\
  !*** ./src/frontend/config.json ***!
  \**********************************/
/***/ ((module) => {

module.exports = JSON.parse('{"frontendUrl":"https://articleman.bluelinden.art/"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/backend/index.mts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _comms_getSettings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./comms/getSettings.js */ "./src/backend/comms/getSettings.ts");
/* harmony import */ var _frontend_config_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../frontend/config.json */ "./src/frontend/config.json");




// @ts-ignore
__webpack_require__.g.onOpen = function onOpen() {
  // start the user interface as a dialog in google sheets
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.getUi()
  .createMenu('Articleman')
    .addItem('Open Articleman...', 'showSidebar')
    .addItem('Open help...', 'showHelp')
    .addToUi();
}

// @ts-ignore
__webpack_require__.g.setSettings = _comms_getSettings_js__WEBPACK_IMPORTED_MODULE_0__.setSettings;
// @ts-ignore
__webpack_require__.g.getSettings = _comms_getSettings_js__WEBPACK_IMPORTED_MODULE_0__.getSettings;

// @ts-ignore
__webpack_require__.g.onSelectionChange = () => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = sheet.getActiveCell().getRow();
  const column = sheet.getActiveCell().getColumn();
  const cache = CacheService.getUserCache();
  cache.put('currentRow', JSON.stringify({
    row: row,
    column: column,
    sheet: sheet.getName(),
  }), 21600);
}

// @ts-ignore
__webpack_require__.g.showSidebar = () => {
  SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutput(`
  <style>* {margin: 0; padding: 0; border: 0;}</style>
  <iframe src="${_frontend_config_json__WEBPACK_IMPORTED_MODULE_1__.frontendUrl}"></iframe>`).setTitle('Articleman'));

}

// @ts-ignore
__webpack_require__.g.showHelp = () => {
  CacheService.getUserCache().put('help', 'true', 20); // @ts-ignore
  __webpack_require__.g.showSidebar();
}
})();

/******/ })()
;