import { StateProvider } from '@uirouter/angularjs';

export class Routes {
  constructor($stateProvider: StateProvider) {
    $stateProvider.state('app.main', {
      url: '/main',
      component: 'mainPageComponent'
    });
  }
}
