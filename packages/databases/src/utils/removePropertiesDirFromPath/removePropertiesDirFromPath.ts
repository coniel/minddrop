import { PropertiesDirName } from '../../constants';

/**
 * Does something useful.
 */
export function removePropertiesDirFromPath(path: string): string {
  const propertiesDirPath = `${PropertiesDirName}/`;
  return path.replace(propertiesDirPath, '');
}
