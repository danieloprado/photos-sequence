import { ServiceError } from '../errors/service';
import * as raven from 'raven-js';

import { IS_DEV, SENTRY_KEY } from '../settings';

export class LogService {
  constructor(private $injector: angular.auto.IInjectorService) {
    if (!IS_DEV) {
      raven
        .config(SENTRY_KEY)
        .install();
    }

    window.onerror = (event: any) => {
      this.exception(event.reason || event);
    };

    (<any>window).onunhandledrejection = event => {
      this.exception(event.reason);
    };
  }

  public exception(exception: any, cause?: string): void {
    if (!exception) return;

    if (typeof exception === 'string') {
      exception = new Error(exception);
    }

    if (IS_DEV) {
      console.error(exception);
      return;
    }

    if (exception instanceof ServiceError) {
      return;
    }

    exception.cause = cause;
    raven.captureException(exception);
    console.error(exception);
  }

  public addBreadcrumb(message: string, extraData: any = {}): void {
    if (IS_DEV) return;

    raven.captureBreadcrumb({
      message,
      category: 'action',
      data: { extraData }
    });
  }

  public async errorTest(): Promise<void> {
    const $mdDialog = this.$injector.get<angular.material.IDialogService>('$mdDialog');

    const confirm = $mdDialog.prompt()
      .title('Forneça a senha:')
      .placeholder('Senha')
      .ok('OK')
      .cancel('Cancelar');

    await $mdDialog.show(confirm).then(result => {
      if (result !== 'prado123') return;
      throw new Error('Test Error');
    }, () => console.log('canceled'));
  }
}
