import { EditorBlockElementConfig, EditorInlineElementConfig } from '../types';

export function isBlockElementConfig(
  config: EditorBlockElementConfig | EditorInlineElementConfig,
): config is EditorBlockElementConfig {
  return config.display === 'block';
}

export function isInlineElementConfig(
  config: EditorBlockElementConfig | EditorInlineElementConfig,
): config is EditorInlineElementConfig {
  return config.display === 'inline';
}

export function getBlockElementConfigs(
  configs: (EditorBlockElementConfig | EditorInlineElementConfig)[],
): EditorBlockElementConfig[] {
  return configs.filter(isBlockElementConfig);
}
