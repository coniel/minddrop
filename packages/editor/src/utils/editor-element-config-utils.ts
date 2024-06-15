import {
  EditorElementConfig,
  EditorBlockElementConfig,
  EditorInlineElementConfig,
} from '../types';

export function isBlockElementConfig(
  config: EditorElementConfig,
): config is EditorBlockElementConfig {
  return config.display === 'block';
}

export function isInlineElementConfig(
  config: EditorElementConfig,
): config is EditorInlineElementConfig {
  return config.display === 'inline';
}

export function getBlockElementConfigs(
  configs: EditorElementConfig[],
): EditorBlockElementConfig[] {
  return configs.filter(isBlockElementConfig);
}
