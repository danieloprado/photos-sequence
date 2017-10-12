import * as angular from 'angular';

import { LogService } from './log';
import { FileService } from './file';
import { GeneratorService } from './generator';

export const moduleName: string = 'Services';
const app = angular.module(moduleName, []);

app.service('logService', LogService);
app.service('fileService', FileService);
app.service('generatorService', GeneratorService);
