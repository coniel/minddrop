import { afterEach, describe, expect, it } from 'vitest';
import { isEditableTarget } from './isEditableTarget';

// Renders the markup into the document and returns the element
// matching the selector
function renderTarget(html: string, selector: string): Element {
  document.body.innerHTML = html;

  const element = document.body.querySelector(selector);

  if (!element) {
    throw new Error(`No element matching ${selector}`);
  }

  return element;
}

describe('isEditableTarget', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns false for non-element targets', () => {
    expect(isEditableTarget(null)).toBe(false);
    expect(isEditableTarget(document.createTextNode('text'))).toBe(false);
  });

  it('returns false for inert content', () => {
    expect(isEditableTarget(renderTarget('<p id="target">Text</p>', 'p'))).toBe(
      false,
    );
  });

  it('returns true for form controls text is typed into', () => {
    expect(isEditableTarget(renderTarget('<input />', 'input'))).toBe(true);
    expect(
      isEditableTarget(renderTarget('<textarea></textarea>', 'textarea')),
    ).toBe(true);
    expect(isEditableTarget(renderTarget('<select></select>', 'select'))).toBe(
      true,
    );
  });

  it('returns true for editable content', () => {
    const target = renderTarget('<div contenteditable="true"></div>', 'div');

    // The DOM implementation leaves the editable flag to the
    // browser, so it is defined for the test
    Object.defineProperty(target, 'isContentEditable', { value: true });

    expect(isEditableTarget(target)).toBe(true);
  });
});
