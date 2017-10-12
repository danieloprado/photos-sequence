import { UrlRouterProvider, StateProvider } from '@uirouter/angularjs';

export function routes(app: angular.IModule): void {
  app.config(configRoutes);
  app.config(configAppState);
}

function configRoutes($urlRouterProvider: UrlRouterProvider, $locationProvider: any): void {
  $locationProvider.html5Mode({ enabled: false, requireBase: false });
  $urlRouterProvider.otherwise('/main');
}

function configAppState($stateProvider: StateProvider): void {
  $stateProvider.state('app', {});
}
