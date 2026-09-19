import { afterEach, describe, expect, it } from 'vitest';
import { resolveScrollContainers } from './resolveScrollContainers';

// Appends an element to the parent, scrolling its content when told
// to.
function appendElement(parent: Element, scrolls: boolean): HTMLElement {
  const element = document.createElement('div');

  if (scrolls) {
    element.style.overflowY = 'auto';
    Object.defineProperties(element, {
      scrollHeight: { value: 200 },
      clientHeight: { value: 100 },
    });
  }

  parent.appendChild(element);

  return element;
}

describe('resolveScrollContainers', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('resolves the scrolling ancestors, innermost first', () => {
    const outer = appendElement(document.body, true);
    const middle = appendElement(outer, false);
    const inner = appendElement(middle, true);
    const element = appendElement(inner, false);

    expect(resolveScrollContainers(element)).toEqual([inner, outer]);
  });

  it('resolves the element itself when it scrolls', () => {
    const outer = appendElement(document.body, true);
    const element = appendElement(outer, true);

    expect(resolveScrollContainers(element)).toEqual([element, outer]);
  });

  it('resolves none when neither the element nor an ancestor scrolls', () => {
    const element = appendElement(appendElement(document.body, false), false);

    expect(resolveScrollContainers(element)).toEqual([]);
  });
});
