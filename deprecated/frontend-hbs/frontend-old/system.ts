import Handlebars from "handlebars";

// @ts-ignore
import BigTitle from "./components/bigtitle.dry.hbs";
// @ts-ignore
import SubTitle from "./components/subtitle.dry.hbs";

import init from "./index.js";


export default function renderSystem() {
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
    text: "System",
  }) + subTitle({
    text: "Debugging options and troubleshooting doodads",
  }) + `
  <div class="button adminbutton">
    Switch to Worker Mode
  </div>
  `;
  document.querySelector('.adminbutton').addEventListener('click', () => {
    init(false, false);
    // @ts-ignore
    global.isAdmin = false;
  });

  document.querySelector('.header .inner .page').innerHTML = "System";
}