import Handlebars from "handlebars";
let view = document.getElementById("app");

let loader = Handlebars.compile(`
  <div class="loader">
    <div class="hbs-load" data-time-now="{{date}}">Initializing the Articleman interface...</div>
    <div class="hbs-load copyright-notice" style="font-size:0.8em;">&copy; 2023 blue linden, licensed under the GNU AGPL 3.0.</div>
  </div>
`);



view.innerHTML = loader({
  date: new Date().toLocaleString()
});