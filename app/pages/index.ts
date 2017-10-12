import * as angular from 'angular';

import { Routes } from './routes';
import { component as mainPageComponent } from './main/main';

export const moduleName: string = 'Pages';
const app = angular.module(moduleName, []);

app.component('mainPageComponent', mainPageComponent);
app.config(Routes);
