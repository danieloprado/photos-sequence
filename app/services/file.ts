import { remote } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

import { ServiceError } from '../errors/service';

export class FileService {

  public async askForSave(defaultPath: string): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      remote.dialog.showSaveDialog({ title: 'Salvar', defaultPath: defaultPath }, filename => {
        const originalExt = path.extname(defaultPath);

        if (path.extname(filename) != originalExt) {
          filename += originalExt;
        }

        !filename ? reject(new ServiceError('canceled')) : resolve(filename);
      });
    });
  }

  public async selectFolder(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      remote.dialog.showOpenDialog({ title: 'Selecionar', properties: ['openDirectory'] }, paths => {
        !paths ? reject(new ServiceError('canceled')) : resolve(paths[0]);
      });
    });
  }

  public async exists(path: string): Promise<boolean> {
    return await new Promise<boolean>((resolve, reject) => {
      fs.exists(path, exists => {
        resolve(exists);
      });
    });
  }

  public async copy(source: string, destination: string): Promise<void> {
    return await new Promise<void>((resolve, reject) => {
      fs.createReadStream(source)
        .pipe(fs.createWriteStream(destination))
        .on('finish', () => resolve())
        .on('error', err => reject(err));
    });
  }

  public async readDir(folder: string): Promise<string[]> {
    return await new Promise<string[]>((resolve, reject) => {
      fs.readdir(folder, (err, files) => {
        err ? reject(err) : resolve(files);
      });
    });
  }

  public async createFolder(path: string): Promise<void> {
    if (await this.exists(path)) return;

    return new Promise<void>((resolve, reject) => {
      fs.mkdir(path, (err) => err ? reject(err) : resolve());
    });
  }

}
