import { Paths } from '@minddrop/utils';

interface Options {
  namePlural: string;
}

export function itemsDirPath(itemType: Options): string;
export function itemsDirPath(itemType: string): string;
export function itemsDirPath(itemType: Options | string): string {
  const namePlural =
    typeof itemType === 'string' ? itemType : itemType.namePlural;

  return `${Paths.workspace}/${namePlural}`;
}
