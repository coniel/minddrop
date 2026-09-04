import { DesignElementConfigsStore } from '../DesignElementConfigsStore';
import { DesignElementConfig } from '../types';

/**
 * Retrieves all registered design element type configs.
 *
 * @returns An array of the registered design element type configs.
 */
export function getDesignElementConfigs(): DesignElementConfig[] {
  return DesignElementConfigsStore.getAllArray();
}
