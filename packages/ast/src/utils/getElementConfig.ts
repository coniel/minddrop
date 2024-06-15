import { BlockElementConfig, InlineElementConfig } from '../types';

/**
 * Gets the configuration object for an element type, looking first in the block
 * element configurations and then in the inline element configurations.
 *
 * @param type - The type of element to get the configuration for.
 * @param blockConfigs - The block element configurations.
 * @param inlineConfigs - The inline element configurations.
 * @returns The configuration object or null if not found.
 */
export function getElementConfig(
  type: string,
  blockConfigs: BlockElementConfig[],
  inlineConfigs: InlineElementConfig[],
): BlockElementConfig | InlineElementConfig | null {
  const blockConfig = blockConfigs.find((config) => config.type === type);
  const inlineConfig = inlineConfigs.find((config) => config.type === type);

  return blockConfig || inlineConfig || null;
}
