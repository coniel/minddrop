import { afterEach, describe, expect, it } from 'vitest';
import { BoxElementType, getDesignElementConfig } from '@minddrop/designs-next';
import {
  BoxElementConfig,
  HeadingElementConfig,
  HeadingElementType,
  TextElementConfig,
  TextElementType,
} from '../elements';
import { cleanup } from '../test-utils';
import { initializeDesignsNextFeature } from './initializeDesignsNextFeature';

describe('initializeDesignsNextFeature', () => {
  afterEach(cleanup);

  it('registers the built-in element configs', () => {
    initializeDesignsNextFeature();

    expect(getDesignElementConfig(BoxElementType)).toBe(BoxElementConfig);
    expect(getDesignElementConfig(HeadingElementType)).toBe(
      HeadingElementConfig,
    );
    expect(getDesignElementConfig(TextElementType)).toBe(TextElementConfig);
  });
});
