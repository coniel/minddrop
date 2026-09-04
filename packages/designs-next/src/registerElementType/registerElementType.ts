import { ElementConfigsStore } from '../ElementConfigsStore';
import { DesignElementConfig } from '../types';

/**
 * Registers an element type config.
 *
 * @param config - The element type config to register.
 */
export function registerElementType(config: DesignElementConfig): void {
  ElementConfigsStore.set(config.type, config);
}
