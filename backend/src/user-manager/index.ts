import SurgicalEngine from 'lib/surgical-engine';
import User, { TermsOfAddress } from './user';
import {
	set as _set,
	merge as _merge,
	uniq as _uniq,
	cloneDeep as _cloneDeep,
	random as _random,
} from 'lodash';
import StorageManager from 'lib/storage-manager';
import defaultTOA from 'locale/default-toa.json';
import { v4 as uuidv4 } from 'uuid';
import 'types/global';

class Names {
	static userStorage = 'user-metadata';
}

//   ███    ███  █████  ██ ███    ██
//   ████  ████ ██   ██ ██ ████   ██
//   ██ ████ ██ ███████ ██ ██ ██  ██
//   ██  ██  ██ ██   ██ ██ ██  ██ ██
//   ██      ██ ██   ██ ██ ██   ████

export class UserManager {
	private activeUser: User;
	private allUsers: {
		[id: string]: User;
	};
	private engine: SurgicalEngine;
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

	constructor(
		attributeMap: UserAttributeSet,
		spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
	) {
		this.engine = new SurgicalEngine(spreadsheet);
		const userEmail = Session.getActiveUser().getEmail();
		const userStorage = StorageManager.get(Names.userStorage) as UserStorage;
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

		// create the global user manager and freeze it at a shallow level so that it can't be directly modified
		globalThis.userManager = Object.freeze(
			new GlobalUserManager({
				activeUser: this.activeUser,
				allUsers: this.allUsers,
				emailLUT: this.emailLUT,
				groupLUT: this.groupLUT,
				groups: this.groups,
			}),
		);
	}

	@needs(Capabilities.UM.addUsers) newUser(addition: UserAddition) {
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

	@needs(Capabilities.UM.removeUsers) removeUser(user: User) {
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

	@needs(Capabilities.UM.addGroups) addGroup(group: AMUserGroup) {
		if (userBalance(this.activeUser, group)) {
			this.groups[group.id] = group;
		} else {
			throw new Error('you do not have the capability to add this group');
		}
	}

	@needs(Capabilities.UM.removeGroups) removeGroup(group: AMUserGroup) {
		if (userBalance(this.activeUser, group)) {
			delete this.groups[group.id];
		} else {
			throw new Error('you do not have the capability to remove this group');
		}
	}

	@needs(Capabilities.UM.promoteUsers) addCapabilitiesToUser(
		user: User,
		...capabilities: string[]
	) {
		if (
			userHasCapabilities(this.activeUser, capabilities) &&
			userBalance(this.activeUser, user)
		) {
			this.allUsers[user.id].capabilities.push(...capabilities);
		}
	}

	@needs(Capabilities.UM.demoteUsers) removeCapabilitiesFromUser(
		user: User,
		...capabilities: string[]
	) {
		if (
			(userBalance(this.activeUser, user),
			userHasCapabilities(this.activeUser, capabilities))
		) {
			this.allUsers[user.id].capabilities = user.capabilities.filter(
				(capability) => !capabilities.includes(capability),
			);
		}
	}

	@needs(Capabilities.UM.editUserTOAs) setTermsOfAddress(
		user: User,
		termsOfAddress: TermsOfAddress,
	) {
		if (userBalance(this.activeUser, user)) {
			_merge(this.allUsers[user.id].termsOfAddress, termsOfAddress);
		}
	}

	@needs(Capabilities.UM.editUserAttributes) setAttributes(
		user: User,
		attributes: { [key: string]: string },
	) {
		if (userBalance(this.activeUser, user)) {
			_merge(this.allUsers[user.id].attributes, attributes);
		}
	}
}

//      ██████  ██       ██████  ██████   █████  ██
//     ██       ██      ██    ██ ██   ██ ██   ██ ██
//     ██   ███ ██      ██    ██ ██████  ███████ ██
//     ██    ██ ██      ██    ██ ██   ██ ██   ██ ██
//      ██████  ███████  ██████  ██████  ██   ██ ███████

// so, blue, why do we have a second class for the global user manager?
// well, it's a bit of a hack, i'll admit. it's here cause i need the global user manager object (accessible via globalThis.userManager) to be reachable everywhere, but also be immutable, to avoid code injection attacks being able to modify a user's capabilities.
export class GlobalUserManager {
	private _activeUser: User;
	get activeUser(): User {
		return _cloneDeep(this._activeUser);
	}
	private _allUsers: {
		[id: string]: User;
	};
	get allUsers() {
		return _cloneDeep(this._allUsers);
	}
	private _emailLUT: {
		[email: string]: string;
	};
	get emailLUT() {
		return _cloneDeep(this._emailLUT);
	}
	private _groups: {
		[id: string]: AMUserGroup;
	};
	get groups() {
		return _cloneDeep(this._groups);
	}
	private _groupLUT: {
		[group: string]: User[];
	};
	get groupLUT() {
		return _cloneDeep(this._groupLUT);
	}

	constructor(newGUM: GUMConstructor) {
		this._activeUser = newGUM.activeUser;
		this._allUsers = newGUM.allUsers;
		this._emailLUT = newGUM.emailLUT;
		this._groups = newGUM.groups;
		this._groupLUT = newGUM.groupLUT;
	}
}

interface GUMConstructor {
	activeUser: User;
	allUsers: {
		[id: string]: User;
	};
	emailLUT: {
		[email: string]: string;
	};
	groups: {
		[id: string]: AMUserGroup;
	};
	groupLUT: {
		[group: string]: User[];
	};
}

//     ██   ██ ███████ ██      ██████  ███████ ██████  ███████
//     ██   ██ ██      ██      ██   ██ ██      ██   ██ ██
//     ███████ █████   ██      ██████  █████   ██████  ███████
//     ██   ██ ██      ██      ██      ██      ██   ██      ██
//     ██   ██ ███████ ███████ ██      ███████ ██   ██ ███████

/**
 * Terms of Address
 */
export function toa(user: User, locale: string) {
	return user.termsOfAddress[locale];
}

export function pronouns(user: User, locale: string) {
	const pronouns = user.termsOfAddress[locale].pronouns;

	if (pronouns.tactic)
		switch (pronouns.tactic) {
			case 'alternateDaily':
				function getDailyPronoun(user: User) {
					const dayNumber = new Date().getDay();
					const dayPronounIndex = (dayNumber % pronouns.values.length) - 1;
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

class SentencePronounGenerator {
	private toa: TermsOfAddress;
	index: number;
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

/**
 * Active User Terms of Address
 */
export function autoa() {
	return globalThis.activeUser.termsOfAddress;
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

/**
 *
 * @param capability The capability to check
 * @returns A decorator that checks if the user has the given capability at runtime.
 */
export function needs(capability: string) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: any[]) {
			if (globalThis.activeUser.computedCapabilities.includes(capability)) {
				return originalMethod.apply(this, args);
			} else {
				throw new Error(
					`You don't have the "${capability}" capability on your user or in any of the groups you're in. Either fix the spelling of the capability for the @needs decorator, add the "${capability}" capability to your user or a group you're in, or stop trying to hack the system.`,
				);
			}
		};

		return descriptor;
	};
}

/**
 *
 * @param capability The capability to check
 * @returns Whether the user has the given capability in their computed capabilities
 */
export function userCan(capability: string) {
	return globalThis.activeUser.computedCapabilities.includes(capability);
}

//     ████████ ██    ██ ██████  ███████ ███████
//        ██     ██  ██  ██   ██ ██      ██
//        ██      ████   ██████  █████   ███████
//        ██       ██    ██      ██           ██
//        ██       ██    ██      ███████ ███████

interface UserAttributeSet {
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

interface UserStorage {
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

namespace Capabilities {
	export enum UM {
		/**
		 * User can add new users to Articleman
		 */
		addUsers = 'cap:um:addUsers',

		/**
		 * User can remove users from Articleman
		 */
		removeUsers = 'cap:um:removeUsers',

		/**
		 * User can add new groups to Articleman
		 */
		addGroups = 'cap:um:addGroups',

		/**
		 * User can remove groups from Articleman
		 */
		removeGroups = 'cap:um:removeGroups',

		/**
		 * User can add capabilities present in their computed capabilities to groups
		 */
		promoteGroups = 'cap:um:promoteGroups',

		/**
		 * User can remove capabilities present in their computed capabilities from groups
		 */
		demoteGroups = 'cap:um:demoteGroups',

		/**
		 * User can add other users to groups that have equal or fewer capabilities than their computed capabilities.
		 */
		promoteUsers = 'cap:um:promoteUsers',

		/**
		 * User can remove other users from groups that have equal or fewer capabilities than their computed capabilities, and remove capabilities that are present in their own computed capabilities from other users.
		 */
		demoteUsers = 'cap:um:demoteUsers',

		/**
		 * Edit other users' attributes
		 */
		editUserAttributes = 'cap:um:editUserAttrs',

		/**
		 * Edit other users' terms of address
		 */
		editUserTOAs = 'cap:um:editUserTOAs',
	}
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
