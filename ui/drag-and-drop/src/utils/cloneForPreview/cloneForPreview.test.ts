import { describe, expect, it } from 'vitest';
import { cloneForPreview } from './cloneForPreview';

/**
 * Creates the element to clone from markup.
 *
 * @param html - The markup.
 * @returns The markup's root element.
 */
function createElement(html: string): Element {
  // Parse the markup into a container
  const container = document.createElement('div');

  container.innerHTML = html;

  // Return the markup's root element
  return container.firstElementChild as Element;
}

describe('cloneForPreview', () => {
  it('marks the clone as an inert preview', () => {
    const clone = cloneForPreview(createElement('<div>Item</div>'));

    expect(clone.hasAttribute('data-drag-preview')).toBe(true);
    expect(clone.hasAttribute('inert')).toBe(true);
    expect(clone.getAttribute('aria-hidden')).toBe('true');
  });

  it('strips the IDs', () => {
    const clone = cloneForPreview(
      createElement('<div id="row"><span id="label">Item</span></div>'),
    );

    expect(clone.hasAttribute('id')).toBe(false);
    expect(clone.querySelector('[id]')).toBeNull();
  });

  it('strips the editing', () => {
    const clone = cloneForPreview(
      createElement('<div><p contenteditable="true">Text</p></div>'),
    );

    expect(clone.querySelector('[contenteditable]')).toBeNull();
  });

  it('strips the drag registration keys', () => {
    const clone = cloneForPreview(
      createElement(
        '<div data-draggable-key="a" data-droppable-key="b"><span data-droppable-key="c" /></div>',
      ),
    );

    expect(clone.hasAttribute('data-draggable-key')).toBe(false);
    expect(clone.hasAttribute('data-droppable-key')).toBe(false);
    expect(clone.querySelector('[data-droppable-key]')).toBeNull();
  });

  it('removes the canvases', () => {
    const clone = cloneForPreview(
      createElement('<div><canvas></canvas><span>Item</span></div>'),
    );

    expect(clone.querySelector('canvas')).toBeNull();
    expect(clone.textContent).toBe('Item');
  });

  it('leaves the original untouched', () => {
    const element = createElement('<div id="row">Item</div>');

    cloneForPreview(element);

    expect(element.getAttribute('id')).toBe('row');
  });
});
