import Service from '@ember/service';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import RouteInfo from '@ember/routing/-private/route-info';

interface RouteData {
  name: string;
  userId?: string;
  // Add any other data you want to save here
}

export default class RouteHistoryService extends Service {
  @service router!: RouterService;
  routeHistory: RouteData[] = [];

  init() {
    super.init();

    

    this.router.on('routeDidChange', (transition) => {
      const currentRoute = transition.to.name;
      const routeData: RouteData = { name: currentRoute };
      
      // If the current route is a user route, save the user ID
      if (currentRoute.startsWith('user/')) {
        const userId = currentRoute.substring(5);
        routeData.userId = userId;
      }
      
      this.routeHistory.push(routeData);
    });
  }

  back() {
    this.router.transitionTo(
      this.routeHistory[this.routeHistory.length - 2]!.name
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
