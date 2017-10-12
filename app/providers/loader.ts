import * as angular from 'angular';

export class Loader {
  private disabled: number = 0;
  private promises: any[] = [];

  constructor(
    private $q: angular.IQService,
    private $rootScope: angular.IRootScopeService
  ) { }

  public async show<T>(promise: Promise<T>): Promise<T> {
    const minimumTime = this.getMinimumTime();

    if (angular.isArray(promise)) {
      promise = <any>this.$q.all(promise);
    }

    this.promises.push(promise);

    (<any>promise).then(() => minimumTime).then(() => {
      const index = this.promises.indexOf(promise);
      this.promises.splice(index, 1);

      this.emitChange();
    }).catch(err => {
      const index = this.promises.indexOf(promise);
      this.promises.splice(index, 1);

      this.emitChange();
      return Promise.reject(err);
    });

    this.emitChange();
    return await promise;
  }

  public enable(): void {
    if (this.disabled === 0) return;

    this.disabled--;
    this.emitChange();
  }

  public disable(): void {
    if (this.promises.length === 0) return;

    this.disabled++;
    this.emitChange();
  }

  private emitChange(): void {
    const qtd = this.promises.length - this.disabled;
    this.$rootScope.$broadcast(qtd <= 0 ? 'loading-finished' : 'loading-started');
  }

  private getMinimumTime(): angular.IPromise<any> {
    return this.$q(resolve => setTimeout(() => resolve(), 500));
  }

}
