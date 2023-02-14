import { Core } from '@minddrop/core';
import { RTMarkConfigsStore } from '../RTMarkConfigsStore';
import { RTMarkConfig } from '../types';

/**
 * Registers a rich text mark configs. Dispatches a
 * 'rich-text-mark:register' event for each config.
 *
 * @param core - A MindDrop core instance.
 * @param markConfig - The rich text mark config to register.
 */
export function registerRichTextMark(
  core: Core,
  markConfig: RTMarkConfig,
): void;
/**
 * Registers rich text mark configs. Dispatches a
 * 'rich-text-mark:register' event for each config.
 *
 * @param core - A MindDrop core instance.
 * @param markConfigs - The rich text mark configs to register.
 */
export function registerRichTextMark(
  core: Core,
  markConfigs: RTMarkConfig[],
): void;
export function registerRichTextMark(
  core: Core,
  markConfig: RTMarkConfig | RTMarkConfig[],
): void {
  // Register the config(s)
  RTMarkConfigsStore.register(markConfig);

  // Dispatch a 'rich-text-mark:register' event
  // for each config.
  (Array.isArray(markConfig) ? markConfig : [markConfig]).forEach((config) => {
    core.dispatch('rich-text-mark:register', config);
  });
}
