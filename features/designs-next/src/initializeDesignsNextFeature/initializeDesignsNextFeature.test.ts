import { afterEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs } from '@minddrop/designs-next';
import {
  BoxElementConfig,
  BoxElementType,
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

    expect(DesignElementConfigs.get(BoxElementType)).toBe(BoxElementConfig);
    expect(DesignElementConfigs.get(HeadingElementType)).toBe(
      HeadingElementConfig,
    );
    expect(DesignElementConfigs.get(TextElementType)).toBe(TextElementConfig);
  });

  it('suggests only property types the element accepts', () => {
    initializeDesignsNextFeature();

    // A suggested type the element does not accept would be offered
    // by the picker and then filtered out of it.
    DesignElementConfigs.getAll().forEach((config) => {
      config.suggestedPropertyTypes?.forEach((type) => {
        expect(config.propertyTypes).toContain(type);
      });
    });
  });
});
