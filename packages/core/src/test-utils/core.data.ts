import { BaseDirectory } from '@minddrop/file-system';

export const configsFileDescriptor = {
  path: 'configs.json',
  options: { dir: BaseDirectory.AppData },
};
