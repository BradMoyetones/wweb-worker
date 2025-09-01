import { is } from '@electron-toolkit/utils';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const basePath = is.dev
  ? path.join(__dirname, '../../src/renderer/public')
  : path.join(process.resourcesPath, 'app.asar.unpacked', 'out', 'renderer');


export { basePath };
