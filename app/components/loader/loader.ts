class Controller {
  public hide: boolean = true;

  constructor($scope: angular.IScope, $timeout: angular.ITimeoutService) {
    $scope.$on('loading-started', () => $timeout(() => this.hide = false));
    $scope.$on('loading-finished', () => $timeout(() => this.hide = true));
  }

}

export const component = {
  controller: Controller,
  template: `
      <div ng-if="!$ctrl.hide">
        <md-progress-circular
              class="md-accent"
              md-diameter="60"
              md-mode="indeterminate" />
        </md-progress-circular>
      </div>
  `
};
