import '@glint/environment-ember-loose';
import '@glint/environment-ember-template-imports';

// TODO: UPDATE EMBER-INTL TO WHATEVER VERSION FIXES GLINT SUPPORT
// import type EmberIntlRegistry from 'ember-intl/template-registry';

import BackButtonComponent from "frontend/components/back-button";
import MainMenuComponent from "frontend/components/main-menu";
import PageHeaderComponent from "frontend/components/page-header";
import NavButtonComponent from "frontend/components/nav-button";
import svgJar from "ember-svg-jar/helpers/svg-jar";

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry /* extends EmberIntlRegistry */  /* other addon registries */ {


    BackButton: typeof BackButtonComponent;
    MainMenu: typeof MainMenuComponent;
    PageHeader: typeof PageHeaderComponent;
    NavButton: typeof NavButtonComponent;

    "svg-jar": typeof svgJar;

    t: (key: string, options: Record<string, unknown>) => string;
  }
}
