import { ElementTypeConfig } from '../types';

export function generateElementTypeConfig(
  type: string,
  config: Partial<ElementTypeConfig> = {},
): ElementTypeConfig {
  return {
    type,
    level: 'block',
    content: 'inline',
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
    level: 'inline',
    content: 'inline',
    toMarkdown: () => '',
    ...config,
  };
}
