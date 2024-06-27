import { createArrayStore } from '@minddrop/utils';
import { NodeRendererConfig, NodeType } from './types';

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

export const useNodeRendererConfig = (
  nodeType: NodeType,
  nodeDisplay?: string,
) => {
  const configs = NodeRendererConfigsStore.useAllItems();
  const defaultConfig = configs.find((config) => config.id === nodeType);

  if (!nodeDisplay) {
    return defaultConfig;
  }

  const config = configs.find(
    (config) => config.nodeType === nodeType && config.id === nodeDisplay,
  );

  return config || defaultConfig;
};
