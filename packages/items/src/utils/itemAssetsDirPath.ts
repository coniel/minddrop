import { AssetsDirPath } from '../constants';

export function itemAssetsDirPath(path: string): string {
  const entryFileNameWithoutExt = path
    .split('/')
    .pop()!
    .split('.')
    .slice(0, -1)
    .join('.');

  const itemParentPath = path.split('/').slice(0, -1).join('/');

  return `${itemParentPath}/${AssetsDirPath}/${entryFileNameWithoutExt}`;
}
