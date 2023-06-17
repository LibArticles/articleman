# Project Articleman

Student journalism has a big problem: managing the publication based on real workflow data is next to impossible unless you've got a dev onstaff. This project aims to solve that problem by providing a simple, easy-to-use, and extensible platform for managing the publication process.

## Stack
The frontend and backend are both written in TypeScript, with the frontend using Ember.js and the backend using Google Apps Script. The data source is Google Sheets, using a custom, in-house parsing system called Dataset Manager. Dataset Manager is more resistant to schema changes than other systems, and doesn't require code changes to add new fields and swap positions.

## Installation
To use a custom frontend you need to have a publicly available domain name. Github.io domains will work. The 'index.html' file in the 'dist' folder is the entry point for the app, and the backend will fetch it from your server to send to the sidebar container in Google Sheets. 

To use a custom frontend, both the backend and frontend have to be modified. Edit the `containerUrl` variable in `shared/config.json` to point to the location of your frontend container. Then, edit the `frontendUrl` variable `shared/config.json` to point to the CDN prefix (for example, `https://articleman.bluelinden.art/`) of the various JavaScript and CSS files linked to by your `index.html` file. Run `pnpm ember build` in the `frontend` folder to build the frontend. Deploy the `dist` folder to your server. Then, follow the paragraph below to deploy the backend, and you're done!

To only build the backend, run `pnpm webpack` in the `backend` folder. Copy the generated JS file in the `dist` folder to a Google Apps Script project attached to your spreadsheet.