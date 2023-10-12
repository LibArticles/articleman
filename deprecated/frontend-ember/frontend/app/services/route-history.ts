// https://api.emberjs.com/ember/5.0/classes/RouterService/properties/currentURL?anchor=currentURL

import Service from '@ember/service';
import { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class RouteHistoryService extends Service {
  @service router!: RouterService;
  routeHistory: string[] = [];


  back() {
    if (this.routeHistory.length > 2) {
      this.routeHistory.pop();
      this.router.transitionTo(
        this.routeHistory[this.routeHistory.length - 1]!
      );
    } else {
      if (this.router.currentRoute && this.router.currentRoute.parent) {
        this.routeHistory.pop();
        // if there is no previous, go to the parent route
        this.router.transitionTo(this.router.currentRoute.parent.name);
      }
    }

  }

  get previousRoute() {
    return this.routeHistory[this.routeHistory.length - 2]!;
  }

  get startingRoute() {
    return this.routeHistory[0];
  }
}

// TypeScript declaration for the service
declare module '@ember/service' {
  interface Registry {
    'route-history': RouteHistoryService;
  }
}
