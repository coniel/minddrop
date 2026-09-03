import { afterEach, describe, expect, it } from 'vitest';
import { ElementRenderersStore } from '../ElementRenderersStore';
import { getElementRenderer } from '../getElementRenderer';
import { DesignElementComponent } from '../types';
import { registerElementRenderer } from './registerElementRenderer';

const CustomElement: DesignElementComponent = () => null;

describe('registerElementRenderer', () => {
  afterEach(() => {
    ElementRenderersStore.delete('custom');
  });

  it('registers a renderer for an element type', () => {
    registerElementRenderer('custom', CustomElement);

    expect(getElementRenderer('custom')).toBe(CustomElement);
  });
});
