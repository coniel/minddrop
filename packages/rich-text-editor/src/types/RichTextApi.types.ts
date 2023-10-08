import { RichTextElementConfig } from './RichTextElementConfig.types';
import { RichTextMarkConfig } from './RichTextMarkConfig.types';

export interface RichTextApi {
  /**
   * Registers a new RichTextElementConfig and dispatches a
   * 'rich-text-editor:element:register' event.
   *
   * @param config - The config to register.
   */
  registerElement(config: RichTextElementConfig): void;

  /**
   * Unregisters a RichTextElementConfig and dispatches a
   * 'rich-text-editor:element:unregister' event.
   *
   * @param type - The type of the config to unregister.
   */
  unregisterElement(type: string): void;

  /**
   * Registers a new RichTextMarkConfig and dispatches a
   * 'rich-text-editor:mark:register' event.
   *
   * @param config - The config to register.
   */
  registerMark(config: RichTextMarkConfig): void;

  /**
   * Unregisters a RichTextMarkConfig and dispatches a
   * 'rich-text-editor:mark:unregister' event.
   *
   * @param key - The key of the config to unregister.
   */
  unregisterMark(key: string): void;
}
