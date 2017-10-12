import { Toast } from '../../providers/toast';
import { ServiceError } from '../../errors/service';
import { IS_DEV } from '../../settings';
import { Loader } from '../../providers/loader';
import { GeneratorService } from '../../services/generator';
import { FileService } from '../../services/file';
import { LogService } from '../../services/log';

class MainController implements angular.IComponentController {
  private clickErrorCounter: number = 0;
  private clickErrorTimeout: NodeJS.Timer;
  private model: { source?: string, target?: string, folderName?: string, quantity?: number };

  constructor(
    private toast: Toast,
    private loader: Loader,
    private logService: LogService,
    private fileService: FileService,
    private generatorService: GeneratorService
  ) { }

  public async $onInit(): Promise<void> {
    this.model = {};

    if (IS_DEV) {
      this.model = {
        folderName: 'Paris',
        quantity: 50,
        source: 'C:\\Users\\daniel\\Pictures\\Aps',
        target: 'C:\\Users\\daniel\\Pictures\\dest'
      };
    }
  }

  public async errorTest(): Promise<void> {
    this.clickErrorCounter++;

    if (this.clickErrorCounter === 9) {
      this.logService.errorTest();
    }

    clearTimeout(this.clickErrorTimeout);
    this.clickErrorTimeout = setTimeout(() => {
      this.clickErrorCounter = 0;
    }, 1000);
  }

  public async selectFolder(prop: string): Promise<void> {
    const folder = await this.fileService.selectFolder();
    this.model[prop] = folder;
  }

  public async submit(): Promise<void> {
    try {
      await this.loader.show(this.generatorService.proccess(
        this.model.source,
        this.model.target,
        this.model.folderName,
        this.model.quantity
      ));
      this.toast.show('Imagens geradas com sucesso!', 'success');
    } catch (err) {
      if (!(err instanceof ServiceError)) throw err;

      const messages = {
        'source-invalid': 'A pasta das fotos deve existir e deve conter imagens numeradas',
        'target-invalid': 'A pasta de destino deve existir e estar vázia',
      };

      this.toast.show(messages[err.message] || 'Erro inesperado', 'error');
    }
  }

}

export const component = {
  controller: MainController,
  templateUrl: __dirname + '/main.html'
};
