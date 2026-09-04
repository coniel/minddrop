import { afterEach, describe, expect, it } from 'vitest';
import { ElementRenderersStore } from '../ElementRenderersStore';
import { registerElementRenderer } from '../registerElementRenderer';
import { DesignElementComponent } from '../types';
import { getElementRenderer } from './getElementRenderer';

const CustomElement: DesignElementComponent = () => null;

describe('getElementRenderer', () => {
  afterEach(() => {
    ElementRenderersStore.delete('custom');
  });

  it('returns the registered renderer', () => {
    registerElementRenderer('custom', CustomElement);

    expect(getElementRenderer('custom')).toBe(CustomElement);
  });

  it('returns null for unregistered element types', () => {
    expect(getElementRenderer('unknown')).toBeNull();
  });
});
