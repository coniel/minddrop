import { createArrayStore } from '@minddrop/utils';
import { NodeClassifierConfig } from './types';

export const NodeClassifierConfigsStore =
  createArrayStore<NodeClassifierConfig>('id');

/**
 * Registers a NodeClassifierConfig.
 *
 * @param config - The config to register.
 */
export function registerNodeClassifierConfig(
  config: NodeClassifierConfig,
): void {
  NodeClassifierConfigsStore.add(config);
}

/**
 * Unregisters a NodeClassifierConfig by file type.
 *
 * @param id - The ID of the config to unregister.
 */
export function unregisterNodeClassifierConfig(id: string): void {
  NodeClassifierConfigsStore.remove(id);
}
