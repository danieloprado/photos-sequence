import * as angular from 'angular';

import { pageToolbarDirective } from './pageToolbar';
import { pageToolbarOutputDirective } from './pageToolbarOutput';

export const moduleName: string = 'Directives';
const app = angular.module(moduleName, []);

app.directive('pageToolbar', pageToolbarDirective);
app.directive('pageToolbarOutput', pageToolbarOutputDirective);
