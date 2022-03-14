import { EditorElementConfig } from './EditorElementConfig.types';

export interface EditorPluginConfig {
  /**
   * The elements added by the plugin.
   */
  elements?: EditorElementConfig[];
}
