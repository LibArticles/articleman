import Service from '@ember/service';
import { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

interface RouteData {
  name: string;
  params: any;
  // Add any other data you want to save here
}

export default class RouteHistoryService extends Service {
  @service router!: RouterService;
  routeHistory: RouteData[] = [];

  init() {
    super.init();

    

    this.router.on('routeDidChange', (transition) => {
      const currentRoute = transition.to.name;
      const routeData: RouteData = { name: currentRoute,
                                     params: {} };
      
      // save the route's model
      if(transition.to.params) {
        routeData.params = transition.to.params;
      }
      
      this.routeHistory.push(routeData);
    });
  }

  back() {
    this.router.transitionTo(
      this.routeHistory[this.routeHistory.length - 2]!.name,
      this.routeHistory[this.routeHistory.length - 2]!.params
    );
    this.routeHistory.pop();
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
