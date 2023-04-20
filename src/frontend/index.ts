import Handlebars from "handlebars";
let view = document.getElementById("app");

let loader = Handlebars.compile(`
  <div class="loader">
    <div class="hbs-load" data-time-now="{{date}}">Initializing the Articleman interface...</div>
  </div>
`);



if (view) {
  view.innerHTML = loader({
    date: new Date().toLocaleString()
  });
}