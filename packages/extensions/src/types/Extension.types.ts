import { ExtensionConfig } from './ExtensionConfig.types';

export interface Extension extends ExtensionConfig {
  /**
   * `false` if the extension is installed but disabled.
   */
  enabled: boolean;

  /**
   * The IDs of the topics in which the extension is enabled.
   */
  topics: string[];
}
