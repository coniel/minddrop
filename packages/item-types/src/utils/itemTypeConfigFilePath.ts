import { Paths } from '@minddrop/utils';
import { ItemTypeConfigsDir } from '../constants';

interface Options {
  nameSingular: string;
}

export function itemTypeConfigFilePath(itemType: Options): string;
export function itemTypeConfigFilePath(itemType: string): string;
export function itemTypeConfigFilePath(itemType: Options | string): string {
  const nameSingular =
    typeof itemType === 'string' ? itemType : itemType.nameSingular;

  return `${Paths.workspaceConfigs}/${ItemTypeConfigsDir}/${nameSingular}.json`;
}
