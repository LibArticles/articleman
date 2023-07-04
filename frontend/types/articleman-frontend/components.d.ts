import '@glint/environment-ember-loose';
import '@glint/environment-ember-template-imports';

import BackButtonComponent from "frontend/components/back-button";
import MainMenuComponent from "frontend/components/main-menu";
import PageHeaderComponent from "frontend/components/page-header";
import NavButtonComponent from "frontend/components/nav-button";
import "@gavant/glint-template-types/types/ember-intl/helpers/t";
import t from "ember-intl/helpers/t";
import svgJar from "ember-svg-jar/helpers/svg-jar";

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BackButton: typeof BackButtonComponent;
    MainMenu: typeof MainMenuComponent;
    PageHeader: typeof PageHeaderComponent;
    NavButton: typeof NavButtonComponent;

    "svg-jar": typeof svgJar;
    t: typeof t;
  }
}