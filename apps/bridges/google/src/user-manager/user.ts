import { AMUserGroup } from '.';
import { uniq as _uniq } from 'lodash-es';

export default class User {
	email: string;
	id: string;
	termsOfAddress: TermsOfAddress;
	capabilities: string[];
	locale?: string;
	onboarded: boolean;
	type = 'user';
	attributes: {
		[attr: string]: string | boolean | number;
	};
	groups: AMUserGroup[];

	get computedCapabilities(): string[] {
		const allGroupCaps = this.groups.flatMap((group) => group.capabilities);
		const userCaps = this.capabilities;

		return _uniq(allGroupCaps.concat(userCaps));
	}

	constructor(input: UserConstructor) {
		this.email = input.email;
		this.id = input.id;
		this.termsOfAddress = input.termsOfAddress;
		this.capabilities = input.capabilities;
		this.onboarded = input.onboarded;
		this.attributes = input.attributes;
		this.groups = input.groups;
	}
}

export interface UserConstructor {
	email: string;
	id: string;
	groups: AMUserGroup[];
	termsOfAddress: TermsOfAddress;
	locale?: string;
	attributes: {
		[attr: string]: string | boolean | number;
	};
	capabilities: string[];
	onboarded: boolean;
}

export interface TermsOfAddress {
	[language: string]: {
		// pronouns and titles
		title?: {
			text: string;
		};
		name?: {
			short: string;
			surname: string;
			full: string;
		};
		pronouns: {
			tactic?:
				| 'alternateDaily'
				| 'alternateSentence'
				| 'alternateWord'
				| 'static';
			staticIndex?: number;
			values: {
				// TODO: once the app is better localized, make this more language-agnostic! maybe have a separate type for each language?
				subject: string; // they are
				object: string; // with them
				possessive: {
					determiner: string; // their things
					pronoun: string; // of theirs
				};
				reflexive: string; // by themself
			}[];
		};
	};
}
