import type SurgicalEngine from 'lib/surgical-engine';
import User, { type TermsOfAddress } from './user';
import {
	set as _set,
	merge as _merge,
	uniq as _uniq,
	cloneDeep as _cloneDeep,
	random as _random,
} from 'lodash';
import type StorageManager from 'lib/storage-manager';
import defaultTOA from 'locale/default-toa.json';
import { v4 as uuidv4 } from 'uuid';
import { injectable, inject } from 'inversify';
import { Capabilities } from './caps';
import Service from 'src/dependencies';

class Names {
	static userStorage = 'user-metadata';
}

//   ███    ███  █████  ██ ███    ██
//   ████  ████ ██   ██ ██ ████   ██
//   ██ ████ ██ ███████ ██ ██ ██  ██
//   ██  ██  ██ ██   ██ ██ ██  ██ ██
//   ██      ██ ██   ██ ██ ██   ████

@injectable()
export default class UserManager {
	activeUser: User;
	private allUsers: {
		[id: string]: User;
	};

	private emailLUT: {
		[email: string]: string;
	};
	private groupLUT: {
		[group: string]: User[];
	};
	private groups: {
		[group: string]: AMUserGroup;
	};
	private attributeMap: UserAttributeSet;

	@inject(Service.Storage)
	private StorageManager: StorageManager;

	@inject(Service.Surgical)
	private engine: SurgicalEngine;

	load(attributeMap: UserAttributeSet) {
		const userEmail = Session.getActiveUser().getEmail();
		const userStorage = this.StorageManager.document.getStored(
			Names.userStorage,
		) as UserStorage;
		this.groups = userStorage.groups;
		this.attributeMap = attributeMap;

		// for each sheet in the map, add the user to the manager and the lookup tables
		for (const sheetId in attributeMap) {
			const sheet = this.engine.getSheetById(sheetId);
			const users = this.engine.getAllObjectsForSheet(sheet);
			const map = attributeMap[sheetId];
			const userLocaleRaw = Session.getActiveUserLocale();
			let userLocale: 'en';
			switch (userLocaleRaw) {
				case 'en':
					userLocale = 'en';
					break;
				default:
					userLocale = 'en';
			}

			for (const surgicalUserObject of users) {
				const userEmail = surgicalUserObject.attributes[
					map.email
				] as string;

				const userStorageEntry = userStorage.main[surgicalUserObject.id];

				const userGroups = userStorageEntry.groups.map(
					(group) => this.groups[group],
				);

				const newUserObject = new User({
					email: userEmail,
					id: surgicalUserObject.id,
					termsOfAddress: userStorageEntry.termsOfAddress ?? defaultTOA,
					attributes: surgicalUserObject.attributes,
					capabilities: userStorageEntry.capabilities ?? [],
					groups: userGroups ?? [],
					onboarded: userStorageEntry.onboarded,
				});

				_set(this.allUsers, [sheetId, newUserObject.id], newUserObject);

				if (!this.activeUser && this.activeUser.email === userEmail) {
					this.activeUser = newUserObject;
				}

				this.emailLUT[map.email] = newUserObject.id;
			}
		}
	}

	newUser(addition: UserAddition) {
		this.guard(Capabilities.UM.addUsers)
		const allGroupCaps = addition.groups.flatMap(
			(group) => group.capabilities,
		);
		const userCaps = addition.capabilities;

		const additionComputedCapabilities = _uniq(allGroupCaps.concat(userCaps));

		if (
			additionComputedCapabilities.every((capability) =>
				this.activeUser.computedCapabilities.includes(capability),
			)
		) {
			const id = uuidv4();
			this.engine.newObject({
				id,
				position: { offset: 0 },
				type: 'append',
				sheetId: addition.sheetId,
				attributes: {
					[this.attributeMap[addition.sheetId].email]: addition.email,
					[this.attributeMap[addition.sheetId].fullName]:
						addition.fullName,
				},
			});

			const userObject = new User({
				email: addition.email,
				id,
				termsOfAddress: addition.termsOfAddress,
				attributes: {
					[this.attributeMap[addition.sheetId].email]: addition.email,
					[this.attributeMap[addition.sheetId].fullName]:
						addition.fullName,
				},
				capabilities: addition.capabilities,
				groups: addition.groups,
				onboarded: false,
			});

			this.allUsers[id] = userObject;
			this.emailLUT[addition.email] = id;

			this.shareWithUser(
				this.engine.backend.spreadsheet,
				'edit',
				userObject,
			);

			this.engine.commit();
		} else {
			throw new Error(
				"cannot add user because they have permissions you don't",
			);
		}
	}

	removeUser(user: User) {
		this.guard(Capabilities.UM.removeUsers)
		if (userBalance(this.activeUser, user)) {
			if (this.activeUser.id === user.id) {
				throw new Error('cannot remove active user');
			}

			const id = user.id;
			const email = user.email;
			const groups = user.groups;
			const attributes = user.attributes;

			delete this.allUsers[id];
			delete this.emailLUT[email];
			for (const group of groups) {
				const newGroup = this.groupLUT[group.id].filter(
					(user) => user.id !== id,
				);
				this.groupLUT[group.id] = newGroup;
			}

			this.unshareWithUser(this.engine.backend.spreadsheet, 'edit', user);

			this.engine.deleteObject({
				id,
				type: 'splice',
			});
			this.engine.commit();
		} else {
			throw new Error(
				"cannot remove user because they have permissions you don't",
			);
		}
	}

	shareWithUser(
		item:
			| GoogleAppsScript.Spreadsheet.Spreadsheet
			| GoogleAppsScript.Document.Document,
		permission: 'edit' | 'view',
		userInput: User,
	) {
		const email = userInput.email;

		if (email) {
			switch (permission) {
				case 'edit':
					item.addEditor(email);
					break;
				case 'view':
					item.addViewer(email);
					break;
				default:
					throw new Error('invalid permission level for sharing');
			}
		} else {
			throw new Error('invalid user input for sharing');
		}
	}

	unshareWithUser(
		item:
			| GoogleAppsScript.Spreadsheet.Spreadsheet
			| GoogleAppsScript.Document.Document,
		permission: 'edit' | 'view',
		userInput: User,
	) {
		const email = userInput.email;

		if (email) {
			switch (permission) {
				case 'edit':
					item.removeEditor(email);
					break;
				case 'view':
					item.removeViewer(email);
					break;
				default:
					throw new Error('invalid permission level for unsharing');
			}
		} else {
			throw new Error('invalid user input for unsharing');
		}
	}

	addGroup(group: AMUserGroup) {
		this.guard(Capabilities.UM.addGroups)
		if (userBalance(this.activeUser, group)) {
			this.groups[group.id] = group;
		} else {
			throw new Error('you do not have the capability to add this group');
		}
	}

	removeGroup(group: AMUserGroup) {
		this.guard(Capabilities.UM.removeGroups)
		if (userBalance(this.activeUser, group)) {
			delete this.groups[group.id];
		} else {
			throw new Error('you do not have the capability to remove this group');
		}
	}

	addCapabilitiesToUser(
		user: User,
		...capabilities: string[]
	) {
		this.guard(Capabilities.UM.promoteUsers)
		if (
			userHasCapabilities(this.activeUser, capabilities) &&
			userBalance(this.activeUser, user)
		) {
			this.allUsers[user.id].capabilities.push(...capabilities);
		}
	}

	removeCapabilitiesFromUser(
		user: User,
		...capabilities: string[]
	) {
		this.guard(Capabilities.UM.demoteUsers)
		if (
			(userBalance(this.activeUser, user),
			userHasCapabilities(this.activeUser, capabilities))
		) {
			this.allUsers[user.id].capabilities = user.capabilities.filter(
				(capability) => !capabilities.includes(capability),
			);
		}
	}

	setTermsOfAddress(
		user: User,
		termsOfAddress: TermsOfAddress,
	) {
		this.guard(Capabilities.UM.editUserTOAs)
		if (userBalance(this.activeUser, user)) {
			_merge(this.allUsers[user.id].termsOfAddress, termsOfAddress);
		}
	}

	setOwnTermsOfAddress(
		termsOfAddress: TermsOfAddress,
	) {
		this.guard(Capabilities.UM.editOwnTOAs)
		if (userBalance(this.activeUser, this.activeUser)) {
			_merge(this.activeUser.termsOfAddress, termsOfAddress);
		}
	}

	setAttributes(
		user: User,
		attributes: { [key: string]: string },
	) {
		this.guard(Capabilities.UM.editUserAttributes)
		if (userBalance(this.activeUser, user)) {
			_merge(this.allUsers[user.id].attributes, attributes);
		}
	}

	setOwnAttributes(attributes: {
		[key: string]: string;
	}) {
		this.guard(Capabilities.UM.editOwnAttributes)
		if (userBalance(this.activeUser, this.activeUser)) {
			_merge(this.activeUser.attributes, attributes);
		}
	}

	commit() {
		const mainStorage: Record<string, object> = {};

		for (const id in this.allUsers) {
			const user = this.allUsers[id];
			mainStorage[id] = {
				termsOfAddress: user.termsOfAddress,
				capabilities: user.capabilities,
				attributes: user.attributes,
				groups: user.groups,
				onboarded: user.onboarded,
				locale: user.locale,
			};
		}
		this.StorageManager.document.store(Names.userStorage, {
			main: mainStorage,
			emailLUT: this.emailLUT,
			groups: this.groups,
		} as UserStorage);
	}

	userCan(capability: string) {
		return this.activeUser.computedCapabilities.includes(capability);
	}

	/**
	 * Terms of Address
	 */
	toa(user: User, locale: string) {
		return user.termsOfAddress[locale];
	}

	pronouns(user: User, locale: string) {
		const pronouns = user.termsOfAddress[locale].pronouns;

		if (pronouns.tactic)
			switch (pronouns.tactic) {
				case 'alternateDaily':
					function getDailyPronoun(user: User) {
						const dayNumber = new Date().getDay();
						const dayPronounIndex =
							(dayNumber % pronouns.values.length) - 1;
						return pronouns.values[dayPronounIndex];
					}
					return getDailyPronoun(user);
				case 'alternateSentence':
					return new SentencePronounGenerator(user, locale);
				case 'alternateWord':
					return new WordPronounGenerator(user, locale);
				default:
					if (pronouns.staticIndex)
						return pronouns.values[pronouns.staticIndex];
					else return pronouns.values[0];
			}
	}

	guard(capability: string) {
		if (!this.userCan(capability))
			throw new Error(
				`You don't have the "${capability}" capability on your user or in any of the groups you're in. Either fix the spelling of the capability, add the "${capability}" capability to your user or a group you're in, or stop trying to hack the system.`,
			);
	}
}






export function userBalance(initiator: User, target: AMUserGroup | User) {
	switch (target.type) {
		case 'group':
			return target.capabilities.every((capability) =>
				initiator.computedCapabilities.includes(capability),
			);
		case 'user':
			return target.computedCapabilities.every((capability) =>
				initiator.computedCapabilities.includes(capability),
			);
	}
}

export function userHasCapabilities(user: User, capabilities: string[]) {
	return capabilities.every((capability) =>
		user.computedCapabilities.includes(capability),
	);
}


class SentencePronounGenerator {
	private toa: TermsOfAddress;
	private index: number;
	private locale: string;

	endSentence() {
		this.index = _random(this.toa[this.locale].pronouns.values.length - 1);
	}

	get pronoun() {
		return this.toa[this.locale].pronouns.values[this.index];
	}

	constructor(user: User, locale: string) {
		this.index = 0;
		this.toa = user.termsOfAddress;
		this.locale = locale;
	}
}

class WordPronounGenerator {
	private toa: TermsOfAddress;
	private locale: string;

	get pronoun() {
		return this.toa[this.locale].pronouns.values[
			_random(this.toa[this.locale].pronouns.values.length - 1)
		];
	}

	constructor(user: User, locale: string) {
		this.toa = user.termsOfAddress;
		this.locale = locale;
	}
}

//     ████████ ██    ██ ██████  ███████ ███████
//        ██     ██  ██  ██   ██ ██      ██
//        ██      ████   ██████  █████   ███████
//        ██       ██    ██      ██           ██
//        ██       ██    ██      ███████ ███████

export interface UserAttributeSet {
	[sheetId: string]: {
		email: string;
		fullName: string;
		nickname?: string;
		attributes: {
			[key: string]: string | boolean | number;
		};
	};
}

export interface AMUserGroup {
	id: string;
	capabilities: string[];
	name: {
		plural: string;
		object: string;
		singular: string;
	};
	type: 'group';
}

interface UserAddition {
	fullName: string;
	email: string;
	groups: AMUserGroup[];
	termsOfAddress: TermsOfAddress;
	capabilities: string[];
	sheetId: string;
}

export interface UserStorage {
	main: {
		[id: string]: {
			termsOfAddress: TermsOfAddress;
			email: string;
			capabilities: string[];
			groups: string[];
			locale?: string;
			onboarded: boolean;
		};
	};
	emailLUT: {
		[email: string]: string;
	};
	groups: {
		[group: string]: AMUserGroup;
	};
}

// make a typescript decorator that automatically checks authentication, like @requires('cap:manageattributes')

/*
	TODO: implement:
	* quick pronoun/name/term of addr lookups from templates, with comfier syntax (done)
	* checking whether a user needs onboarding or not (done!!!)
	* better error handling (duh)
	* PERMISSIONS CHECKING W/ GOOD SYNTAX! (maybe a prelim check for privileged funcs via a decorator, and then further checking via a service?) (done)
	* adding + removing users (done)
	* changing user caps securely (done)
	* adding and removing caps (done)
	* editing attributes (done)

*/

// on first usermanager call, save info to the global object
