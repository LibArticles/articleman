

import container from './inversify.config';
import type { SocketeerMessage } from './comms/socket';
import type Socketeer from './comms/socket';
import Service from './dependencies';

import config from '../../shared/config.json';

// @ts-ignore
global.onOpen = function onOpen() {
	SpreadsheetApp.getUi()
		.createMenu('Articleman')
		.addItem('Open Articleman...', 'showSidebar')
		.addItem('Open help...', 'showHelp')
		.addToUi();
};

declare namespace global {
	var socketeer: (payload?: SocketeerMessage) => void;
}

const socketeer = container.get<Socketeer>(Service.Socketeer);
global.socketeer = socketeer.checkup.bind(socketeer);

// @ts-ignore
global.onSelectionChange = () => {
	const sheet = SpreadsheetApp.getActiveSheet();
	const row = sheet.getActiveCell().getRow();
	const column = sheet.getActiveCell().getColumn();
	CacheService.getUserCache().put(
		'currentRow',
		JSON.stringify({
			row,
			column,
			sheet: sheet.getName(),
		}),
		21600,
	);
};

// @ts-ignore
global.showSidebar = () => {
	SpreadsheetApp.getUi().showSidebar(
		HtmlService.createHtmlOutput(
			UrlFetchApp.fetch(config.containerUrl),
		).setTitle('Articleman'),
	);
};


// @ts-ignore
global.onInstall = function onInstall() {
	// @ts-ignore
	global.showSidebar();
};
