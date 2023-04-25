import Handlebars from "handlebars"; 

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
// @ts-ignore
import BigTitle from "./components/bigtitle.dry.hbs";
// @ts-ignore
import SubTitle from "./components/subtitle.dry.hbs";
// @ts-ignore
import ColumnSelect from "./components/columnselect.dry.hbs";

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

console.time('render');

let header = Handlebars.compile(Header);
let footer = Handlebars.compile(Footer);

document.getElementById("app").innerHTML = HeaderContain + Main + FooterContain;

document.getElementById("header-container").innerHTML = header({
  title: "Articleman",
  page: "Home",
});

document.getElementById("footer-container").innerHTML = footer({
  isAdmin: true,
  isDebugMode: true,
  icons: {
    home: HomeIcon,
    settings: SettingsIcon,
    debug: DebugIcon,
    people: PeopleIcon,
    me: MeIcon,
  }
});

let bigTitle = Handlebars.compile(BigTitle);
let subTitle = Handlebars.compile(SubTitle);
let columnSelect = Handlebars.compile(ColumnSelect);

document.getElementById("main-container").innerHTML = bigTitle({
  text: "Articles aren't loading right now.",
}) + subTitle({
  text: "A mysterious ghost",
})

document.querySelector('.footer .button.home').classList.add('active');

console.timeEnd('render');