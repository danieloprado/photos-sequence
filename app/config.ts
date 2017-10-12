export function config(app: angular.IModule): void {
  app.run(fixAsyncDigest);
  app.run(fixMdPicker);
  app.config(fixBinding);
  app.config(configIcons);
  app.config(configTheme);
  app.config(configErrorMessages);
}

function fixBinding($compileProvider: angular.ICompileProvider): void {
  $compileProvider.preAssignBindingsEnabled(true);
}

function fixMdPicker($mdDialog: angular.material.IDialogService): void {
  const oldShow = $mdDialog.show;

  $mdDialog.show = function (options: any): any {
    if (options.hasOwnProperty('skipHide')) {
      options.multiple = options.skipHide;
    }

    return oldShow(options);
  };
}

function fixAsyncDigest($timeout: angular.ITimeoutService): void {
  const originalPromise = (<any>window).originalPromise = Promise;
  let timeout;

  const forceDigest = () => {
    $timeout.cancel(timeout);
    timeout = $timeout(() => { }, 100);
  };

  (<any>window).Promise = function <T>(callback: any): Promise<T> {
    return new originalPromise<T>(callback).then(data => {
      forceDigest();
      return data;
    }).catch(err => {
      forceDigest();
      throw err;
    });
  };
  (<any>window).Promise.resolve = originalPromise.resolve;
  (<any>window).Promise.reject = originalPromise.reject;
  (<any>window).Promise.all = originalPromise.all;
}

function configIcons($mdIconProvider: angular.material.IIconProvider): void {
  $mdIconProvider.defaultIconSet(__dirname + '/svgs/mdi.svg');
}

function configErrorMessages(mdFormValidatorProvider: any): void {
  mdFormValidatorProvider.setMessage('required', 'Obrigatório');
  mdFormValidatorProvider.setMessage('date', 'Data inválida');
  mdFormValidatorProvider.setMessage('time', 'Hora inválida');
  mdFormValidatorProvider.setMessage('email', 'Email inválido');
  mdFormValidatorProvider.setMessage('number', 'Número inválido');
  mdFormValidatorProvider.setMessage('url', 'Url inválida');
  mdFormValidatorProvider.setMessage('cpf', 'CPF inválido');
  mdFormValidatorProvider.setMessage('cnpj', 'CNPJ inválido');
  mdFormValidatorProvider.setMessage('min', 'Deve ter ser no minimo {min}');
  mdFormValidatorProvider.setMessage('max', 'Deve ter ser no máximo {max}');
  mdFormValidatorProvider.setMessage('md-maxlength', 'Deve ter no máximo {md-maxlength} caracteres');
  mdFormValidatorProvider.setMessage('minlength', 'Deve ter no minimo {ng-minlength} caracteres');
}

function configTheme($mdThemingProvider: angular.material.IThemingProvider): void {
  $mdThemingProvider.definePalette('customPrimary', {
    50: '#5cc0f6',
    100: '#44b7f5',
    200: '#2caef3',
    300: '#14a4f2',
    400: '#0c96e0',
    500: '#0b86c8',
    600: '#0a76b0',
    700: '#086698',
    800: '#07557f',
    900: '#064567',
    A100: '#75caf7',
    A200: '#8dd3f9',
    A400: '#a5dcfa',
    A700: '#04354f',
    contrastDefaultColor: 'light'
  });

  $mdThemingProvider.definePalette('customAccent', {
    50: '#022436',
    100: '#04344e',
    200: '#054466',
    300: '#06547f',
    400: '#076597',
    500: '#0875b0',
    600: '#0a95e0',
    700: '#10a4f4',
    800: '#28adf5',
    900: '#41b7f6',
    A100: '#0a95e0',
    A200: '#0985C8',
    A400: '#0875b0',
    A700: '#59c0f8',
    contrastDefaultColor: 'light'
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('customPrimary')
    .accentPalette('customAccent');
}
