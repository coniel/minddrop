import { Paths } from '@minddrop/utils';
import { ItemTypeConfigsDir } from '../constants';

interface Options {
  namePlural: string;
}

export function itemTypeConfigFilePath(itemType: Options): string;
export function itemTypeConfigFilePath(itemType: string): string;
export function itemTypeConfigFilePath(itemType: Options | string): string {
  const namePlural =
    typeof itemType === 'string' ? itemType : itemType.namePlural;

  return `${Paths.workspaceConfigs}/${ItemTypeConfigsDir}/${namePlural}.json`;
}
