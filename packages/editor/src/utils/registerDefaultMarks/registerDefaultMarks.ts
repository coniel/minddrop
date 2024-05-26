import { defaultMarkConfigs } from '../../default-mark-configs';
import { registerMarkConfig } from '../../registerMarkConfig';

/**
 * Registers all default marks.
 */
export function registerDefaultMarks(): void {
  defaultMarkConfigs.forEach((config) => {
    registerMarkConfig(config);
  });
}
