import UserManager, { UserAttributeSet } from 'src/user-manager';
import StorageManager from 'lib/storage-manager';
import * as Toolbelt from 'lib/utilities';
import { CMD } from 'shared/recognized-commands';
import { set as _set, get as _get, merge as _merge } from 'lodash';
import { injectable } from 'inversify';
import { Capabilities } from 'src/user-manager/caps';

class Names {
	static userAttributeMap = 'user-attribute-map';
	static userSettings = 'user-settings';
	static globalSettings = 'global-settings';
	static documentSettings = 'document-settings';
}

@injectable()
export default class SettingsManager {
	constructor(
		private UserManager: UserManager,
		private StorageManager: StorageManager,
	) {}

	private _settings: Record<string, OptionGroup | Option | AcceptableValue>;
	private _values: OptionValues;

	registerSettings(cb: (api: SettingsApi) => void) {
		const settings = {};

		let currentGroup = '';

		const api: SettingsApi = {
			group(id, type, cb) {
				const newGroup = {};
				if (id.includes('.') || id === 'children')
					_set(settings, `${currentGroup}.${id}`, {
						id,
						type,
					} as OptionGroup);

				currentGroup = `${currentGroup}.${id}.children`;

				cb(api);

				currentGroup = currentGroup.replace(`.${id}.children`, '');
			},

			setting(id, type, defaultValue) {
				_set(settings, `${currentGroup}.${id}`, {
					id,
					type,
					defaultValue,
				} as Option);
			},
		};

		cb(api);

		this._settings = settings;
	}

	getSettings() {
		return this._settings;
	}

	private _valuePathToOptionPath(path: string) {
		return path.replaceAll('.', '.children.');
	}

	private _OptionPathToValuePath(path: string) {
		return path.replaceAll('.children.', '.');
	}

	getOption(name: string) {
		const userValue = _get(this._values, name) as AcceptableValue;
		const option = _get(
			this._settings,
			name.replaceAll('.', '.children.'),
		) as Option;
		if (option) {
			return userValue ?? option.defaultValue;
		} else {
			throw new Error(
				`Unknown setting: ${name}. Try adding the setting definition to your code.`,
			);
		}
	}

	getSettingMetadata(name: string) {
		if (name.includes('.children')) {
			throw new Error(
				`Input setting ID '${name}' is using SettingsManager Option notation, not the required Value notation.`,
			);
		}
		return _get(this._settings, this._valuePathToOptionPath(name)) as Option;
	}

	private _setSetting(name: string, value: AcceptableValue) {
		const option = _get(
			this._settings,
			this._valuePathToOptionPath(name),
		) as Option;

		if (Toolbelt.classify(value) === option.type)
			_set(this._values, name, value);
		else
			throw new Error(
				`Invalid value (${value.toString()}) for setting ${name}. Expected type ${
					option.type
				}, got type ${Toolbelt.classify(value)} instead.`,
			);
	}

	setSetting(name: string, value: AcceptableValue) {
		const metadata = this.getSettingMetadata(name);
		switch ((metadata as Option).scope) {
			case 'user':
				if (this.UserManager.userCan(Capabilities.SM.editOwnSettings)) {
					this._setSetting(name, value);
				}
				break;
			case 'global':
				if (this.UserManager.userCan(Capabilities.SM.editGlobalSettings)) {
					this._setSetting(name, value);
				}
				break;
			case 'document':
				if (
					this.UserManager.userCan(Capabilities.SM.editDocumentSettings)
				) {
					this._setSetting(name, value);
				}
			default:
				if (this.UserManager.userCan(Capabilities.SM.editGlobalSettings)) {
					this._setSetting(name, value);
				}
				break;
		}
	}

	populate() {
		const userSettings = this.StorageManager.user.getStored(
			Names.userSettings,
		);
		const globalSettings = this.StorageManager.script.getStored(
			Names.globalSettings,
		);
		const documentSettings = this.StorageManager.document.getStored(
			Names.documentSettings,
		);

		Toolbelt.traverseObject(userSettings, (value, path) => {
			const metadata = this.getSettingMetadata(path);
			if ((metadata as Option).scope === 'user') {
				this._setSetting(path, value);
			}
		});

		Toolbelt.traverseObject(globalSettings, (value, path) => {
			const metadata = this.getSettingMetadata(path);
			if ((metadata as Option).scope === 'global') {
				this._setSetting(path, value);
			}
		});

		Toolbelt.traverseObject(documentSettings, (value, path) => {
			const metadata = this.getSettingMetadata(path);
			if ((metadata as Option).scope === 'document') {
				this._setSetting(path, value);
			}
		});
	}

	commit() {
		const userSettings: OptionValues = {};
		const globalSettings: OptionValues = {};
		const documentSettings: OptionValues = {};

		Toolbelt.traverseObject(this._values, (value, path) => {
			const metadata = this.getSettingMetadata(path);
			if (!metadata)
				throw new Error(
					`Unknown setting: ${path}. Try adding the setting definition to your code. For security reasons, your settings won't be committed.`,
				);
			switch (metadata.scope) {
				case 'user':
					if (this.UserManager.userCan(Capabilities.SM.editOwnSettings)) {
						_set(userSettings, path, value);
					}
					break;
				case 'global':
					if (
						this.UserManager.userCan(Capabilities.SM.editGlobalSettings)
					) {
						_set(globalSettings, path, value);
					}
					break;
				case 'document':
					if (
						this.UserManager.userCan(Capabilities.SM.editDocumentSettings)
					) {
						_set(documentSettings, path, value);
					}
					break;
				default:
					if (
						this.UserManager.userCan(Capabilities.SM.editGlobalSettings)
					) {
						_set(globalSettings, path, value);
					}
					break;
			}
		});

		this.StorageManager.user.store(Names.userSettings, userSettings);
		this.StorageManager.script.store(Names.globalSettings, globalSettings);
		this.StorageManager.document.store(
			Names.documentSettings,
			documentSettings,
		);
	}
}

interface SettingsApi {
	group(name: string, type: GroupType, cb: (api: SettingsApi) => void): void;
	setting(path: string, type: OptionType, defaultValue: AcceptableValue): void;
}

interface OptionValues {
	[key: string]: AcceptableValue | OptionValues;
}

interface HydratedOption extends Option {
	value: AcceptableValue;
}

interface OptionGroup {
	id: string;
	children: Record<string, Option | OptionGroup>;
	type: 'radio' | 'checkbox' | 'section';
}

interface Option {
	id: string;
	type: OptionType;
	defaultValue: AcceptableValue;
	scope: OptionScope;
}

type OptionScope = 'user' | 'document' | 'global';

type OptionType = 'boolean' | 'number' | 'string' | 'array';
type GroupType = 'radio' | 'checkbox' | 'section';

type AcceptableValue = string | number | boolean | Array<AcceptableValue>;

/**
 *	TODO: implement.
 * methods:
 *  	registerSettings: similar to a route system in an app, it uses nested callbacks to create a settings structure. (done)
 *  	getSettings: get an object containing all settings and their values. (done)
 *    populateSettings: populate the settings object with input.
 *  	getSetting: get a setting by name.
 *  	setSetting: set a setting by name.
 *
 *
 */
