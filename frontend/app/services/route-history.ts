import Service from '@ember/service';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';


// this service keeps an array of every route that has been visited
export default class RouteHistoryService extends Service {
  @service router!: RouterService;
  routeHistory: string[] = [];

  init() {
    super.init();

    this.router.on('routeDidChange', () => {
      const currentRoute = this.router.currentRouteName;
      this.routeHistory.push(currentRoute);
    });
  }

  // on click, pop the last route from the history stack and navigate to the one before.
  back() {
    this.routeHistory.pop();
    this.router.transitionTo(this.previousRoute);
  }

  get previousRoute() {
    return this.routeHistory[this.routeHistory.length - 1]!;
  }

  get startingRoute() {
    return this.routeHistory[0];
  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:route-history')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('route-history') declare altName: RouteHistoryService;`.
declare module '@ember/service' {
  interface Registry {
    'route-history': RouteHistoryService;
  }
}
