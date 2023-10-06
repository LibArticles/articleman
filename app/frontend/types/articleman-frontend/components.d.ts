import '@glint/environment-ember-loose';
import '@glint/environment-ember-template-imports';


import BackButtonComponent from 'frontend/components/back-button';
import MainMenuComponent from 'frontend/components/main-menu';
import PageHeaderComponent from 'frontend/components/page-header';
import NavButtonComponent from 'frontend/components/nav-button';
import type EmberIntlRegistry from 'ember-intl/template-registry';
import EmberSvgJarRegistry from 'ember-svg-jar/template-registry';
import NotificationCenterComponent from 'frontend/components/notification-center';
import NotificationComponent from 'frontend/components/notification';

declare module '@glint/environment-ember-loose/registry' {
	export default interface Registry
		extends EmberIntlRegistry, EmberSvgJarRegistry {
		BackButton: typeof BackButtonComponent;
		MainMenu: typeof MainMenuComponent;
		PageHeader: typeof PageHeaderComponent;
		NavButton: typeof NavButtonComponent;
		NotificationCenter: typeof NotificationCenterComponent
		Notification: typeof NotificationComponent
	}
}
