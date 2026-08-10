import { afterEach, describe, expect, it } from 'vitest';
import { isInteractiveTarget } from './isInteractiveTarget';

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

describe('isInteractiveTarget', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns false for non-element targets', () => {
    expect(isInteractiveTarget(null)).toBe(false);
    expect(isInteractiveTarget(document.createTextNode('text'))).toBe(false);
  });

  it('returns false for inert content', () => {
    const target = renderTarget(
      '<div><p id="target">Some card text</p></div>',
      '#target',
    );

    expect(isInteractiveTarget(target)).toBe(false);
  });

  it('returns true for native interactive elements', () => {
    expect(isInteractiveTarget(renderTarget('<button id="t" />', '#t'))).toBe(
      true,
    );
    expect(isInteractiveTarget(renderTarget('<input id="t" />', '#t'))).toBe(
      true,
    );
    expect(isInteractiveTarget(renderTarget('<textarea id="t" />', '#t'))).toBe(
      true,
    );
    expect(
      isInteractiveTarget(renderTarget('<a id="t" href="/x">x</a>', '#t')),
    ).toBe(true);
  });

  it('returns true for elements with an interactive role', () => {
    const target = renderTarget(
      '<div role="menuitem" id="target">Item</div>',
      '#target',
    );

    expect(isInteractiveTarget(target)).toBe(true);
  });

  it('returns true for content within an interactive element', () => {
    const target = renderTarget(
      '<button><span id="target">Label</span></button>',
      '#target',
    );

    expect(isInteractiveTarget(target)).toBe(true);
  });

  it('returns true for editable content and its inert islands', () => {
    const target = renderTarget(
      '<div contenteditable="true"><div contenteditable="false" id="target"></div></div>',
      '#target',
    );

    expect(isInteractiveTarget(target)).toBe(true);
  });

  it('returns false for read-only editable content', () => {
    const target = renderTarget(
      '<div contenteditable="false"><p id="target">Read only</p></div>',
      '#target',
    );

    expect(isInteractiveTarget(target)).toBe(false);
  });

  it('returns true for elements in the tab order', () => {
    const target = renderTarget('<div tabindex="0" id="target" />', '#target');

    expect(isInteractiveTarget(target)).toBe(true);
  });

  it('returns false for elements taken out of the tab order', () => {
    const target = renderTarget('<div tabindex="-1" id="target" />', '#target');

    expect(isInteractiveTarget(target)).toBe(false);
  });

  it('returns true for elements marked interactive', () => {
    const target = renderTarget(
      '<div data-canvas-interactive id="target" />',
      '#target',
    );

    expect(isInteractiveTarget(target)).toBe(true);
  });
});
