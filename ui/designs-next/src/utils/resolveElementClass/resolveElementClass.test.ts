import { describe, expect, it } from 'vitest';
import { resolveElementClass } from './resolveElementClass';

describe('resolveElementClass', () => {
  it('returns the base class for unmarked blocks', () => {
    expect(resolveElementClass('element_a', null, null)).toBe(
      'design-block-editor-element',
    );
  });

  it('marks the selected block', () => {
    expect(resolveElementClass('element_a', 'element_a', null)).toBe(
      'design-block-editor-element design-block-editor-element-selected',
    );
  });

  it('marks the dragged block', () => {
    expect(resolveElementClass('element_a', 'element_a', 'element_a')).toBe(
      'design-block-editor-element design-block-editor-element-selected design-block-editor-element-dragging',
    );
  });
});
