import './_globals';
import '@uirouter/angularjs';
import 'angular';
import 'angular-i18n/angular-locale_pt-br';
import 'angular-input-masks';
import 'angular-material';
import 'angular-messages';
import 'angular-sanitize';
import 'md-form-validator';
import 'source-map-support/register';

import * as angular from 'angular';

import { config } from './config';
import { moduleName as directivesModule } from './directives';
import { moduleName as componentsModule } from './components';
import { moduleName as pagesModule } from './pages';
import { moduleName as providersModule } from './providers';
import { routes } from './routes';
import { moduleName as servicesModule } from './services';

export const app = angular.module('App', [
  'ui.router',
  'ngAria',
  'ngAnimate',
  'ngMaterial',
  'ngSanitize',
  'ngMessages',
  'mdFormValidator',
  'ui.utils.masks',
  pagesModule,
  providersModule,
  servicesModule,
  directivesModule,
  componentsModule
]);

config(app);
routes(app);
