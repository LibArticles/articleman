import Backend from "./comms/backend.js";
import Handlebars from "handlebars";

// @ts-ignore
import BigTitle from "./components/bigtitle.dry.hbs";
// @ts-ignore
import SubTitle from "./components/subtitle.dry.hbs";


export default function renderSettings() {
  let bigTitle, subTitle; // @ts-ignore
  if (global.bigTitle !== undefined) { // @ts-ignore
    bigTitle = global.bigTitle;
  } else {
    bigTitle = Handlebars.compile(BigTitle); // @ts-ignore
    global.bigTitle = bigTitle;
  } // @ts-ignore
  if (global.subTitle !== undefined) { // @ts-ignore
    subTitle = global.subTitle;
  } else {
    subTitle = Handlebars.compile(SubTitle); // @ts-ignore
    global.subTitle = subTitle;
  }

  
  document.getElementById("main-container").innerHTML = 
  bigTitle({
    text: "Settings",
  }) + subTitle({
    text: "Wooo! Settings!",
  });

  document.querySelector('.header .inner .page').innerHTML = "Settings";

}