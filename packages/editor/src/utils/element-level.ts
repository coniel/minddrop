import { EditorBlockElementConfigsStore } from '../BlockElementTypeConfigsStore';
import { EditorInlineElementConfigsStore } from '../InlineElementTypeConfigsStore';

export function isBlockElement(type: string): boolean {
  return !!EditorBlockElementConfigsStore.get(type);
}

export function isInlineElement(type: string): boolean {
  return !!EditorInlineElementConfigsStore.get(type);
}
