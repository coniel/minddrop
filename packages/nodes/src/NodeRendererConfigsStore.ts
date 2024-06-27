import { createArrayStore } from '@minddrop/utils';
import { NodeRendererConfig } from './types';

export const NodeRendererConfigsStore =
  createArrayStore<NodeRendererConfig>('id');

/**
 * Registers a NodeRendererConfig.
 *
 * @param config - The config to register.
 */
export function registerNodeRendererConfig(config: NodeRendererConfig): void {
  NodeRendererConfigsStore.add(config);
}

/**
 * Unregisters a NodeRendererConfig by file type.
 *
 * @param id - The ID of the config to unregister.
 */
export function unregisterNodeRendererConfig(id: string): void {
  NodeRendererConfigsStore.remove(id);
}

/**
 * Retrieves a NodeRendererConfig by ID or null if it doesn't exist.
 *
 * @param id - The ID of the config to retrieve.
 * @returns The config or null if it doesn't exist.
 */
export function getNodeRendererConfig(id: string): NodeRendererConfig | null {
  const config = NodeRendererConfigsStore.get(id);

  return config || null;
}

export const useNodeRendererConfig = NodeRendererConfigsStore.useItem;
