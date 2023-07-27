export function getSettings() {
	return {
		document: JSON.parse(
			PropertiesService.getDocumentProperties().getProperty(
				'articleman-settings',
			),
		),
		user: JSON.parse(
			PropertiesService.getUserProperties().getProperty('articleman-settings'),
		),
		global: JSON.parse(
			PropertiesService.getScriptProperties().getProperty(
				'articleman-settings',
			),
		),
	};
}

interface Settings {
	document: {
		[key: string]: any;
	};
	user: {
		[key: string]: any;
	};
	global: {
		[key: string]: any;
	};
}

function mergeSettings(obj1: object, obj2: object): object {
	return Object.assign(
		{},
		obj1,
		Object.fromEntries(
			Object.entries(obj2).filter(([key]) => !obj1.hasOwnProperty(key)),
		),
	);
}

export function setSettings(settings: Settings) {
	const document = mergeSettings(getSettings().document, settings.document);
	const user = mergeSettings(getSettings().user, settings.user);
	const global = mergeSettings(getSettings().global, settings.global);
	PropertiesService.getDocumentProperties().setProperty(
		'articleman-settings',
		JSON.stringify(document),
	);
	PropertiesService.getUserProperties().setProperty(
		'articleman-settings',
		JSON.stringify(user),
	);
	PropertiesService.getScriptProperties().setProperty(
		'articleman-settings',
		JSON.stringify(global),
	);
}
