import { afterEach, describe, expect, it } from 'vitest';
import { isTextInputTarget } from './isTextInputTarget';

// Appends an element of the given tag to the document
function element(tag: string, contentEditable?: boolean): HTMLElement {
  const node = document.createElement(tag);

  if (contentEditable) {
    node.contentEditable = 'true';
  }

  document.body.appendChild(node);

  return node;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('isTextInputTarget', () => {
  it('returns true for form fields', () => {
    expect(isTextInputTarget(element('input'))).toBe(true);
    expect(isTextInputTarget(element('textarea'))).toBe(true);
    expect(isTextInputTarget(element('select'))).toBe(true);
  });

  it('returns true for editable content', () => {
    expect(isTextInputTarget(element('div', true))).toBe(true);
  });

  it('returns false for other elements', () => {
    expect(isTextInputTarget(element('div'))).toBe(false);
    expect(isTextInputTarget(element('button'))).toBe(false);
  });

  it('returns false for targets which are not elements', () => {
    expect(isTextInputTarget(null)).toBe(false);
    expect(isTextInputTarget(window)).toBe(false);
  });
});
