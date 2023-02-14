import { Core } from '@minddrop/core';
import { defaultMarkConfigs } from '../../default-mark-configs';
import { RichTextMarks } from '../../RichTextMarks';

/**
 * Registers all default rich text marks.
 */
export function registerDefaultRichTextMarks(core: Core): void {
  RichTextMarks.register(core, defaultMarkConfigs);
}
