import { EditorBlockElementConfigsStore } from '../BlockElementTypeConfigsStore';
import { EditorInlineElementConfigsStore } from '../InlineElementTypeConfigsStore';
import { EditorBlockElementConfig, EditorInlineElementConfig } from '../types';

export function getElementTypeConfig(
  type: string,
): EditorBlockElementConfig | EditorInlineElementConfig | null {
  return (
    EditorBlockElementConfigsStore.get(type) ||
    EditorInlineElementConfigsStore.get(type) ||
    null
  );
}
