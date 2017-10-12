import * as angular from 'angular';

import { LogService } from '../services/log';

export class Toast {
  private GENERIC_MESSAGES: any = {
    invalid: 'Inválido',
    'not-found': 'Não encontrado',
    'os-not-supported': 'O Sistema Operacional não suporta essa ação',
    'not-connected': 'Não conectado com o servidor de Intranet',
  };

  private STATUS_MESSAGES: any = {
    400: 'Dados inválidos',
    409: 'Conflito',
    403: 'Você não tem permissão de acesso'
  };

  constructor(
    private $mdToast: angular.material.IToastService,
    private logService: LogService
  ) { }

  public async show(message: string, theme: 'success' | 'error' = null): Promise<void> {
    const toast = this.$mdToast
      .simple().toastClass('md-toast-' + theme)
      .textContent(message)
      .position('top right')
      .hideDelay(theme === 'error' ? 20000 : 5000)
      .action('OK');

    await this.$mdToast.show(toast);
  }

  public async genericError(err: any = null): Promise<void> {
    if (err) {
      if (err.message === 'os-not-supported') {
        return await this.show('O Sistema Operacional não suporta essa ação', 'error');
      }

      console.error(err);
    }

    await this.show('Aconteceu um erro inesperado...', 'error');
  }

  public async notFound(): Promise<void> {
    this.show('Não encontrado', 'error');
  }

  public async errorHandler(err: any, messages: Object = {}): Promise<void> {
    err = err || {};

    if (err.isToast || err.isConfirm) return;

    let message = null;
    const status = err.status || '';

    if (err instanceof Error) {
      this.logService.exception(err);
    }

    if (err.data && err.data.message) {
      message = this.getMessage(err.data, messages) || err.data.message;
    }

    if (err.message) {
      message = this.getMessage(err, messages);
    }

    if (typeof err.data === 'string') {
      message = this.getMessage({ message: err.data }, messages) || err.data;
    }

    if (typeof err === 'string') {
      message = this.getMessage({ message: err }, messages) || err;
    }

    if (message) {
      return await this.show(message, 'error');
    }

    if (this.STATUS_MESSAGES[status]) {
      return await this.show(this.STATUS_MESSAGES[status], 'error');
    }

    this.genericError();
  }

  private getMessage(err: { message: string }, messages: Object): string {
    if (!err) return null;

    const allMessages = { ...this.GENERIC_MESSAGES, ...messages };
    return allMessages[err.message];
  }

}
