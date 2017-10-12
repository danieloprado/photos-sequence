import * as angular from 'angular';

import { $exceptionHandler } from './exceptionHandler';
import { Loader } from './loader';
import { Toast } from './toast';

export const moduleName: string = 'Providers';
const app = angular.module(moduleName, []);

app.factory('loader', Loader);
app.factory('toast', Toast);
app.factory('$exceptionHandler', $exceptionHandler);
