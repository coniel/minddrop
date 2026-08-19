import { describe, expect, it } from 'vitest';
import { TextElementConfig } from '../design-element-configs';
import { DefaultContainerStyle } from '../styles';
import { createElement } from './createElement';

describe('createElement', () => {
  it('creates an element from the type template with a minted ID', () => {
    const element = createElement('text');

    expect(element).toEqual({ ...TextElementConfig.template, id: element.id });
    expect(element.id).toBeTruthy();
  });

  it('arranges the children of a new container', () => {
    const element = createElement('container');

    // A container starts out stacking its children from the top,
    // spaced apart rather than flush together
    expect(element.style).toEqual(DefaultContainerStyle);
  });

  it('mints a unique ID per element', () => {
    expect(createElement('text').id).not.toBe(createElement('text').id);
  });

  it('clones the template so instances are independent', () => {
    const first = createElement('container');
    const second = createElement('container');

    expect(first).not.toBe(second);

    // Mutating one instance's children must not affect the other
    if ('children' in first && 'children' in second) {
      first.children.push(createElement('text'));

      expect(second.children).toHaveLength(0);
    }
  });

  it('throws for unregistered element types', () => {
    expect(() => createElement('unknown')).toThrow();
  });
});
