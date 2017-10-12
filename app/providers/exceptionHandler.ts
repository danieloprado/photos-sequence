import { LogService } from '../services/log';

export function $exceptionHandler(logService: LogService): angular.IExceptionHandlerService {

  return (exception, cause) => {
    logService.exception(exception, cause);
  };
}
