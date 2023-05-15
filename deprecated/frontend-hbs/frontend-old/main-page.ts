import Handlebars from "handlebars"; 


// @ts-ignore
import BigTitle from "./components/bigtitle.dry.hbs";
// @ts-ignore
import SubTitle from "./components/subtitle.dry.hbs";





export default function renderHome() {
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

  document.getElementById("main-container").innerHTML = bigTitle({
    text: "Articleman isn't able to parse the spreadsheet.",
  }) + subTitle({
    text: "Go to Settings to fix it.",
  })
  
  document.querySelector('.header .inner .page').innerHTML = "Home";


}

console.timeEnd('render');