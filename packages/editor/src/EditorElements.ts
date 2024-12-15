import { EditorBlockElementConfigsStore } from './BlockElementTypeConfigsStore';
import { EditorInlineElementConfigsStore } from './InlineElementTypeConfigsStore';
import { EditorBlockElementConfig, EditorInlineElementConfig } from './types';

export { registerDefaultElements as registerDefaults } from './utils';

/**
 * Registers a new editor block element type configuration.
 *
 * @param config - The element type configuration.
 */
export function registerBlockType(config: EditorBlockElementConfig) {
  EditorBlockElementConfigsStore.add(config);
}

/**
 * Registers a new editor inline element type configuration.
 *
 * @param config - The element type configuration.
 */
export function registerInlineType(config: EditorInlineElementConfig) {
  EditorInlineElementConfigsStore.add(config);
}

/**
 * Unregisters an editor element type configuration.
 *
 * @param type - The element type to unregister.
 */
export function unregisterType(type: string) {
  EditorBlockElementConfigsStore.remove(type);
  EditorInlineElementConfigsStore.remove(type);
}

/**
 * Retrieves the configuration for a block editor element type.
 *
 * @param type - The block element type.
 * @returns The block element configuration, or null if no configuration was found.
 */
export function getBlockTypeConfig(
  type: string,
): EditorBlockElementConfig | null {
  return EditorBlockElementConfigsStore.get(type) || null;
}

/**
 * Retrieves the configuration for an inline editor element type.
 *
 * @param type - The inline element type.
 * @returns The inline element configuration, or null if no configuration was found.
 */
export function getInlineTypeConfig(
  type: string,
): EditorInlineElementConfig | null {
  return EditorInlineElementConfigsStore.get(type) || null;
}

/**
 * Retrieves all editor block element configurations as an array.
 *
 * @returns An array of block element configurations.
 */
export function getAllBlockTypeConfigs(): EditorBlockElementConfig[] {
  return EditorBlockElementConfigsStore.getAll();
}

/**
 * Retrieves all editor inline element configurations as an array.
 *
 * @returns An array of inline element configurations.
 */
export function getAllInlineTypeConfigs() {
  return EditorInlineElementConfigsStore.getAll();
}

/**
 * Clears all editor element configurations.
 *
 * **Note:** This method is intended for testing purposes only.
 */
export function clearTypeConfigs() {
  EditorBlockElementConfigsStore.clear();
  EditorInlineElementConfigsStore.clear();
}
