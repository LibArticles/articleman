import './main-page';
import './styles.scss';
import renderHome from './main-page.js';
import renderSettings from './settings.js';
import renderSystem from './system.js';

import Handlebars from "handlebars";

// @ts-ignore
import HomeIcon from "./assets/home.svg";
// @ts-ignore
import SettingsIcon from "./assets/settings.svg";
// @ts-ignore
import DebugIcon from "./assets/debug.svg";
// @ts-ignore
import PeopleIcon from "./assets/people.svg";
// @ts-ignore
import MeIcon from "./assets/me.svg";

// @ts-ignore
import Header from "./layout/header.dry.hbs";
// @ts-ignore
import Footer from "./layout/footer.dry.hbs";
// @ts-ignore
import HeaderContain from "./layout/headercontainer.dry.hbs";
// @ts-ignore
import Main from "./layout/main.dry.hbs";
// @ts-ignore
import FooterContain from "./layout/footercontainer.dry.hbs";

export default function init(isAdmin: boolean = true, isDebugMode: boolean = true) { // @ts-ignore
  if (global.isAdmin) isAdmin = true; // @ts-ignore
  if (global.isDebugMode) isDebugMode = true; // @ts-ignore
  if (global.isAdmin === false) isAdmin = false; // @ts-ignore
  if (global.isDebugMode === false) isDebugMode = false;

  let header = Handlebars.compile(Header);
  let footer = Handlebars.compile(Footer);

  document.getElementById("app").innerHTML = HeaderContain + Main + FooterContain;

  document.getElementById("header-container").innerHTML = header({
    title: "Articleman",
    page: "Home",
  });

  document.getElementById("footer-container").innerHTML = footer({
    isAdmin: isAdmin,
    isDebugMode: isDebugMode,
    icons: {
      home: HomeIcon,
      settings: SettingsIcon,
      debug: DebugIcon,
      people: PeopleIcon,
      me: MeIcon,
    }
  });

  let homeButton = document.querySelector('.footer .button.home');
  homeButton.classList.add('active');

  homeButton.addEventListener('click', () => {
    homeButton.addEventListener('click',homeButtonClick);
    homeButton.addEventListener('keydown', (e) => { // @ts-ignore
      if (e.key === "Enter") {
        homeButtonClick();
      }
    });

    function homeButtonClick() {
      document.querySelectorAll('.footer .button.active').forEach((el) => {
        el.classList.remove('active');
      });
      homeButton.classList.add('active');
      renderHome();
    }
  });

  // @ts-ignore
  if (isAdmin) {
    let settingsButton = document.querySelector('.footer .button.settings'); 
    settingsButton.addEventListener('click', settingsButtonClick);
    settingsButton.addEventListener('keydown', (e) => { // @ts-ignore
      if (e.key === "Enter") {
        settingsButtonClick();
      }
    });

    function settingsButtonClick() {
      document.querySelectorAll('.footer .button.active').forEach((el) => {
        el.classList.remove('active');
      });
      settingsButton.classList.add('active');
      renderSettings();
    }
  }

  // @ts-ignore
  if (isDebugMode) {
    let systemButton = document.querySelector('.footer .button.debug');
    systemButton.addEventListener('click', systemButtonClick);
    systemButton.addEventListener('keydown', (e) => { // @ts-ignore
      if (e.key === "Enter") {
        systemButtonClick();
      }
    });

    function systemButtonClick() {
      document.querySelectorAll('.footer .button.active').forEach((el) => {
        el.classList.remove('active');
      });
      systemButton.classList.add('active');
      renderSystem();
    }
  }





  renderHome();
}
init();