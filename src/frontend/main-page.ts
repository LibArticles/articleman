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

console.time('render');

let header = Handlebars.compile(Header);

document.getElementById("app").innerHTML = HeaderContain + Main + FooterContain;

document.getElementById("header-container").innerHTML = header({
  title: "Articleman",
  page: "Home",
});

let bigTitle = Handlebars.compile(BigTitle);
let subTitle = Handlebars.compile(SubTitle);
let columnSelect = Handlebars.compile(ColumnSelect);

document.getElementById("main-container").innerHTML = bigTitle({
  text: "Articles aren't loading right now.",
}) + subTitle({
  text: "By a mysterious ghost",
}) + columnSelect({
  types: [
    { value: {
      long: "Article name",
      short: "thingName"
    }, selected: false},
    { value: {
      long: "Task",
      short: "task"
    }, selected: false},
    { value: {
      long: "Run",
      short: "run"
    }, selected: false},
  ],
  id: "bhfdwjfbwhjfbwhjfbnh"
});

console.timeEnd('render');