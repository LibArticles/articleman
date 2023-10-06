export namespace Capabilities {
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

		/**
		 * Edit own terms of address
		 */
		editOwnTOAs = 'cap:um:editOwnTOAs',

		/**
		 * Edit own attributes
		 */
		editOwnAttributes = 'cap:um:editOwnAttrs',
	}

	export enum SM {
		/**
		 * User can edit their own settings
		 */
		editOwnSettings = 'cap:sm:editOwnSettings',

		/**
		 * User can edit other users' settings
		 */
		editGlobalSettings = 'cap:sm:editGlobalSettings',

		/**
		 * User can edit document settings
		 */
		editDocumentSettings = 'cap:sm:editDocumentSettings',
	}
}
