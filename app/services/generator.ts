import { ServiceError } from '../errors/service';
import { FileService } from './file';
import * as lodash from 'lodash';
import * as path from 'path';

export class GeneratorService {
  constructor(
    private fileService: FileService
  ) { }

  public async proccess(source: string, target: string, folderName: string, quantity: number): Promise<void> {
    const okTargetFolder = await this.verifyTargetFolder(target);
    if (!okTargetFolder) throw new ServiceError('target-invalid');

    const content = await this.getSourceContent(source);
    if (!content.length) throw new ServiceError('source-invalid');

    await this.generate(content, path.join(target, folderName), quantity);
  }

  private async generate(content: string[], targetFolder: string, quantity: number): Promise<void> {
    for (let x = 0; x < content.length; x++) {
      const image = content[x];

      for (let y = 0; y < quantity; y++) {
        const finalFolder = `${targetFolder} ${y + 1}`;
        const finalImage = `${(x + 1) + (y * content.length)}${path.extname(image)}`;

        if (x === 0) {
          await this.fileService.createFolder(finalFolder);
        }

        await this.fileService.copy(image, path.join(finalFolder, finalImage));
      }
    }
  }

  private async getSourceContent(folder: string): Promise<string[]> {
    const exists = await this.fileService.exists(folder);
    if (!exists) return [];

    const content = await this.fileService.readDir(folder);
    const images = content.filter(name => /^\d+\.(jpg|jpeg|gif|png|bmp)$/gi.test(name));

    return lodash.sortBy(images, f => Number(f.replace(/\D/gi, ''))).map(f => path.join(folder, f));
  }

  private async verifyTargetFolder(folder: string): Promise<boolean> {
    const exists = await this.fileService.exists(folder);
    if (!exists) return false;

    const content = await this.fileService.readDir(folder);
    return content.length === 0;
  }
}
