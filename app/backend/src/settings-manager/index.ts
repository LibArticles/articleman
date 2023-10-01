import UserManager, { UserAttributeSet } from 'src/user-manager';
import StorageManager from 'lib/storage-manager';
import Socketeer from 'src/comms/socket';
import { CMD } from 'shared/recognized-commands';
import { set as _set } from 'lodash';

class Names {
	static userAttributeMap = 'user-attribute-map';
}

export default class SettingsManager {
	private _userManager: UserManager;
	private _settings: Record<string, OptionGroup>;
	private _values: Record<string, AcceptableValue>;

	constructor(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
		// load user maps for the given spreadsheet
		const userAttributeMap = StorageManager.document.getStored(
			Names.userAttributeMap,
		) as UserAttributeSet | undefined;

		if (userAttributeMap) {
			this._userManager = new UserManager(userAttributeMap, spreadsheet);
		} else {
			Socketeer.send({
				type: CMD.Frontend.Onboarding.trigger,
				payload: {
					settings: ['users.userAttributeMap'],
				},
				nextPoll: 3000,
			});
		}
	}

	registerSettings(cb: (api: SettingsApi) => void ) {
		const settings = {};

		let currentGroup = '';

		const api: SettingsApi = {
			group(id, type, cb) {
				const newGroup = {};
				_set(settings, `${currentGroup}.${id}`, {
					id,
					type,
				});

				currentGroup = `${currentGroup}.${id}.children`;

				cb(api);

				currentGroup = currentGroup.replace(`.${id}.children`, '');
			},

			setting(id, type) {
				_set(settings, `${currentGroup}.${id}`, {
					id,
					type,
				});
			},
		};

		cb(api);

		this._settings = settings;
	}
}

interface SettingsApi {
	group(name: string, type: GroupType, cb: (api: SettingsApi) => void): void;
	setting(path: string, type: OptionType): void;
}

interface OptionGroup {
	id: string;
	children: GroupType;
	type: 'radio' | 'checkbox' | 'section';
}

interface Option {
	id: string;
	type: OptionType;
	value: AcceptableValue;
}

type OptionType = 'boolean' | 'number' | 'string' | 'array';
type GroupType = 'radio' | 'checkbox' | 'section';

type AcceptableValue = string | number | boolean | Array<AcceptableValue>;

/**
 *	TODO: implement.
 * methods:
 *  	registerOption: register a setting at a certain scope and allow it to be modified. happens every time during initialization.
 *  	registerGroup: register a group of settings at a certain scope. takes a function that registers a group of settings, and returns the class, for chaining purposes.
 *  	getSettings: get an object containing all settings and their values.
 *    populateSettings: populate the settings object with input.
 *  	getSetting: get a setting by name.
 *  	setSetting: set a setting by name.
 *
 *
 */
