import * as angular from 'angular';

import { component as loaderComponent } from './loader/loader';

export const moduleName: string = 'Components';
const app = angular.module(moduleName, []);

app.component('appLoaderComponent', loaderComponent);
