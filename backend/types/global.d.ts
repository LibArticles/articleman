import type User from 'src/user-manager/user';
import type { GlobalUserManager } from 'src/user-manager';

declare global {
	var activeUser: User;
	var userManager: Readonly<GlobalUserManager>;
}
