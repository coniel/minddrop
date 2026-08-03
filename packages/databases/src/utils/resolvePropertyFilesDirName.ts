import { i18n } from '@minddrop/i18n';
import { PropertyFilesDirNameKey } from '../constants';

/**
 * Resolves the name of the directory used to store property files under
 * `common` storage, falling back to the localised default when none is set.
 *
 * @param dir - The configured directory name, if any.
 * @returns The resolved directory name.
 */
export function resolvePropertyFilesDirName(dir?: string): string {
  return dir || i18n.t(PropertyFilesDirNameKey);
}
