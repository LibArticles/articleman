import Handlebars from "handlebars"; 

// @ts-ignore
import Header from "./layout/header.dry.hbs";
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

let header = Handlebars.compile(Header);

document.getElementById("app").innerHTML = HeaderContain + Main + FooterContain;

document.getElementById("header-container").innerHTML = header({
  title: "Articleman",
  page: "Home",
});

document.getElementById("main-container").innerHTML = BigTitle + SubTitle + ColumnSelect;