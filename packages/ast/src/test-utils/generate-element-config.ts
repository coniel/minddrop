import { ElementTypeConfig } from '../types';

export function generateElementTypeConfig(
  type: string,
  config: Partial<ElementTypeConfig> = {},
): ElementTypeConfig {
  return {
    type,
    display: 'block',
    toMarkdown: () => '',
    ...config,
  };
}

export function generateInlineElementTypeConfig(
  type: string,
  config: Partial<ElementTypeConfig> = {},
): ElementTypeConfig {
  return {
    type,
    display: 'inline',
    toMarkdown: () => '',
    ...config,
  };
}
