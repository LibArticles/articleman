import Handlebars from "handlebars"; 

// @ts-ignore
import Header from "./layout/header.dry.hbs";

let header = Handlebars.compile(Header);

document.getElementById("app").innerHTML = header({title: "Articleman", page: "Home",});