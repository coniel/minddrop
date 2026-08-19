import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures, TextElement } from '@minddrop/designs';
import { cleanup, setup } from '../../test-utils';
import { isStaticContentElement } from './isStaticContentElement';

const { element_text_1 } = DesignFixtures;

describe('isStaticContentElement', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('is static when the type supports it and the element is static', () => {
    const element: TextElement = { ...element_text_1, static: true };

    expect(isStaticContentElement(element)).toBe(true);
  });

  it('is not static when the element is bound', () => {
    expect(isStaticContentElement(element_text_1)).toBe(false);
  });

  it('is never static for always bound element types', () => {
    // URL elements have no static mode, so a stale flag from an
    // earlier design must not put one into static mode
    const element = { ...element_text_1, type: 'url', static: true };

    expect(isStaticContentElement(element as TextElement)).toBe(false);
  });
});
