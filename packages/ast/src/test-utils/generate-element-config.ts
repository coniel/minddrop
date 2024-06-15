import { BlockElementConfig, InlineElementConfig } from '../types';

export function generateBlockElementConfig(
  type: string,
  config: Partial<BlockElementConfig> = {},
): BlockElementConfig {
  return {
    type,
    fromMarkdown: () => null,
    toMarkdown: () => '',
    ...config,
  };
}

export function generateInlineElementConfig(
  type: string,
  config: Partial<InlineElementConfig> = {},
): InlineElementConfig {
  return {
    type,
    toMarkdown: () => '',
    ...config,
  };
}
