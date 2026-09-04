import { afterEach, describe, expect, it } from 'vitest';
import { BoxElementType, getElementType } from '@minddrop/designs-next';
import { getElementRenderer } from '@minddrop/ui-designs-next';
import {
  BoxElementConfig,
  BoxElementRenderer,
  HeadingElementConfig,
  HeadingElementRenderer,
  HeadingElementType,
  TextElementConfig,
  TextElementRenderer,
  TextElementType,
} from '../elements';
import { cleanup } from '../test-utils';
import { initializeDesignsNextFeature } from './initializeDesignsNextFeature';

describe('initializeDesignsNextFeature', () => {
  afterEach(cleanup);

  it('registers the built-in element configs', () => {
    initializeDesignsNextFeature();

    expect(getElementType(BoxElementType)).toBe(BoxElementConfig);
    expect(getElementType(HeadingElementType)).toBe(HeadingElementConfig);
    expect(getElementType(TextElementType)).toBe(TextElementConfig);
  });

  it('registers the built-in element renderers', () => {
    initializeDesignsNextFeature();

    expect(getElementRenderer(BoxElementType)).toBe(BoxElementRenderer);
    expect(getElementRenderer(HeadingElementType)).toBe(HeadingElementRenderer);
    expect(getElementRenderer(TextElementType)).toBe(TextElementRenderer);
  });
});
