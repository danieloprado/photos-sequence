import * as angular from 'angular';

export function pageToolbarOutputDirective($rootScope: angular.IRootScopeService): angular.IDirective {

  return {
    scope: false,
    link: ($scope, elem) => {
      $rootScope.$on('change-page-title', (info, data) => {
        elem.html(data);
      });
    }
  };

}
