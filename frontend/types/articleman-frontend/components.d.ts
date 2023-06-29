import BackButtonComponent from "frontend/components/back-button";
import MainMenuComponent from "frontend/components/main-menu";
import PageHeaderComponent from "frontend/components/page-header";
import t from "ember-intl/helpers/t";
import svgJar from "ember-svg-jar/helpers/svg-jar";

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BackButton: typeof BackButtonComponent;
    MainMenu: typeof MainMenuComponent;
    PageHeader: typeof PageHeaderComponent;
    t: typeof t;
    "svg-jar": typeof svgJar;
  }
}