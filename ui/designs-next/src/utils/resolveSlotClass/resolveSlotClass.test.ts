import { describe, expect, it } from 'vitest';
import { resolveSlotClass } from './resolveSlotClass';

describe('resolveSlotClass', () => {
  it('marks the selected slot block', () => {
    expect(resolveSlotClass('element_caption', 'element_caption')).toBe(
      'design-block-editor-slot design-block-editor-slot-selected',
    );
  });

  it('leaves an unselected slot block unmarked', () => {
    expect(resolveSlotClass('element_caption', 'element_body')).toBe(
      'design-block-editor-slot',
    );
  });
});
