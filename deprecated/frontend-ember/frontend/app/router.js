import EmberRouter from '@ember/routing/router';
import config from 'frontend/config/environment';

export default class Router extends EmberRouter {
	location = config.locationType;
	rootURL = config.rootURL;
}

Router.map(function () {
	this.route('settings', function () {
		this.route('datasets');
	});
	this.route('system');
	this.route('people');
	this.route('work');
});
