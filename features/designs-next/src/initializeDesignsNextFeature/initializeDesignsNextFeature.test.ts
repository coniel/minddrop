import { afterEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs } from '@minddrop/designs-next';
import {
  BoxElementConfig,
  BoxElementType,
  EditorElementConfig,
  EditorElementType,
  EditorTitleElementConfig,
  EditorTitleElementType,
  HeadingElementConfig,
  HeadingElementType,
  IconElementConfig,
  IconElementType,
  LabelElementConfig,
  LabelElementType,
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
    expect(DesignElementConfigs.get(EditorElementType)).toBe(
      EditorElementConfig,
    );
    expect(DesignElementConfigs.get(EditorTitleElementType)).toBe(
      EditorTitleElementConfig,
    );
    expect(DesignElementConfigs.get(HeadingElementType)).toBe(
      HeadingElementConfig,
    );
    expect(DesignElementConfigs.get(IconElementType)).toBe(IconElementConfig);
    expect(DesignElementConfigs.get(LabelElementType)).toBe(LabelElementConfig);
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

  it('starts square elements square and holds them there', () => {
    initializeDesignsNextFeature();

    // Unequal default spans would insert an out-of-square block,
    // and a fluid width mode would stretch it on whichever axis
    // scales with the render width.
    DesignElementConfigs.getAll()
      .filter((config) => config.square)
      .forEach((config) => {
        expect(config.defaultColumnSpan).toBe(config.defaultRowSpan);
        expect(config.defaultWidthMode).toBeDefined();
        expect(config.defaultWidthMode).not.toBe('fluid');
      });
  });
});
