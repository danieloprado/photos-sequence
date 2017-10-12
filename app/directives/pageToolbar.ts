import * as angular from 'angular';

export function pageToolbarDirective($compile: angular.ICompileService): angular.IDirective {

  return {
    restrict: 'E',
    scope: false,
    priority: 1,
    replace: false,
    terminal: true,
    compile: (tElement) => {
      const html = tElement.html();

      return {
        pre: $scope => {
          tElement.remove();
          $scope.$emit('change-page-title', $compile(`<div>${html}</div>`)($scope));
        }
      };
    }
  };

}
